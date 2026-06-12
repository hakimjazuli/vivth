// @ts-check

/**
 * @description
 * - object creation mapper;
 * @template {Object} OBJ
 * @template {any} MODIFIED
 * @param {OBJ} object
 * @param {(obj:OBJ)=>MODIFIED} callback
 * @returns {MODIFIED}
 */
export function NewObjectWrapper(object, callback) {
	return callback(object);
}
