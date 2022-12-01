import { Matrix3 } from './matrix3';

export class Complex {
    public static get i() {
        return new Complex(0, 1);
    }

    public a: number = 0;

    public b: number = 0;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    public clone() {
        return new Complex(this.a, this.b);
    }

    public modulus() {
        return Math.hypot(this.a, this.b);
    }

    public add(c: Complex | number) {
        if (c instanceof Complex) {
            this.a += c.a;
            this.b += c.b;
        } else {
            this.a += c;
        }
        return this;
    }

    public sub(c: Complex | number) {
        if (c instanceof Complex) {
            this.a -= c.a;
            this.b -= c.b;
        } else {
            this.a -= c;
        }
        return this;
    }

    public multiply(c: Complex | number) {
        if (c instanceof Complex) {
            const a = this.a * c.a - this.b * c.b;
            const b = this.b * c.a + this.a * c.b;
            this.a = a;
            this.b = b;
        } else {
            this.a *= c;
            this.b *= c;
        }
        return this;
    }

    public divide(c: Complex | number) {
        if (c instanceof Complex) {
            const s = c.a ** 2 + c.b ** 2;
            const a = (this.a * c.a + this.b * c.b) / s;
            const b = (this.b * c.a - this.a * c.b) / s;
            this.a = a;
            this.b = b;
        } else {
            this.a /= c;
            this.b /= c;
        }
        return this;
    }

    public inverse() {
        const s = this.a ** 2 + this.b ** 2;
        this.a /= s;
        this.b /= -s;
        return this;
    }

    public equals(c: Complex | number) {
        if (c instanceof Complex) {
            return c.a === this.a && c.b === this.b;
        }
        return c === this.a && 0 === this.b;
    }

    public nealyEquals(c: Complex | number, tolerance = 1e-6) {
        if (c instanceof Complex) {
            return Math.abs(this.a - c.a) < tolerance && Math.abs(this.b - c.b) < tolerance;
        }
        return Math.abs(this.a - c) < tolerance && Math.abs(this.b - 0) < tolerance;
    }

    public toMatrix3() {
        return new Matrix3().set(this.a, -this.b, 0, this.b, this.a, 0, 0, 0, 1);
    }
}
