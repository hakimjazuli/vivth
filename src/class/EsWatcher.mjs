// @ts-check

import { context } from 'esbuild';
import { SafeExit } from './SafeExit.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { QChannel } from './QChannel.mjs';
import { Timeout } from '../function/Timeout.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - wrapper for `watcher` via `esbuild.context`;
 * - watcher cleanup is automatically registered to `SafeExit`;
 * @template {import('esbuild').BuildOptions} O
 * @implements {VivthCleanup}
 */
export class EsWatcher {
	static q = LazyFactory(() => new QChannel('EsWatcher'));
	/**
	 * @description
	 * @param {Partial<O>} buildOptions
	 * @param {import('esbuild').WatchOptions} [watchOptions]
	 * @param {number} [delay]
	 * @example
	 * import { EsWatcher } from 'vivth/node';
	 *
	 * const { context, remove } = new EsWatcher({
	 *  ...esbuildOptions,
	 * });
	 */
	constructor(buildOptions, watchOptions, delay = 0) {
		this.#delay = delay;
		const context_ = (this.ctx = context(
			// @ts-expect-error
			buildOptions,
		));
		context_.then(async (ctx) => {
			await ctx.watch(watchOptions);
			SafeExit.instance?.addCallback(this.vivthCleanup);
		});
	}
	#delay;
	/**
	 * @type {()=>Promise<void>}
	 */
	vivthCleanup = async () => {
		SafeExit.instance?.removeCallback(this.vivthCleanup);
		const { cancel, dispose } = await this.ctx;
		await Promise.all([TryAsync(cancel), TryAsync(dispose)]);
	};

	/**
	 * @description
	 * - Promise of `BuildContext`;
	 * @type {Promise<import('esbuild').BuildContext<O>>}
	 */
	ctx;
	/**
	 * @description
	 * - rebuild callback;
	 */
	rebuild = async () => {
		const timeout = this.#delay;
		if (!timeout) {
			const ctx = await this.ctx;
			return await ctx.rebuild();
		}
		await Timeout(this.#delay);
		const ctx = await this.ctx;
		return await ctx.rebuild();
	};
}
