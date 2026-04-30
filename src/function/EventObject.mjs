// @ts-check

import { EventNameSpace } from '../common/EventNameSpace.mjs';

/**
 * @description
 * - simple object generation function helper for [EventCheck](#eventcheck), for multiple context, eg: `mainThread` <-> `workerThread`;
 * @template {string} NAME
 * @param {NAME} name
 * @returns {{[EventNameSpace]: NAME}}
 * @example
 * import { EventObject } from 'vivth';
 *
 * export const eventObjectPayload = EventObject('worker:exit');
 */
export function EventObject(name) {
	return { [EventNameSpace]: name };
}
