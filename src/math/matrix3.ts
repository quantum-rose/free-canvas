/**
 * 三阶矩阵
 * ┎ n11 n12 n13 ┓
 * ┃ n21 n22 n23 ┃
 * ┗ n31 n32 n33 ┚
 *
 * 在数组中存储的位置，按列优先存储
 * [n11, n21, n31, n12, n22, n32, n13, n23, n33]
 *
 * 用数组索引表示为
 * ┎ 0 3 6 ┓
 * ┃ 1 4 7 ┃
 * ┗ 2 5 8 ┚
 */
export class Matrix3 extends Array<number> {
    constructor() {
        super(1, 0, 0, 0, 1, 0, 0, 0, 1);
        Object.setPrototypeOf(this, Matrix3.prototype);
    }

    public set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number) {
        this[0] = n11;
        this[1] = n21;
        this[2] = n31;
        this[3] = n12;
        this[4] = n22;
        this[5] = n32;
        this[6] = n13;
        this[7] = n23;
        this[8] = n33;
        return this;
    }

    public identity() {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    }

    public copy(m: number[]) {
        this[0] = m[0];
        this[1] = m[1];
        this[2] = m[2];
        this[3] = m[3];
        this[4] = m[4];
        this[5] = m[5];
        this[6] = m[6];
        this[7] = m[7];
        this[8] = m[8];
        return this;
    }

    /**
     * this 右乘 m
     */
    public multiply(m: number[]) {
        return this.multiplyMatrices(this, m);
    }

    /**
     * this 左乘 m
     */
    public premultiply(m: number[]) {
        return this.multiplyMatrices(m, this);
    }

    public multiplyMatrices(a: number[], b: number[]) {
        const [a11, a21, a31, a12, a22, a32, a13, a23, a33] = a;
        const [b11, b21, b31, b12, b22, b32, b13, b23, b33] = b;
        this[0] = a11 * b11 + a12 * b21 + a13 * b31;
        this[3] = a11 * b12 + a12 * b22 + a13 * b32;
        this[6] = a11 * b13 + a12 * b23 + a13 * b33;
        this[1] = a21 * b11 + a22 * b21 + a23 * b31;
        this[4] = a21 * b12 + a22 * b22 + a23 * b32;
        this[7] = a21 * b13 + a22 * b23 + a23 * b33;
        this[2] = a31 * b11 + a32 * b21 + a33 * b31;
        this[5] = a31 * b12 + a32 * b22 + a33 * b32;
        this[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    }

    public multiplyScalar(s: number) {
        this[0] *= s;
        this[3] *= s;
        this[6] *= s;
        this[1] *= s;
        this[4] *= s;
        this[7] *= s;
        this[2] *= s;
        this[5] *= s;
        this[8] *= s;
        return this;
    }

    public determinant() {
        const [a, b, c, d, e, f, g, h, i] = this;
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }

    public invert() {
        const [n11, n21, n31, n12, n22, n32, n13, n23, n33] = this;
        const t11 = n33 * n22 - n32 * n23;
        const t12 = n32 * n13 - n33 * n12;
        const t13 = n23 * n12 - n22 * n13;
        const det = n11 * t11 + n21 * t12 + n31 * t13;
        if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        const detInv = 1 / det;
        this[0] = t11 * detInv;
        this[1] = (n31 * n23 - n33 * n21) * detInv;
        this[2] = (n32 * n21 - n31 * n22) * detInv;
        this[3] = t12 * detInv;
        this[4] = (n33 * n11 - n31 * n13) * detInv;
        this[5] = (n31 * n12 - n32 * n11) * detInv;
        this[6] = t13 * detInv;
        this[7] = (n21 * n13 - n23 * n11) * detInv;
        this[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
    }

    public transpose() {
        let tmp;
        tmp = this[1];
        this[1] = this[3];
        this[3] = tmp;
        tmp = this[2];
        this[2] = this[6];
        this[6] = tmp;
        tmp = this[5];
        this[5] = this[7];
        this[7] = tmp;
        return this;
    }

    public transposeIntoArray(r: number[]) {
        r[0] = this[0];
        r[1] = this[3];
        r[2] = this[6];
        r[3] = this[1];
        r[4] = this[4];
        r[5] = this[7];
        r[6] = this[2];
        r[7] = this[5];
        r[8] = this[8];
        return this;
    }

    /**
     * 等价于左乘矩阵
     * ┎ sx 0  0 ┓
     * ┃ 0  sy 0 ┃
     * ┗ 0  0  1 ┚
     */
    public scale(sx: number, sy: number) {
        this[0] *= sx;
        this[3] *= sx;
        this[6] *= sx;
        this[1] *= sy;
        this[4] *= sy;
        this[7] *= sy;
        return this;
    }

    /**
     * 等价于左乘矩阵
     * ┎  cos(θ)  sin(θ)  0 ┓
     * ┃ -sin(θ)  cos(θ)  0 ┃
     * ┗  0       0       1 ┚
     */
    public rotate(theta: number) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        const [a11, a21, , a12, a22, , a13, a23] = this;
        this[0] = c * a11 + s * a21;
        this[3] = c * a12 + s * a22;
        this[6] = c * a13 + s * a23;
        this[1] = -s * a11 + c * a21;
        this[4] = -s * a12 + c * a22;
        this[7] = -s * a13 + c * a23;
        return this;
    }

    /**
     * 等价于左乘矩阵
     * ┎ 1  0  tx ┓
     * ┃ 0  1  ty ┃
     * ┗ 0  0  1  ┚
     */
    public translate(tx: number, ty: number) {
        this[0] += tx * this[2];
        this[3] += tx * this[5];
        this[6] += tx * this[8];
        this[1] += ty * this[2];
        this[4] += ty * this[5];
        this[7] += ty * this[8];
        return this;
    }

    public equals(m: number[]) {
        return (
            this[0] === m[0] &&
            this[1] === m[1] &&
            this[2] === m[2] &&
            this[3] === m[3] &&
            this[4] === m[4] &&
            this[5] === m[5] &&
            this[6] === m[6] &&
            this[7] === m[7] &&
            this[8] === m[8]
        );
    }

    public fromArray(array: number[], offset = 0) {
        this[0] = array[offset];
        this[1] = array[offset + 1];
        this[2] = array[offset + 2];
        this[3] = array[offset + 3];
        this[4] = array[offset + 4];
        this[5] = array[offset + 5];
        this[6] = array[offset + 6];
        this[7] = array[offset + 7];
        this[8] = array[offset + 8];
        return this;
    }

    public toArray(array: number[] = [], offset = 0) {
        array[offset] = this[0];
        array[offset + 1] = this[1];
        array[offset + 2] = this[2];
        array[offset + 3] = this[3];
        array[offset + 4] = this[4];
        array[offset + 5] = this[5];
        array[offset + 6] = this[6];
        array[offset + 7] = this[7];
        array[offset + 8] = this[8];
        return array;
    }

    public toTransformArray() {
        return [this[0], this[3], this[1], this[4], this[6], this[7]] as const;
    }

    public toTransformString() {
        return `matrix(${this.toTransformArray().join(',')})`;
    }

    public clone() {
        return new Matrix3().fromArray(this);
    }

    /**
     * 获取第 i 行 第 j 列
     */
    public getItem(i: number, j: number) {
        return this[i - 1 + j * 3 - 3];
    }
}
