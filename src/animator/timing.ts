export interface TimingProps {
    duration: number;
    iterations?: number;
    easing?(p: number): number;
}

export class Timing {
    public startTime: number;

    public duration: number;

    public iterations: number;

    public easing: (p: number) => number;

    constructor({ duration, iterations = 1, easing }: TimingProps) {
        this.startTime = Date.now();
        this.duration = duration;
        this.iterations = iterations;
        this.easing = (p: number) => {
            if (easing) {
                return easing(p);
            }
            return p;
        };
    }

    public get time() {
        return Date.now() - this.startTime;
    }

    public get p() {
        const progress = Math.min(this.time / this.duration, this.iterations);
        return this.isFinished ? 1 : this.easing(progress % 1);
    }

    public get isFinished() {
        return this.time / this.duration >= this.iterations;
    }
}
