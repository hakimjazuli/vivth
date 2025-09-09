export function CompileMJS({ entryPoint, encoding, outputNoExt, minify, asBinary, }: {
    entryPoint: string;
    outputNoExt: string;
    encoding: BufferEncoding;
    minify?: boolean;
    asBinary?: boolean;
}): Promise<ReturnType<typeof WriteFileSafe>>;
import { WriteFileSafe } from '../function/WriteFileSafe.mjs';
