// @ts-check

/**
 * @description
 * - class helper for signal performant logging, more or less just for type hinting;
 * - internally used as Signal value logging instance;
 * @template {any} VALUE
 */
export class DataLog {
	/**
	 * @description
	 * @param {VALUE} value
	 */
	constructor(value) {
		this.value = value;
	}
	/**
	 * @description
	 * - data value;
	 * @type {VALUE}
	 */
	value;
	/**
	 * @description
	 * - occurence unix timestamp;
	 * @type {number}
	 */
	timeStamp = Date.now();
}
