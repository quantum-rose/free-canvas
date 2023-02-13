export class MathUtil {
    private static _factorialCache: number[] = [1, 1, 2, 6];

    /**
     * 夹值
     */
    public static clamp(target: number, min: number, max: number) {
        if (target < min) return min;
        if (target > max) return max;
        return target;
    }

    /**
     * 阶乘
     */
    public static factorial(n: number): number {
        if (MathUtil._factorialCache[n] === undefined) {
            MathUtil._factorialCache[n] = n * MathUtil.factorial(n - 1);
        }
        return MathUtil._factorialCache[n];
    }

    /**
     * 组合数
     */
    public static combination(n: number, m: number) {
        return MathUtil.factorial(n) / (MathUtil.factorial(m) * MathUtil.factorial(n - m));
    }

    /**
     * 是否是 2 的幂
     */
    public static isPowerOf2(n: number) {
        return (n & (n - 1)) === 0;
    }

    /**
     * 直角坐标转极坐标
     */
    public static toPolar(x: number, y: number): [number, number] {
        return [Math.hypot(x, y), Math.atan2(y, x)];
    }

    /**
     * 极坐标转直角坐标
     */
    public static fromPolar(r: number, theta: number): [number, number] {
        return [r * Math.cos(theta), r * Math.sin(theta)];
    }
}
