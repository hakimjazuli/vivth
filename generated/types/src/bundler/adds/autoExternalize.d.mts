export function autoExternalize(path: string, targetPath: string, watchPath: string, mapToPath: string, depMap: Map<string, Set<string>>, esbuildPathRebuild: Map<string, () => Promise<any>>): Plugin;
import type { Plugin } from 'esbuild';
