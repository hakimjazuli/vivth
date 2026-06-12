/**
 * @description
 * - object creation mapper;
 * @template {Object} OBJ
 * @template {any} MODIFIED
 * @param {OBJ} object
 * @param {(obj:OBJ)=>MODIFIED} callback
 * @returns {MODIFIED}
 */
export function NewObjectWrapper<OBJ extends Object, MODIFIED extends unknown>(object: OBJ, callback: (obj: OBJ) => MODIFIED): MODIFIED;
