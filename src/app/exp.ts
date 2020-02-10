import { sequenceOf, asSequence } from 'sequency'

export class Lineage {
    constructor(
        public chain:number[],
        public exp:Exp
    ) {}
}
export interface Exp {
    latex: string
    kids: Exp[]
    isEq(e:Exp):boolean;
    clone(newKids:Exp[]): Exp;
    eval(): Exp;
}

export class Scalar implements Exp {
    isEq(e: Exp): boolean {
        if (e instanceof Scalar) {
            return this.n == e.n
        }
        return false
    }
    eval(): Exp {
        return this
    }
    get latex(): string {return `${this.n}`}
    get kids(): Exp[] { return [] }
    clone(newKids:Exp[]): Exp {return this}
    constructor (
        public n:number
    ) {}
}
export class Add implements Exp {
    isEq(e: Exp): boolean {
        if (e instanceof Add) {
            return this.l == e.l && this.r == e.r
        }
        return false
    }
    eval(): Exp {
        return this
    }
    get latex(): string {
        return this.l.latex + " + " + this.r.latex
    }
    get kids(): Exp[] {
        return [this.l, this.r]
    }
    clone(newKids:Exp[]):Exp {
        return new Add(newKids[0], newKids[1])
    }
    constructor(
        public l: Exp,
        public r: Exp
    ) {}
}

export class Matrix implements Exp {
    isEq(e: Exp): boolean {
        if (e instanceof Matrix) {
            return asSequence(this.elements).zip(asSequence(e.elements)).all(rowPair=>
                asSequence(rowPair[0]).zip(asSequence(rowPair[1])).all(ePair=>ePair[0].isEq(ePair[1]))
                )
        }
        return false
    }
    eval(): Exp {
        return this
    }
    get latex(): string {
        let inner = this.elements.map((row) => {
            return row.map(e => `{${e.latex}}` ).join(" & ")
        }).join("\\\\\n")
        return "\\begin{pmatrix}\n" + inner + "\n\\end{pmatrix}"
    }
    get kids(): Exp[] {
        return flatMap(this.elements, (x) => { return x})
    }
    clone(newKids:Exp[]):Exp {
        let cols = this.elements[0].length
        let newElements = this.elements.map((row, ri)=>{
            return row.map((e, ci)=>{
                return newKids[ri * cols + ci]
            })
        })
        return new Matrix(newElements)
    }
    constructor(
        public elements: Exp[][]
    ) {}
}

export class Var implements Exp {
    isEq(e: Exp): boolean {
        if (e instanceof Var) {
            return this.name == e.name
        }
        return false
    }
    eval(): Exp {
        return this
    }
    constructor (
        public name:string
    ) {}
    get latex(): string {
        return `\\text{${this.name}}`
    }
    get kids():Exp[] {return []}
    clone(newKids:Exp[]):Exp { return this }
}
function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return Array.prototype.concat(...array.map(callbackfn));
}


export function changed(e:Exp, from:Exp, to:Exp): Exp {
    if (e.isEq(from)) {
        return to
    }
    let newKids = e.kids.map(x=>changed(x, from, to))
    return e.clone(newKids)
}