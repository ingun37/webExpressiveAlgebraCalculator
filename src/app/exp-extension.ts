import { Exp, Add, Scalar, Matrix } from './exp'
import Sequence, { asSequence, sequenceOf, range } from 'sequency'


export class Rational {
    private numerator: number
    private denominator: number

    constructor(numerator: number, denominator: number) {
        if (denominator === 0) {
            throw new Error("Denominator must not be zero.")
        }

        this.numerator = numerator
        this.denominator = denominator

        this.reduce()
        this.ensureSignInNumerator()
    }

    public add(that: Rational): Rational {
        const commonDenominator = this.denominator * that.denominator
        return new Rational(
            this.numerator * that.denominator + that.numerator * this.denominator,
            commonDenominator
        )
    }

    public sub(that: Rational): Rational {
        const commonDenominator = this.denominator * that.denominator
        return new Rational(
            this.numerator * that.denominator - that.numerator * this.denominator,
            commonDenominator
        )
    }

    public mul(that: Rational): Rational {
        return new Rational(
            this.numerator * that.numerator,
            this.denominator * that.denominator
        )
    }

    public div(that: Rational): Rational {
        return new Rational(
            this.numerator * that.denominator,
            this.denominator * that.numerator
        )
    }

    public abs(): Rational {
        return new Rational(Math.abs(this.numerator), Math.abs(this.denominator))
    }

    public exprational(n: number): Rational {
        return new Rational(
            Math.pow(this.numerator, n),
            Math.pow(this.denominator, n)
        )
    }

    public expreal(base: number): number {
        return Math.pow(
            10.0,
            Math.log10(Math.pow(base, this.numerator)) / this.denominator
        )
    }

    public reduce(): this {
        const commonDivisor = this.gcd(this.numerator, this.denominator)

        this.numerator /= commonDivisor
        this.denominator /= commonDivisor
        this.ensureSignInNumerator()

        return this
    }

    private gcd(a: number, b: number): number {
        let localA = a
        let localB = b
        while (localB !== 0) {
            const t = localB
            localB = localA % localB
            localA = t
        }
        return localA
    }

    private ensureSignInNumerator(): void {
        if (this.denominator < 0) {
            this.denominator = -this.denominator
            this.numerator = -this.numerator
        }
    }
}

export function flatAdd(add:Add): Sequence<Exp> {
    return asSequence(add.kids).flatMap(k => {
        if (k instanceof Add) {
            return flatAdd(k)
        } else {
            return sequenceOf(k)
        }
    })
}

function add2(l:Exp, r:Exp): Exp {
    console.log(l, r)
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
export function addXs(head:Exp, tail:Exp[]): Exp {
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