export function WriteFileSafe(outFile: string, content: string, options: import("node:fs").WriteFileOptions): Promise<ReturnType<typeof TryAsync<void>>>;
import { TryAsync } from './TryAsync.mjs';
