import { EventNameSpace } from '../common/EventNameSpace.mjs';
/**
 * @description
 * - simple object generation function helper for [EventCheck](#eventcheck), for multiple context, eg: `mainThread` <-> `workerThread`;
 * @template {string} NAME
 * @param {NAME} name
 * @returns {{[EventNameSpace]: NAME}}
 * @example
 * import { EventObject } from 'vivth/neutral';
 *
 * export const eventObjectPayload = EventObject('worker:exit');
 */
export declare function EventObject<NAME extends string>(name: NAME): {
    [EventNameSpace]: NAME;
};
