/**
 * Checks if a string segment contains invalid characters (Spaces, Uppercase, or Symbols)
 */
export type IsValidSegment<S extends string> = S extends `${infer Char}${infer Rest}` ? Char extends ' ' | '_' | '/' | '\\' | '.' | ',' | '?' | '!' ? false : Char extends Uppercase<Char> ? Char extends Lowercase<Char> ? true : false : IsValidSegment<Rest> : true;
/**
 * @preserve
 * @description
 * Validates whether a string follows the strict custom-element layout:
 * - Must contain a hyphen (-)
 * - No spaces allowed anywhere
 * - Must be strictly lowercase
 * @template {string} TAG
 * @[blank]typedef {import('./WC_TagName_type.mts').WC_TagName_type<TAG>} WC_TagName_type
 */
export type WC_TagName_type<T extends string> = T extends `${infer Prefix}-${infer Suffix}` ? Prefix extends '' ? 'ERROR: Custom element tag names cannot start with a hyphen.' : Suffix extends '' ? 'ERROR: Custom element tag names cannot end with a hyphen.' : IsValidSegment<Prefix> extends false ? 'ERROR: Tag contains spaces, uppercase letters, or invalid characters in the prefix.' : IsValidSegment<Suffix> extends false ? 'ERROR: Tag contains spaces, uppercase letters, or invalid characters in the suffix.' : T : 'ERROR: Web Component tag names MUST contain a hyphen (-) character.';
