// @ts-check

import { join } from 'node:path';

import { Paths } from '../class/Paths.mjs';

export class FSInline {
	static prefix = '';
	/**
	 * @param {string} filePathFromProject
	 * @returns {Promise<Buffer<ArrayBuffer>>}
	 */
	static vivthFSInlineFile = async (filePathFromProject) => {
		filePathFromProject = Paths.normalizesForRoot(filePathFromProject);
		const bufferStored = FSInline.vivthFSInlinelists[filePathFromProject];
		if (bufferStored === undefined) {
			return Buffer.from([]);
		}
		return Buffer.from(bufferStored);
	};
	/**
	 * @param {string} dirPathFromProject
	 * @param {Object} regexRule
	 * @param {RegExp} regexRule.dir
	 * @param {RegExp} regexRule.file
	 * @returns {Promise<typeof FSInline["vivthFSInlineFile"]>}
	 * - relative to the `dirPathFromProject`
	 */
	static vivthFSInlineDir = async (dirPathFromProject) => {
		dirPathFromProject = Paths.normalizesForRoot(dirPathFromProject);
		return (path_) => FSInline.vivthFSInlineFile(join(dirPathFromProject, path_));
	};
	/**
	 * - to be used as embed placeholder on `bundled` and `compiled`;
	 * @type {Record<string, Buffer<ArrayBufferLike>>}
	 */
	static vivthFSInlinelists;
}
