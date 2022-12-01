import { Timing, TimingProps } from './timing';

interface AnimateUpdater<T> {
    (params: { target: T; frameIndex: number; timing: Timing }): boolean | void;
}

export class Animator {
    private _timing: TimingProps;

    constructor({ duration, iterations, easing }: TimingProps) {
        this._timing = {
            duration,
            iterations,
            easing,
        };
    }

    public animate<T>(target: T, update: AnimateUpdater<T>) {
        let frameIndex = 0;
        const timing = new Timing(this._timing);
        return new Promise(resolve => {
            function next() {
                if (update({ target, frameIndex, timing }) !== false && !timing.isFinished) {
                    requestAnimationFrame(next);
                } else {
                    resolve(timing);
                }
                frameIndex++;
            }
            next();
        });
    }
}
