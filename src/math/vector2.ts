export class Vector2 extends Array<number> {
    public get x() {
        return this[0];
    }

    public get y() {
        return this[1];
    }

    public set x(v: number) {
        this[0] = v;
    }

    public set y(v: number) {
        this[1] = v;
    }

    constructor(x = 0, y = 0) {
        super(x, y);
        Object.setPrototypeOf(this, Vector2.prototype);
    }

    public set(x: number, y: number) {
        this[0] = x;
        this[1] = y;
        return this;
    }

    public clone() {
        return new Vector2(this[0], this[1]);
    }

    public copy(v: number[]) {
        this[0] = v[0];
        this[1] = v[1];
        return this;
    }

    public add(v: number[]) {
        this[0] += v[0];
        this[1] += v[1];
        return this;
    }

    public sub(v: number[]) {
        this[0] -= v[0];
        this[1] -= v[1];
        return this;
    }

    public dot(v: number[]) {
        return this[0] * v[0] + this[1] * v[1];
    }

    public cross(v: number[]) {
        return this[0] * v[1] - this[1] * v[0];
    }

    public scale(scalar: number) {
        this[0] *= scalar;
        this[1] *= scalar;
        return this;
    }

    public negate() {
        return this.scale(-1);
    }

    public applyMatrix3(m: number[]) {
        const { x, y } = this;
        this[0] = m[0] * x + m[3] * y + m[6];
        this[1] = m[1] * x + m[4] * y + m[7];
        return this;
    }

    public len() {
        return Math.hypot(this[0], this[1]);
    }

    public setLength(length: number) {
        return this.normalize().scale(length);
    }

    public normalize() {
        return this.scale(1 / (this.len() || 1));
    }

    public angle() {
        return Math.atan2(-this[1], -this[0]) + Math.PI;
    }

    public rotate(angle: number, center: number[] = [0, 0]) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const x = this[0] - center[0];
        const y = this[1] - center[1];
        this[0] = x * c - y * s + center[0];
        this[1] = x * s + y * c + center[1];
        return this;
    }

    public distanceTo(v: number[]) {
        return Math.hypot(this[0] - v[0], this[1] - v[1]);
    }

    public equals(v: number[]) {
        return v[0] === this[0] && v[1] === this[1];
    }

    public nealyEquals(v: number[], tolerance = 1e-6) {
        return Math.abs(this[0] - v[0]) < tolerance && Math.abs(this[1] - v[1]) < tolerance;
    }

    public fromArray(array: number[], offset = 0) {
        this[0] = array[offset];
        this[1] = array[offset + 1];
        return this;
    }

    public toArray(array: number[] = [], offset = 0) {
        array[offset] = this[0];
        array[offset + 1] = this[1];
        return array;
    }

    public random() {
        this[0] = Math.random();
        this[1] = Math.random();
        return this;
    }
}
