import BezierEasing from 'bezier-easing';
import { Animator } from './animator';
import { Canvas } from './canvas';
import { Circle } from './rendertasks/circle';
import { InteractiveRenderTask } from './rendertasks/interactiverendertask';
import { Rect } from './rendertasks/rect';

const canvasElement = document.createElement('canvas');
document.body.appendChild(canvasElement);
const canvas = new Canvas(canvasElement);

const interactiveRenderTask = new InteractiveRenderTask();
canvas.addRenderTask(interactiveRenderTask);

new Animator({ duration: 10000, iterations: Infinity }).animate(interactiveRenderTask, ({ target, timing }) => {
    target.offset = Math.PI * 2 * timing.p;
    target.emitDirty();
});

const rect = new Rect(45, 45, 10, 10, {
    lineWidth: 1,
    strokeStyle: 'blue',
    fillStyle: 'skyblue',
});
canvas.addRenderTask(rect);

new Animator({ duration: 1000, iterations: Infinity, easing: (p: number) => p * (2 - p) }).animate(rect, ({ target, timing }) => {
    target.setRotation(Math.PI * 0.5 * timing.p);
});

const square = new Rect(-55, -55, 10, 10, {
    lineWidth: 1,
    strokeStyle: 'red',
    fillStyle: 'pink',
});
canvas.addRenderTask(square);

new Animator({ duration: 1000, iterations: Infinity, easing: BezierEasing(0.5, -1.5, 0.5, 2.5) }).animate(square, ({ target, timing }) => {
    target.setRotation(Math.PI * 0.5 * timing.p);
});

const circle = new Circle(0, 95, 5, {
    lineWidth: 1,
    strokeStyle: 'orange',
    fillStyle: 'yellow',
});
canvas.addRenderTask(circle);

async function fall(h: number, duration: number, k = 0.5): Promise<void> {
    await new Animator({ duration, easing: (p: number) => p ** 2 }).animate(circle, ({ target, timing }) => {
        target.y = target.radius + h * (1 - timing.p);
        target.emitDirty();
    });
    const nextH = h * k;
    const nextDuration = (duration ** 2 * k) ** 0.5;
    if (nextDuration > 16) {
        await new Animator({ duration: nextDuration, easing: (p: number) => p * (2 - p) }).animate(circle, ({ target, timing }) => {
            target.y = target.radius + nextH * timing.p;
            target.emitDirty();
        });
        return fall(nextH, nextDuration, k);
    }
}
fall(90, 1000, 0.9).then(() => console.log('end'));

Object.defineProperty(window, 'canvas', {
    get: () => canvas,
});
