#!/usr/bin/env node
// @ts-check

import { LazyFactory } from '../../src/function/LazyFactory.mjs';

const node_modules = LazyFactory(() => ({
	/** @node_modules */
}));

/**
 * @type {Record<string, string>}
 */
const workers = LazyFactory(() => ({
	/** @workers */
}));

const src = LazyFactory(() => ({
	init: async () => {
		/** @entry */
	},
	/** @src */
}));

src.init();
