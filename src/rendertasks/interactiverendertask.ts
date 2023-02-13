import { RenderTask } from '../canvas';
import { MouseEventContext } from '../interfaces';
import { Bound, Parametric, Vector2 } from '../math';
import { DrawUtil } from '../util/drawutil';
import { MathUtil } from '../util/mathutil';

export class InteractiveRenderTask extends RenderTask {
    private static _origin = new Vector2();

    private _color: string;

    private _vector: Vector2;

    public offset: number = 0;

    public get randomColor(): string {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    constructor() {
        super();
        this._color = this.randomColor;
        this._vector = new Vector2(600, 0);
    }

    public onMouseMove(context: MouseEventContext): void {
        this._vector = context.modelLocation.clone();
        this.emitDirty();
    }

    public render(cvsCtx: CanvasRenderingContext2D, pixelSize: number): void {
        cvsCtx.save();

        const l = 4000;
        const n = l / 100;
        for (let i = -n + 1; i < n; i++) {
            DrawUtil.line(cvsCtx, [i * 100, -l], [i * 100, l], '#808080', i === 0 ? pixelSize * 2 : pixelSize);
            DrawUtil.line(cvsCtx, [-l, i * 100], [l, i * 100], '#808080', i === 0 ? pixelSize * 2 : pixelSize);
        }

        this._arrow(cvsCtx, InteractiveRenderTask._origin, this._vector, this._color, pixelSize);

        Parametric((t: number, r: number) => [r * Math.cos(t * 3 + this.offset), t], MathUtil.fromPolar)(0, Math.PI, 1000, 100).draw(cvsCtx, {
            strokeStyle: 'red',
            lineWidth: pixelSize,
        });

        const near = -10 * Math.abs(Math.cos(this.offset));
        const far = -100;
        Parametric((z: number, n: number, f: number) => [z, n + f - (n * f) / z])(near, far, 10000, near, far).draw(cvsCtx, {
            strokeStyle: 'green',
            lineWidth: pixelSize * 2,
        });

        const position = new Vector2(0, (Math.sign(this._vector.y) || 1) * 20 * pixelSize).add(this._vector);
        const text = `(${this._vector.x.toFixed(2)}, ${this._vector.y.toFixed(2)}) ${this._vector.angle().toFixed(2)}`;
        this._text(cvsCtx, position, text, this._color, pixelSize);

        cvsCtx.restore();
    }

    private _arrow(cvsCtx: CanvasRenderingContext2D, start: Vector2, end: Vector2, color: string, pixelSize: number) {
        const dir = end.clone().sub(start);
        const a = dir
            .clone()
            .negate()
            .setLength(30 * pixelSize)
            .rotate(Math.PI / 10)
            .add(end);
        const b = dir
            .clone()
            .negate()
            .setLength(30 * pixelSize)
            .rotate(-Math.PI / 10)
            .add(end);
        const midpoint = a.clone().add(b).scale(0.5);
        DrawUtil.line(cvsCtx, start, midpoint, color, pixelSize * 3);
        cvsCtx.beginPath();
        cvsCtx.moveTo(end.x, end.y);
        cvsCtx.lineTo(a.x, a.y);
        cvsCtx.lineTo(b.x, b.y);
        cvsCtx.closePath();
        cvsCtx.fillStyle = color;
        cvsCtx.fill();
    }

    private _text(cvsCtx: CanvasRenderingContext2D, position: Vector2, text: string, color: string, pixelSize: number) {
        cvsCtx.save();
        cvsCtx.transform(1, 0, 0, -1, position.x, position.y);
        cvsCtx.textAlign = 'center';
        cvsCtx.textBaseline = 'middle';
        cvsCtx.font = `700 ${16 * pixelSize}px Helvetica`;
        cvsCtx.fillStyle = color;
        cvsCtx.fillText(text, 0, 0);
        cvsCtx.restore();
    }

    public getBound(): Bound | undefined {
        return new Bound(new Vector2(-100, -100), new Vector2(100, 100));
    }
}
