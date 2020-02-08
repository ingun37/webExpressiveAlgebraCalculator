export class Lineage {
    constructor(
        public chain:[Exp, number][],
        public exp:Exp
    ) {}
}
export interface Exp {
    latex: string
    kids: Exp[]
    clone(newKids:Exp[]): Exp;
}

export class Scalar implements Exp {
    get latex(): string {return `${this.n}`}
    get kids(): Exp[] { return [] }
    clone(newKids:Exp[]): Exp {return this}
    constructor (
        public n:number
    ) {}
}
export class Add implements Exp {
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

let n1 = new Scalar(1)
let n0 = new Scalar(0)
let vA = new Var("A")
let sampleAdd = new Add(n1, n0)
export let sampleMat = new Matrix([[n1, vA], [sampleAdd, n1]])
export let sampleX = new Var("X")