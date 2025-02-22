// @ts-check

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const timeout = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * @param {(...any:any)=>(any|Promise<any>)} fn
 * @returns {boolean}
 */
export const isAsync = (fn) => fn.constructor.name === 'AsyncFunction';
