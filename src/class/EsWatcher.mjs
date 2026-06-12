// @ts-check

import { context } from 'esbuild';
import { SafeExit } from './SafeExit.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

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
	/**
	 * @description
	 * @param {Partial<O>} buildOptions
	 * @param {import('esbuild').WatchOptions} [watchOptions]
	 * @example
	 * import { EsWatcher } from 'vivth/node';
	 *
	 * const { context, remove } = new EsWatcher({
	 *  ...esbuildOptions,
	 * });
	 */
	constructor(buildOptions, watchOptions) {
		const context_ = (this.ctx = context(
			// @ts-expect-error
			buildOptions,
		));
		context_.then(async (ctx) => {
			await ctx.watch(watchOptions);
			SafeExit.instance?.addCallback(this.vivthCleanup);
		});
	}

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
	rebuild = async () => {
		const ctx = await this.ctx;
		return ctx.rebuild();
	};
}
