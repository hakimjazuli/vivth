export function EsBundler({ content, extension, asBinary }: {
    content: string;
    extension: string;
    asBinary?: boolean;
}, esbuildOptions?: Omit<Parameters<typeof build>[0], "entryPoints" | "bundle" | "write" | "format" | "sourcemap" | "external" | "stdin">): Promise<ReturnType<typeof TryAsync<string>>>;
import { build } from 'esbuild';
import { TryAsync } from '../function/TryAsync.mjs';
