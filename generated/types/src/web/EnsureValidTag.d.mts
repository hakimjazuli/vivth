import type { WC_TagName_type } from './common/WC_TagName_type.mts';
/**
 * @preserve
 * @template {string} T
 * @[blank]typedef {import('./EnsureValidTag.mts').EnsureValidTag<T>} EnsureValidTag
 */
export type EnsureValidTag<T extends string> = WC_TagName_type<T> extends T ? T : 'INVALID_TAG_NAME';
