import { RenderTask } from '../canvas';
import { IVector2 } from '../interfaces';
import { Bound, Vector2 } from '../math';

export class PolygonRenderTask extends RenderTask {
    public regions: Vector2[][][];

    private _strokeColors: string[] = [];

    private _strokeColor?: string;

    constructor(regions: IVector2[][][], strokeColor?: string) {
        super();
        this.regions = regions.map(region => region.map(path => path.map(point => new Vector2(point.x, point.y))));
        this._strokeColor = strokeColor;
    }

    public update(regions: IVector2[][][]) {
        this.regions = regions.map(region => region.map(path => path.map(point => new Vector2(point.x, point.y))));
        this.emitDirty();
    }

    public get randomColor(): string {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    public render(cvsCtx: CanvasRenderingContext2D, pixelSize: number): void {
        cvsCtx.save();
        let colorIndex = 0;
        this.regions.forEach(region =>
            region.forEach((path, n) =>
                path.forEach((point, i, arr) => {
                    const start = point;
                    const end = arr[(i + 1) % arr.length];
                    if (start.nearlyEquals(end)) {
                        return;
                    }
                    if (this._strokeColors[colorIndex] === undefined) {
                        this._strokeColors[colorIndex] = this.randomColor;
                    }
                    const color = this._strokeColor ? this._strokeColor : this._strokeColors[colorIndex];
                    this._line(cvsCtx, start, end, color, pixelSize);
                    const middle = start.clone().add(end).scale(0.5);
                    const dir = end.clone().sub(start).normalize();
                    this._triagle(cvsCtx, middle, dir, color, pixelSize);
                    this._number(cvsCtx, middle, dir, i.toString(), color, pixelSize);
                    colorIndex++;
                })
            )
        );
        cvsCtx.restore();
    }

    public getBound(): Bound {
        const bound = new Bound();
        this.regions.forEach(region => region.forEach(path => path.forEach(point => bound.addPoint(point))));
        bound.expand(Math.max(bound.width, bound.height) * 0.02);
        return bound;
    }

    private _line(cvsCtx: CanvasRenderingContext2D, start: Vector2, end: Vector2, color: string, lineWidth: number): void {
        cvsCtx.beginPath();
        cvsCtx.moveTo(start.x, start.y);
        cvsCtx.lineTo(end.x, end.y);
        cvsCtx.strokeStyle = color;
        cvsCtx.lineWidth = lineWidth;
        cvsCtx.stroke();
    }

    private _triagle(cvsCtx: CanvasRenderingContext2D, position: Vector2, dir: Vector2, color: string, pixelSize: number) {
        const a = dir
            .clone()
            .setLength(20 * pixelSize)
            .add(position);
        const b = dir
            .clone()
            .rotate((5 * Math.PI) / 6)
            .setLength(15 * pixelSize)
            .add(position);
        const c = dir
            .clone()
            .rotate((-5 * Math.PI) / 6)
            .setLength(15 * pixelSize)
            .add(position);
        cvsCtx.beginPath();
        cvsCtx.moveTo(a.x, a.y);
        cvsCtx.lineTo(b.x, b.y);
        cvsCtx.lineTo(c.x, c.y);
        cvsCtx.closePath();
        cvsCtx.fillStyle = color;
        cvsCtx.fill();
    }

    private _number(cvsCtx: CanvasRenderingContext2D, position: Vector2, dir: Vector2, text: string, color: string, pixelSize: number) {
        cvsCtx.save();
        const { x, y } = dir
            .clone()
            .rotate(Math.PI / 2)
            .setLength(16 * pixelSize)
            .add(position);
        cvsCtx.transform(1, 0, 0, -1, x, y);
        cvsCtx.textAlign = 'center';
        cvsCtx.textBaseline = 'middle';
        cvsCtx.font = `700 ${16 * pixelSize}px Helvetica`;
        cvsCtx.fillStyle = color;
        cvsCtx.fillText(text, 0, 0);
        cvsCtx.restore();
    }
}
