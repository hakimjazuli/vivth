import type { LitExpKeyType } from './LitExpKeyType.mjs';
export type LitExpResultType<KEYS extends LitExpKeyType> = {
    result: {
        whole: string[];
        named: Array<Record<keyof KEYS, string>>;
    };
    regexp: RegExp;
};
/**
 * @import {LitExpKeyType} from './LitExpKeyType.mjs'
 */
/**
 * @template {LitExpKeyType} KEYS
 * @typedef {{result:{whole:string[], named:Array<Record<keyof KEYS, string>>},
 * regexp: RegExp}} LitExpResultType
 */
