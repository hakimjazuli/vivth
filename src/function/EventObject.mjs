// @ts-check
import { EventNameSpace } from '../common/EventNameSpace.mjs';

/**
 * @description
 * - simple object generation function helper for [EventCheck](#eventcheck), for multiple context, eg: `mainThread` <-> `workerThread`;
 * @template {string} N
 * @param {N} name
 * @returns {{[EventNameSpace]: N}}
 * @example
 * import { EventCheck } from 'vivth';
 * import { incomingMessage } from './some/where.mjs';
 *
 * const eventObjectPayload = EventObject('worker:exit');
 * // assuming `incomingMessage`, also created using EventObject('worker:exit');
 * // or manually {[EventNameSpace]:'worker:exit'};
 * // which either will result true;
 */
export const EventObject = (name) => {
	return { [EventNameSpace]: name };
};
