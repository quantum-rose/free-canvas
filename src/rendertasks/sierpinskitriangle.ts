import { RenderTask } from '../canvas';
import { Bound, Vector2 } from '../math';

export class SierpinskiTriangle extends RenderTask {
    private _renderCache: HTMLCanvasElement | null = null;

    private readonly _radius = 400;

    private readonly _width = this._radius * 3 ** 0.5;

    private readonly _height = this._radius * 1.5;

    public render(cvsCtx: CanvasRenderingContext2D, pixelSize: number): void {
        if (!this._renderCache) {
            this._renderCache = this._getRenderData(pixelSize);
        }
        cvsCtx.save();
        cvsCtx.scale(1, -1);
        cvsCtx.drawImage(this._renderCache, -this._width / 2, -this._height / 2, this._width, this._height);
        cvsCtx.restore();
    }

    private _getRenderData(pixelSize: number) {
        const offscreenCanvas = document.createElement('canvas');
        const cvsCtx = offscreenCanvas.getContext('2d');
        if (!cvsCtx) {
            throw new Error('Canvas context is not supported');
        }
        const a = new Vector2(0, this._radius * pixelSize);
        const b = a.clone().rotate(-(Math.PI * 2) / 3);
        const c = a.clone().rotate((Math.PI * 2) / 3);
        const bound = new Bound();
        bound.addPoint(a);
        bound.addPoint(b);
        bound.addPoint(c);
        const { width, height } = bound;
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;

        cvsCtx.transform(1, 0, 0, -1, width / 2, this._radius * pixelSize);
        cvsCtx.beginPath();
        cvsCtx.fillStyle = '#000';
        cvsCtx.rect(a.x - pixelSize / 2, a.y - pixelSize / 2, pixelSize, pixelSize);
        cvsCtx.rect(b.x - pixelSize / 2, b.y - pixelSize / 2, pixelSize, pixelSize);
        cvsCtx.rect(c.x - pixelSize / 2, c.y - pixelSize / 2, pixelSize, pixelSize);

        const vertexes = [a, b, c];
        let lastPoint = a.clone().sub(b).scale(Math.random()).add(b);
        for (let i = 0; i < 10000; i++) {
            const vertex = vertexes[Math.floor(Math.random() * 3)];
            const nextPoint = lastPoint.clone().sub(vertex).scale(0.5).add(vertex);
            cvsCtx.rect(nextPoint.x - pixelSize / 2, nextPoint.y - pixelSize / 2, pixelSize, pixelSize);
            lastPoint = nextPoint;
        }
        cvsCtx.fill();

        return offscreenCanvas;
    }

    public onWheel() {
        this._renderCache = null;
    }
}
