import type { WC_TagName_type } from './common/WC_TagName_type.mts';

// If T is valid, return T, otherwise return the literal string 'INVALID_TAG_NAME'
/**
 * @preserve
 * @template {string} T
 * @[blank]typedef {import('./EnsureValidTag.mts').EnsureValidTag<T>} EnsureValidTag
 */
export type EnsureValidTag<T extends string> =
	WC_TagName_type<T> extends T ? T : 'INVALID_TAG_NAME';
