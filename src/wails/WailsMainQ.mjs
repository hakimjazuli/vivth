// @ts-check

import { QChannel } from '../class/QChannel.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';

/**
 * @description
 * - is a [QChannel](#qchannel) instance helper to queue operations;
 * - use with certain unique object;
 * - don't use primitive like, number | string | etc;
 * @type {QChannel<any>}
 */
export const WailsMainQ = LazyFactory(() => new QChannel('WailsMainQ'));
