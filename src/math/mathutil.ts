export class MathUtil {
    public static toPolar(x: number, y: number): [number, number] {
        return [Math.hypot(x, y), Math.atan2(y, x)];
    }

    public static fromPolar(r: number, theta: number): [number, number] {
        return [r * Math.cos(theta), r * Math.sin(theta)];
    }
}
