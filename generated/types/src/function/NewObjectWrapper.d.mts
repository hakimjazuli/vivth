/**
 * @description
 * - object creation mapper;
 * @template {Object} OBJ
 * @template {any} MODIFIED
 * @param {OBJ} object
 * @param {(obj:OBJ)=>MODIFIED} callback
 * @returns {MODIFIED}
 */
export declare function NewObjectWrapper<OBJ extends Object, MODIFIED extends any>(object: OBJ, callback: (obj: OBJ) => MODIFIED): MODIFIED;
