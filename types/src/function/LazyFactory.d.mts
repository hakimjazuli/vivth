export function LazyFactory<T>(factory: () => T): T & {
    [unwrapLazy]: string;
};
import { unwrapLazy } from '../common/lazie.mjs';
