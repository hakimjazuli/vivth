// @ts-check

import { Signal } from '../class/Signal.mjs';

/**
 * @template Value
 * @param {Value} value
 * @returns {Signal<Value>}
 */
export const NewSignal = (value) => new Signal(value);
