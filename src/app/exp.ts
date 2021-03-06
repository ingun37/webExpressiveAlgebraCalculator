import Sequence, { sequenceOf, asSequence, range } from 'sequency'
import { Rational } from './exp-extension'

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
    l:Exp
    r:Exp
}
export function instanceOfAssociative(object: Exp): object is Associative {
    return 'l' in object && 'r' in object
}
function isRational(n: number | Rational): n is Rational {
    return (n as Rational).add !== undefined;
}
function isNumber(n: number | Rational): n is number {
    return !isRational(n)
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
    get latex(): string {
        let n = this.n
        if (isRational(n)) {
            return `\\frac{${n.numerator}}{${n.denominator}}`
            //"\\frac{\(r.numerator)}{\(r.denominator)}"
        } else {
            return `${this.n}`
        }
    }
    get kids(): Exp[] { return [] }
    clone(newKids:Exp[]): Exp {return this}
    n:number | Rational
    constructor (
        n:number | Rational
    ) {
        this.n = n
        if (n instanceof Rational) {
            if (Math.abs(n.numerator) == Math.abs(n.denominator)) {
                this.n = n.numerator / n.numerator
            }
        }
    }
    add(s:Scalar): Scalar {
        let n = this.n
        let m = s.n
        if(isRational(n)) {
            if(isRational(m)) {
                return new Scalar(n.add(m))
            } else {
                if (Number.isInteger(m)) {
                    return new Scalar(n.add(new Rational(m,1)))
                } else {
                    return new Scalar( (n.numerator / n.denominator) + m)
                }
            }
        } else {
            if (isRational(m)) {
                return s.add(this)
            } else {
                return new Scalar( n + m)
            }
        }
    }
    mul(s:Scalar): Scalar {
        let n = this.n
        let m = s.n
        if(isRational(n)) {
            if(isRational(m)) {
                return new Scalar(n.mul(m))
            } else {
                if (Number.isInteger(m)) {
                    return new Scalar(n.mul(new Rational(m,1)))
                } else {
                    return new Scalar( (n.numerator / n.denominator) * m)
                }
            }
        } else {
            if (isRational(m)) {
                return s.mul(this)
            } else {
                return new Scalar( n * m)
            }
        }
    }
    get inverse():Scalar {
        let n = this.n
        if(isRational(n)) {
            return new Scalar(new Rational(n.denominator, n.numerator))
        } else {
            if (Number.isInteger(n)) {
                return new Scalar(new Rational(1, n))
            } else {
                return new Scalar(1/n)
            }
        }
    }
}
export class Add implements Associative {
    isEq(e: Exp): boolean {
        if (e instanceof Add) {
            return this.l == e.l && this.r == e.r
        }
        return false
    }
    eval(): Exp {
        let seq = flatAdd(this).map(x=>x.eval()).toArray()
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
export class Mul implements Associative {
    constructor(
        public l:Exp,
        public r:Exp
    ) {}
    get latex(): string { return `{${this.l.latex}} \\times {${this.r.latex}}` }
    get kids(): Exp[] {return [this.l, this.r]}
    isEq(e: Exp): boolean {
        if(e instanceof Mul) {
            return this.l.isEq(e.l) && this.r.isEq(e.r)
        }
        return false
    }
    clone(newKids: Exp[]): Exp {
        return new Mul(newKids[0], newKids[1])
    }
    eval(): Exp {
        let seq = flatMul(this).map(x=>x.eval()).toArray()
        let head = seq[0]
        let tail = seq.slice(1)
        let result = mulXs(head, tail)
        return result
    }

    
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

        return new Matrix(this.elements.map(r=>r.map(e=>e.eval())))
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
    if (l instanceof Scalar) {
        if (l.n == 0) {
            return r
        }
    }
    if (l instanceof Scalar && r instanceof Scalar) {
        return l.add(r)
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

export function rng2(start:number, lessThan:number): Sequence<number> {
    if (start == lessThan-1) {
        return asSequence([start])
    }
    return range(start, lessThan-1, 1)
}
export function rng(n:number): Sequence<number> {
    if ( n == 1) {
        return asSequence([0])
    }
    return range(0, n-1, 1)
}
function addXs(head:Exp, tail:Exp[]): Exp {
    if(tail.length == 0) {
        return head
    }
    let exps = asSequence(tail).plus(head).toArray()
    let len = exps.length
    let perm = rng(len).flatMap(n=>{
        return rng(len).filter(m=>m!=n).map((m):[number, number]=>[n,m])
    })

    let tailed = perm.map(([m,n]):[Exp,Sequence<Exp>]=>[add2(exps[m],exps[n]), rng(len).filter(x=>x!=m && x!=n).map(x=>exps[x])])
    let f = tailed.firstOrNull(([x,tail])=>x!=null)
    if(f) {
        return addXs(f[0], f[1].toArray())
    } else {
        return tail.reduce((l,r)=>new Add(l,r),head)
    }
}
function commutativeMul(l:Exp, r:Exp): Exp {
    if(l instanceof Scalar && r instanceof Scalar) {
        return l.mul(r)
    }
    if(l instanceof Scalar) {
        if (l.n == 0) {
            return new Scalar(0)
        } else if (l.n == 1) {
            return r
        }
    }
    if(l instanceof Scalar && r instanceof Matrix) {
        return new Matrix(
            r.elements.map(row=>row.map(e=>new Mul(new Scalar(-1), e).eval()))
        )
    }
    return null
}

function adjacentCommutativeMul(l:Exp, r:Exp): Exp {
    if (l instanceof Power) {
        if (l.base.isEq(r)) {
            return new Power(r, new Add(l.exponent, new Scalar(1)).eval())
        }
    }
    if (l instanceof Power && r instanceof Power) {
        if (l.base.isEq(r.base)) {
            return new Power(l.base, new Add(l.exponent, r.exponent).eval())
        }
    }
    
    if(l.isEq(r)) {
        console.log('equal',l,r)
        return new Power(l, new Scalar(2))
    }
    return null
}
function adjacentNonCommuteMul(l:Exp, r:Exp): Exp {
    if (l instanceof Matrix && r instanceof Matrix) {
        if (l.elements[0].length == r.elements.length) {
            console.log('can mul mat')
            let newElements = rng(l.elements.length).map(row=>{
                return rng(r.elements[0].length).map(col => {
                    let lrow = asSequence(l.elements[row])
                    let rcol = asSequence(r.elements.map(rrow=>rrow[col]))
                    return lrow.zip(rcol).map(([x,y])=>new Mul(x,y)).reduce((l:Exp,r)=>new Add(l,r)).eval()
                })
            })
            let newE = newElements.map(x=>x.toArray()).toArray()
            return new Matrix(newE)
        }
    }
    return null
}
function pairwiseMul(head:Exp, tail:Exp[]): Exp {
    if (tail.length == 0) {return head}
    let exps = [head].concat(tail)
    let couple = rng(exps.length-1).mapNotNull((idx):[number, Exp]=>{
        let l = exps[idx]
        let r = exps[idx+1]
        let combined = adjacentNonCommuteMul(l, r) || adjacentCommutativeMul(l, r) || adjacentCommutativeMul(r,l)
        if (combined) {
            return [idx, combined]
        } else {
            return null
        }
    }).firstOrNull()
    if (couple) {
        let x = exps.slice(0, couple[0]).concat([couple[1]], exps.slice(couple[0]+2))
        return pairwiseMul(x[0], x.slice(1))
    } else {
        return tail.reduce((l,r)=>new Mul(l,r), head)
    }
}
function mulXs(head:Exp, tail:Exp[]): Exp {
    if (tail.length == 0) {
        return head
    }
    let exps = [head].concat(tail)
    let len = exps.length
    let perm = rng(len).flatMap(x=>rng(len).filter(y=>y!=x).map((y):[number,number]=>[x,y]))
    let f = perm.map(([i,j]):[Exp, Sequence<Exp>]=>{
        let a = commutativeMul(exps[i],exps[j])
        return [a, rng(len).filter(n=>n!=i && n!=j).map(n=>exps[n])]
    }).firstOrNull(([head, tail])=>head != null)
    if (f) {
        return mulXs(f[0], f[1].toArray())
    } else {
        return pairwiseMul(head, tail)
    }
}
function flatAdd(e:Add): Sequence<Exp> {
    return asSequence([e.l, e.r]).flatMap(k => {
        if (k instanceof Add) {
            return flatAdd(k)
        } else {
            return sequenceOf(k)
        }
    })
}

function flatMul(e:Mul): Sequence<Exp> {
    return asSequence([e.l, e.r]).flatMap(k => {
        if (k instanceof Mul) {
            return flatMul(k)
        } else {
            return sequenceOf(k)
        }
    })
}

export class Fraction implements Exp {
    constructor (
        public numo:Exp,
        public deno:Exp
    ) {}
    get latex(): string {
        return `\\frac{${this.numo.latex}}{${this.deno.latex}}`
    }
    get kids(): Exp[] {
        return [this.numo, this.deno]
    }
    isEq(e: Exp): boolean {
        if (e instanceof Fraction) {
            return this.numo.isEq(e.numo) && this.deno.isEq(e.deno)
        }
        return false
    }
    clone(newKids: Exp[]): Exp {
        return new Fraction(newKids[0], newKids[1])
    }
    eval(): Exp {
        let n = this.numo.eval()
        let d = this.deno.eval()
        if (n instanceof Scalar) {
            let nn = n.n
            if (d instanceof Scalar) {
                let dd = d.n
                if (isNumber(nn)) {
                    if (isNumber(dd)) {//number / number
                        if (Number.isInteger(nn)) {
                            //int / number
                            if (Number.isInteger(dd)) {
                                // int / int
                                return new Scalar(new Rational(nn, dd))
                            } else {
                                // int / float
                                return new Scalar(nn/dd)
                            }
                        } else {
                            //float / float
                            return new Scalar(nn/dd)
                        }
                    } else { //number/rational
                        if (Number.isInteger(nn)) { 
                            //int / rational
                            return new Scalar(new Rational(nn,1).div(dd))
                        } else {
                            //float / rational
                            return new Scalar(nn / (dd.numerator / dd.denominator))
                        }
                    }
                } else {
                    if (isNumber(dd)) {
                        //rational / number
                        if (Number.isInteger(dd)) {
                            //rational / int
                            return new Scalar(nn.div(new Rational(dd, 1)))
                        } else {
                            //rational / float
                            return new Scalar((nn.numerator / nn.denominator) / dd)
                        }
                    } else {
                        //rational / rational
                        return new Scalar(nn.div(dd))
                    }
                }
            }
        }
        return new Mul(this.numo, new Power(this.deno, new Scalar(-1)))
    }


}

export class Negate implements Exp {
    constructor (
        public e:Exp
    ) {}
    get latex(): string {
        let e = this.e
        if (instanceOfAssociative(e)) {
            return `- ({${e.latex}})`
        }
        return `- {${e.latex}}`
    }
    get kids(): Exp[] {
        return [this.e]
    }
    isEq(e: Exp): boolean {
        if (e instanceof Negate) {
            return e.e.isEq(this.e)
        }
    }
    clone(newKids: Exp[]): Exp {
        return new Negate(newKids[0])
    }
    eval(): Exp {
        let e = this.e
        if (e instanceof Scalar) {
            let s = e.n
            if (isRational(s)) {
                return new Scalar(new Rational(-s.numerator, s.denominator))
            } else {
                return new Scalar(-s)
            }
        }
        return new Mul(new Scalar(-1), e).eval()
    }
}

export class Power implements Exp {
    constructor (
        public base:Exp,
        public exponent:Exp
    ) {}
    get latex(): string {
        let base = this.base
        let ex = this.exponent
        if (instanceOfAssociative(base)) {
            return `{(${base.latex})} ^ {${ex.latex}}`
        } else {
            return `{${base.latex}} ^ {${ex.latex}}`
        }
    }
    get kids(): Exp[] { return [this.base, this.exponent]}
    isEq(e: Exp): boolean {
        if (e instanceof Power) {
            return this.base.isEq(e.base) && this.exponent.isEq(e.exponent)
        }
        return false
    }
    clone(newKids: Exp[]): Exp {
        return new Power(newKids[0], newKids[1])
    }
    eval(): Exp {
        let base = this.base.eval()
        let ex = this.exponent.eval()
        if (base instanceof Power) {
            return new Power(base, new Mul(ex, base.exponent)).eval()
        }

        if (ex instanceof Scalar) {
            let exponentNumber = ex.n
            if (isNumber(exponentNumber)) {
                if (exponentNumber == 0) {
                    return new Scalar(1)
                } else if (exponentNumber == 1) {
                    return base
                } else if (Number.isInteger(exponentNumber)) {
                    let result = rng(Math.abs(exponentNumber)).map(x=>base).fold(new Scalar(1),(l:Exp,r)=>{
                        return new Mul(l,r)
                    }).eval()
                    if (exponentNumber < 0) {
                        if (result instanceof Scalar) {
                            return result.inverse
                        } else if (result instanceof Matrix) {
                            //todo return matrix inverse
                        }
                    } else {
                        return result
                    }
                }
            }
        }

        if (base instanceof Fraction) {
            return new Mul(new Power(base.numo, ex), new Power(base.deno, new Negate(ex)))
        }

        return this
    }

    
}