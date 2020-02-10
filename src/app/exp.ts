import Sequence, { sequenceOf, asSequence, range } from 'sequency'

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
export interface Associative extends Exp {

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
export class Add implements Associative {
    isEq(e: Exp): boolean {
        if (e instanceof Add) {
            return this.l == e.l && this.r == e.r
        }
        return false
    }
    eval(): Exp {
        let seq = flatAdd(this).toArray()
        let head = seq[0]
        let tail = seq.slice(1)
        let result = addXs(head, tail)
        return result
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


function add2(l:Exp, r:Exp): Exp {
    if (l instanceof Scalar && r instanceof Scalar) {
        return new Scalar(l.n + r.n)
    }
    if (l instanceof Matrix && r instanceof Matrix) {
        if (l.elements.length == r.elements.length && l.elements[0].length == r.elements[0].length) {
            let e = asSequence(l.elements).zip(asSequence(r.elements)).map(([lr,rr])=>{
                return asSequence(lr).zip(asSequence(rr)).map(([x,y])=>{
                    return new Add(x,y).eval()
                }).toArray()
            }).toArray()
            return new Matrix(e)
        }
    }
    return null
}


function rng(n:number): Sequence<number> {
    return range(0, n-1, 1)
}
function addXs(head:Exp, tail:Exp[]): Exp {
    if(tail.length == 0) {
        return head
    }
    let exps = asSequence(tail).plus(head).toArray()
    let len = exps.length
    let combi2 = rng(len).flatMap(n=>{
        return rng(len).filter(m=>m!=n).map((m):[number, number]=>[n,m])
    })

    let tailed = combi2.map(([m,n]):[Exp,Sequence<Exp>]=>[add2(exps[m],exps[n]), rng(len).filter(x=>x!=m && x!=n).map(x=>exps[x])])
    let f = tailed.firstOrNull(([x,tail])=>x!=null)
    if(f) {
        return addXs(f[0], f[1].toArray())
    } else {
        return tail.reduce((l,r)=>new Add(l,r),head)
    }
}

function flatAdd(add:Add): Sequence<Exp> {
    return asSequence(add.kids).flatMap(k => {
        if (k instanceof Add) {
            return flatAdd(k)
        } else {
            return sequenceOf(k)
        }
    })
}
