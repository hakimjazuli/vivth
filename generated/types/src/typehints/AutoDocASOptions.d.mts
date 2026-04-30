export type AutoDocASOptions = {
    /**
     * - `true`: will generate `${fileName}.mjs` that uses `FSasar`;
     * >- upon compiling with `vivth` it should be embeded as inline buffer;
     * - `false`: does nothing;
     * - on both cases, the `${fileName}.js` can be used for both browser or nodeJS compatibel runtime;
     */
    generateFSasarImporter?: boolean | undefined;
    /**
     * - `argv` for assembley script compiler (`asc.main`), excluding `inputPath`, `--outputFile`, `--bindings`;
     * >- `--bindings`: strictly using `esm`;
     */
    ASArgv?: string[] | undefined;
    ASAPIOptions?: Parameters<typeof import("../bundler/CompileAS.mjs").CompileAS>[1];
};
