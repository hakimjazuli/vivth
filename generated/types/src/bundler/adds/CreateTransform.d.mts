import { Transform } from 'node:stream';
/**
 * @description
 * - function helper to turn string into `node:stream.Transform` instance;
 * - usefull for generating return value for `asar.options.transform`;
 * @param {string} content
 * @returns {Transform}
 * @example
 * import { CreateTransform } from 'vivth/node';
 *
 * // asar input context:
 * const transform = (filePath) => {
 * 	filePath = Paths.normalize(filePath);
 * 	const newStringFromBundle = checkBundle.get*(filePath);
 * 	if (newStringFromBundle) {
 * 		return CreateTransform(newStringFromBundle);
 * 	}
 * 	const res = optionsTransform?.(filePath);
 * 	if (!res) {
 * 		return;
 * 	}
 * 	return res;
 * };
 * //
 */
export declare function CreateTransform(content: string): Transform;
