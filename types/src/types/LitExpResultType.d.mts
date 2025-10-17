export type LitExpResultType<KEYS extends import("./LitExpKeyType.mjs").LitExpKeyType> = {
    result: {
        whole: string[];
        named: Array<Record<keyof KEYS, string>>;
    };
    regexp: RegExp;
};
