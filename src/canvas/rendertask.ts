import EventEmitter from 'events';
import { MouseEventContext } from '../interfaces';
import { Bound } from '../math';

const DirtyEventName = 'render-task.event.dirty';

export abstract class RenderTask {
    private _event = new EventEmitter();

    public listenDirty(listener: (renderTask: RenderTask) => void) {
        this._event.addListener(DirtyEventName, listener);
    }

    public unlistenDirty(listener: (renderTask: RenderTask) => void) {
        this._event.removeListener(DirtyEventName, listener);
    }

    public emitDirty() {
        this._event.emit(DirtyEventName, this);
    }

    public render(_cvsCtx: CanvasRenderingContext2D, _pixelSize: number) {
        throw new Error('RenderTask.render() must be implemented');
    }

    public onRemoved() {}

    public onWheel() {}

    public onMouseMove(_context: MouseEventContext) {}

    public getBound(): Bound | undefined {
        return undefined;
    }
}
