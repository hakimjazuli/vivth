import { EventNameSpace } from '../common/EventNameSpace.mjs';
/**
 * @description
 * - simple validation function for [EventObject](#eventobject), for multiple context, eg: `mainThread` <-> `workerThread`;
 * @param {any} object
 * @param {Record<typeof EventNameSpace, string>} eventObject
 * @returns {boolean}
 * @example
 * import { EventCheck } from 'vivth/neutral';
 * import { incomingMessage } from './some/where.mjs';
 *
 * const eventObjectPayload = EventObject('worker:exit');
 *
 * console.log(EventCheck(incomingMessage, eventObjectPayload));
 * // assuming `incomingMessage`, also created using EventObject('worker:exit');
 * // or manually {[EventNameSpace]:'worker:exit'};
 * // which either will result true;
 */
export declare function EventCheck(object: any, eventObject: Record<typeof EventNameSpace, string>): boolean;
