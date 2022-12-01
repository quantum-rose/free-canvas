export class DrawUtil {
    public static line(cvsCtx: CanvasRenderingContext2D, start: number[], end: number[], color: string, lineWidth: number) {
        cvsCtx.save();
        cvsCtx.beginPath();
        cvsCtx.moveTo(start[0], start[1]);
        cvsCtx.lineTo(end[0], end[1]);
        cvsCtx.strokeStyle = color;
        cvsCtx.lineWidth = lineWidth;
        cvsCtx.stroke();
        cvsCtx.restore();
    }

    public static polyline(cvsCtx: CanvasRenderingContext2D, points: number[][], color: string, lineWidth: number) {
        cvsCtx.save();
        cvsCtx.beginPath();
        cvsCtx.moveTo(points[0][0], points[0][1]);
        for (let i = 2; i < points.length; i += 2) {
            cvsCtx.lineTo(points[i][0], points[i][1]);
        }
        cvsCtx.strokeStyle = color;
        cvsCtx.lineWidth = lineWidth;
        cvsCtx.stroke();
        cvsCtx.restore();
    }
}
