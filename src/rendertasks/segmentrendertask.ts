import { RenderTask } from '../canvas';
import { ArcSegment, LineSegment, SegmentClassId } from '../interfaces';
import { Bound, Vector2 } from '../math';

export class SegmentRenderTask extends RenderTask {
    public regions: (LineSegment | ArcSegment)[][][];

    private _strokeColors: string[] = [];

    constructor(regions: (LineSegment | ArcSegment)[][][]) {
        super();
        this.regions = regions;
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
            region.forEach(path =>
                path.forEach((segment, i) => {
                    if (this._strokeColors[colorIndex] === undefined) {
                        this._strokeColors[colorIndex] = this.randomColor;
                    }
                    const color = this._strokeColors[colorIndex];
                    if (segment.classId === SegmentClassId.Line) {
                        this._line(cvsCtx, segment, color, pixelSize);
                        const start = new Vector2(segment.endPoints[0].x, segment.endPoints[0].y);
                        const end = new Vector2(segment.endPoints[1].x, segment.endPoints[1].y);
                        const middle = start.clone().add(end).scale(0.5);
                        const dir = end.clone().sub(start).normalize();
                        this._triagle(cvsCtx, middle, dir, color, pixelSize);
                        this._number(cvsCtx, middle, dir, i.toString(), color, pixelSize);
                    } else {
                        const middleDir = new Vector2(segment.radius, 0).rotate((segment.startAngle + segment.endAngle) / 2);
                        const middle = new Vector2(segment.centerPoint.x, segment.centerPoint.y).add(middleDir);
                        const middleTangent = middleDir.normalize().rotate(Math.PI / (segment.startAngle > segment.endAngle ? -2 : 2));
                        this._arc(cvsCtx, segment, color, pixelSize);
                        this._triagle(cvsCtx, middle, middleTangent, color, pixelSize);
                        this._number(cvsCtx, middle, middleTangent, i.toString(), color, pixelSize);
                        console.log(middle);
                    }
                    colorIndex++;
                })
            )
        );
        cvsCtx.restore();
    }

    public getBound(): Bound {
        const bound = new Bound();
        this.regions.forEach(region =>
            region.forEach(path =>
                path.forEach(segment => {
                    if (segment.classId === SegmentClassId.Line) {
                        bound.addPoint(new Vector2(segment.endPoints[0].x, segment.endPoints[0].y));
                        bound.addPoint(new Vector2(segment.endPoints[1].x, segment.endPoints[1].y));
                    } else {
                        let startAngle = segment.startAngle;
                        let endAngle = segment.endAngle;
                        if (segment.startAngle > segment.endAngle) {
                            startAngle = segment.endAngle;
                            endAngle = segment.startAngle;
                        }
                        const pid2 = Math.PI / 2;
                        const sn = Math.ceil(startAngle / pid2);
                        const en = Math.floor(endAngle / pid2);
                        const min = new Vector2(Infinity, Infinity);
                        const max = new Vector2(-Infinity, -Infinity);
                        for (let i = sn; i <= en; i++) {
                            const angIdx = ((i % 4) + 4) % 4;
                            if (angIdx === 0) {
                                max.x = Math.max(max.x, segment.centerPoint.x + segment.radius);
                            } else if (angIdx === 1) {
                                max.y = Math.max(max.y, segment.centerPoint.y + segment.radius);
                            } else if (angIdx === 2) {
                                min.x = Math.min(min.x, segment.centerPoint.x - segment.radius);
                            } else if (angIdx === 3) {
                                min.y = Math.min(min.y, segment.centerPoint.y - segment.radius);
                            }
                        }
                        const arcBound = new Bound(min, max);

                        const start = new Vector2(
                            segment.centerPoint.x + segment.radius * Math.cos(segment.startAngle),
                            segment.centerPoint.y + segment.radius * Math.sin(segment.startAngle)
                        );
                        const end = new Vector2(
                            segment.centerPoint.x + segment.radius * Math.cos(segment.endAngle),
                            segment.centerPoint.y + segment.radius * Math.sin(segment.endAngle)
                        );
                        arcBound.addPoint(start);
                        arcBound.addPoint(end);

                        bound.addBound(arcBound);
                    }
                })
            )
        );
        bound.expand(Math.max(bound.width, bound.height) * 0.02);
        return bound;
    }

    private _line(cvsCtx: CanvasRenderingContext2D, line: LineSegment, color: string, lineWidth: number): void {
        cvsCtx.beginPath();
        cvsCtx.moveTo(line.endPoints[0].x, line.endPoints[0].y);
        cvsCtx.lineTo(line.endPoints[1].x, line.endPoints[1].y);
        cvsCtx.strokeStyle = color;
        cvsCtx.lineWidth = lineWidth;
        cvsCtx.stroke();
    }

    private _arc(cvsCtx: CanvasRenderingContext2D, arc: ArcSegment, color: string, lineWidth: number): void {
        cvsCtx.beginPath();
        cvsCtx.arc(arc.centerPoint.x, arc.centerPoint.y, arc.radius, arc.startAngle, arc.endAngle, arc.startAngle > arc.endAngle);
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
