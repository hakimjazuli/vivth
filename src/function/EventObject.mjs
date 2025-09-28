// @ts-check
import { EventNameSpace } from '../common/EventNameSpace.mjs';

/**
 * @description
 * - simple object generation function helper for [EventCheck](#eventcheck), for multiple context, eg: `mainThread` <-> `workerThread`;
 * @template {string} NAME
 * @param {NAME} name
 * @returns {{[EventNameSpace]: NAME}}
 * @example
 * import { EventCheck } from 'vivth';
 * import { incomingMessage } from './some/where.mjs';
 *
 * const eventObjectPayload = EventObject('worker:exit');
 * // assuming `incomingMessage`, also created using EventObject('worker:exit');
 * // or manually {[EventNameSpace]:'worker:exit'};
 * // which either will result true;
 */
export function EventObject(name) {
	return { [EventNameSpace]: name };
}
