// @ts-check

import { TrySync } from './TrySync.mjs';

/**
 * @description
 * - create animation timeline helper;
 * @param {Object} options
 * @param {number} options.fps
 * - frame per second;
 * @param {{seconds:number}|{frames:number}} options.duration
 * @param {(frame:{index:number, total:number, percentage:number})=>void} callback
 * - called every frame until duration ends;
 * @returns {()=>void}
 * - early clearInterval callback;
 */
export function NewAnimationTimeline({ fps, duration }, callback) {
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let interval;
	let totalFrames;
	if ('frames' in duration) {
		totalFrames = duration.frames;
	} else {
		totalFrames = Math.round(fps * duration.seconds);
	}
	let currentFrame = 0;
	const clear = () => {
		clearInterval(interval);
	};
	interval = setInterval(() => {
		const [, errorAnimate] = TrySync(() => {
			currentFrame++;
			callback({
				get index() {
					return currentFrame;
				},
				get total() {
					return totalFrames;
				},
				get percentage() {
					return currentFrame / totalFrames;
				},
			});
		});
		if (errorAnimate) {
			console.error({ errorAnimate });
			clear();
			return;
		}
		if (currentFrame >= totalFrames && interval) {
			clear();
		}
	}, 1000 / fps);
	return clear;
}
