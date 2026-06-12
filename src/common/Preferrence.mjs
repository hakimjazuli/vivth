// @ts-check

/**
 * @description
 * - class wrapper for `vivth` innerworking preferrences;
 */
export class Preferrence {
	/**
	 * @description
	 * - default `vivth` innerworking encoding;
	 * @type {BufferEncoding}
	 */
	static encoding = 'utf-8';
	/**
	 * @description
	 * - setup `vivth `preffered encoding;
	 * @param {Object} arg0
	 * @param {typeof Preferrence["encoding"]} arg0.encoding
	 * @example
	 * import { Preferrence } from 'vivth/neutral';
	 *
	 * Preferrence.setup({ encoding: 'utf-8' });
	 */
	static setup = ({ encoding }) => {
		Preferrence.encoding = encoding;
	};
}
