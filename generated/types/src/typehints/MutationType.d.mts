/**
 * - instance method: serves as helper to mutate, and notify for `effects`;
 * > - `slice` uses `splice` in the background, you don't need to manually reindex when using it;
 */
export type MutationType = "push" | "unshift" | "splice" | "swap" | "modify" | "shift" | "remove";
