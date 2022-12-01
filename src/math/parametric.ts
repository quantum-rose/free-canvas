import { IVector2, Shifted } from '../interfaces';

export interface DrawStyle {
    lineWidth?: number;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    close?: boolean;
}

/**
 * 构建曲线参数方程
 * func 的第一个参数是 t，约定返回值是长度为 2 的数组，数组的两个元素为一个点的 x 和 y 坐标
 * transFunc 的作用是变换坐标，处理 func 返回的结果，比如极坐标转直角坐标
 * 返回一个构造出的曲线函数，前两个参数为t的取值范围，闭区间；第三个参数为区间内的采样点数量，值越大、曲线越平滑
 * 曲线函数返回一个对象，包括一个 points 数组，为所有采样点的坐标（共有采样点数量 +1 个坐标点），以及一个 draw 方法
 */
export function Parametric<T extends (t: number, ...args: any[]) => [number, number]>(func: T, transFunc?: (x: number, y: number) => [number, number]) {
    return function (start: number, end: number, segments = 100, ...args: Shifted<Parameters<T>>) {
        const points: [number, number][] = [];
        for (let i = 0; i <= segments; i++) {
            if (transFunc) {
                points[i] = transFunc(...func(((end - start) / segments) * i + start, ...args));
            } else {
                points[i] = func(((end - start) / segments) * i + start, ...args);
            }
        }
        return {
            points,
            draw(cvsCtx: CanvasRenderingContext2D, style: DrawStyle = {}) {
                const { lineWidth = 1, strokeStyle = 'black', fillStyle = undefined, close = false } = style;
                cvsCtx.save();
                cvsCtx.lineWidth = lineWidth;
                cvsCtx.strokeStyle = strokeStyle;
                cvsCtx.beginPath();
                cvsCtx.moveTo(points[0][0], points[0][1]);
                for (let i = 1; i < points.length; i++) {
                    cvsCtx.lineTo(points[i][0], points[i][1]);
                }
                if (close) cvsCtx.closePath();
                if (fillStyle) {
                    cvsCtx.fillStyle = fillStyle;
                    cvsCtx.fill();
                }
                cvsCtx.stroke();
                cvsCtx.restore();
            },
        };
    };
}

/**
 * 圆弧
 */
Parametric.arc = Parametric((t: number, cx: number, cy: number, r: number) => [cx + r * Math.cos(t), cy + r * Math.sin(t)]);

/**
 * 椭圆
 */
Parametric.ellipse = Parametric((t: number, cx: number, cy: number, rx: number, ry: number) => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);

/**
 * 抛物线
 */
Parametric.parabola = Parametric((t: number, x: number, y: number, p: number) => [x + 2 * p * t, y + 2 * p * t ** 2]);

/**
 * 阿基米德螺线
 */
Parametric.helical = Parametric((t: number, l: number) => [l * t * Math.cos(t), l * t * Math.sin(t)]);

/**
 * 四角星
 */
Parametric.star = Parametric((t: number, l: number) => [l * Math.cos(t) ** 3, l * Math.sin(t) ** 3]);

/**
 * 二次贝塞尔曲线
 */
Parametric.quadricBezier = Parametric((t: number, p0: IVector2, p1: IVector2, p2: IVector2) => [
    (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
]);

/**
 * 三次贝塞尔曲线
 */
Parametric.cubicBezier = Parametric((t: number, p0: IVector2, p1: IVector2, p2: IVector2, p3: IVector2) => [
    (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * p1.x + 3 * (1 - t) * t ** 2 * p2.x + t ** 3 * p3.x,
    (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * p1.y + 3 * (1 - t) * t ** 2 * p2.y + t ** 3 * p3.y,
]);
