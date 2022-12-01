import { RenderTask } from '../canvas';

export interface CircleStyle {
    lineWidth?: number;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    fillStyle?: string | CanvasGradient | CanvasPattern;
}

export class Circle extends RenderTask {
    public x: number;

    public y: number;

    public radius: number;

    public style: CircleStyle;

    constructor(x: number, y: number, r: number, style: CircleStyle = {}) {
        super();
        this.x = x;
        this.y = y;
        this.radius = r;
        this.style = style;
    }

    public render(cvsCtx: CanvasRenderingContext2D, pixelSize: number) {
        cvsCtx.save();
        cvsCtx.beginPath();
        cvsCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const { lineWidth, strokeStyle, fillStyle } = this.style;
        if (fillStyle) {
            cvsCtx.fillStyle = fillStyle;
            cvsCtx.fill();
        }
        if (strokeStyle) {
            cvsCtx.strokeStyle = strokeStyle;
        }
        if (lineWidth) {
            cvsCtx.lineWidth = lineWidth * pixelSize;
            cvsCtx.stroke();
        }
        cvsCtx.restore();
    }
}
