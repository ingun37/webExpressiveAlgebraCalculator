export interface Exp {
    latex: string
    kids: Exp[]
}

export class NumExp implements Exp {
    get latex(): string {return `${this.n}`}
    get kids(): Exp[] { return [] }
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

    constructor(
        public elements: Exp[][]
    ) {}
}

function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return Array.prototype.concat(...array.map(callbackfn));
}

let n1 = new NumExp(1)
let n0 = new NumExp(0)
let sampleAdd = new Add(n1, n0)
export let sampleMat = new Matrix([[n1, n0], [sampleAdd, n1]])