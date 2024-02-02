import { MouseEventContext } from '../interfaces';
import { Bound, Matrix3, Vector2 } from '../math';
import { MathUtil } from '../util/mathutil';
import { RenderTask } from './rendertask';

export class Canvas {
    private _canvas: HTMLCanvasElement;

    private _cvsCtx: CanvasRenderingContext2D;

    private _width!: number;

    private _height!: number;

    private _lastPoint = new Vector2();

    private _renderTasks = new Set<RenderTask>();

    private _shouldRender = true;

    private _matrix = new Matrix3().scale(1, -1);

    private _zoomLimit = [0.01, 100];

    private get _zoom() {
        return Math.hypot(this._matrix[0], this._matrix[3]);
    }

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        const cvsCtx = this._canvas.getContext('2d');
        if (!cvsCtx) {
            throw new Error('Canvas context is not supported');
        }
        this._cvsCtx = cvsCtx;
        this._onResize();
        this._hookEvent();
        this._onEnterFrame();
    }

    private _hookEvent() {
        window.addEventListener('resize', this._onResize);
        if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            this._canvas.addEventListener('DOMMouseScroll', this._onWheel, false);
        } else {
            this._canvas.addEventListener('mousewheel', this._onWheel, false);
        }
        this._canvas.addEventListener('mousedown', this._onDragStart);
        this._canvas.addEventListener('mouseup', this._onDragEnd);
        this._canvas.addEventListener('dblclick', this.fit);
        this._canvas.addEventListener('mousemove', this._onMouseMove);
    }

    private _onResize = () => {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._shouldRender = true;
    };

    private _onWheel = (e: any) => {
        e.preventDefault();
        this._matrix.translate(-e.offsetX, -e.offsetY);
        if (e.detail ? e.detail > 0 : e.wheelDelta < 0) {
            this._matrix.scale(0.8, 0.8);
        } else {
            this._matrix.scale(1.25, 1.25);
        }
        const scale = MathUtil.clamp(this._zoom, this._zoomLimit[0], this._zoomLimit[1]) / this._zoom;
        this._matrix.scale(scale, scale);
        this._matrix.translate(e.offsetX, e.offsetY);
        this._renderTasks.forEach(task => task.onWheel());
        this._shouldRender = true;
    };

    private _onDragStart = (e: MouseEvent) => {
        this._lastPoint.x = e.offsetX;
        this._lastPoint.y = e.offsetY;
        this._canvas.addEventListener('mousemove', this._onDragMove);
        this._canvas.addEventListener('mouseleave', this._onDragEnd);
    };

    private _onDragMove = (e: MouseEvent) => {
        const { offsetX: x, offsetY: y } = e;
        this._matrix.translate(x - this._lastPoint.x, y - this._lastPoint.y);
        this._lastPoint.x = x;
        this._lastPoint.y = y;
        this._shouldRender = true;
    };

    private _onDragEnd = () => {
        this._canvas.removeEventListener('mousemove', this._onDragMove);
        this._canvas.removeEventListener('mouseleave', this._onDragEnd);
    };

    private _onMouseMove = (e: MouseEvent) => {
        const location = new Vector2(e.offsetX, e.offsetY);
        const modelLocation = this.screenToModel(location);
        const eventContext: MouseEventContext = {
            event: e,
            location,
            modelLocation,
        };
        this._renderTasks.forEach(task => task.onMouseMove(eventContext));
    };

    private _onEnterFrame = () => {
        if (this._shouldRender) {
            this._shouldRender = false;
            this._cvsCtx.clearRect(0, 0, this._width, this._height);
            this._cvsCtx.save();
            this._cvsCtx.transform(...this._matrix.toTransformArray());
            const pixelSize = 1 / this._zoom;
            this._renderTasks.forEach(task => task.render(this._cvsCtx, pixelSize));
            this._cvsCtx.restore();
        }
        requestAnimationFrame(this._onEnterFrame);
    };

    private _onRenderTaskDirty = () => (this._shouldRender = true);

    public addRenderTask(task: RenderTask) {
        task.listenDirty(this._onRenderTaskDirty);
        this._renderTasks.add(task);
        this.fit();
        this._shouldRender = true;
    }

    public removeRenderTask(task: RenderTask) {
        task.unlistenDirty(this._onRenderTaskDirty);
        this._renderTasks.delete(task);
        task.onRemoved();
        this._shouldRender = true;
    }

    private _getBound(): Bound {
        let bound: Bound | undefined;
        this._renderTasks.forEach(task => {
            const taskBound = task.getBound();
            if (taskBound) {
                if (!bound) {
                    bound = taskBound.clone();
                } else {
                    bound.addBound(taskBound);
                }
            }
        });
        if (!bound) {
            bound = new Bound(new Vector2(-this._width / 2, -this._height / 2), new Vector2(this._width / 2, this._height / 2));
        }
        return bound;
    }

    public fit = () => {
        const bound = this._getBound();
        const zoom = Math.min(this._width / bound.width, this._height / bound.height);
        this._matrix
            .identity()
            .translate(-bound.center.x, -bound.center.y)
            .scale(zoom, -zoom)
            .translate(this._width / 2, this._height / 2);
        this._shouldRender = true;
    };

    public screenToModel(point: Vector2): Vector2 {
        return point.applyMatrix3(this._matrix.clone().invert());
    }

    public modelToScreen(point: Vector2): Vector2 {
        return point.applyMatrix3(this._matrix);
    }
}
