// @ts-check

import { context } from 'esbuild';
import { SafeExit } from './SafeExit.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

/**
 * @description
 * - wrapper for `watcher` via `esbuild.context`;
 * - watcher cleanup is automatically registered to `SafeExit`;
 * @template {import('esbuild').BuildOptions} O
 */
export class EsWatcher {
	/**
	 * @description
	 * @param {Partial<O>} buildOptions
	 * @param {import('esbuild').WatchOptions} [watchOptions]
	 * @example
	 * import { EsWatcher } from 'vivth';
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
			SafeExit.instance?.addCallback(this.#kill);
		});
	}
	/**
	 * @type {()=>Promise<void>}
	 */
	#kill = async () => {
		const ctx = await this.ctx;
		await Promise.all([TryAsync(ctx.cancel), TryAsync(ctx.dispose)]);
	};

	/**
	 * @description
	 * - manually and safely call `cancel` and `dispose` on `BuildContext`;
	 * @type {()=>Promise<void>}
	 */
	remove = async () => {
		SafeExit.instance?.removeCallback(this.#kill);
		await this.#kill();
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
