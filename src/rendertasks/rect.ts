import { RenderTask } from '../canvas';
import { IVector2 } from '../interfaces';

export interface RectStyle {
    lineWidth?: number;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    fillStyle?: string | CanvasGradient | CanvasPattern;
}

export class Rect extends RenderTask {
    public x: number;

    public y: number;

    public width: number;

    public height: number;

    public style: RectStyle;

    public rotation: number;

    constructor(x: number, y: number, w: number, h: number, style: RectStyle = {}) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.style = style;
        this.rotation = 0;
    }

    public center(): IVector2 {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }

    public rotate(theta: number) {
        this.rotation += theta;
        this.emitDirty();
    }

    public setRotation(theta: number) {
        this.rotation = theta;
        this.emitDirty();
    }

    public render(cvsCtx: CanvasRenderingContext2D, pixelSize: number) {
        cvsCtx.save();
        const center = this.center();
        cvsCtx.translate(center.x, center.y);
        cvsCtx.rotate(-this.rotation);
        cvsCtx.beginPath();
        cvsCtx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
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
