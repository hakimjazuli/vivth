## HOW TO INSTALL

- example uses `npm`, you can allways use your own favourite package manager;

```shell
npm i vivth
```

---

## vivth

- `vivth` are intended to be a collections of usefull `primitives`, and not to be directly used as
  underlying framework;
- `vivth` are leaning to `esm(.mjs)+jsdoc` first;
  > - some functionality "might need" work around if you are using other than `esm+jsdoc`;
- contains helpers to help you write data driven javascript program, including:
  > - collections of ⚡ performant `signal` classes;
  >   > - `vivth` deliberately take away `auto-subscription`:
  >   >   > - and introducing more imperative way of subsrciption yet still simple enough, which in
  >   >   >   turn, it completely removes abstraction performance headsup on previously needed auto
  >   >   >   subsrciption process on first run;
  >   >   > - and also make previously unthinkable dynamic subscription on conditionals that runs
  >   >   >   outside first run, now completely possible;
  > - collections of `queue-helper` classes;
  > - fully typed `worker-threads` abstraction;
  > - ` error as value` function helper;
  > - opionated `autoDocumentation`;
  > - opionated `bundler`:
  >   > - abstracted via `esbuild`;
  > - opionated `compiler`;
  >   > - abstracted via `bun`;
- core `dependency`:
  > - `bunJS`(hard mandatory);
  > - `nodeJS`(checks for compatibility if you need to run things in node instead of bun);

---

## versions:

- `1.0.0+:beta`:

  > - beta release;
  > - checking edge cases;
  > - stable API, the exposed API access are highly unlikely to changes, only the underlying code
  >   might changes for improving performance;

- `1.3.x:beta`:
  > - type should now fully fixed, even with strict ts check;
- `1.3.3+:beta`:
  > - added class `Dev` for testing and `Dev`/`preBundled` only code block;
- `1.5.x:rc`:
  > - move code stripping to [BundledV](#bundledv);
  > - [EnvMode](#envmode) are now independent from whether it's bundled or not, and need to be
  >   separately declared;
  > - add mechanism for `Effect` callback to run periodically when under heavy calls;
  > - move all logic for `FSInline` to [FSasar](#fsasar);
  > - modify [JSautoDoc](#jsautodoc) for `multi-exports`, as to prevent runtime to run incorrect
  >   platform module due to importing from `libName` still walktrhough all of listed exports
  >   regardless if it's being imported or not;

---

<h2 id="list-of-exported-api-and-typehelpers">list of exported API and typehelpers</h2>

- [node.BrowserExternals](#browserexternals)
- [node.CreateTransform](#createtransform)
- [node.LastEditedUnix](#lasteditedunix)
- [node.NodeModuleList](#nodemodulelist)
- [node.PathFSBundles](#pathfsbundles)
- [node.PathFSDir](#pathfsdir)
- [node.PathFSFile](#pathfsfile)
- [node.ToBundledJSPlugin](#tobundledjsplugin)
- [node.CompileAS](#compileas)
- [node.CompileJS](#compilejs)
- [neutral.CreateESPlugin](#createesplugin)
- [node.EsBundler](#esbundler)
- [node.FileSelfMapper](#fileselfmapper)
- [node.FSAnalyzer](#fsanalyzer)
- [node.FSasar](#fsasar)
- [node.JSDirMapper](#jsdirmapper)
- [node.RunWatchThenCompileJSOnSafeExit](#runwatchthencompilejsonsafeexit)
- [neutral.AwaitSignal](#awaitsignal)
- [neutral.Console](#console)
- [neutral.DataLog](#datalog)
- [neutral.Derived](#derived)
- [neutral.Effect](#effect)
- [neutral.EnvSignal](#envsignal)
- [node.EsWatcher](#eswatcher)
- [neutral.EventSignal](#eventsignal)
- [node.FileSafe](#filesafe)
- [neutral.ForEach](#foreach)
- [neutral.ForSignal](#forsignal)
- [node.FSDirArchWatcher](#fsdirarchwatcher)
- [neutral.GetterSetter](#gettersetter)
- [node.JSONFileHandler](#jsonfilehandler)
- [neutral.ListSignal](#listsignal)
- [neutral.LitExp](#litexp)
- [neutral.ObjectSignal](#objectsignal)
- [neutral.Paths](#paths)
- [node.Prettivy](#prettivy)
- [neutral.QChannel](#qchannel)
- [node.SafeExit](#safeexit)
- [node.Setup](#setup)
- [neutral.Signal](#signal)
- [neutral.SignalCollection](#signalcollection)
- [neutral.WalkThrough](#walkthrough)
- [neutral.WorkerMainThread](#workermainthread)
- [neutral.WorkerResult](#workerresult)
- [neutral.WorkerThread](#workerthread)
- [neutral.Base64URL](#base64url)
- [node.Base64URLFromFile](#base64urlfromfile)
- [neutral.BundledV](#bundledv)
- [neutral.CreateStringID](#createstringid)
- [neutral.EnvMode](#envmode)
- [neutral.EventNameSpace](#eventnamespace)
- [neutral.FactoryKey](#factorykey)
- [neutral.Preferrence](#preferrence)
- [neutral.Trace](#trace)
- [neutral.TracePath](#tracepath)
- [neutral.VivthUnBundledCodeBlock](#vivthunbundledcodeblock)
- [node.JSautoDOC](#jsautodoc)
- [node.ClearRequireCache](#clearrequirecache)
- [neutral.CreateImmutable](#createimmutable)
- [neutral.EventCheck](#eventcheck)
- [neutral.EventObject](#eventobject)
- [neutral.ForInAsync](#forinasync)
- [neutral.ForInSync](#forinsync)
- [neutral.ForOfAsync](#forofasync)
- [neutral.ForOfSync](#forofsync)
- [node.GetBufferFromRelativePath](#getbufferfromrelativepath)
- [node.GetFilesFromDir](#getfilesfromdir)
- [node.GetMaxFilenameLength](#getmaxfilenamelength)
- [node.GetModuleEsbuildPlatform](#getmoduleesbuildplatform)
- [neutral.GetNamedImportAlias](#getnamedimportalias)
- [neutral.GetRuntime](#getruntime)
- [node.InstantiateAssemblyScript](#instantiateassemblyscript)
- [neutral.IsAsync](#isasync)
- [neutral.IsInstanceOf](#isinstanceof)
- [neutral.IsSameFile](#issamefile)
- [neutral.IsStringLooksLikeAPath](#isstringlookslikeapath)
- [neutral.IsTypeOf](#istypeof)
- [neutral.LazyFactory](#lazyfactory)
- [neutral.MonkeyPatch](#monkeypatch)
- [neutral.NewAnimationTimeline](#newanimationtimeline)
- [neutral.NewChainable](#newchainable)
- [neutral.NewObjectWrapper](#newobjectwrapper)
- [neutral.ObjectRegistrar](#objectregistrar)
- [node.ParseSQLFile](#parsesqlfile)
- [neutral.PipeAsync](#pipeasync)
- [neutral.PipeSync](#pipesync)
- [node.SafeImport](#safeimport)
- [neutral.TemplateLiteral](#templateliteral)
- [neutral.Timeout](#timeout)
- [neutral.Tries](#tries)
- [neutral.TryAsync](#tryasync)
- [neutral.TryNew](#trynew)
- [neutral.TrySync](#trysync)
- [node.TsToMjs](#tstomjs)
- [node.UniqueFSTempName](#uniquefstempname)
- [node.VivthyNeinth](#vivthyneinth)
- [neutral.AnyButUndefined](#anybutundefined)
- [neutral.ArrayToKeys](#arraytokeys)
- [neutral.AssemblyScriptExportsType](#assemblyscriptexportstype)
- [neutral.AssemblyScriptLoaderInstantiate](#assemblyscriptloaderinstantiate)
- [neutral.AutoDocASOptions](#autodocasoptions)
- [neutral.ChainableType](#chainabletype)
- [neutral.ComponentDecorator_Constructor](#componentdecorator_constructor)
- [neutral.ConsoleAdditionalSettingType](#consoleadditionalsettingtype)
- [neutral.Decorator](#decorator)
- [neutral.DecoratorMonkeyPatch](#decoratormonkeypatch)
- [neutral.DevTestCB](#devtestcb)
- [neutral.EnvModeType](#envmodetype)
- [neutral.ExtnameType](#extnametype)
- [neutral.ListArg](#listarg)
- [neutral.LitExpKeyType](#litexpkeytype)
- [neutral.LitExpResultType](#litexpresulttype)
- [neutral.MonkeyPatchedType](#monkeypatchedtype)
- [neutral.MutationType](#mutationtype)
- [neutral.ParametersFollowingN](#parametersfollowingn)
- [neutral.PrefixedKeysOf](#prefixedkeysof)
- [neutral.QCBFIFOReturn](#qcbfiforeturn)
- [neutral.QCBReturn](#qcbreturn)
- [neutral.Runtime](#runtime)
- [neutral.SafeImportReturnType](#safeimportreturntype)
- [neutral.StylePropRefType](#stylepropreftype)
- [neutral.TemplateLiteralValueHandler](#templateliteralvaluehandler)
- [neutral.VivthCleanup](#vivthcleanup)
- [neutral.VLifecycleCallbacks](#vlifecyclecallbacks)
- [neutral.WC_createElement_bind](#wc_createelement_bind)
- [neutral.WC_createNamedSlot](#wc_createnamedslot)
- [neutral.WC_litRender_bind](#wc_litrender_bind)
- [neutral.WC_litStyleMap](#wc_litstylemap)
- [neutral.WC_StyleProp_bind](#wc_styleprop_bind)
- [node.BrowserDirMapper](#browserdirmapper)
- [neutral.CSS](#css)
- [neutral.E](#e)
- [neutral.NewStyleSheetAsync](#newstylesheetasync)
- [neutral.NewStyleSheetSync](#newstylesheetsync)
- [neutral.WC_TagName_type](#wc_tagname_type)
- [neutral.EnsureValidTag](#ensurevalidtag)
- [neutral.IsInViewPortSignal](#isinviewportsignal)
- [neutral.ObserverSignal](#observersignal)
- [neutral.WC_litRef](#wc_litref)
- [neutral.WC_loopedSiblingsRef](#wc_loopedsiblingsref)
- [browser.WC_extendsA](#wc_extendsa)
- [neutral.WC_extendsB](#wc_extendsb)

---

<h2 id="browserexternals">node.BrowserExternals</h2>

#### reference: `BrowserExternals`

- esbuild external `Set` for browser platform;
- this Set is automatically applied to [FileSelfMapper](#fileselfmapper) and [EsBundler](#esbundler) if platform is equal to browser;
- while `vivth` already exports environtment specific(`node`, `browser`, `neutral`) via `vivth/node.JSAutoDoc`, there are possibility of other library might bleeded out when trying to:
  > - use esbuild;
  > - earlier version of `vivth`;
  > - importing from `vivth`, which is definitely bleeded out, and you need to import from proper `exports`;
  > - importing from `vivth/all`, which is definitely bleeded out, and you need to import from proper `exports`;

```js
/**
 * @type {Set<string>}
 */
```

- <i>example</i>:

```js
import { BrowserExternals } from "vivth/node";
import { build } from "esbuild";
await build({
  ...esbuildOptions,
  platform: "browser",
  external: Array.from(BrowserExternals),
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="createtransform">node.CreateTransform</h2>

#### reference: `CreateTransform`

- function helper to turn string into `node:stream.Transform` instance;
- usefull for generating return value for `asar.options.transform`;

```js
/**
 * @param {string} content
 * @returns {Transform}
 */
```

- <i>example</i>:

```js
import { CreateTransform } from "vivth/node";
// asar input context:
const transform = (filePath) => {
  filePath = Paths.normalize(filePath);
  const newStringFromBundle = checkBundle.get(filePath);
  if (newStringFromBundle) {
    return CreateTransform(newStringFromBundle);
  }
  const res = optionsTransform?.(filePath);
  if (!res) {
    return;
  }
  return res;
};
//
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="lasteditedunix">node.LastEditedUnix</h2>

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="nodemodulelist">node.NodeModuleList</h2>

#### reference: `NodeModuleList`

- generate Set of `node` built in modules;

```js
/**
 * @returns {Set<string>}
 */
```

- <i>example</i>:

```js
import { build } from "esbuild";
import { NodeModuleList } from "vivth/node";
await build({
  ...buildOptions,
  platform: "browser",
  external: Array.from(NodeModuleList()),
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="pathfsbundles">node.PathFSBundles</h2>

#### reference: `PathFSBundles`

- when used with `EsBundler+ToBundledJSPlugin` the file on the dir that are match the rule are `Bundled` first before being put on the `.asar`;

#### reference: `PathFSBundles.vivthBundles`

```js
/**
 * @param {string} relativePath
 * - to the dirname of the file you are calling this method;
 * @param {{shouldNotIncludes:string}} [options]
 * - `shouldNotIncludes`:
 * >- when this method receive non immediate string(declared on other file),
 * >- `shouldNotIncludes` should be filled with the string like,
 * >- `/${libname}/path/to/file/this/method/is/being/called.extname`;
 * @returns {PathFSBundles}
 */
```

- <i>example</i>:

```js
// D://true/path/mypath.mjs
import { PathFSBundles } from "vivth/node";
PathFSBundles.vivthBundles("../src/entryPoint.mjs", {
  shouldNotIncludes: "D://true/path/mypath.mjs",
});
```

#### reference: `PathFSBundles_instance.path:getter`

- relative path of the target to the project root;

```js
/**
 * @returns {string}
 */
```

#### reference: `PathFSBundles_instance.callerPath:getter`

- depending on whether running on bundled or not;

```js
/**
 * @returns {string}
 * - unBundled: `absolutePath` on disk of the file caller;
 * - bundled: `blankString`;
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="pathfsdir">node.PathFSDir</h2>

#### reference: `PathFSDir`

- includes all files, that match the rule to `.asar` specification;

#### reference: `PathFSDir.vivthDir`

```js
/**
 * @param {string} relativePath
 * - relativePath to the `dirname` of the file you are calling this method;
 * @param {RegExp} rule
 * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
 * @returns {PathFSDir}
 */
```

- <i>example</i>:

```js
import { PathFSDir } from "vivth/node";
PathFSDir.vivthDir("../src/", /[\s\S]*/);
// visible for ide inline check: without ``;
```

#### reference: `PathFSDir_instance.rule:getter`

- rule for dir, to get file any file match the rule inside that directory;

```js
/**
 * @type {RegExp}
 */
```

#### reference: `PathFSDir_instance.path:getter`

- relative path of the target to the project root;

```js
/**
 * @returns {string}
 */
```

#### reference: `PathFSDir_instance.callerPath:getter`

- depending on whether running on bundled or not;
- unBundled: absolute disk path of the file caller;
- bundled: `blankstring`;

```js
/**
 * @returns {string}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="pathfsfile">node.PathFSFile</h2>

#### reference: `PathFSFile`

> - the file are added to `asar` AS IS, OR
> - transformed according to the `asar.options.transform` value;

#### reference: `PathFSFile.vivthFile`

```js
/**
 * @param {string} relativePath
 * - to the dirname of the file you are calling this method;
 * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
 * @returns {PathFSFile}
 */
```

- <i>example</i>:

```js
import { PathFSFile } from "vivth/node";
PathFSFile.vivthFile("../CompileAS.mjs");
```

#### reference: `PathFSFile_instance.path:getter`

- relative path of the target to the project root;

```js
/**
 * @returns {string}
 */
```

#### reference: `PathFSFile_instance.callerPath:getter`

- depending on whether running on bundled or not;
- unBundled: absolute disk path of the file caller;
- bundled: `blankstring`;

```js
/**
 * @returns {string}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="tobundledjsplugin">node.ToBundledJSPlugin</h2>

#### reference: `ToBundledJSPlugin`

- generate `esbuild.Plugin` for changing unbundled time file into runtime file;
- on using esbuild with this plugin, it will:
  > - replace any module that have similiar file name but ended with Bundled(before extname);
  > - works on `.mts`|`.ts`|`.mjs`|`.js`;
  > - `${fileName}.mjs` -> seek for and use `${fileName}.bundled.mjs`, if not found use `${fileName}.mjs`;
  > - removes `BundledV.vivthUnBundledCodeBlock` code block;

```js
/**
 * @param {string} includedInPath
 * - is generalized path, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 */
```

- <i>example</i>:

```js
import { ToBundledJSPlugin } from "vivth/node";
export const myBundledPlugin = ToBundledJSPlugin("/myProjectName/src/");
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="compileas">node.CompileAS</h2>

#### reference: `CompileAS`

- helper to compile `AssemblyScript`;
- file name should endswith `.as.ts`;
  > - basename that starts with `-` are excluded, and to be used as sharable library OR code management/split;
- will generate:
  > - `${fileBaseNameNoExt}_import.mjs`: setting for import input;
  >   > - also the only file that are editable;
  > - `${fileBaseNameNoExt}.d.ts`: asc generated typehint;
  > - `${fileBaseNameNoExt}.js`: asc generated esm binding;
  > - `${fileBaseNameNoExt}.wasm`: asc compiled;
  > - `${fileBaseNameNoExt}_ASUniversal.mjs`: able to be `JSautoDOC`ed, for universal runtime;
  > - `${fileBaseNameNoExt}_ASasar.mjs`: able to be `JSautoDOC`ed, use as `vivth.FSasar` binding;
- generated file are on the same directory as the source, so make sure to isolate the source from other file(in a single different directory), as to not make it messy real fast;
- assuming `js/tsconfig.json` should already set this following value:
  > - `compilerOptions.allowJs`: true;
  > - `compilerOptions.checkJs`: false;
  > - should excludes: `.js`, `.as.ts`, `.wasm`;

```js
/**
 * @param {Parameters<import('assemblyscript/asc')["main"]>} args
 * - as of `vivth@1.5.x`, `arg0` type `string[]` produce more stable results than `CompilerOptions`;
 * @returns {ReturnType<import('assemblyscript/asc')["main"]>}
 */
```

- <i>example</i>:

```js
import { CompileAS } from "vivth/node";
const { error } = await CompileAS(
  [inputABSPath, "--outFile", wasmABSPath, "--bindings", "esm", ...ASArgv],
  ASAPIOptions,
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="compilejs">node.CompileJS</h2>

#### reference: `CompileJS`

- function to compile `.ts`|`.mts`|`.mjs` file, into a single executable;
- also generate js representation of the `bundled` version of the target;
- uses [bun](https://bun.com/docs/bundler/executables) compiler under the hood;
  > - it is used only as packaging/compiler agent, and doesn't necessarily supports their advanced feature, such as, assets bundling(use [`FSasar`](#fsasar) instead);
  > - `WorkerThread` will be converted to inline using `FSasar` too;

---

---

---

- This function does not obfuscate and will not prevent decompilation. Do not embed environment variables or sensitive information inside `options.entryPoint`;
- It is designed for quick binarization, allowing execution on machines without `Bun` installed;
- The resulting binary will contain `FSasar` and `WorkerMainThread` target paths Buffers, which are loaded into memory at runtime. If your logic depends on the file system, use `node:fs` or `node:fs/promises` APIs and ship external files alongside the `binary` and `.asar` file (not compiled);

---

---

---

```js
/**
 * @param {Object} options
 * @param {string} options.entryPoint
 * - need to be manually prefixed;
 * @param {BufferEncoding} [options.encoding]
 * - read and write encoding for the sources;
 * - default: `utf-8`;
 * @param {(entryPointContent:string)=>string} [options.preprocessEntryPoint]
 * - to modify entry point before bundling;
 * - `entryPointContent` is the original string of the entry point;
 * - returned value then passed to `ESBundler`;
 * @param {boolean} [options.minifyFirst]
 * - minify the bundle before compilation;
 * @param {Object} [options.asar]
 * @param {Parameters<typeof import('@electron/asar')["createPackageFromFiles"]>[3]} [options.asar.InputMetadata]
 * @param {Parameters<typeof import('@electron/asar')["createPackageFromFiles"]>[4]} [options.asar.options]
 * @param {string} options.outDir
 * - need manual prefix;
 * @param {Record<string, string[]|string>} [options.bunCompilerArguments]
 * - `key` are to used as `--keyName`;
 * - value are the `value` of the `key`;
 * >- `string`: will be inputed as is;
 * >- `string[]`: will be joined with `,`;
 * - no need to add the output/outdir, as it use the `options.outDir`;
 * @param {ReturnType<CreateESPlugin>[]} [options.esBundlerPlugins]
 * - plugins for `EsBundler`;
 * @param {Parameters<typeof EsBundler>[1]} [options.esbuildOptions]
 * - options for `EsBundler`;
 * @param {string[]} [options.additionalCommandArgument]
 * - argument to be passed process generator;
 * @return {ReturnType<typeof TryAsync<{compileResult: any,
 * commandCalled: string|undefined;
 * compiledBinFile: string|undefined;
 * bundledJSFile: string|undefined
 * }>>}
 */
```

- <i>example</i>:

```js
import process from "node:process";
import { join } from "node:path";
import { CompileJS, SafeExit } from "vivth/node";
import { Console, Paths } from "vivth/neutral";
new Paths({
  root: process.env.INIT_CWD ?? process.cwd(),
});
new SafeExit("SIGINT", "SIGTERM");
const pathRoot = Paths.root;
const [, errorbun] = await CompileJS({
  entryPoint: join(pathRoot, "/dev/myEntryPoint.mjs"),
  minifyFirst: true,
  outDir: join(pathRoot, "/dev-bun/"),
  compiler: "bun",
  compilerArguments: {
    target: "bun-win-x64",
  },
  asar: {},
  encoding: "utf-8",
});
if (errorbun) {
  Console.error({ errorbun });
}
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="createesplugin">neutral.CreateESPlugin</h2>

#### reference: `CreateESPlugin`

- typed esbuild Plugin generator;

```js
/**
 * @param {string} name
 * @param {import('esbuild').Plugin["setup"]} setup
 * @returns {import('esbuild').Plugin}
 */
```

- <i>example</i>:

```js
import { CreateESPlugin } from "vivth/neutral";
export const pluginAddCopyRight = CreateESPlugin(
  "MyCopyrightDeclaration",
  async (build) => {
    // build script;
  },
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="esbundler">node.EsBundler</h2>

#### reference: `EsBundler`

- opinionated bundler for limited extensions using esbuild;
- bundles all imports into a single output string;

```js
/**
 * @param {Object} options
 * @param {string} options.content
 * - the code can also uses composites from the result from multiple readFiles;
 * @param {string} options.root
 * - use dirname of said fileString path;
 * @param {'.mts'|'.ts'|'.mjs'} options.extension
 * - supported extension;
 * @param {boolean} [options.withBinHeader]
 * @param {Omit<Parameters<build>[0],
 * 'entryPoints'|'bundle'|'write'|'sourcemap'|'outdir'|'splitting'|'format'>
 * } [esbuildOptions]
 * - assume `esm`;
 * @returns {ReturnType<typeof TryAsync<string>>}
 */
```

- <i>example</i>:

```js
import { EsBundler } from "vivth/node";
const [bundledString, errorBundling] = EsBundler(
  {
    content: ``,
    extension: ".mts",
    ...options,
  },
  {
    ...esbuildOptions,
  },
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="fileselfmapper">node.FileSelfMapper</h2>

#### reference: `FileSelfMapper`

- each file can define it's own `targetPaths` inline by adding comment then fullpath on the begining of the file:
  > - `mjs`;

```js
// D://my/path/something.mjs
// D://my/path/something-else.mjs

console.log("hello");
```

> - `scss`;

```scss
/* D://my/path/something.css */

$somecolor: black;

body {
  background-color: $somecolor;
}
```

> - `.ignore`;

```.ignore
# D:/my/project/root/.gitignore
# D:/my/project/root/.npmignore

/dev/
```

- files extention:
  > - `js`/`ts` files will be compiled with `vivth/node.EsWathcer`, using `option.esbuild` as argument;
  > - `sass`/`scss` it will be compiled to `css` first;
  > - other than those files, they will be just copied to `targetPaths`;
- for runtime example see file `/dev/auto/` on source code;

```js
/**
 * @implements {VivthCleanup}
 */
```

#### reference: `new FileSelfMapper`

```js
/**
 * @param {string} watchPath
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {Object} options
 * @param {Omit<Parameters<import('esbuild')["context"]>[0], "write"|"minify"|"format"|"mainFields"|"outfile"|"bundle">} [options.esbuild]
 * - `logLimit`: default = `3`;
 * - `outFile`: auto determined by comment line on top level of each files;
 * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
 * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
 * - `mainFields`: `module,main`;
 * - `bundle`: automatically added by `vivth.FileSelfMapper`;
 * - `write`: automatically added by `vivth.FileSelfMapper`;
 * @param {boolean} [options.deleteTempFilesAfterExit]
 * @param {(path:{mapTo:string, src:string}, content:string)=>(string|false)} [options.postProcessDirectCopy]
 * - works for:
 * >- `.js`;
 * >- anything that are not `sass` and `module js/ts`;
 * - return `false` to exclude `target` from mapping;
 */
```

- <i>example</i>:

```js
import { FileSelfMapper } from "vivth/node";
new FileSelfMapper("../ssg-assets/", {
  esbuild: {},
  // deleteTempFilesAfterExit: true,
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="fsanalyzer">node.FSAnalyzer</h2>

#### reference: `FSAnalyzer`

- collections of static method to process content for:
  > - `FSasar`;
- mostly used internally;

#### reference: `FSAnalyzer.finalContent`

- to be used on bundled content;

```js
/**
 * @param {string} entryPoint
 * @param {string} content
 * @param {Object} asarConfig
 * @param {Parameters<createPackageFromFiles>[3]} [asarConfig.InputMetadata]
 * @param {Parameters<createPackageFromFiles>[4]} [asarConfig.options]
 * @param {string} bundledJSFilePath
 * @returns {ReturnType<typeof TryAsync<string>>}
 */
```

- <i>example</i>:

```js
import { readFile } from "node:fs/promises";
import { FSAnalyzer } from "vivth/node";
import { Preferrence } from "vivth/neutral";
const filePath = "README.md";
const [resultFinalContent, errorFinalContent] = await FSAnalyzer.finalContent(
  filePath,
  await readFile(filePath, { encoding: Preferrence.encoding }),
  "esm",
  {},
  ...args,
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="fsasar">node.FSasar</h2>

#### reference: `FSasar`

- class helper to bundle assets files as `.asar`;
  > - as `type: "buffer"`;
  > - uses `

```js
/**
 * @electron/asar` under the hood;
 * - use only if you are planning to use [CompileJS](#compilejs);
 * >- the class static methods don't obfuscate target file;
 * >- don't embed any sensitive content using this methods of `CompileJS`;
 * >- it's better to place it on `.env`;
 */
```

#### reference: `FSasar.file`

```js
/**
 * @param {PathFSFile} pathFSFPathFSFileInstance
 * @returns {Promise<Buffer<ArrayBufferLike>>}
 */
```

- <i>example</i>:

```js
import { FSasar, PathFSFile } from "vivth/node";
const fileBuffer = await FSasar.file(
  PathFSFile.vivthFile("../function/myModule.mjs"),
);
```

#### reference: `FSasar.dir`

- helper function for asar dir;

```js
/**
 * @param {PathFSDir} pathFSDirInstance
 * @returns {{
 * forEachFiles:(loopCallback:(pathDetail:{inputRelative:string, asar:string})=>void)=>void,
 * getFile:(relativeFromDir:string)=> ReturnType<typeof FSasar["file"]>
 * }}
 * - forEachFiles are looped async without awaiting any iterations;
 */
```

- <i>example</i>:

```js
import { FSasar, PathFSDir } from "vivth/node";
const { forEachFiles, getFile } = FSasar.dir(
  PathFSDir.vivthDir("../function/", /[\s\S]*[noblank]/),
); // without `[noblank]`;
forEachFiles(async ({ inputRelative, asar }) => {
  // handle `inputRelative` with getFile; OR
  // handle `asar` with FSasar.file
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="jsdirmapper">node.JSDirMapper</h2>

#### reference: `JSDirMapper`

- class helper for one to one Mapping JS files;
- only bundles `.mts` AND `.mjs` in the `path.watch` directory, extension restriction to module as to enforce:
  > - `esm` style input;
  > - to not confuse IDE and esbuild resolver of extensionless static import;

```js
/**
 * @template {BuildOptions} OPT
 * @implements {VivthCleanup}
 */
```

#### reference: `new JSDirMapper`

```js
/**
 * @param {Object} path
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * - handles:
 * >- `.mts`,`.mjs`: bundled;
 * >- `.css`: minified;
 * >-`.scss`, `sass`: two step bundling;
 * >>- bundle to `.s.css` at source path;
 * >>- write to `.s.css` on target path;
 * >- `.as.ts` and it's companion `js` will be dealt accordingly based on `options.asTsToMjsHandler`;
 * >>- `.ts` and `.js` that are not `.wasm` related are ignored;
 * >- everything else will be copied as is;
 * @param {string} path.watch
 * - watch this path for changes;
 * @param {string} path.mapTo
 * - bundles to this path
 * @param {(
 * 		arg0:
 * 			{
 * 				source:string;
 * 				target:string;
 * 				eventName:EventName;
 * 			}
 * 	)=>Promise<{
 * 		shouldProcessDefault:
 * 			boolean|{selfCleanup:()=>Promise<void>};
 * 	}>
 * } [path.filter]
 * - handler trap before sending it to
 * @param {Object} options
 * @param {Object} options.esbuild
 * @param {Omit<ConstructorParameters<typeof EsWatcher<OPT>>[0],
 * 	"entryPoints"|
 * 	"outFile"|
 * 	"write"|
 * 	"format"|
 * 	"bundle"|
 * 	"logLevel"|
 * 	"mainFields"
 * >} options.esbuild.buildOptions
 * - `logLimit`: default = `3`;
 * - `entryPoints`: auto filled with `path.watch` + filepath;
 * - `outFile`: auto filled with `path.mapTo` + filepath(suffixed with `.mjs`);
 * - `write`: auto filled by `vivth.JSDirMapper`;
 * - `mainFields`: auto filled by `vivth.JSDirMapper`, ['module', 'main'];
 * - `format`: auto filled by `vivth.JSDirMapper`, always `esm`;
 * - `bundle`: auto filled by `vivth.JSDirMapper`, always `true`;
 * - `logLevel`: auto filled by `vivth.JSDirMapper`;
 * @param {ConstructorParameters<typeof EsWatcher<OPT>>[1]} [options.esbuild.watchOption]
 * @param {Parameters<typeof TsToMjs>[1]} [options.asTsToMjsHandler]
 * - argument[1] used for `.as.ts` extention(assemblyscript to `.wasm` + `.mjs` loader):
 * >- handled via `vivth.TsToMjs`;
 * >- preferably to be isolated on a single folder;
 * - when falsy -> ignore `.as.ts`;
 */
```

- <i>example</i>:

```js
import process from "node:process";
import { SafeExit, Paths, JSDirMapper } from "vivth/node";
new Paths({
  root: process.env.INIT_CWD ?? process.cwd(),
});
new SafeExit("SIGINT", "SIGTERM");
new JSDirMapper(
  {
    mapTo: "/test/jsdirmapped/",
    watch: "/test/jsdirmapper/",
  },
  {
    esbuild: { buildOptions: { platform: "browser" } },
    asTsToMjsHandler: { assemblyScriptOptions: {} },
  },
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="runwatchthencompilejsonsafeexit">node.RunWatchThenCompileJSOnSafeExit</h2>

#### reference: `RunWatchThenCompileJSOnSafeExit`

- function to:
  > - spawn watcher on `source`;
  > - run the `source`;
  > - compile `source` to target on `SafeExit`;
- this function assume `Paths` and `SafeExit` to be instantiated;

```js
/**
 * @param {Object} options
 * @param {boolean} options.showLog
 * @param {string} options.source
 * - filepath for source;
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {string} options.target
 * - dirpath for compile target;
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {string[]} [options.additionalSpawnArgument]
 * @param {Omit<
 * 	Parameters<typeof import('./CompileJS.mjs').CompileJS>[0],
 * 	"entryPoint"|
 * 	"outDir"
 * >} [options.compileJSargs]
 * @returns {ReturnType<typeof TryAsync<import('../typehints/VivthCleanup.mjs').VivthCleanup>>}
 */
```

- <i>example</i>:

```js
import { RunWatchThenCompileJSOnSafeExit } from "vivth/node";
// assume `Paths` and `SafeExit` to be instantiated;
await RunWatchThenCompileJSOnSafeExit({
  showLog: false,
  source: "/test/watchrun/hi.mjs",
  target: "/test/watchrun/compile-bun/",
  compileJSargs: {
    minifyFirst: false,
    esbuildOptions: {},
    compilerArguments: {
      target: "bun-win-x64",
    },
    asar: {},
    encoding: "utf-8",
  },
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="awaitsignal">neutral.AwaitSignal</h2>

#### reference: `AwaitSignal`

- `Signal` to unwrap `Promise`;
- useful to create underlying mechanism for something like react `Suspense` component;
- auto queued for last unwrap request;

```js
/**
 * @template {any} VALUE
 * @template {any[]} ARGS
 * @extends {Signal<VALUE|Promise<VALUE>|Error>}
 * @implements {VivthCleanup}
 */
```

- <i>example</i>:

```js
import { AwaitSignal, Effect } from "vivth/neutral";
const bigAwaitSignal = new AwaitSignal(fetch("../SomethingReallyBig"));
new Effect(async ({ subscribe }) => {
  const myBigLoadProgress = subscribe(bigAwaitSignal).value;
  const isError = IsInstanceOf(myBigLoadProgress, Error);
  if (isError) {
    // handle error here
    return;
  }
  const isAPromise = IsInstanceOf(myBigLoadProgress, Promise);
  if (isAPromise) {
    // handle suspense here;
    return;
  }
  // handle ready state here;
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="console">neutral.Console</h2>

#### reference: `Console`

- class with static methods to print to standard console with bare minimum ANSI styles;

#### reference: `Console.log`

```js
/**
 * @param {any} data
 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Console } from "vivth/neutral";
Console.log({
  hello: "world!!",
});
```

#### reference: `Console.info`

```js
/**
 * @param {any} data
 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Console } from "vivth/neutral";
Console.info({
  hello: "world!!",
});
```

#### reference: `Console.warn`

```js
/**
 * @param {any} data
 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Console } from "vivth/neutral";
Console.warn({
  hello: "world!!",
});
```

#### reference: `Console.error`

```js
/**
 * @param {any} data
 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Console } from "vivth/neutral";
Console.error({
  hello: "world!!",
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="datalog">neutral.DataLog</h2>

#### reference: `DataLog`

- class helper for signal performant logging, more or less just for type hinting;
- internally used as Signal value logging instance;

```js
/**
 * @template {any} VALUE
 */
```

#### reference: `new DataLog`

```js
/**
 * @param {VALUE} value
 */
```

#### reference: `DataLog_instance.value`

- data value;

```js
/**
 * @type {VALUE}
 */
```

#### reference: `DataLog_instance.timeStamp`

- occurence unix timestamp;

```js
/**
 * @type {number}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="derived">neutral.Derived</h2>

#### reference: `Derived`

- a class for creating derived version of [Signal](#signal);

```js
/**
 * @template VALUE
 * @extends Signal<VALUE|undefined>
 */
```

#### reference: `new Derived`

- Derived used [Signal](#signal) and [Effect](#effect) under the hood;

```js
/**
 * @param {(
 * 		effectInstanceOptions: Parameters<ConstructorParameters<typeof Effect>[0]>[0] &
 * 		{
 * 			dontUpdate:Derived<VALUE>["dontUpdate"]
 * 		}
 * 	) => Promise<Derived<VALUE>["dontUpdate"] | VALUE>
 * } derivedFunction
 * @param {ConstructorParameters<typeof Effect>[1]} [maxTimelapseBeingDebounced]
 * - prevent rapid changes from being unhandled more than the value;
 * - in miliseconds;
 * - default: `2_000`;
 */
```

- <i>example</i>:

```js
import { Signal, Derived } from "vivth/neutral";
const count = new Signal(0);
const double = new Derived(
  async ({
    subscribe,
    // : registrar callback for this derived instance, immediately return the signal instance
  }) => {
    return subscribe(count).value * 2;
    // double listen to count changes, by returning the value, double.value also changes
    // notice the count.value are accessed double, but it's all safe,
    // since the wrapped one is the only one that are recorded as notifier.
  },
);
count.value++;
```

#### reference: `Derived_instance.dontUpdate`

- return this value to not to update the value of this instance, even when returning early;

```js
/**
 * @type {Symbol}
 */
```

- <i>example</i>:

```js
import { Signal, Derived } from "vivth/neutral";
const count = new Signal(0);
const double = new Derived(async ({ subscribe, isLastCalled }) => {
  if (!(await isLastCalled(100))) {
    return this.dontUpdate;
  }
  const currentValue = subscribe(count).value;
  const res = await fetch(`some/path/${curentValue.toString()}`);
  if (!(await isLastCalled()) || !res) {
    // returning early prevent race condition, even if the earlier fetch return late;
    return this.dontUpdate;
    // returning this.dontUpdate, will not modify the derived instance value;
  }
  count.value++;
  return res;
});
```

#### reference: `Derived_instance.value:getter`

- the most recent value of the instance;
- can be turn into reactive with Effect or Derived instantiation;
- value are allowed to be `undefined` and always be `undefined` at the instantiation time;
  > - make sure to put a check before consuming(inside an `Effect`);

```js
/**
 * @returns {VALUE|undefined}
 * @override
 */
```

- <i>example</i>:

```js
import { Signal, Derived, Effect } from "vivth/neutral";
const numberSignal = new Signal(0);
const doubleDerived = new Derived(async ({ subscribe }) => {
  return subscribe(numberSignal).value * 2;
});
new Effect(async ({ subscribe }) => {
  console.log(subscribe(doubleDerived).value);
});
numberSignal++;
```

#### reference: `Derived_instance.value:setter`

- Derived instance value cannot be manually assigned;
- it's value should always be determined by it's own returned value from `derivedFunction`;

```js
/**
 * @private
 * @type {(value:VALUE|undefined)=>void}
 * @override
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="effect">neutral.Effect</h2>

#### reference: `Effect`

- a class for creating effect;
- behaviour:
  > - doesn't autosubscribe at first run;
  > - it is using passed <b>subscribe</b> named `arg0` options as subscriber;
  > - doesn't block other queues during first run;
  > - can dynamically subscribes to signal, even on conditionals, that are not run during first run;

```js
/**
 * @implements {VivthCleanup}
 */
```

#### reference: `new Effect`

```js
/**
 * @param {(
 * 		arg0: Effect["options"]
 * 	) => Promise<void>
 * } effect
 * @param {number} [maxTimelapseBeingDebounced]
 * - prevent rapid changes from being unhandled more than the value;
 * - in miliseconds;
 * - default: `2_000`;
 */
```

- <i>example</i>:

```js
import { Signal, Derived, Effect, Console } from "vivth/neutral";
const count = new Signal(0);
// double listen to count changes
const double = new Derived(async ({ subscribe }) => subscribe(count).value * 2);
new Effect(
  async ({
    subscribe, // : registrar callback for this effect instance, immediately return the signal instance
    removeEffect, // : disable this effect instance from reacting to dependency changes;
    isLastCalled, // : check whether this callback run is this instance last called effect;
  }) => {
    const { value: currentValue, prev: prevValue } = subscribe(double); // effect listen to double changes
    Console.log({ currentValue, prevValue });
  },
);
count.value++;
```

#### reference: `Effect_instance.options`

- collections of methods to handle effect calls of this instance;

#### reference: `Effect_instance.options.subscribe`

- subscribe to `Signal_instance`;
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @template {Signal<any>} SIGV
 * @param {SIGV} signalInstance
 * @returns {SIGV}
 */
```

- <i>example</i>:

```js
import { Signal, Effect } from "vivth/neutral";
const signal1 = new Signal(0);
const signal2 = new Signal(true);
const signal3 = new Signal(true);
const effect = new Effect(async ({ subscribe }) => {
  const signal1Value = subscribe(signal1).value;
  if (signal1Value % 2) {
    // only subscribe to signal3, on conditional block
    const signal3Value = subscribe(signal3).value;
  }
});
effect.options.subscribe(signal2);
```

#### reference: `Effect_instance.options.subscribes`

- the same with `.options.subscribe`, but for batches subscription;
- ideal for first run which to add signal to subscription on main condition;
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @template {ReadonlyArray<any>} T
 * @param {T} signalInstances
 * @returns {T}
 */
```

- <i>example</i>:

```js
import { Signal, Effect } from "vivth/neutral";
const signal1 = new Signal(0);
const signal2 = new Signal(true);
const effect = new Effect(async ({ subscribes }) => {
  const [{ value: signal1Value }, { value: signal2Value }] = subscribes([
    signal1,
    signal2,
  ]);
});
```

#### reference: `Effect_instance.options.removeEffect`

- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @type {()=>void}
 */
```

- <i>example</i>:

```js
import { Effect } from "vivth/neutral";
const effect = new Effect(async ({ removeEffect }) => {
  if (someCondition) {
    removeEffect();
    return;
  }
});
// OR
effect.options.removeEffect();
```

#### reference: `Effect_instance.removeSignal`

- remove inputed signal from this `Effect_instance`;
- if effect signal has no other `Signal_instance` to listen to, it will then completely rendered non reactive;
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @param {Signal<any>} signalInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Effect, Signal } from "vivth/neutral";
const count = new Signal(0);
const effect = new Effect(async ({ subscribe }) => {
  console.log(subscribe(count).value); // will subscribe  count changes;
});
count.value++; // will increase the count and trigger effect;
effect.options.removeSignal(count);
count.value++; // will increase the count but will no longer trigger effect;
```

#### reference: `Effect_instance.removeCollection`

- remove inputed `SignalCollection` from this `Effect_instance`;
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @param {import('./SignalCollection.mjs').SignalCollection<Record<string, Signal<any>>>} collectionInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Signal, Derived, Effect, SignalCollection } from "vivth/neutral";
const a = new Signal("a");
const b = new Signal("b");
const c = new Derived(async ({ subscribe }) => {
  return `${subscribe(b).value}_b`;
});
const f = new SignalCollection({ a, c });
const e = new Effect(async ({ subscribe, isLastCalled, removeCollection }) => {
  const {
    a: { value: aa }, // safely desctructured and auto subscribed
    c: { value: cc }, // safely desctructured and auto subscribed
  } = f.signals(subscribe);
  if (!(await isLastCalled(100))) {
    return; // impertaive debounce
  }
  // removeCollection(f); // standard call from outside callback;
});
// optional call from outside callback;
e.options.removeCollection(f);
```

#### reference: `Effect_instance.options.isLastCalled:getter`

```js
/**
 * @returns {(timeoutMS?:number)=>Promise<boolean>}
 * - timeoutMS only necessary if the operation doesn't naturally await;
 * - if it's operation such as `fetch`, you can just leave it blank;
 */
```

- <i>example</i>:

```js
import { Effect } from "vivth/neutral";
const effect = new Effect(async ({ isLastCalled }) => {
  if (!(await isLastCalled(100))) {
    return;
  }
  // OR
  const res = await fetch("some/path");
  if (
    !(await isLastCalled())
    // no need to add timeoutMS argument, as fetch are naturally add delay;
  ) {
    return;
  }
});
```

#### reference: `Effect_instance.run`

- normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;

```js
/**
 * @type {()=>void}
 */
```

- <i>example</i>:

```js
import { Effect } from "vivth/neutral";
const effect = new Effect(async () => {
  // code
});
effect.run();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="envsignal">neutral.EnvSignal</h2>

#### reference: `EnvSignal`

- uses [Signal](#signal) and [Derived](#derived) under the hood;

```js
/**
 * @template VALUE
 */
```

#### reference: `new EnvSignal`

- create `EnvSignal` instance;

```js
/**
 * @param {VALUE} initialValue
 */
```

- <i>example</i>:

```js
import { EnvSignal } from "vivth/neutral";
export const myEnv = new EnvSignal(true);
```

#### reference: `EnvSignal_instance.env`

- exposed property to listen to;

```js
/**
 * @type {Derived<VALUE>}
 */
```

- <i>example</i>:

```js
import { EnvSignal, Effect } from "vivth/neutral";
export const myEnv = new EnvSignal(true);
new Effect(async ({ subscribe }) => {
  const myEnvValue = subscribe(myEnv.env).value;
  // code
});
```

#### reference: `EnvSignal_instance.correction`

- call to correct the value of previously declared value;
- can only be called once;

```js
/**
 * @param {VALUE} correctedValue
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EnvSignal } from "vivth/neutral";
export const myEnv = new EnvSignal(true);
// somewhere else on the program
import { myEnv } from "./myEnv.mjs";
myEnv.correction(false); // this will notify all subscribers;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="eswatcher">node.EsWatcher</h2>

#### reference: `EsWatcher`

- wrapper for `watcher` via `esbuild.context`;
- watcher cleanup is automatically registered to `SafeExit`;

```js
/**
 * @template {import('esbuild').BuildOptions} O
 * @implements {VivthCleanup}
 */
```

#### reference: `new EsWatcher`

```js
/**
 * @param {Partial<O>} buildOptions
 * @param {import('esbuild').WatchOptions} [watchOptions]
 */
```

- <i>example</i>:

```js
import { EsWatcher } from "vivth/node";
const { context, remove } = new EsWatcher({
  ...esbuildOptions,
});
```

#### reference: `EsWatcher_instance.ctx`

- Promise of `BuildContext`;

```js
/**
 * @type {Promise<import('esbuild').BuildContext<O>>}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="eventsignal">neutral.EventSignal</h2>

#### reference: `EventSignal`

- Signal implementation for `CustomEvent`, to dispatch and listen;
- it's based on string as key, so it can be listened/dispatched even without direct instance reference;

```js
/**
 * @template {any} TYPE
 * @implements {VivthCleanup}
 */
```

#### reference: `EventSignal.get`

- the constructor it self is set to `private`;
- it's globally queued:
  > - the `Promise` nature is to prevent race condition on creating the instance;

```js
/**
 * @param {string} stringName
 * @returns {Promise<EventSignal<any>>}
 */
```

- <i>example</i>:

```js
import { EventSignal, Trace } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent");
// recommendation
const myEventSignalGenerator = async (name) => {
  return await EventSignal.get(`myEventSignalGenerator:${name}`);
};
```

#### reference: `EventSignal_instance.dispatcher`

- is [Signal](#signal) instance;
- if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
- is `lazily` created;

```js
/**
 * @type {Signal<TYPE>}
 */
```

- <i>example</i>:

```js
import { EventSignal, Effect, Console } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent", false);
new Effect(({ subscribe }) => {
  const listenValue = subscribe(myEventSignal.dispatch).value;
  // dispatch can be used as two way communication;
  Console.log({ listenValue });
});
myEventSignal.dispatch.value = "hey";
```

#### reference: `EventSignal_instance.listener`

- is [Derived](#derived);
- can be used as listener when passed down value shouldn't be modified manually;
- is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;

```js
/**
 * @type {Derived<TYPE>}
 */
```

- <i>example</i>:

```js
import { EventSignal, Effect, Console } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent", false);
new Effect(({ subscribe }) => {
  const listenValue = subscribe(myEventSignal.listen).value;
  // listen can be used only as listener for one way communication;
  Console.log({ listenValue });
});
myEventSignal.dispatch.value = "hey";
```

#### reference: `EventSignal.remove`

- methods of this static property is lazily created;
- remove signal and effect subscription of the named `EventSignal_instance`;

#### reference: `EventSignal.remove.subscriber`

- remove subscriber from the named `EventSignal_instance`;

```js
/**
 * @param {string} name
 * @param {import('./Effect.mjs').Effect} effectInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EventSignal } from "vivth/neutral";
EventSignal.remove.subscriber("yourEventSignalName", myEffectInstance);
```

#### reference: `EventSignal.remove.allSubscribers`

- remove all subscribers from the named `EventSignal_instance`;

```js
/**
 * @param {string} name
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EventSignal } from "vivth/neutral";
EventSignal.remove.allSubscribers("yourEventSignalName");
```

#### reference: `EventSignal.remove.refs`

- remove reference of the `proxySignals` of the named `EventSignal_instance`;

```js
/**
 * @param {string} name
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EventSignal } from "vivth/neutral";
EventSignal.remove.refs("yourEventSignalName");
```

#### reference: `EventSignal_instance.remove.subscriber`

- remove subscriber from the `EventSignal_instance`;

```js
/**
 * @param {import('./Effect.mjs').Effect} effectInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EventSignal, Effect, Console } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myEventSignal.dispatch).value;
  Console.log({ listenValue });
});
myEventSignal.dispatch.value = "hey";
eventSignal_instance.remove.subscriber(myEffectInstance);
```

#### reference: `EventSignal_instance.remove.allSubscribers`

- remove allSubscribers from the `EventSignal_instance`;

```js
/**
 * @type  {()=>void}
 */
```

- <i>example</i>:

```js
import { EventSignal, Effect, Console } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myEventSignal.dispatch).value;
  Console.log({ listenValue });
});
myEventSignal.dispatch.value = "hey";
eventSignal_instance.remove.allSubscribers();
```

#### reference: `EventSignal_instance.remove.ref`

- remove reference of the `proxySignals` of the `EventSignal_instance`;

```js
/**
 * @type {()=>void}
 */
```

- <i>example</i>:

```js
import { EventSignal, Effect, Console } from "vivth/neutral";
const myEventSignal = await EventSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myEventSignal.dispatch).value;
  Console.log({ listenValue });
});
eventSignal_instance.remove.ref();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="filesafe">node.FileSafe</h2>

#### reference: `FileSafe`

- collection of static methods of file access with added safety to mkdir before proceeding;

#### reference: `FileSafe.exist`

- method to safely detects whether filePaths exist;
- uses `'node:fs/promises'.access` under the hood;
- also returning promise of result & error as value;

```js
/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { FileSafe } from "vivth/node";
import { Paths } from "vivth/neutral";
const isExist = await FileSafe.exist(join(Paths.root, "/some/path.mjs"));
```

#### reference: `FileSafe.write`

- method to create file safely by recursively mkdir the dirname of the outFile;
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<writeFile>[0]} outFile
 * @param {Parameters<writeFile>[1]} content
 * @param {Parameters<writeFile>[2]} [options]
 * @param {boolean} [checkFuzySame]
 * - true: check while normalize consecutive whitespace into singel white space;
 * - false(default): check absolute value;
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { FileSafe } from "vivth/node";
import { Paths } from "vivth/neutral";
const [, errorWrite] = await FileSafe.write(
  join(Paths.root, "/some/path.mjs"),
  `console.log("hello-world!!");`,
  { encoding: "utf-8" },
);
```

#### reference: `FileSafe.copy`

- method to copy file/dir safely by recursively mkdir the dirname of the dest;
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<typeof copyFile>[0]} sourceFile
 * @param {Parameters<typeof copyFile>[1]} destinationFile
 * @param {Parameters<typeof copyFile>[2]} [mode]
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { FileSafe } from "vivth/node";
import { Paths } from "vivth/neutral";
const [, errorWrite] = await FileSafe.copy(
  join(Paths.root, "/some/path.mjs"),
  join(Paths.root, "/other/path.copy.mjs"),
  { encoding: "utf-8" },
);
```

#### reference: `FileSafe.rename`

- method to rename file/dir safely by recursively mkdir the dirname of the dest;
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<typeof rename>[0]} oldPath
 * @param {Parameters<typeof rename>[0]} newPath
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { FileSafe } from "vivth/node";
import { Paths } from "vivth/neutral";
const [, errorRename] = await FileSafe.rename(
  join(Paths.root, "some/path"),
  join(Paths.root, "other/path"),
);
```

#### reference: `FileSafe.rm`

- function to remove dir and file;
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<rm>[0]} path
 * @param {Parameters<rm>[1]} [rmOptions]
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

#### reference: `FileSafe.mkdir`

- create directory recursively;
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<mkdir>[0]} outDir
 * - absolute path
 * @returns {ReturnType<typeof TryAsync<string|undefined>>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { FileSafe } from "vivth/node";
import { Paths } from "vivth/neutral";
const [str, errorMkDir] = await FileSafe.mkdir(
  join(Paths.root, "/some/path/example"),
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="foreach">neutral.ForEach</h2>

#### reference: `ForEach`

- is collections of safe `.forEach` wrapper;
  > - via [TrySync](#trysync);

#### reference: `ForEach.array`

- static method helper for `array` to be iterate safely;

```js
/**
 * @template T, R
 * @param {T[]} array
 * @param {(value: T, index: number, array: T[]) => R} handler
 * @returns {Array<ReturnType<typeof TrySync<R>>>}
 */
```

- <i>example</i>:

```js
import { Foreach } from "vivth/neutral";
const arr = ["a", "b"];
ForEach(arr, (string, i, arr_) => {
  // unsafe Code
});
```

#### reference: `ForEach.set`

- static method helper for `set` to be iterate safely;

```js
/**
 * @template T, R
 * @param {Set<T>} set
 * @param {(value: T, value2: T, set: Set<T>) => R} handler
 * @returns {Array<ReturnType<typeof TrySync<R>>>}
 */
```

- <i>example</i>:

```js
import { Foreach } from "vivth/neutral";
const set = new Set();
ForEach(set, (value, value2, set_) => {
  // unsafe Code
});
```

#### reference: `ForEach.map`

- static method helper for `map` to be iterate safely;

```js
/**
 * @template K, V, R
 * @param {Map<K,V>} map
 * @param {(value: V, key: K, map: Map<K,V>) => R} handler
 * @returns {Array<ReturnType<typeof TrySync<R>>>}
 */
```

- <i>example</i>:

```js
import { Foreach } from "vivth/neutral";
const map = new Map();
ForEach(map, (value, key, map_) => {
  // unsafe Code
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="forsignal">neutral.ForSignal</h2>

#### reference: `ForSignal`

- this class extends `Signal`;
- `ForSignal_instance.runCleanUp` still needs to be manually called, when cleaning up this instance;

```js
/**
 * @template {any} TYPE
 * @implements {VivthCleanup}
 * @extends {Signal<Array<TYPE|undefined>>}
 */
```

#### reference: `new ForSignal`

```js
/**
 * @param {(
 *	this: ForSignal<TYPE>,
 *	arg:{
 *		index:number,
 *		value:{ value:TYPE, isValueDefined:true, }|
 *			{ value:undefined, isValueDefined:false, },
 *		prev:{ prev:TYPE, isPrevDefined:true, }|
 * 			{ prev:undefined, isPrevDefined:false, },
 * 	})=>void
 * } loopCallback
 * - the diffence of `current` and `prev` or `isValueDefined` and `isPrevDefined` can be used for sideEffect, such as;
 * >- `adding/removing/modifiying` `childNode`s on a parent element;
 * >- `adding/removing/modifiying` `Signal` instances;
 * @param {()=>void} [additionalCleanUp]
 * - additional callback to be run when runCleanUp is called;
 */
```

- <i>example</i>:

```js
import { ForSignal } from "vivth/neutral";
const myLoop = new ForSignal(
  function ({
    index,
    value: { value, isValueDefined },
    prev: { prev, isPrevDefined },
  }) {
    // code
  },
  () => {
    // additional cleanup code
  },
);
// myLoop.runCleanUp(); // need to be called manually when the instance are to out of scope;
```

#### reference: `ForSignal_instance.vivthCleanup`

- need to be manually called when disposing/cleaning up this instance;

```js
/**
 * @type {()=>Promise<void>}
 * @override
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="fsdirarchwatcher">node.FSDirArchWatcher</h2>

#### reference: `FSDirArchWatcher`

- class helper for chokidar abstraction to watch and iterate paths;
- this class assume `Paths` and `SafeExit` to be instantiated;

```js
/**
 * @template {any} PASSEDVALUE
 * @implements {VivthCleanup}
 */
```

#### reference: `FSDirArchWatcher_instance.eachHandler`

- callback to handle each path;

```js
/**
 * @type {(
 *  eventName: import('chokidar/handler.js').EventName,
 *  path: import('chokidar/handler.js').Path,
 *  stats?: import('node:fs').Stats,
 *  ) => Promise<PASSEDVALUE>
 * }
 */
```

#### reference: `FSDirArchWatcher_instance.fullHandler`

- callback to handle all registered path;
- debounced to only handle last changes on full registry with:
  > - `options.debounce`;
  > - `QChannel` `isLastOnQ`;

```js
/**
 * @type {(
 * 		alphabeticallySortedSharedValue: {
 * 			map: Map<string, PASSEDVALUE>,
 * 			array: Array<[path: string, PASSEDVALUE]>,
 * 		}
 * 	) => Promise<void>
 * }
 */
```

#### reference: `new FSDirArchWatcher`

```js
/**
 * @param {string[]} watchPaths
 * @param {Object} options
 * @param {FSDirArchWatcher<PASSEDVALUE>["eachHandler"]} options.each
 * - throw to `ignore` OR `delete` path from the result passed to `.full`;
 * @param {FSDirArchWatcher<PASSEDVALUE>["fullHandler"]} options.full
 * @param {number} [options.debounce]
 * - debounce on calling `fullHandler`;
 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
 * - `ChokidarOptions`;
 */
```

- <i>example</i>:

```js
import { FSDirArchWatcher, IsSameFile } from "vivth/node";
const settingFile = "/fsrouter.setting.mjs";
new FSDirArchWatcher(["/routers/", "/fsrouter.setting.mjs"], {
  // debounce: 100,
  each: async (eventName, path, stats) => {
    // this callback is queued already;
    // path are already `Paths.normalized`;
    if (IsSameFile(path, settingFile)) {
      // code;
    }
    switch (eventName) {
      case "add":
      case "change":
        // structure route here and return;
        // a throwed call, will delete from sharedMap;
        return {};
      default:
        // only for imperative handler when needed;
        // or you can just throw here;
        return {};
    }
    // only non throwed call of path is registered to sharedMap;
    // throwed call of path is unregistered from sharedMap;
  },
  full: async (sharedMap) => {
    // this callback is queued already;
    // loop through returned from loop then write to a file;
  },
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="gettersetter">neutral.GetterSetter</h2>

#### reference: `GetterSetter`

- create getter setter in one place;

```js
/**
 * @template {any} RET
 * @template {((...any:any[])=>RET)} TG
 * @template {((...any:any[])=>void)} TS
 */
```

- <i>example</i>:

```js
import { GetterSetter } from "vivth/neutral";
const localA = new GetterSetter({
  get: () => {
    return localStorage.getItem("myAValue");
  },
  set: (newValue) => {
    return localStorage.setItem("myAValue", newValue);
  },
});
localA.get(); // null;
localA.set("my new value");
localA.get(); // 'my new value'
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="jsonfilehandler">node.JSONFileHandler</h2>

#### reference: `JSONFileHandler`

- class helper to handle `.json` file;
- this class assume, `Paths` already instantiated;

#### reference: `JSONFileHandler_instance.read`

```js
/**
 * @returns {ReturnType<typeof TryAsync<Object>>}
 */
```

- <i>example</i>:

```js
import { JSONFileHandler } from "vivth/node";
const packageJSONHandler = new JSONFileHandler("/package.json");
const [content, error] = await packageJSONHandler.read();
```

#### reference: `JSONFileHandler_instance.write`

```js
/**
 * @param {Object} newObj
 * @return { ReturnType<typeof TryAsync<void>> }
 */
```

- <i>example</i>:

```js
 import { this.writeJSONFileHandler } from "vivth/node";
  const packageJSONHandler = new JSONFileHandler('/package.json');
 const [, error] = await packageJSONHandler.write({
  ...object,
 });
```

#### reference: `JSONFileHandler_instance.assign`

```js
/**
 * @param {Object} object
 * @return { ReturnType<typeof TryAsync<void>> }
 */
```

- <i>example</i>:

```js
import { JSONFileHandler } from "vivth/node";
const packageJSONHandler = new JSONFileHandler("/package.json");
const [, error] = await packageJSONHandler.assign({
  ...object,
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="listsignal">neutral.ListSignal</h2>

#### reference: `ListSignal`

- class to create list that satisfy `Array<Record<string, string>>`.

```js
/**
 * @template {import('../typehints/ListArg.mjs').ListArg} LISTARG
 * @extends {Signal<LISTARG[]>}
 */
```

#### reference: `ListSignal.isValid`

- Checks if the input is an array whose first item (if present) is a plain object
- with string keys and string values. Allows empty arrays.

```js
/**
 * @param {unknown} value - The value to validate.
 * @returns {value is Array<Record<string, string>>} True if the first item is a valid string record or array is empty.
 */
```

#### reference: `new ListSignal`

- usefull for `loops`;

```js
/**
 * @param {LISTARG[]} [value]
 * @param {ConstructorParameters<typeof Signal<LISTARG[]>>[1]} [performanceChangesReport]
 * - the argument passed are `structuredClone` of the array;
 */
```

- <i>example</i>:

```js
import { ListSignal } from "vivth/neutral";
const listExample = new ListSignal([{ key1: "test1" }, { key1: "test2" }]);
```

#### reference: `ListSignal_instance.value:getter`

- reference to original inputed `value`;

```js
/**
 * @returns {LISTARG[]}
 * @override
 */
```

#### reference: `ListSignal_instance.value:setter`

- you cannot mannually set`value` `ListSignal_instance`;

```js
/**
 * @private
 * @type {LISTARG[]}
 * @override
 */
```

#### reference: `ListSignal_instance.prev:getter`

- structuredClone of prev

```js
/**
 * @type {LISTARG[]|undefined}
 * @override
 */
```

#### reference: `ListSignal_instance.arrayMethods`

- methods collection that mimics `Array` API;
- calling this methods will notify subscribers for changes, except for some;

#### reference: `ListSignal_instance.arrayMethods.structuredClone:getter`

- reference to `structuredClone` elements of `value`;
- calling doesn't notify for changes;

```js
/**
 * @returns {Array<LISTARG>}
 * - use this getter instead of subscribing the `ListSignal` value;
 * >- as to not accidentally mutate the source value;
 */
```

- <i>example</i>:

```js
import { ListSignal, Derived } from "vivth/neutral";
const myListSignal = new ListSignal([
  { key: "a", group: 0 },
  { key: "b", group: 1 },
  { key: "c", group: 0 },
]);
const myFilteredListSignal = new Derived(async ({ subscribe }) => {
  return subscribe(myListSignal).structuredClone.filter((val) => {
    // return specific val
  });
});
```

#### reference: `ListSignal_instance.arrayMethods.push`

- appends new elements to the end;

```js
/**
 * @param {...LISTARG} listArg
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.shift`

- removes the first element;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.unshift`

- inserts new element at the start;

```js
/**
 * @param  {...LISTARG} listArg
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.slice`

- for both start and end, a negative index can be used to indicate an offset from the end of the data. For example, -2 refers to the second to last element of the data;

```js
/**
 * @param {number} [start]
 * - the beginning index of the specified portion of the data. If start is undefined, then the slice begins at index 0.
 * @param {number} [end]
 * - the end index of the specified portion of the data. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the data.
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.replace`

- replace whole `List` data with new array.

```js
/**
 * @param {LISTARG[]} listArgs
 * - new array in place of the deleted array.
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.splice`

- removes elements from an data and, if necessary, inserts new elements in their place;

```js
/**
 * @param {number} start
 * - The zero-based location in the data from which to start removing elements.
 * @param {number} deleteCount
 * -The number of elements to remove.
 * @param {...LISTARG} listArg
 * - new data in place of the deleted data.
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.swap`

- swap `List` data between two indexes;

```js
/**
 * @param {number} indexA
 * @param {number} indexB
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.modify`

- modify `List` element at specific index;

```js
/**
 * @param {number} index
 * @param {Partial<LISTARG>} listArg
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.remove`

- remove `List` element at specific index;

```js
/**
 * @param {number} index
 * @returns {void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.reverse`

- reverses the elements in an `List` in place.

```js
/**
 * @type {()=>void}
 */
```

#### reference: `ListSignal_instance.arrayMethods.pop`

- removes the last element;

```js
/**
 * @type {()=>void}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="litexp">neutral.LitExp</h2>

#### reference: `LitExp`

- class helper to created opionated regex helper;
- named capture uses `es6+` feature, you might need to add polyfill to target extremely old browser;
- class name refer to `Literal Expression`;
- please be patient when using this class;
  > - destructuring is meant for extensive typehelper;
  > - and destructuring can lead to unhandled error here and there;
  > - therefore error as value is introduced to help to prevent error on runtime;
- made primarily for generating string file, that are purely managed programatically;

```js
/**
 * @template {LitExpKeyType} KEYS
 */
```

#### reference: `LitExp.escape`

- to escape special chars from string literal;
- returned value can be used to create instance of RegExp;

```js
/**
 * @param {string} string
 * @returns {string}
 */
```

- <i>example</i>:

```js
import { LitExp } from "vivt";
const escapedLiteral = LitExp.escape(`something[][;alerk325]`);
new RegExp(escapedLiteral, "g");
```

#### reference: `LitExp.prepare`

- constructor helper;
- under the hood it is an abstraction of `RegExp`, with more template literal touch;
  > - you can apply inline `RegExp` features on the string template literal(as constructor RegExp arg0);
  >   > - by doing so you are opting in to make:
  >   >   > - your regex detection more robust; but
  >   >   > - `litExp_instance.make.string` to be `unusable`;
  >   > - also mind the needs of escape for special characters;

````js
/**
 * @template {LitExpKeyType} KEYS
 * @param {KEYS} keysAndDefaultValuePair
 * - keys and whether to override regex detection;
 * >- example:
 * ```js
 *  myKey: /myCustomCapture/ // all flags will be stripped;
 * ```
 * - default value === `false` is "[\\s\\S]
 *?", as in whiteSpace and nonWhiteSpace 0 to more occurence;
 * @returns {ReturnType<typeof TrySync<(templateStringArray:TemplateStringsArray,
 * ...values:(keyof KEYS)[]
 * )=>LitExp<KEYS>>>}
 * - placement of `key` will determine the named capture group will be placed in the template literal;
 * - it is recomended to not end template literal with any of the `key`s as the regex detection might failed to detects the boundary of the end of matched string of that capture group;
 */
````

- <i>example</i>:

```js
import { LitExp } from "vivth/neutral";
(() => {
  const [liteal, errorPrep] = LitExp.prepare({
    myKey: /myCustomCapture/, // is placed on (?<myKey>myCustomCapture)
    // use false to place "[\\s\\S]*?" instead;
    ...keyCaptureLogicPair,
  });
  if (errorPrep) {
    console.error(error);
    return;
  }
  const litExp_instance = liteal`templateLiteral:${"myKey"};`;
  // recommended to end the template literal with any string but `key`;
})();
```

#### reference: `LitExp_instance.make`

- instance methods for generating things;

#### reference: `LitExp_instance.make.string`

- to make string based on the template literal;

```js
/**
 * @param {Partial<{ [K in keyof KEYS]?: string }>} overrides
 * @returns {string|undefined}
 */
```

- <i>example</i>:

```js
import { LitExp } from "vivth/neutral";
const [literal, errorPreparing] = LitExp.prepare({
  myKey: false,
  ...keyCaptureLogicPair,
});
// asuming no error
litExp_instance = `templateLiteral:${"myKey"};`;
const [result, error] = litExp_instance.make.string({
  myKey: "actualvalue",
});
console.log(result); // "templateLiteral:actualvalue;"
```

#### reference: `LitExp_instance.evaluate`

- methods collections to evaluate string with `Literal Expression`;

#### reference: `LitExp_instance.evaluate.execGroups`

- to exec and grouped based on `key`;

```js
/**
 * @param {string} string
	* @param {Object} options
	* @param {ConstructorParameters<typeof RegExp>[1]} options.flags
	* @param {boolean} options.whiteSpaceSensitive
	* - true: leave any whitespace as is to be used as regex detection;
	* - false: convert all whitespace to `\s+`;
	* @param {boolean} options.absoluteLeadAndFollowing
	* - false: standard capture;
	* - true: add `^` and `<h2 id="litexp">neutral.LitExp</h2>

 to capture definition:
	* >- meaning string will have to match starting and end of line from capture definition;
	* @returns {ReturnType<typeof TrySync<{
	* result:{ whole:string, named: Record<keyof KEYS, string>},
	* regexp:RegExp}>>
	* }
	*/
```

- <i>example</i>:

```js
import { LitExp } from "vivth/neutral";
const [literal, errorPreparing] = LitExp.prepare({
  myKey: false,
  ...keyCaptureLogicPair,
});
// asuming no eror
const litExp_instance = literal`templateLiteral:${"myKey"};`;
const [
  {
    result: {
      // asuming there's no error
      named: { myKey },
      whole,
    },
    regex, // for reference
  },
  error,
] = litExp_instance.evaluate.execGroups(`templateLiteral:Something;`, {
  ...options,
});
console.log(whole); // "templateLiteral:Something;"
console.log(myKey); // "Something"
```

#### reference: `LitExp_instance.evaluate.matchedAllAndGrouped`

- to match all and grouped based on `key`;

```js
/**
 * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0]} string
 * @param {Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], 'absoluteLeadAndFollowing'>} options
 * @returns {ReturnType<typeof TrySync<import('../typehints/LitExpResultType.mjs').LitExpResultType<KEYS>>>
 * }
 */
```

- <i>example</i>:

```js
import { LitExp, Console } from "vivth/neutral";
const [literal, errorPreparing] = LitExp.prepare({
  myKey: false,
  ...keyCaptureLogicPair,
});
// asuming no error;
litExp_instance = literal`templateLiteral:${"myKey"};`;
const [resultOfMatchedAllAndGrouped, error] =
  litExp_instance.evaluate.matchedAllAndGrouped(
    `templateLiteral:Something;
 	templateLiteral:SomethingElse;`,
    { ...options },
  )(() => {
    if (error) {
      Console.error(error);
      return;
    }
    const {
      result: { whole, named },
      regexp,
    } = resultOfMatchedAllAndGrouped;
    named.foreach(({ myKey }) => {
      // code
    });
    whole.foreach((capturedString) => {
      // code
    });
  })();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="objectsignal">neutral.ObjectSignal</h2>

#### reference: `ObjectSignal`

- Signal based on shared/globally available `Object` as key;

```js
/**
 * @template {any} SHAREDOBJECT
 * @implements {VivthCleanup}
 */
```

#### reference: `ObjectSignal_instance.dispatcher`

- is [Signal](#signal);
- if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
- is `lazily` created;

```js
/**
 * @type {Signal<SHAREDOBJECT|undefined>}
 */
```

- <i>example</i>:

```js
import { ObjectSignal, Effect, Console } from "vivth/neutral";
const myObjectSignal = await ObjectSignal.get("dataEvent", false);
new Effect(({ subscribe }) => {
  const listenValue = subscribe(myObjectSignal.dispatch).value;
  // dispatch can be used as two way communication;
  Console.log({ listenValue });
});
myObjectSignal.dispatch.value = "hey";
```

#### reference: `ObjectSignal_instance.listener`

- is [Derived](#derived);
- can be used as listener when passed down value shouldn't be modified manually;
- is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;

```js
/**
 * @type {Derived<SHAREDOBJECT|undefined>}
 */
```

- <i>example</i>:

```js
import { ObjectSignal, Effect, Console } from "vivth/neutral";
const myObjectSignal = await ObjectSignal.get("dataEvent", false);
new Effect(({ subscribe }) => {
  const listenValue = subscribe(myObjectSignal.listen).value;
  // listen can be used only as listener for one way communication;
  Console.log({ listenValue });
});
myObjectSignal.dispatch.value = "hey";
```

#### reference: `ObjectSignal.remove`

- methods of this static property is lazily created;
- remove signal and effect subscription of the named `ObjectSignal_instance`;

#### reference: `ObjectSignal.remove.subscriber`

- remove subscriber from the named `ObjectSignal_instance`;

```js
/**
 * @param {string} name
 * @param {import('./Effect.mjs').Effect} effectInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal } from "vivth/neutral";
ObjectSignal.remove.subscriber("yourObjectSignalName", myEffectInstance);
```

#### reference: `ObjectSignal.remove.allSubscribers`

- remove all subscribers from the named `ObjectSignal_instance`;

```js
/**
 * @param {string} name
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal } from "vivth/neutral";
ObjectSignal.remove.allSubscribers("yourObjectSignalName");
```

#### reference: `ObjectSignal.remove.refs`

- remove reference of the `proxySignals` of the named `ObjectSignal_instance`;

```js
/**
 * @param {string} name
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal } from "vivth/neutral";
ObjectSignal.remove.refs("yourObjectSignalName");
```

#### reference: `ObjectSignal_instance.remove.subscriber`

- remove subscriber from the `ObjectSignal_instance`;

```js
/**
 * @param {import('./Effect.mjs').Effect} effectInstance
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal, Effect, Console } from "vivth/neutral";
const myObjectSignal = await ObjectSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myObjectSignal.dispatch).value;
  Console.log({ listenValue });
});
myObjectSignal.dispatch.value = "hey";
objectSigObjectSignal_instance.remove.subscriber(myEffectInstance);
```

#### reference: `ObjectSignal_instance.remove.allSubscribers`

- remove allSubscribers from the `ObjectSignal_instance`;

```js
/**
 * @type  {()=>void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal, Effect, Console } from "vivth/neutral";
const myObjectSignal = await ObjectSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myObjectSignal.dispatch).value;
  Console.log({ listenValue });
});
myObjectSignal.dispatch.value = "hey";
objectSigObjectSignal_instance.remove.allSubscribers();
```

#### reference: `ObjectSignal_instance.remove.ref`

- remove reference of the `proxySignals` of the `ObjectSignal_instance`;

```js
/**
 * @type {()=>void}
 */
```

- <i>example</i>:

```js
import { ObjectSignal, Effect, Console } from "vivth/neutral";
const myObjectSignal = await ObjectSignal.get("dataEvent", false);
const myEffectInstance = new Effect(({ subscribe }) => {
  const listenValue = subscribe(myObjectSignal.dispatch).value;
  Console.log({ listenValue });
});
objectSigObjectSignal_instance.remove.ref();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="paths">neutral.Paths</h2>

#### reference: `Paths`

- class helpers to define pathReference;
- is a singleton;
- most of functionality need to access `Paths.root`, if you get warning, you can instantiate `Paths` before running anything;

#### reference: `new Paths`

````js
/**
 * @param {Object} options
 * @param {string} options.root
 * - browser:
 * ```js
 * location.origin
 * ```
 * - node/bun compatible:
 * ```js
 * import process from 'node:process';
 * process.env.INIT_CWD ?? process.cwd()
 * ```
 * - other: you need to check your JSRuntime for the rootPath reference;
 */
````

- <i>example</i>:

```js
import { Paths } from "vivth/neutral";
new Paths({
  // root: location.origin,
  // root: process.env.INIT_CWD ?? process.cwd(),
});
```

#### reference: `Paths.root:getter`

- MIGHT THROW AN ERROR;
  > - most `vivth` modules uses this value, so you need to instantiate Paths by all means before using them;
- reference for rootPath
- `Paths` needed to be instantiated via:
  > - `Paths` constructor;
  > - `Setup.paths` constructor;

```js
/**
 * @type {string}
 */
```

#### reference: `Paths.normalize`

- replace path separator to forward slash `/`;
- remove repeating `./`;

```js
/**
 * @param {string} path
 * @returns {string}
 */
```

- <i>example</i>:

```js
import { Paths } from "vivth/neutral";
Paths.normalize("file:\\D:\\myFile.mjs"); //  "file://D://myFile.mjs"
```

#### reference: `Paths.nativeSep`

- replace path separator to `sep`;

```js
/**
 * @param {string} path
 * @returns {string}
 */
```

- <i>example</i>:

```js
import { Paths } from "vivth/neutral";
Paths.nativeSep("path//myFile.mjs"); //  "path\myFile.mjs" OR "path/myFile.mjs" depending on sep value;
```

#### reference: `Paths.normalizeForRoot`

- normalized then starts with forward slash `/`;

```js
/**
 * @param {string} path
 * @returns {`/${string}`}
 */
```

- <i>example</i>:

```js
import { Paths } from "vivth/neutral";
Paths.normalizesForRoot("path\\myFile.mjs"); //  "/path/myFile.mjs"
```

#### reference: `Paths.diskAbsolute`

- convert path to diskAbsolute and normalized to be using forward slash;
- usefull for arguments for `methods` OR `functions` that needs to be absolute disk path, regardles if path is relative to project root, or already absolute path;

```js
/**
 * @param {string} path
 * @returns {string}
 */
```

- <i>example</i>:

```js
import { Paths } from "vivth/neutral";
Paths.normalizesForRoot("\\path\\myFile.mjs"); //  "D://something/path/myFile.mjs"
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="prettivy">node.Prettivy</h2>

#### reference: `Prettivy`

- `prettier` wrapper with option inference from path;

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="qchannel">neutral.QChannel</h2>

#### reference: `QChannel`

- class for `Queue` handling;

```js
/**
 * @template {AnyButUndefined} DEFINEDANY
 * @implements {VivthCleanup}
 */
```

#### reference: `QChannel.setup`

- to modify `MapReference`

```js
/**
 * @param {Map<AnyButUndefined, [Promise<any>, {}]>} uniqueMap
 * @returns {typeof QChannel}
 * - usefull for Queue primitive on multiple library but single reference, like the Web by making the `Map` on `window` object;
 */
```

- <i>example</i>:

```js
import { QChannel } from "vivth/neutral";
const myMappedQref = (window["myMappedQref"] = new Map());
export const MyQClass = QChannel.setup(myMappedQref);
```

#### reference: `QChannel.fifo`

- first in first out handler

#### reference: `QChannel.fifo.key`

- blocks execution for subsequent calls until the current one finishes.

```js
/**
 * @returns {Promise<QCBFIFOReturn>} Resolves when it's safe to proceed, returning a cleanup function
 */
```

- <i>example</i>:

```js
const { resume } = await QChannel.fifo.key();
// blocks all `FIFO` called using this method and QChannel.fifoCallback;
resume();
```

#### reference: `QChannel.fifo.callback`

- blocks execution for subsequent calls until the current one finishes.

```js
/**
 * @template RESULT
 * @param {()=>Promise<RESULT>} asyncCallback
 * @returns {ReturnType<typeof TryAsync<RESULT>>}
 */
```

- <i>example</i>:

```js
 const [result, error] = await QChannel.fifo.callback(async () = > {
 	// code
 })
```

#### reference: `QChannel_instance.close`

- disable queue;
- when `closed`, `isLastOnQ` will allways return `false`;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `QChannel_instance.open`

- enable queue;
- when `opened`, `isLastOnQ` will evaluate whether calls are actually the last of queue;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `QChannel_instance.key`

- each `QChannelInstance` are managing it's own `queue`, and will not `await` for other `QChannelInstance`;
- caveat:
  > - need to manually call resume();
  > - slightly more performant than `callback`;

```js
/**
 * @param {DEFINEDANY} keyID
 * @returns {Promise<QCBReturn>}
 */
```

- <i>example</i>:

```js
const q = new QChannel("channel name");
const handler = async () => {
  const { resume, isLastOnQ } = await q.key(keyID);
  // if (!isLastOnQ()) { // imperative debounce if needed
  // 	resume();
  // 	return;
  // }
  // don't forget to call resume before any returns;
  // blocks only if keyID is the same, until resume is called;
  resume(); // don't forget to call resume before any returns;
  return "something";
};
handler();
```

#### reference: `QChannel_instance.callback`

- `callbackBlock` with error as value:
- caveat:
  > - no need to manually call resume();
  > - slightly less performant than `key`;

```js
/**
 * @template RESULT
 * @param {DEFINEDANY} keyID
 * @param {(options:Omit<QCBReturn,
 * "resume">) =>
 * Promise<RESULT>} asyncCallback
 * @returns {ReturnType<typeof TryAsync<RESULT>>}
 */
```

- <i>example</i>:

```js
const q = new QChannel("channel name");
const [result, error] = await q.callback(keyID, async ({ isLastOnQ }) => {
  // if (!isLastOnQ()) { // imperative debounce if needed
  // 	return;
  // }
  // code
  // return result
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="safeexit">node.SafeExit</h2>

#### reference: `SafeExit`

- class helper for describing how to Safely Response on exit events
- singleton;
- most of functionality might need to access `SafeExit.instance.exiting`, if you get warning, you can instantiate `SafeExit` before running anything;

#### reference: `SafeExit.instance`

- only accessible after instantiation;

```js
/**
 * @type {SafeExit|undefined}
 */
```

#### reference: `new SafeExit`

````js
/**
 * @param {...NodeJS.Signals} eventNames
 * - `beforeExit` is auto included;
 * - example:
 * ```js
 *  ['SIGINT', 'SIGTERM'] // both are automatically added
 * ```
 */
````

- <i>example</i>:

```js
import process from "node:process";
import { SafeExit } from "vivth/node";
new SafeExit("SIGINT", "SIGTERM", ...eventNames);
```

#### reference: `SafeExit_instance.addCallback`

- `SafeExit` ${eventName}.Callback registration;
- `onEventName` all callbacks are called simultanousely using `await Promise.all`;
  > - for sequential event you need to put them in a single callback;

```js
/**
 * @param {()=>(Promise<void>)} safeExitCallback
 * @returns {{removeCallback:()=>void}}
 */
```

- <i>example</i>:

```js
import { SafeExit } from "vivth/node";
const exitCallback = async () => {
  // code
};
SafeExit.instance.addCallback(exitCallback);
```

#### reference: `SafeExit_instance.removeCallback`

- optional exit event removal;
- the callbacks will be removed from registered via `addCallback` exiting;

```js
/**
 * @param {()=>(Promise<void>)} cb
 */
```

- <i>example</i>:

```js
 import { SafeExit } from 'vivth/node';
  const exitCallback () => {
 	// code
 }
 SafeExit.instance.addCallback(exitCallback);
 // somewhere else
 SafeExit.instance.removeCallback(exitCallback);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="setup">node.Setup</h2>

#### reference: `Setup`

- class with collections of methods/constructors for setting up necessary variables for vivth internal functionalities;

#### reference: `Setup.safeExit`

- proxy `SafeExit_instance` for Setup

- <i>example</i>:

```js
import { Setup } from "vivth/node";
new Setup.safeExit("SIGINT", "SIGTERM", ...eventNames);
```

#### reference: `Setup.paths`

- proxy `Paths_instance` for Setup;

- <i>example</i>:

```js
import { Setup } from "vivth/node";
new Setup.paths({
  root: location.origin, // browser example
});
```

#### reference: `Setup.workerMain`

- proxy `WorkerMainThread_instance` for Setup;

- <i>example</i>:

```js
import { Setup } from "vivth/node";
import { Worker } from "node:worker_threads";
Setup.workerMain({
  workerClass: Worker,
  basePath: "public/assets/js/workers",
  pathValidator: async (workerPath, root, base) => {
    const res = await fetch(`${root}/${base}/${workerPath}`);
    // might also check wheter it need base or not
    return await res.ok;
  },
});
```

#### reference: `Setup.workerThread`

- correct `parentPort` reference when needed;
- export to create new reference to be use to create new WorkerThread instance;

- <i>example</i>:

```js
import { Setup } from "vivth/node";
import { parentPort } from "node:worker_threads";
export const MyWorkerThreadRef = Setup.workerThread({ parentPort });
// that is the default value, if your parentPort/equivalent API is not that;
// you need to call this method;
```

#### reference: `Setup.enforceEnvMode`

- setup envMode into `developement`('default') or `production`;

- <i>example</i>:

```js
import { Setup } from "vivth/node";
Setup.enforceEnvMode("prod");
// default behaviour, technically only need to be call for reactive functionality;
Setup.enforceEnvMode("dev");
```

#### reference: `Setup.preferrence`

- setup `vivth `preffered encoding;

- <i>example</i>:

```js
import { Setup } from "vivth/node";
Setup.preferrence({ encoding: "utf-8" });
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="signal">neutral.Signal</h2>

#### reference: `Signal`

- a class for creating effect to signals;

```js
/**
 * @template VALUE
 * @implements {VivthCleanup}
 */
```

#### reference: `new Signal`

- create a `Signal`;

```js
/**
 * @param {VALUE} value
 * @param {(data:DataLog<VALUE>)=>void} [performanceChangesReport]
 * - callback independent from effect;
 * >- it will always be called when there's value change;
 */
```

- <i>example</i>:

```js
import { Signal, Effect } from "vivth/neutral";
const count = new Signal(0);
```

#### reference: `Signal_instance.subscribers`

- subsrcibers reference of this instance;

#### reference: `Signal_instance.subscribers.setOf`

- subscribedEffects

```js
/**
 * @type {Set<Effect>}
 */
```

#### reference: `Signal_instance.subscribers.notify`

- manually notify on non primitive value or value that have depths;

```js
/**
 * @param {(options:{signalInstance:Signal<VALUE>})=>Promise<void>} [callback]
 * @param {(error:Error|undefined)=>Promise<void>} [afterCompletion]
 * @returns {Promise<void>}
 */
```

- <i>example</i>:

```js
import { Signal } from "vivth/neutral";
// for deep signal like array or object you can:
const arraySignal = new Signal([1, 2]);
arraySignal.value.push(3);
arraySignal.subscribers.notify();
// OR for more complex mutation:
const objectSignal = new Signal({ a: "test", b: "test" });
objectSignal.subscribers.notify(async ({ signalInstance }) => {
  signalInstance.value["c"] = "testc";
  signalInstance.value["d"] = "testd";
});
```

#### reference: `Signal_instance.remove`

- collection of remove methods

#### reference: `Signal_instance.remove.subscriber`

- remove effect subscriber to react from this instance value changes;

```js
/**
 * @param {Effect} effectInstance
 * @returns {void}
 */
```

#### reference: `Signal_instance.remove.allSubscribers`

- remove all effect subscribers to react from this instance value changes;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `Signal_instance.remove.ref`

- remove this instance from `vivth` reactivity engine, and nullify it's own value;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `Signal_instance.prev:getter`

- value before change;

```js
/**
 * @returns {VALUE|undefined}
 */
```

#### reference: `Signal_instance.value:getter`

- value after change;

```js
/**
 * @returns {VALUE}
 */
```

- <i>example</i>:

```js
import { Signal, Effect, Derived } from "vivth/neutral";
const count = new Signal(0);
count.value; // not reactive
new Effect(async ({ subscribe }) => {
  const countValue = subscribe(count).value; // reactive
});
const oneMoreThanCount = new Derived(async function ({ subscribe }) {
  return subscribe(count).value + 1; // reactive
});
```

#### reference: `Signal_instance.value:setter`

- assign new value then automatically notify all subscribers;

```js
/**
 * @type {VALUE}
 */
```

- <i>example</i>:

```js
import { Signal } from "vivth/neutral";
const count = new Signal(0);
count.value++;
// OR
count.value = 9;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="signalcollection">neutral.SignalCollection</h2>

#### reference: `SignalCollection`

- class helper for creating Collection of `Signals` for Object of Signals to be subscribed to(on `Effect`/`Derived`) collectively as signals;
  > - uses as `Facade` Pattern;

```js
/**
 * @template {Record<string, import('./Signal.mjs').Signal<any>>} SIGNALS
 * @implements {VivthCleanup}
 */
```

#### reference: `new SignalCollection`

- creates instance of `SignalCollection`, by referencing to named Signal;

```js
/**
 * @param {SIGNALS} signalsObject
 */
```

- <i>example</i>:

```js
import { Signal, Derived, SignalCollection } from "vivth/neutral";
const a = new Signal("a");
const b = new Signal("b");
const c = new Derived(async ({ subscribe }) => {
  return `${subscribe(b).value}_b`;
});
const f = new SignalCollection({ a, c });
```

#### reference: `SignalCollection_instance.signals`

- accessor for signals, to be subscribed to;

```js
/**
 * @param {import('./Effect.mjs').Effect["options"]["subscribe"]} [subscribe]
 * @returns {SIGNALS}
 */
```

- <i>example</i>:

```js
import { Signal, Derived, Effect, SignalCollection } from "vivth/neutral";
const a = new Signal("a");
const b = new Signal("b");
const c = new Derived(async ({ subscribe }) => {
  return `${subscribe(b).value}_b`;
});
const f = new SignalCollection({ a, c });
new Effect(async ({ subscribe, isLastCalled }) => {
  const {
    a: { value: aa }, // aa is safely desctructured and auto subscribed
    c: { value: cc }, // cc is safely desctructured and auto subscribed
  } = f.signals(subscribe);
  if (!(await isLastCalled(100))) {
    return; // impertaive debounce
  }
});
const d = new Derived(async function ({ subscribe, isLastCalled }) {
  const {
    a: { value: aa }, // aa is safely desctructured and auto subscribed
    c: { value: cc }, // cc is safely desctructured and auto subscribed
  } = f.signals(subscribe);
  if (!(await isLastCalled(100))) {
    return this.dontUpdate; // impertaive debounce
  }
  // return something;
});
```

#### reference: `SignalCollection_instance.forInSignals`

- is looping synchronously;
  > - will not await any async block;
- use for operation that doesn't need the value:
  > - unsub from the signal;

```js
/**
 * @template {keyof SIGNALS} K
 * @param {(key: K,
 * signal: SIGNALS[K]
 * )=>void} callback
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Signal, Derived, Effect, SignalCollection } from "vivth/neutral";
const a = new Signal("a");
const b = new Signal("b");
const c = new Derived(async ({ subscribe }) => {
  return `${subscribe(b).value}_b`;
});
const f = new SignalCollection({ a, c });
f.forInSignals((key, signal) => {
  // code
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="walkthrough">neutral.WalkThrough</h2>

#### reference: `WalkThrough`

- collection of static `methods` to walktrhough things, instead of regular looping;
- usefull to iterator that might be modified during iteration;
- mostlikely to be less performant, but with better result clarity;

#### reference: `WalkThrough.set`

- method helper to WalkThrough `Set`;

```js
/**
 * @template VAL
 * @param {Set<VAL>} setInstance
 * @param {(value:VAL)=>void} callback
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { WalkThrough } from "vivth/neutral";
WalkThrough.set(setOfSomething, (value) => {
  // code
});
```

#### reference: `WalkThrough.map`

- method helper to WalkThrough `Map`;

```js
/**
 * @template KEY, VAL
 * @param {Map<KEY, VAL>} mapInstance
 * @param {(res:[key: KEY, value: VAL]) => void} callback
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { WalkThrough } from "vivth/neutral";
WalkThrough.map(mapOfSomething, ([key, value]) => {
  // code
});
```

#### reference: `WalkThrough.array`

- method helper to WalkThrough `Array`;

```js
/**
 * @template VAL
 * @param {VAL[]} arrayInstance
 * @param {(res:[value: VAL, index: number]) => void} callback
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { WalkThrough } from "vivth/neutral";
WalkThrough.array(arrayOfSomething, ([value, index]) => {
  // code
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="workermainthread">neutral.WorkerMainThread</h2>

#### reference: `WorkerMainThread`

- class helper to create `Worker` instance;
- before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;

```js
/**
 * @template {WorkerThread<any, any>} WT
 * @implements {VivthCleanup}
 */
```

#### reference: `WorkerMainThread.setup`

- need to be called first, before any `WorkerMainThread` instantiation:

````js
/**
 * @param {Object} param0
 * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
 * - example:
 * ```js
 * import { Worker } from 'node:worker_threads';
 * ```
 * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
 * - example:
 * ```js
 * async (workerPath, root) => {
 *  const truePathCheck = `${root}/${base}/${workerPath}`;
 * 	const res = await fetch(truePathCheck);
 * 	// might also check wheter it need base or not
 * 	return await res.ok;
 * }
 * ```
 */
````

- <i>example</i>:

```js
import { Worker } from "node:worker_threads";
import { WorkerMainThread } from "vivth/neutral";
WorkerMainThread.setup({
  workerClass: Worker,
  pathValidator: async ({ worker, root }) => {
    const res = await fetch(`${root}/${worker}`);
    if (res.ok) {
      return res;
    }
    const res2 = await fetch(`${root}/someAdditionalPath/${worker}`);
    if (res2.ok) {
      return res2;
    }
  },
});
```

#### reference: `WorkerMainThread.workerClass`

- reference for `Worker` class;
- edit via `setup`;

```js
/**
 * @type {typeof Worker|typeof import('node:worker_threads').Worker}
 */
```

#### reference: `WorkerMainThread.pathValidator`

- reference for validating path;
- edit via `setup`;

```js
/**
 * @type {(paths:{worker: string, root:string})=>Promise<string>}
 */
```

#### reference: `new WorkerMainThread`

- create Worker_instance;

```js
/**
 * @param {import('../bundler/adds/PathFSBundles.mjs').PathFSBundles} handler
 * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} options
 */
```

- <i>example</i>:

```js
import { WorkerMainThread } from "vivth/neutral";
export const myDoubleWorker = new WorkerMainThread(
  PathFSBundles.vivthBundles("./doubleWorkerThread.mjs"),
);
```

#### reference: `WorkerMainThread_instance.vivthCleanup`

- terminate all signals that are used on this instance;

```js
/**
 * @return {Promise<void>}
 */
```

#### reference: `WorkerMainThread_instance.receiverSignal`

- result signal of the processed message;

```js
/**
 * @type {Derived<WorkerResult<WT["POST"]>>}
 */
```

- <i>example</i>:

```js
import { Effect } from "vivth/neutral";
import { myDoubleWorker } from "./myDoubleWorker.mjs";
const doubleReceiverSignal = myDoubleWorker.receiverSignal;
new Effect(async ({ subscribe }) => {
  const value = subscribe(doubleReceiverSignal).value;
  // code
});
```

#### reference: `WorkerMainThread_instance.postMessage`

- callback to send message to the worker thread;

```js
/**
 * @type {(event: WT["RECEIVE"])=>void}
 */
```

- <i>example</i>:

```js
import { myDoubleWorker } from "./myDoubleWorker.mjs";
myDoubleWorker.postMessage(90);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="workerresult">neutral.WorkerResult</h2>

#### reference: `WorkerResult`

- typeHelper for `Worker` message passing;
- uses error as value instead;

```js
/**
 * @template POST
 */
```

#### reference: `WorkerResult_instance.data`

- result value;

```js
/**
 * @type {POST}
 */
```

#### reference: `WorkerResult_instance.error`

- error value;

```js
/**
 * @type {Error|string|undefined}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="workerthread">neutral.WorkerThread</h2>

#### reference: `WorkerThread`

- class helper for `WorkerThread` creation;
- before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;

```js
/**
 * @template RECEIVE
 * @template POST
 * @implements {VivthCleanup}
 */
```

#### reference: `WorkerThread.setup`

- need to be called and exported as new `WorkerThread` class reference;

````js
/**
 * @template RECEIVE
 * @template POST
 * @param {{parentPort:import('node:worker_threads')["parentPort"]}} refs
 * -example:
 * ```js
 * import { parentPort } from 'node:worker_threads';
 * ```
 * @returns {typeof WorkerThread<RECEIVE, POST>}
 */
````

- <i>example</i>:

```js
import { parentPort } from "node:worker_threads";
import { WorkerThread } from "vivth/neutral";
export const MyWorkerThreadRef = WorkerThread.setup({ parentPort });
```

#### reference: `new WorkerThread`

- instantiate via created class from `setup` static method;

```js
/**
 * @param {WorkerThread<RECEIVE, POST>["handler"]} handler
 */
```

- <i>example</i>:

```js
import { MyWorkerThread } from "./MyWorkerThread.mjs";
const handler = async (ev, isLastOnQ) => {
  // if(!isLastOnQ()) {
  // 	return null; // can be used for imperative debouncing;
  // }
  // await fetch('some/path')
  // if(!isLastOnQ()) {
  // 	return;
  // }
  return (ev = ev * 2);
};
new MyWorkerThread(handler);
```

#### reference: `WorkerThread_instance.handler`

- type helper;

```js
/**
 * @type {(ev: RECEIVE, isLastOnQ:QCBReturn["isLastOnQ"]) => Promise<POST>}
 */
```

#### reference: `WorkerThread_instance.RECEIVE`

- helper type, hold no actual value;

```js
/**
 * @type {RECEIVE}
 */
```

#### reference: `WorkerThread_instance.POST`

- helper type, hold no actual value;

```js
/**
 * @type {POST}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="base64url">neutral.Base64URL</h2>

#### reference: `Base64URL`

- create inline base64 url;
- usage:
  > - can be extremely usefull to display file on desktop app `webview` or any bundled browser, without exposing http server;

````js
/**
 * @param {string} fileString
 * @param {string} mimeType
 * @param {(string:string)=>string} btoaFunction
 * - check your js runtime `btoa`;
 * - node compatible:
 * ```js
 * (str, prevBufferEncoding) => {
 * 	return Buffer.from(str, prevBufferEncoding).toString('base64');
 * }
 * ```
 * @returns {string}
 */
````

- <i>example</i>:

```js
import { Base64URL } from "vivth/neutral";
import fileString from "./fileString.mjs";
// example for browser;
Base64URL(fileString, "application/javascript", btoa);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="base64urlfromfile">node.Base64URLFromFile</h2>

#### reference: `Base64URLFromFile`

- create inline base64 url;
- usage:
  > - can be extremely usefull to display file on desktop app webview, without exposing http server;
  > - when using `FSasar`, use [Base64URL](#base64url) instead;

```js
/**
 * @param {string} filePath
 * @returns {Promise<{data:string, mime:string|false}|undefined>}
 */
```

- <i>example</i>:

```js
import { join } from "node:path";
import { Base64URLFromFile } from "vivth/node";
import { Paths } from "vivth/neutral";
await Base64URLFromFile(join(Paths.root, "/path/to/file"));
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="bundledv">neutral.BundledV</h2>

#### reference: `BundledV`

- class helper for `vivth` `Bundled` values;

#### reference: `BundledV.isBundled:getter`

- readonly value of whether the script run after being bundled with `vivth` or not;

```js
/**
 * @readonly
 * @type {boolean}
 */
```

- <i>example</i>:

```js
import { BundledV } from "vivth/neutral";
if (BundledV.isBundled) {
  // code
}
```

#### reference: `BundledV.vivthUnBundledCodeBlock`

- to create `unbundled` only codeBlock;
  > - when properly bundled via `vivth` bundling mechanism, this code block will be removed;

```js
/**
 * @param {()=>void} callback
 * @param {import('./VivthUnBundledCodeBlock.mjs').VivthUnBundledCodeBlock} _closing
 * - must be filled for regexp detection;
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { BundledV } from "vivth/neutral";
BundledV.vivthUnBundledCodeBlock(() => {
  // code
}, "vivthUnBundledCodeBlock");
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="createstringid">neutral.CreateStringID</h2>

#### reference: `CreateStringID`

- function helper to generate absolute unique ID;
- the asynchrounous nature is to prevent race condition that might resulting same Id being generated;
  > - queued using QChannel;

```js
/**
 * @param {string} [prefix]
 * @param {string} [suffix]
 * @returns {ReturnType<typeof TryAsync<string>>}
 */
```

- <i>example</i>:

```js
import { CreateStringID } from "vivth/neutral";
(async () => {
  const [myUniqueID, errorCreatingUniqueID] = await CreateStringID(
    "myPrefix",
    "mySuffix",
  );
  if (errorCreatingUniqueID) {
    return;
  }
  Console.log(myUniqueID); // `myPrefix${Date.now()}mySuffix`
})();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="envmode">neutral.EnvMode</h2>

#### reference: `EnvMode`

- class helper for determining environtment mode to be `developement` or `production`;

#### reference: `EnvMode.mode`

- `Derived` wrapper of whether is in `dev` mode or `prod` not;
  > - for listener only;

```js
/**
 * @type {Derived<EnvModeType>}
 */
```

- <i>example</i>:

```js
import { EnvMode, Effect } from "vivth/neutral";
console.log(EnvMode.mode.value); // default: 'dev'
// listeneing to changes;
new Effect(async ({ subscribe }) => {
  const mode = subscribe(EnvMode.mode).value;
  // code
});
```

#### reference: `EnvMode.enforce`

- enforce development or production mode;
- DO NOT EXPOSE THIS API TO UNSECURED ACCESS, DIRECTLY NOR INDIRECTLY;

```js
/**
 * @param {EnvModeType} mode
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { EnvMode } from "vivth/neutral";
EnvMode.enforce("dev"); // OR
EnvMode.enforce("prod");
```

#### reference: `EnvMode.codeBlock`

```js
/**
 * @param {(options:{devTest:DevTestCB}|
 * {devTest:undefined})=>Promise<void>
 * } callback
 * - when on `dev` mode also provide `test` method for inline testing:
 * >- which is wrapped in `TryAsync`, throwed errors will automatically return `false`;
 * - for smaller bundle size, you can wrap the `devTest` with `BundleV.vivthUnBundledCodeBlock`;
 * @param {Effect["options"]["subscribe"]} [subscribe]
 * - optional whether to scope the callback into an `Effect`;
 * @returns {Promise<void>}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="eventnamespace">neutral.EventNameSpace</h2>

#### reference: `EventNameSpace`

- namespacing for event, string as ID, related API;

```js
/**
 * @type {'vivthEvent'}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="factorykey">neutral.FactoryKey</h2>

#### reference: `FactoryKey`

- key symbol to imediately generate object wrapped by `LazyFactory`;
- usefull for Object that has different accessor behaviour when being get via Proxy, like:
  > - `Set<any>`;
  > - `Map<any, any>`;

```js
/**
 * @type {symbol}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="preferrence">neutral.Preferrence</h2>

#### reference: `Preferrence`

- class wrapper for `vivth` innerworking preferrences;

#### reference: `Preferrence.encoding`

- default `vivth` innerworking encoding;

```js
/**
 * @type {BufferEncoding}
 */
```

#### reference: `Preferrence.setup`

- setup `vivth `preffered encoding;

```js
/**
 * @param {Object} arg0
 * @param {typeof Preferrence["encoding"]} arg0.encoding
 */
```

- <i>example</i>:

```js
import { Preferrence } from "vivth/neutral";
Preferrence.setup({ encoding: "utf-8" });
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="trace">neutral.Trace</h2>

#### reference: `Trace`

- returns position of stack trace as string, formatted like `fileName:lineNumber:columnNumber`;
- extremely usefull for:
  > - jumping positions to code line;
  > - creating dynamic string id;

```js
/**
 * @param {number} traceIndex
 * @returns {string}
 */
```

- <i>example</i>:

```js
import { Trace, Console } from "vivth/neutral";
Console.log(Trace(3)); // "D://test.mjs:3:13"
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="tracepath">neutral.TracePath</h2>

#### reference: `TracePath`

- get stack trace path that matched with truthy filterCallback;
- returns position of stack trace as string, formatted like `fileName:lineNumber:columnNumber`;
- extremely usefull for:
  > - jumping positions to code line;
  > - creating dynamic string id;

```js
/**
 * @param {(stackString:string)=>boolean} filterCallback
 * - stackString path are normalized to use forward slash;
 * - if return true, `TracePath` will return the current stackString;
 * - if return false, continue to check the stacks;
 * @returns {string|undefined}
 */
```

- <i>example</i>:

```js
import { TracePath, Console } from "vivth/neutral";
Console.log(
  TracePath((stackString) => {
    return stackString.includes("test.mjs");
  }),
); // "D://test.mjs:4:2"
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="vivthunbundledcodeblock">neutral.VivthUnBundledCodeBlock</h2>

#### reference: `VivthUnBundledCodeBlock`

- string typehinting value for unbundled only code;

```js
/**
 * @type {'vivthUnBundledCodeBlock'}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="jsautodoc">node.JSautoDOC</h2>

#### reference: `JSautoDOC`

- class for auto documenting mjs package/project, using jsdoc;
- this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;
- this class also is used to generate this `README.md`;
- behaviours:
  > - auto export must follows the following rules;
  >
  > 1.  add `"at"noautodoc` on self closing jsdoc comment to opt out from generating documentation on said file;
  > 2.  will (generate) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.paths.file`;
  > 3.  will (generate) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.paths.file`;
  > 4.  will (generate) create `README.md` based on, `options.paths.dir` and `README.src.md`;
  > 5.  extract `"at"description` jsdoc:
  >     > - on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;
  >     > - `"at"description` are treated as plain `markdown`;
  >     > - first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;
  >     > - `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;
  >     > - you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` documentation/generation results;
  > 6.  this types of arrow functions will be converted to regullar function, for concise type emition, includes:
  >     > - validly exported function;
  >     > - static/instance method with generic template;
  > 7.  transpile `.ts` and `.mts` to `.mjs` with same name and directory;
  >     > - use `"at"preserve` to preserve tsdoc comment section;
  > 8.  integrated with assembly script to wasm compiler on the doc;
  >     > - see [AssemblyScript](#assemblyscript);
  > 9.  modify following root json files:
  >     > - `package.json`: assign `exports`, `main`, `module`;
  >     > - `tsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
  >     > - `jsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
  > 10. generates files to `/generated/vivth/exports/`:
  >     > - `./browser.mjs`: able to be called on `browser` platform;
  >     > - `./node.mjs`: able to be called on `node` platform;
  >     > - `./neutral.mjs`: able to be called on `node` and `browser` platform;
  >     > - `./unsupported.mjs`: most likely will throw error when called, it is more of a logged error to be managed;
  >     > - `./all.mjs`: collections of all platform;
  > 11. doesn't support accessor;
  >     > - due to how TLS way accessor type not casting its getter and setter working around accessor requires ignoring this specific error, and it might become ugly real quick;
  >     > - we recomend to stick with getter and setter;
- for runtime example see file `/dev/auto-doc.mjs` on source code;

```js
/**
 * @implements {VivthCleanup}
 */
```

#### reference: `new JSautoDOC`

```js
/**
 * @param {Object} options
 * @param {string} options.src
 * - source directory;
 * @param {string} [options.copyright]
 * @param {string} [options.tableOfContentTitle]
 * @param {number} [options.maxDebounceForGeneratingDocAndExport]
 * - default `10_000`;
 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
 * - ChokidarOptions;
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * - abstracted details to handle `.as.ts` file;
 * @param {(arg0:{map:Map<string, {
 *     path: string;
 *     parsed: undefined;
 *     ext: `.${string}`;
 *     type: returnTypeStringType;
 *     readme?:string;
 * } | {
 *     path: string;
 *     parsed: parsedFileForDOC;
 *     ext: string;
 *     type: returnTypeStringType;
 *     readme?:string;
 * }>})=>Promise<void>} [options.onLastGeneratedCallback]
 * - callback to be run on finishing generating document AND exports;
 * - only handle that marked as `isLastCalled`;
 * @param { import('typescript').CompilerOptions |
 * 	import('typescript').ParsedCommandLine
 * } [options.jstsconfigs]
 * - type of `ts/jsconfig` to be assigned to existing respective `.json` file;
 */
```

- <i>example</i>:

```js
import { JSautoDOC } from "vivth/node";
new JSautoDOC({
  src: "/src",
  copyright: "this library is made and distributed under MIT license;",
  tableOfContentTitle: "list of exported API and typehelpers",
  // assemblyScriptOptions: {},
  // onLastGeneratedCallback: async (options) => {
  // 	Console.log(options);
  // },
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="clearrequirecache">node.ClearRequireCache</h2>

#### reference: `ClearRequireCache`

- safely clear `import`/`require` `caches`;

```js
/**
 * @type {(path:string)=>void}
 */
```

- <i>example</i>:

```js
import { ClearRequireCache } from "vivth/node";
ClearRequireCache("D://path/to.mjs");
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="createimmutable">neutral.CreateImmutable</h2>

#### reference: `CreateImmutable`

- function for create immutable object;
- usefull for binding immutable object to global for shared object:
  > - e.g. to window object in browser;

```js
/**
 * @template {Object} PARENT
 * @template {Object} OBJECT
 * @param {string} keyName
 * @param {PARENT} parent
 * @param {(this:PARENT)=>OBJECT} object
 * @param {Object} [options]
 * @param {boolean} [options.lazy]
 * @return {ReturnType<typeof TrySync<OBJECT>>}
 */
```

- <i>example</i>:

```js
 import { CreateImmutable } from 'vivth/neutral';
  const mappedObject = new Map();
  const [object, errorCreatingImmutable] = CreateImmutable(window, 'mySharedObject', {
 	setMap(name_, value) => {
 		mappedObject.set(name_, value)
 	},
 	getMap(name_) => mappedObject.get(name_),
 })
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="eventcheck">neutral.EventCheck</h2>

#### reference: `EventCheck`

- simple validation function for [EventObject](#eventobject), for multiple context, eg: `mainThread` <-> `workerThread`;

```js
/**
 * @param {any} object
 * @param {Record<typeof EventNameSpace, string>} eventObject
 * @returns {boolean}
 */
```

- <i>example</i>:

```js
import { EventCheck } from "vivth/neutral";
import { incomingMessage } from "./some/where.mjs";
const eventObjectPayload = EventObject("worker:exit");
console.log(EventCheck(incomingMessage, eventObjectPayload));
// assuming `incomingMessage`, also created using EventObject('worker:exit');
// or manually {[EventNameSpace]:'worker:exit'};
// which either will result true;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="eventobject">neutral.EventObject</h2>

#### reference: `EventObject`

- simple object generation function helper for [EventCheck](#eventcheck), for multiple context, eg: `mainThread` <-> `workerThread`;

```js
/**
 * @template {string} NAME
 * @param {NAME} name
 * @returns {{[EventNameSpace]: NAME}}
 */
```

- <i>example</i>:

```js
import { EventObject } from "vivth/neutral";
export const eventObjectPayload = EventObject("worker:exit");
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="forinasync">neutral.ForInAsync</h2>

#### reference: `ForInAsync`

- safe `Object` async iterator helper;
  > - collect errors then returns it as Set<Error>;

```js
/**
 * @template {Record<string|number|symbol, any>} OBJECT
 * @template {any} RETURNTYPE
 * @param {OBJECT} object
 * @param {(
 * key:keyof OBJECT,
 * value:OBJECT[keyof OBJECT],
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * },
 * )=>Promise<RETURNTYPE|undefined>} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {Promise<[Set<RETURNTYPE>, Set<Error>]>}
 */
```

- <i>example</i>:

```js
import { ForInAsync } from "vivth/neutral";
const object = { A: "a", B: "b" };
const setOfError = await ForInAsync(
  object,
  async (key, value, { prevError, breakEarly }) => {
    // if(prevError) {
    // 	breakEarly(); // imperative break;
    // 	return; // undefined return will not be added to result;
    // }
  },
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="forinsync">neutral.ForInSync</h2>

#### reference: `ForInSync`

- safe `Object` iterator helper;
  > - collect errors then returns it as Set<Error>;

```js
/**
 * @template {Record<string|number|symbol, any>} OBJECT
 * @template {any} RETURNTYPE
 * @param {OBJECT} object
 * @param {(
 * key:keyof OBJECT,
 * value:OBJECT[keyof OBJECT],
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * },
 * )=>RETURNTYPE|undefined} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {[Set<RETURNTYPE>, Set<Error>]}
 */
```

- <i>example</i>:

```js
import { ForInSync } from "vivth/neutral";
const object = { A: "a", B: "b" };
const [setOfResult, setOfError] = ForInSync(
  object,
  (key, value, { prevError, breakEarly }) => {
    // if(prevError) {
    // 	breakEarly(); // imperative break;
    // 	return; // undefined return will not be added to result;
    // }
  },
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="forofasync">neutral.ForOfAsync</h2>

#### reference: `ForOfAsync`

- loop through iterable safely;

```js
/**
 * @template {any} T
 * @template {any} RETURNTYPE
 * @param {Iterable<T>} iterable
 * @param {(value: T,
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * }) => Promise<RETURNTYPE|undefined>} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {Promise<[Set<RETURNTYPE>, Set<Error>]>}
 */
```

- <i>example</i>:

```js
import { ForOfAsync } from "vivth/neutral";
await ForOfAsync(iterable, async (value, { prevError, breakEarly }) => {
  // code
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="forofsync">neutral.ForOfSync</h2>

#### reference: `ForOfSync`

- loop through iterable safely;

```js
/**
 * @template {any} T
 * @template {any} RETURNTYPE
 * @param {Iterable<T>} iterable
 * @param {(value: T,
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * }) => RETURNTYPE|undefined} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {[Set<RETURNTYPE>, Set<Error>]}
 */
```

- <i>example</i>:

```js
import { ForOfSync, TryAsync } from "vivth/neutral";
ForOfSync(iterable, (value, { prevError, breakEarly }) => {
  // code
});
await Promise.all(
  ForOfSync(
    [
      async () => {
        // code to run pararelly
      },
      async () => {
        // code to run pararelly
      },
    ],
    async (cb) => {
      return await cb();
    },
  )[0],
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getbufferfromrelativepath">node.GetBufferFromRelativePath</h2>

#### reference: `GetBufferFromRelativePath`

- get content from relativePath;
- only usefull to unbundled environtment;
- if your goal is to include on the `.asar`, use [FSasar](#fsasar) instead;

```js
/**
 * @param {string} relativePath
 * - relative path from the caller;
 * @returns {ReturnType<typeof FSasar.file>}
 */
```

- <i>example</i>:

```js
import { GetContentFromRelativePath } from "vivth/node";
await GetContentFromRelativePath("../doc/parsedFile.mjs", "utf-8");
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getfilesfromdir">node.GetFilesFromDir</h2>

#### reference: `GetFilesFromDir`

- helper function to get file from dir;

```js
/**
 * @param {string} dirAbsolutePath
 * @param {RegExp} pathRule
 * @param {Set<string>} [fileNames]
 * - fill manually to imediately add result to existing `Set` without expecting return;
 * @returns {Promise<Set<string>>}
 */
```

- <i>example</i>:

```js
import { GetFilesFromDir } from "vivth/node";
const files = await GetFilesFromDir(
  join(Paths.root, "/dev/"),
  /[\s\S]*[noblank]/,
); // without \[noblank]
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getmaxfilenamelength">node.GetMaxFilenameLength</h2>

#### reference: `GetMaxFilenameLength`

- Get OS-specific max filename length;
- On POSIX: fs.constants.NAME_MAX;
- On Windows: 255 (per component, unless long paths enabled);
- used internally to validate name length for [`UniqueFSTempName`](#uniquefstempname);

```js
/**
 * @returns {number}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getmoduleesbuildplatform">node.GetModuleEsbuildPlatform</h2>

#### reference: `GetModuleEsbuildPlatform`

- get valid esbuild platform name for a module path;

```js
/**
 * @param { string } path
 * @returns { Promise<'browser'|'node'|'neutral'|'unsupported'> }
 */
```

- <i>example</i>:

```js
// D://lib-root/myModule.mjs
import process from "node:process"; // lookupA;
import { GetModuleEsbuildPlatform } from "vivth/node";
await GetModuleEsbuildPlatform("./myModule.mjs"); // 'node'; caused of lookupA;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getnamedimportalias">neutral.GetNamedImportAlias</h2>

#### reference: `GetNamedImportAlias`

- regex helper for:
  > - get named import; OR
  > - alias of named import;

```js
/**
 * @param {string} content
 * @param {string} moduleName
 * @param {string} packageName
 * @returns {string|undefined}
 */
```

- <i>example</i>:

```js
import { GetNamedImportAlias } from "vivth/neutral";
const checkNoAlias = `
 import { something } from 'packageName';
 `;
const checkAlias = `
 import { something as somethingElse } from 'packageName';
 `;
GetNamedImportAlias(checkNoAlias, "something", "packageName"); // 'something'
GetNamedImportAlias(checkAlias, "something", "packageName"); // 'somethingElse'
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="getruntime">neutral.GetRuntime</h2>

#### reference: `GetRuntime`

- detects the current JavaScript runtime;

```js
/**
 * @type {()=>Runtime}
 */
```

- <i>example</i>:

```js
import { GetRuntime } from "vivth/neutral";
const runtime = GetRuntime();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="instantiateassemblyscript">node.InstantiateAssemblyScript</h2>

#### reference: `InstantiateAssemblyScript`

- function wrapper for `.asar` `.wasm` from `AssemblyScript` asset;
- conventions for using this class in conjuction with `JSautoDOC`:

```js
/**
 * @template {Record<string, unknown>} RESULTTYPE
 * @param {import('../bundler/adds/PathFSFile.mjs').PathFSFile} filePathFromProject
 * - call `PathFSFile.vivthFile`;
 * @param {Parameters<import('../typehints/AssemblyScriptLoaderInstantiate.mjs').AssemblyScriptLoaderInstantiate<RESULTTYPE>>[1]} [imports]
 * @returns {Promise<import('../typehints/AssemblyScriptExportsType.mjs').AssemblyScriptExportsType<RESULTTYPE>>}
 */
```

- <i>example</i>:

```js
import { PathFSFile, InstantiateAssemblyScript } from "vivth/node";
InstantiateAssemblyScript(PathFSFile.vivthFile("../function/myAsm.wasm"));
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="isasync">neutral.IsAsync</h2>

#### reference: `IsAsync`

- function helper for checking whether `functionReference` is async;

```js
/**
 * @param {(...any:any)=>(any|Promise<any>)} functionReference
 * @returns {boolean}
 */
```

- <i>example</i>:

```js
import { IsAsync } from "vivth/neutral";
const a = function (params) {
  // code
};
const b = async () => {
  // code
};
IsAsync(a); // false
IsAsync(b); // true
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="isinstanceof">neutral.IsInstanceOf</h2>

#### reference: `IsInstanceOf`

A type-safe `instanceof` helper.

```js
/**
 * @template OBJ
 * @param {unknown} obj - The object to test
 * @param {new (...args: any[]) => OBJ} classRef - A constructor reference for T
 * @returns {obj is OBJ}
 */
```

- <i>example</i>:

```js
import { IsInstanceOf, Signal, Effect } from "vivth/neutral";
const a = new Signal(0);
IsInstanceOf(a, Signal); // true
IsInstanceOf(a, Effect); // false
// but why not
if (!(a instanceof Signal)) {
  //
}
// here's why
if (!IsInstanceOf(a, Signal)) {
  //
}
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="issamefile">neutral.IsSameFile</h2>

#### reference: `IsSameFile`

- check if two path is the same file;

```js
/**
 * @param {string} pathA
 * @param {string} pathB
 * @returns {boolean}
 */
```

- <i>example</i>:

```js
// `D://myFile.mjs` cwd at `D://`
import { IsSameFile } from "vivth/node";
IsSameFile("D:\\mFile.mjs", "D://mFile.mjs"); // true;
IsSameFile("//mFile.mjs", "D://mFile.mjs"); // true;
// both path are auto resolved to Paths.root;
IsSameFile("D:\\mFile.mjs", "D:\\notmfile.mjs"); // false;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="isstringlookslikeapath">neutral.IsStringLooksLikeAPath</h2>

#### reference: `IsStringLooksLikeAPath`

- check if string lookslike a path;

```js
/**
 * @param {string} spec
 * @returns {boolean}
 */
```

- <i>example</i>:

```js
import { IsStringLooksLikeAPath } from "vivth/neutral";
looksLikePath("./foo.mjs"); // true
looksLikePath("../bar.ts"); // true
looksLikePath("/usr/lib.js"); // true
looksLikePath("C:\\lib\\mod"); // true
looksLikePath("react"); // false
looksLikePath("node:path"); // false
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="istypeof">neutral.IsTypeOf</h2>

#### reference: ``

A type-safe `typeof` helper.

```js
/**
 * @template {keyof typeof TypeMap} K
 * @param {unknown} object - The value to check.
 * @param {K} type - The type string to compare against.
 * @returns {object is typeof TypeMap[K]} - Returns true if the type matches, narrowing the type.
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="lazyfactory">neutral.LazyFactory</h2>

#### reference: `LazyFactory`

- function helper for creating lazyObject:
  > - usefull for lazily instantiating an object, since instance naturally have props/methods;

```js
/**
 * @template FACTORY
 * @param {() => FACTORY} factory
 * @returns {FACTORY & {[FactoryKey]: FACTORY}}
 * - the FactoryKey prop can be accessed to force instatiation/call;
 * - usefull for Object that has different accessor behaviour when being get via Proxy, including but not limited too:
 * >- `Set<any>`;
 * >- `Map<any, any>`;
 * >- non referenced object, like `Effect`;
 */
```

- <i>example</i>:

```js
import { LazyFactory, FactoryKey } from "vivth/neutral";
class MyClass {
  constructor() {
    this.myProp = 1; // will only available when accessed;
  }
}
export const myInstance = LazyFactory(() => {
  // the instance of MyClass will only be available when,
  // it's prop, or method is accessed/reassign;
  return new MyClass();
});
// on other file
import { myInstance } from "./myInstance.mjs";
const a = myInstance; // not yet initiated;
const b = a.myProp; // imediately initiated;
// OR
myInstance[FactoryKey]; // forcefully call factory generator;
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="monkeypatch">neutral.MonkeyPatch</h2>

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="newanimationtimeline">neutral.NewAnimationTimeline</h2>

#### reference: `NewAnimationTimeline`

- create animation timeline helper;

```js
/**
 * @param {Object} options
 * @param {number} options.fps
 * - frame per second;
 * @param {{seconds:number}|{frames:number}} options.duration
 * @param {(frame:{index:number, total:number, percentage:number})=>void} callback
 * - called every frame until duration ends;
 * @returns {()=>void}
 * - early clearInterval callback;
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="newchainable">neutral.NewChainable</h2>

#### reference: `NewChainable`

- Wraps a target object in a chainable;
- example:

```html
<canvas id="myCanvas" width="400" height="400"></canvas>
```

- chain call are synchronous without awaiting;
  > - if the method are async, it could cause race condition;

```js
/**
 * @template {object} OBJ
 * @param {OBJ} ctx
 * @returns {import("../typehints/ChainableType.mjs").ChainableType<OBJ>}
 */
```

- <i>example</i>:

```js
import { NewChainable, TrySync } from "vivth/neutral";
TrySync(() => {
  const canvas = document.getElementById("myCanvas");
  if (!canvas) {
    return;
  }
  const ctx2D = canvas.getContext("2d");
  // instead of repeating call method from `ctx2D`, you can:
  NewChainable(ctx2D)
    .beginPath()
    .moveTo(50, 50)
    .lineTo(200, 50)
    .lineTo(200, 200)
    .closePath()
    .stroke();
  // .this to get ctx2D reference;
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="newobjectwrapper">neutral.NewObjectWrapper</h2>

#### reference: `NewObjectWrapper`

- object creation mapper;

```js
/**
 * @template {Object} OBJ
 * @template {any} MODIFIED
 * @param {OBJ} object
 * @param {(obj:OBJ)=>MODIFIED} callback
 * @returns {MODIFIED}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="objectregistrar">neutral.ObjectRegistrar</h2>

#### reference: `ObjectRegistrar`

- function helper to object registrar;

```js
/**
 * @template {any[]} ARGS
 * @template {any} OBJ
 * @param {(...args:ARGS)=>OBJ} registrarCallback
 * @returns {Parameters<typeof ObjectRegistrar<ARGS, OBJ>>[0]}
 */
```

- <i>example</i>:

```js
import { ObjectRegistrar, Signal, ForOfSync } from "vivth/neutral";
const autoCleanedUpSignal = ObjectRegistrar(() => {});
const mySignal = autoCleanedUpSignal(1);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="parsesqlfile">node.ParseSQLFile</h2>

#### reference: `ParseSQLFile`

- parse then generate file right next to said sql file;
- this function assume `Paths` already instantiated;s

```js
/**
 * @param {string} path
 * @param {(
 *  arg0:{input:Record<string, string>,output:Record<string, string>, sqlString:string}
 * )=>
 *  {ext:string, content:string}
 * } [fileGenerator]
 * - file string generator;
 * - the default will generate mjs callback type, and sql string;
 * >- `callback` type: basename + 'CBType';
 * >- `sql` string: basename + 'SQL';
 * @returns {ReturnType<typeof TryAsync<boolean>>}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="pipeasync">neutral.PipeAsync</h2>

#### reference: `PipeAsync`

- create an async pipeline starting from an initial value;
- every step must return the same type (VALUE), but may be sync or async.

```js
/**
 * @template {any} VALUE
 * @param {VALUE} intialValue
 * @param {...((currentvalue:VALUE)=>VALUE|Promise<VALUE>)} pipeFunctions
 * @returns {Promise<VALUE>}
 */
```

- <i>example</i>:

```js
import { PipeAsync } from "vivth/neutral";
const res = await PipeAsync(
  "intialValue", // res: Promise<"intialValue">
  (val) => `${val}:1`, // res: Promise<"intialValue:1">
  async (val) => `${val}:2`, // res: Promise<"intialValue:1:2">
  (val) => `${val}:3`, // res: Promise<"intialValue:1:2:3">
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="pipesync">neutral.PipeSync</h2>

#### reference: `PipeSync`

```js
/**
 * @template {any} VALUE
 * @param {VALUE} intialValue
 * @param {...((currentvalue:VALUE)=>VALUE)} pipeFunctions
 * @returns {VALUE}
 */
```

- <i>example</i>:

```js
import { PipeSync } from "vivth/neutral";
const res = PipeSync(
  "intialValue", // res: "intialValue"
  (val) => `${val}:1`, // res: "intialValue:1"
  (val) => `${val}:2`, // res: "intialValue:1:2"
  (val) => `${val}:3`, // res: "intialValue:1:2:3"
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="safeimport">node.SafeImport</h2>

#### reference: `SafeImport`

- import while imediately call clearing require caches;
- `usecases`:
  > - long running process that need to prevent memory leak from uncleanable `cached import`;
  > - to simply import fresh everytime;
- the imported module can then just be treated like any other variable, to only lived and tracked by variable reference only;
- due to how `vivth/node.ClearRequireCache` works, parallel await (like using Promise.all, or not awaited until later) will be done squentially(if targetting the same path);

```js
/**
 * @template { any } T
 * - put the type
 * @param {string} path
 * - either absolute `diskAbsolutepath` or from `Paths.root`;
 * @returns {ReturnType<typeof import('./TryAsync.mjs').TryAsync<T>>}
 */
```

- <i>example</i>:

```js
// Paths.root/myscript.mjs
import { SafeImport } from "vivth/node";
// add type with: import('vivth/neutral').SafeImportReturnType<import('./something.mjs')>
const [importedModule, errorSafeImport] = await SafeImport(
  "/absolute/path/from/Paths.root/something.mjs",
);
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="templateliteral">neutral.TemplateLiteral</h2>

#### reference: `TemplateLiteral`

- function helper to create template literal with valueHandler to handle each values;

```js
/**
 * @template {any} INPUTTYPE
 * @template {string|Promise<string>} RET
 * @param {import('../typehints/TemplateLiteralValueHandler.mjs').TemplateLiteralValueHandler<INPUTTYPE>} valueHandler
 * @param {(result:string)=>(RET)} [postProcess]
 * @returns {(strings:TemplateStringsArray,
 * ...values:(INPUTTYPE)[])=>
 * RET}
 */
```

- <i>example</i>:

```js
 import { TemplateLiteral } from 'vivth/neutral';
  export const html = TemplateLiteral(
  ({ ...datas }) => `my string`,
  // optional
  (res) => return window.body.innerHTML = res
 );
  html`<div>${`<button>innerButton</button>`}</div>`;
 // this will set innerHTML of body to '<div><button>innerButton</button></div>'
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="timeout">neutral.Timeout</h2>

#### reference: `Timeout`

- function helper to temporarily block the code in async context;

```js
/**
 * @param {number} timeMS
 * - in miliseconds;
 * @returns {Promise<void>}
 */
```

- <i>example</i>:

```js
import { Timeout } from "vivth/neutral";
const test = async () => {
  // code0
  await Timeout(1000);
  // code1
};
test();
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="tries">neutral.Tries</h2>

#### reference: `Tries`

- function for error as value for chained operations;
- utility function to brute force which key is able to run;
- usefull to flatten indentation for error handlings;
- caveat:
  > - run in sequence, awaiting each key bofore running next key;

```js
/**
 * @template {string} KEY
 * @template RETURNTYPE
 * @template {Record<
 * 	KEY,
 * 	(err:{prevError:undefined|Error}) => Promise<RETURNTYPE>
 * >} RecordTryType
 * @param {RecordTryType} tryRecord
 * @returns {Promise<
 * 	[[keyof RecordTryType, RETURNTYPE], undefined]
 * 	| [[undefined, undefined], Set<Error>]
 * >}
 */
```

- <i>example</i>:

```js
import { Tries } from "vivth/neutral";
const [[key, result], setOfError] = await Tries({
  someRuntime: async ({ prevError }) => {
    // asuming on this one doesn't naturally throw error,
    // yet you need to continue to next key,
    // instead of returning,
    // you should throw new Error(something);
  },
  browser: async ({ prevError }) => {
    return location?.origin;
    // if no error, stop other key function from running;
    // key = 'browser'
    // result = location?.origin;
    // error = undefined;
    // if error;
    // run nodeOrBun;
  },
  nodeOrBun: async ({ prevError }) => {
    return process?.env?.INIT_CWD ?? process?.cwd();
    // if no error;
    // key = 'nodeOrBun'
    // result =  process?.env?.INIT_CWD ?? process?.cwd();
    // if error;
    // key = undefined;
    // result = undefined;
    // error = new Error('unable to run any key');
  },
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="tryasync">neutral.TryAsync</h2>

#### reference: `TryAsync`

- function for error as value for asynchronous operation;
- usefull to flatten indentation for error handlings;

```js
/**
 * @template RESULT
 * @param {()=>Promise<RESULT>} asyncFunction_
 * @returns {Promise<[RESULT,undefined]|[undefined,Error]>}
 */
```

- <i>example</i>:

```js
import { TryAsync } from "vivth/neutral";
let [res, error] = await TryAsync(async () => {
  return await fetch("./someAPI/Path");
});
[res, error] = await TryAsync(async () => {
  if (!res.ok) {
    throw 404;
  }
  return await res.json();
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="trynew">neutral.TryNew</h2>

#### reference: `TryNew`

- function helper to turn unsafe constructor call of classReference into safe one without tryCatch block;
- usefull to flatten your source code;

```js
/**
 * @template {new (...args: any[]) => any} CLASSREF
 * @param {CLASSREF} classReference
 * @param {ConstructorParameters<CLASSREF>} params
 * @returns {[InstanceType<CLASSREF>, undefined]|
 * [undefined, Error]}
 */
```

- <i>example</i>:

```js
import { TryNew } from "vivth/neutral";
const [instance, error] = TryNew(ClassReference, ...classConstructorParameters);
if (!error) {
  // do something with instance safely;
}
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="trysync">neutral.TrySync</h2>

#### reference: `TrySync`

- function for error as value for synchronous operation;
- usefull to flatten indentation for error handlings;

```js
/**
 * @template RESULT
 * @param {()=>RESULT} function_
 * @returns {[RESULT,undefined]|
 * [undefined,Error]}
 */
```

- <i>example</i>:

```js
import { readFileSync } from "node:fs";
import { TrySync } from "./yourModule.js";
const [data, error] = TrySync(() => {
  return readFileSync("./some/file.txt", "utf-8");
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="tstomjs">node.TsToMjs</h2>

#### reference: `TsToMjs`

- turn `.mts`||`.ts` file into `.mjs`, no bundling, just traspilation;
- on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
  > - uses `"at"preserve` to register `jsdoc`;
  > - at

```js
/**
 * @\[blank\]typedef, import itself.mts pointing to the same exported object to fully type it in mjs(which `vivth` used to generate exports);
 * - auto compile and typehint `.as.ts` to `.wasm`;
 * @param {string} path
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {Object} [options]
 * @param {string} [options.overrideOutputDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * @returns {Promise<void>}
 */
```

- <i>example</i>:

```js
import { TsToMjs } from "vivth/node";
await TsToMjs("./myFile.mts", {
  encoding: "utf-8",
  overrideOutputDir: "./other/dir",
});
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="uniquefstempname">node.UniqueFSTempName</h2>

#### reference: `UniqueFSTempName`

- generate unique full path name to temp directory + 'vivth/${uniqueName}.tmp';
- filename length already calibrated for each os;

```js
/**
 * @param {string} path
 * @param {string} [fileExtention]
 * @returns {string}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="vivthyneinth">node.VivthyNeinth</h2>

#### reference: `VivthyNeinth`

- alternative to `neinth`;

```js
/**
 * @template {any} EXPORT
 * @implements {VivthCleanup}
 */
```

#### reference: `VivthyNeinth.start`

- DO NOT CALL THIS METHOD INSIDE

```js
/**
 * @param {Object} options
 * @param {string} options.dirPath
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

#### reference: `VivthyNeinth_instance.exportedValue:setter`

- use this to update export value;
- `WARNING`: this instance setter are accesible from outside, including importer;
  > - usefull for treating `VivthyNeinth` instance as global signal;
  > - you can accidentally ;

```js
/**
 * @param {EXPORT|undefined} newExportValue
 * @returns {void}
 */
```

- <i>example</i>:

```js

```

#### reference: `VivthyNeinth_instance.listener:getter`

- use this to listen to dependency changes(inside `Effect`);

```js
/**
 * @returns {Promise<Derived<EXPORT|undefined>>}
 */
```

- <i>example</i>:

```js

```

#### reference: `VivthyNeinth_instance.newSignal`

- generate autoCleaned `Signal` instance;

- <i>example</i>:

```js
/// on VivthyNeinth callback scope
const { newSignal } = this;
const numberSignal = newSignal(1);
///
```

#### reference: `VivthyNeinth_instance.newEffect`

- generate autoCleaned `Effect` instance;

- <i>example</i>:

```js
/// on VivthyNeinth callback scope
const { newEffect } = this;
const numberSignal = newSignal(1);
const effer = newEffect(async ({ subscribe }) => {
  const numberSignalValue = subscribe(numberSignal).value;
});
///
```

#### reference: `VivthyNeinth_instance.newDerived`

- generate autoCleaned `Derived` instance;

- <i>example</i>:

```js
/// on VivthyNeinth callback scope
const { newDerived } = this;
const effer = newDerived(async ({ subscribe }) => {
  const numberSignalValue = subscribe(numberSignal).value;
  return numberSignalValue;
  2;
});
///
```

#### reference: `VivthyNeinth_instance.onMutate`

```js
/**
 * @type {Set<()=>Promise<void>>}
 */
```

- <i>example</i>:

```js
 import { watch } from "chokidar";
  /// on VivthyNeinth arg callback scope
 const { onCleanups } = this;
 const watcher = watch('/src/');
 watcher.addListener('all', (...args)=>{
 	// listener code;
 });
 onCleanups.add(async()=>{
 watcher.removeAllListeners();
 watcher.close();
 })
 ///
	/ 	#onCleanups = new Set();  	/
   @description
 - manually registering object celeanup;
 @param {()=>Promise<void>} callback
 @returns {void}
 @example
 import { watch } from 'chokidar';
  /// on VivthyNeinth export callback scope
 const watcher = watch('D://my/dir/path');
 // preferably to declare the cleanup right bellow it's object creation;
 // set 'I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file' to false if you might want to save before full cleanup is written;
 this.onMutate(async () => {
 	watcher.removeAllListeners();
 	watcher.close();
 });
  watcher.addListener('all', (eventName, path, stats) => {
 	//
 })
 ///
 // alternative: use vivth `modules` that returns object that implements `VivthCleanup`;
 // and call uses `registerObjectWithAutoCleanup`;
```

#### reference: `VivthyNeinth_instance.onExit`

- process SafeExit;

```js
/**
 * @param {()=>Promise<void>} callback
 * @returns {void}
 */
```

- <i>example</i>:

```js
import { Console } from "vivth/neutral";
/// on VivthyNeinth export callback scope
this.onExit(async () => {
  Console.log("main process ends");
});
///
```

#### reference: `VivthyNeinth_instance.registerObjectWithAutoCleanup`

- register premade cleanup `vivthCleanup` method to `VivthyNeinth` lifecycle;

```js
/**
 * @template {Object} OBJ
 * @param { OBJ & VivthCleanup } obj
 * @returns {OBJ}
 */
```

- <i>example</i>:

```js
import { EsWatcher } from "vivth/node";
/// on VivthyNeinth export callback scope
const esWatcherInstance = this.registerObjectWithAutoCleanup(
  new EsWatcher({
    ...buildOptions,
  }),
);
///
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="anybutundefined">neutral.AnyButUndefined</h2>

- jsdoc types:

```js
/**
 * - type helper for ID or objects;
 * @typedef {{}|null|number|string|boolean|symbol|bigint|function} AnyButUndefined
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="arraytokeys">neutral.ArrayToKeys</h2>

- jsdoc types:

````js
/**
 * @preserve
 * @description
 * - extract unique string from ArrayString[];
 * - Takes an array/tuple type and returns a unique UNION of its elements.
 * ```ts
 * const a = ['hi', 'there'] as const;
 * const check = (aa:ArrayToKeys<typeof a>) => {};
 * ```
 * ```js
 * const a = /** @type {const} *[]/ (['hi', 'there']);
 * /** @param {ArrayToKeys<typeof a>} aa *[]/
 * const check = (aa) => {};
 * ```
 * @template {readonly unknown[]} T
 * @typedef {import('../../../src/typehints/ArrayToKeys.mts').ArrayToKeys<T>} ArrayToKeys
 */
````

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="assemblyscriptexportstype">neutral.AssemblyScriptExportsType</h2>

- jsdoc types:

```js
/**
 * - `AssemblyScript` `exports` type helper;
 * @template {Record<string, unknown>} RESULTTYPE
 * @typedef {Awaited<ReturnType<typeof import('../../../src/typehints/@assemblyscript/loader').instantiate<RESULTTYPE>>>} AssemblyScriptExportsType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="assemblyscriptloaderinstantiate">neutral.AssemblyScriptLoaderInstantiate</h2>

- jsdoc types:

```js
/**
 * - instantiate type helper;
 * @template {Record<string, unknown>} RESULTTYPE
 * @typedef {typeof import('../../../src/typehints/@assemblyscript/loader').instantiate<RESULTTYPE>} AssemblyScriptLoaderInstantiate
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="autodocasoptions">neutral.AutoDocASOptions</h2>

- jsdoc types:

```js
/**
 * @typedef {Object} AutoDocASOptions
 * @property {boolean} [generateFSasarImporter]
 * - `true`: will generate `${fileName}.mjs` that uses `FSasar`;
 * >- upon compiling with `vivth` it should be embeded as inline buffer;
 * - `false`: does nothing;
 * - on both cases, the `${fileName}.js` can be used for both browser or nodeJS compatibel runtime;
 * @property {string[]} [ASArgv]
 * - `argv` for assembley script compiler (`asc.main`), excluding `inputPath`, `--outputFile`, `--bindings`;
 * >- `--bindings`: strictly using `esm`;
 * @property {Parameters<typeof import('../../../src/bundler/CompileAS.mjs').CompileAS>[1]} [ASAPIOptions]
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="chainabletype">neutral.ChainableType</h2>

- jsdoc types:

```js
/**
 * @template {object} OBJ
 * @typedef { {this: OBJ} & {
 *   [K in keyof OBJ]:
 *     OBJ[K] extends (...args: any[]) => any
 *       ? (...args: Parameters<OBJ[K]>) => ChainableType<OBJ>
 *       : OBJ[K]
 * }} ChainableType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="componentdecorator_constructor">neutral.ComponentDecorator_Constructor</h2>

- jsdoc types:

```js
/**
 * @description Creates a constructor structure with custom static members added.
 * @template {new (...args: any[]) => HTMLElement} BASE
 * @template {readonly string[]} ATTRS
 * @typedef {BASE & {
 *   readonly observedAttributes: ATTRS;
 * }} ComponentDecorator_Constructor
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="consoleadditionalsettingtype">neutral.ConsoleAdditionalSettingType</h2>

- jsdoc types:

```js
/**
 * @typedef {Object} ConsoleAdditionalSettingType
 * @property {boolean} [now]
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="decorator">neutral.Decorator</h2>

- jsdoc types:

```js
/**
 * @preserve
 * @description
 * - type helper to create decorator;
 * >- matches argument with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @typedef {import('../../../src/typehints/Decorator.mts').Decorator<OriginalFn, DecoratorArgs>} Decorator
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="decoratormonkeypatch">neutral.DecoratorMonkeyPatch</h2>

- jsdoc types:

```js
/**
 * @preserve
 * @description
 * - type helper to create decorator for monkeypatching class/instance method;
 * >- matches argument with host method;
 * >- matches return type with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @typedef {import('../../../src/typehints/DecoratorMonkeyPatch.mts').DecoratorMonkeyPatch<OriginalFn, DecoratorArgs>} DecoratorMonkeyPatch
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="devtestcb">neutral.DevTestCB</h2>

- jsdoc types:

```js
/**
 * @callback DevTestCB
 * @param {string} testName
 * @param {()=>Promise<boolean>} testCallback
 * - already wrapped with `TryAsync`:
 * >- if throws error will automatically return false;
 * @returns {{removeId:()=>void}}
 * - calling `removeId` will remove this test from reports;
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="envmodetype">neutral.EnvModeType</h2>

- jsdoc types:

```js
/**
 * - type helper for `EnvMode`;
 * @typedef {'dev'|'prod'} EnvModeType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="extnametype">neutral.ExtnameType</h2>

- jsdoc types:

```js
/**
 * - jsRuntime extention naming convention;
 * @typedef {`.${string}`} ExtnameType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="listarg">neutral.ListArg</h2>

- jsdoc types:

```js
/**
 * - ListSignal argument type;
 * @typedef {Record<string, any>} ListArg
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="litexpkeytype">neutral.LitExpKeyType</h2>

- jsdoc types:

```js
/**
 * @typedef {Record<string, RegExp|false>} LitExpKeyType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="litexpresulttype">neutral.LitExpResultType</h2>

- jsdoc types:

```js
/**
 * @template {import("../../../src/typehints/LitExpKeyType.mjs").LitExpKeyType} KEYS
 * @typedef {{result:{whole:string[], named:Array<Record<keyof KEYS, string>>},
 * regexp: RegExp}} LitExpResultType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="monkeypatchedtype">neutral.MonkeyPatchedType</h2>

- jsdoc types:

```js
/**
 * @description
 * - type helper for `MonkeyPatch`;
 * @template {any} ORIOBJ
 * @typedef {ORIOBJ extends (...args: infer A) => infer R
 *    ? (...args: A) => R
 *    : ORIOBJ extends abstract new (...args: infer C) => infer I
 *    ? abstract new (...args: C) => I
 *    : any
 * } MonkeyPatchedType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="mutationtype">neutral.MutationType</h2>

- jsdoc types:

```js
/**
 * - `ListSignal` mutation type;
 * @typedef {'push'|'unshift'|'splice'|'swap'|'modify'|'shift'|'remove'} MutationType
 * - instance method: serves as helper to mutate, and notify for `effects`;
 * > - `slice` uses `splice` in the background, you don't need to manually reindex when using it;
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="parametersfollowingn">neutral.ParametersFollowingN</h2>

- jsdoc types:

```js
/**
 * @preserve
 * @description
 * - Drop the first N parameters from METHOD and return the rest;
 * @template {(...args: any[]) => any} METHOD
 * @template {number} N
 * @typedef {import('../../../src/typehints/ParametersFollowingN.mts').ParametersFollowingN<N, METHOD>} ParametersFollowingN
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="prefixedkeysof">neutral.PrefixedKeysOf</h2>

- jsdoc types:

```js
/**
 * @description
 * Define a type helper that extracts keys starting with a specific prefix
 * @template {any} T
 * @template {string} Prefix
 * @typedef {Extract<keyof T, `${Prefix}${string}`>} PrefixedKeysOf
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="qcbfiforeturn">neutral.QCBFIFOReturn</h2>

- jsdoc types:

```js
/**
 * - return type of Q callback fifo;
 * @typedef {Omit<import("../../../src/typehints/QCBReturn.mjs").QCBReturn, "isLastOnQ">} QCBFIFOReturn
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="qcbreturn">neutral.QCBReturn</h2>

- jsdoc types:

```js
/**
 * - return type of Q callback;
 * @typedef {{resume:()=>void, isLastOnQ:()=>boolean}} QCBReturn
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="runtime">neutral.Runtime</h2>

- jsdoc types:

```js
/**
 * - for popular runtimes check;
 * @typedef {'node' | 'bun' | 'browser' | 'unknown'} Runtime
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="safeimportreturntype">neutral.SafeImportReturnType</h2>

- jsdoc types:

```js
/**
 * @template {any} IMPORTTARGET
 * @typedef {Awaited<ReturnType<typeof import('../../../src/function/SafeImport.mjs').SafeImport<IMPORTTARGET>>>} SafeImportReturnType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="stylepropreftype">neutral.StylePropRefType</h2>

- jsdoc types:

```js
/**
 * @import {WC_StyleProp_bind} from '../web/bindings/WC_StyleProp_bind.mjs'
 */
/**
 * @description
 * - typehelper to constrict [StyleRef](#styleref) values;
 * @template {string} STRTYPE
 * @typedef {ReturnType<typeof WC_StyleProp_bind<STRTYPE>>} StylePropRefType
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="templateliteralvaluehandler">neutral.TemplateLiteralValueHandler</h2>

- jsdoc types:

```js
/**
 * - type helper for typing `vivth.TemplateLiteral`;
 * @template {any} INPUTTYPE
 * @callback TemplateLiteralValueHandler
 * @param {Object} arg0
 * @param {INPUTTYPE} arg0.currentValue
 * @param {number} arg0.index
 * @param {TemplateStringsArray} arg0.templateStringsArray
 * @param {INPUTTYPE[]} arg0.valuesArrays
 * @param {number} arg0.inputLength
 * @returns {(string|Promise<string>)}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="vivthcleanup">neutral.VivthCleanup</h2>

- jsdoc types:

````js
/**
 * @description
 * - return type of object have this method;
 * @typedef {{vivthCleanup: ()=>Promise<any>}} VivthCleanup
 * - you can call:
 * ```js
 * something.vivthCleanup();
 * ```
 * >- class that implements this;
 * >- function that have this as part of it's return;
 * - to clean up that object, usually a long lived process;
 */
````

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="vlifecyclecallbacks">neutral.VLifecycleCallbacks</h2>

- jsdoc types:

```js
/**
 * @template {keyof HTMLElementTagNameMap} TAGNAME
 * @typedef {Object} VLifecycleCallbacks
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onConnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME])=>void} [onDisconnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onAdopted]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], name:string, oldValue:string, newValue:string)=>void} [onAttributeChanged]
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_createelement_bind">neutral.WC_createElement_bind</h2>

#### reference: `WC_createElement_bind`

- typesafe factory generator for creating element of `WC_extendsA`/`WC_extendsB` class;
- this function is returned by static method `.define`;
  > - bind it with static property;
- uses `lit-html` under the hood;

```js
/**
 * @template {(new (...args: any[]) => HTMLElement & {
 * 		props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * 	}) & {
 *  tagName: string;
 * 	extendIs: string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * 	props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * }} BASE_CONSTRUCTOR
 * @param {BASE_CONSTRUCTOR} arg0
 * @returns {(
 * 	param?:{
 * 		attrs?:BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[]
 * 			? Partial<
 * 					Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>
 * 				>
 * 			: undefined;
 * 		props?: {[K in keyof NonNullable<BASE_CONSTRUCTOR["props"]>]:
 * 			NonNullable<BASE_CONSTRUCTOR["props"][K]> extends string
 * 				? TypeMap[NonNullable<BASE_CONSTRUCTOR["props"]>[K]]
 * 				: InstanceType<NonNullable<BASE_CONSTRUCTOR["props"][K]>>
 * 		};
 * 		children?:(slotName:Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>)=>TemplateResult;
 * 		renderOptions?:RenderOptions;
 * 	},
 * )=>InstanceType<BASE_CONSTRUCTOR>}
 */
```

- <i>example</i>:

```js
 // webcomponent context via `WC_extends`
 static createElement = this.define(...args);
 //
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_createnamedslot">neutral.WC_createNamedSlot</h2>

#### reference: `WC_createNamedSlot`

- typesafe factory generator for creating slot element of `WC_extendsA`/`WC_extendsB` class;

```js
/**
 * @template {{
 * 	namedSlots?: readonly string[]
 * }} NAMEDSLOTS
 * @param {ArrayToKeys<NAMEDSLOTS["namedSlots"] extends readonly string[]
 * 	? NAMEDSLOTS["namedSlots"]
 * 	: never
 * >} name
 * @param {TemplateResult} [defaultNode]
 * @returns {TemplateResult}
 */
```

- <i>example</i>:

```js
// webcomponent context via `WC_extends`.callback props
this.createNamedSlot(...args);
//
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_litrender_bind">neutral.WC_litRender_bind</h2>

#### reference: `WC_litRender_bind`

- factory to create simplified render function by omiting args[1++];

```js
/**
 * @param {import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<typeof render, 1>} args
 * @returns {(template: import('lit-html').TemplateResult)=>import('lit-html').RootPart}
 */
```

- <i>example</i>:

```js
 // webcomponent context via `WC_extends`
 constructor(){
 	super();
 	this.#root = this.attachShadow({ mode: 'closed' });
 	this.#render = WC_litRender_bind(this.#root, this);
 }
 #root;
 #render;
 #something(){
 	this.#render(html`<div></div>`); // <- args[1++] are omitted
 }
 ///
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_litstylemap">neutral.WC_litStyleMap</h2>

#### reference: `WC_litStyleMap`

- type helper for `import { styleMap } from 'lit-html/directives/style-map.js';`, by typehinting the properties;

```js
/**
 * @param {Partial<CSSStyleProperties>} properties
 * @returns {import('lit-html/directive.js').DirectiveResult}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_styleprop_bind">neutral.WC_StyleProp_bind</h2>

#### reference: `WC_StyleProp_bind`

- type helper to create ref custom style `property`;

#### reference: `new WC_StyleProp_bind`

```js
/**
 * @param {HTMLElement} element
 * @param {string} name
 * - automatically prefixed with `--`;
 * @param {Object} options
 * @param {boolean} options.isGlobal
 * - `false`: target scoped `property` on that component, and that component instance alone;
 * >- will not even bleed to other instance with same constructor;
 * - `true`: target style variable defined in global scope(loaded on document `styles` | `link[rel="stylesheet"]`);
 */
```

- <i>example</i>:

```js
 @example
 // webcomponent context via `WC_extends`
 #myStyle = new WC_StyleProp_bind(this, 'my-theme', {isGlobal:false});
 //
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="browserdirmapper">node.BrowserDirMapper</h2>

#### reference: `BrowserDirMapper`

- class helper to map dynamic mjs files;
  > - includes `mts` file too;

```js
/**
 * @implements {VivthCleanup}
 */
```

#### reference: `new BrowserDirMapper`

- instantiate the mapper;

```js
/**
 * @param {Object} path
 * @param {string} path.watch
 * @param {string} path.mapTo
 * @param {(normalizedPath:string)=>boolean} [path.eachFilter]
 * @param {ConstructorParameters<typeof JSDirMapper>[1] &
 * 	{
 * 		debounce?:number,
 * 		chokidarOptions?:import('chokidar').ChokidarOptions
 * 	}
 * } options
 */
```

- <i>example</i>:

```js
import { BrowserDirMapper } from "vivth/node";
import { Paths, SafeExit, BrowserDirMapper } from "vivth/neutral";
new Paths({
  root: process.env.INIT_CWD ?? process.cwd(),
});
new SafeExit();
new BrowserDirMapper(
  { mapTo: "/dist/", watch: "/src/" },
  {
    esbuild: {
      buildOptions: {
        minify: true,
      },
    },
  },
);
```

#### reference: `BrowserDirMapper_instance.dirWatcher`

- `FSDirArchWatcher` instance;

```js
/**
 * @type {FSDirArchWatcher<any>|undefined}
 */
```

#### reference: `BrowserDirMapper_instance.dirMapper`

- `JSDirMapper` instance;

```js
/**
 * @type {JSDirMapper<any>|undefined}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="css">neutral.CSS</h2>

#### reference: `CSS`

- generate `CSSStyleSheet` with template literal;

```js
/**
 * @param {TemplateStringsArray} strings
 * @param {...string} values
 * @returns {CSSStyleSheet}
 */
```

- <i>example</i>:

```js
 import { CSS as css } from 'vivth/neutral';
 // webcomponent context via `WC_extends`
 static CSS = css`
 	:host{
 		--my-theme: salmon;
 		background-color: var(--my-theme);
 	}
 `
 constructor(){
 	super();
 	const root = this.attachShadow({mode:'closed'});
 	root.adoptedStyleSheets= [MyClass.CSS];
 }
 //
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="e">neutral.E</h2>

#### reference: `E`

- helper function to create element;

```js
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @template {Partial<HTMLElementTagNameMap[K]> & Record<string, any>} RR
 * @param {K} tagName
 * @param {(
 *   & Omit<Record<string, string|Signal<string>>, 'style'|'class'>
 *   & { style?: string, class?: string }
 * )} [attrs]
 * @param {RR} [props]
 * @param {ChildNode[]|Signal<ChildNode[]>} [childNodes]
 * @returns {HTMLElementTagNameMap[K]
 * 	& RR
 * 	& {
 * 		onDisconnected:()=>void;
 * 		}
 * }
 */
```

- <i>example</i>:

```js
const text = new Text("hello");
const div = E(
  "div",
  {
    class: "p-1 m-1",
    id: "my-div",
  },
  {
    onclick(e) {
      console.log(e);
    },
  },
  [text],
);
// fine grain modify
text.nodeValue = "hello world";
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="newstylesheetasync">neutral.NewStyleSheetAsync</h2>

#### reference: `NewStyleSheetAsync`

- function helper to asynchronously `CSSStyleSheet`;
  > - './main.css';

```css
:host {
  background-color: red;
}
```

- internally used for `Dynamics`;

```js
/**
 * @param {string} string
 * @param {ConstructorParameters<typeof CSSStyleSheet>} arg1
 * @returns {Promise<CSSStyleSheet>}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="newstylesheetsync">neutral.NewStyleSheetSync</h2>

#### reference: `NewStyleSheetSync`

- function helper to synchronously `CSSStyleSheet`;
  > - './main.css';

```css
:host {
  background-color: red;
}
```

- internally used for `CSS`;

```js
/**
 * @param {string} string
 * @param {ConstructorParameters<typeof CSSStyleSheet>} arg1
 * @returns {CSSStyleSheet}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_tagname_type">neutral.WC_TagName_type</h2>

- jsdoc types:

```js
/**
 * @preserve
 * @description
 * Validates whether a string follows the strict custom-element layout:
 * - Must contain a hyphen (-)
 * - No spaces allowed anywhere
 * - Must be strictly lowercase
 * @template {string} TAG
 * @typedef {import('../../../src/web/common/WC_TagName_type.mts').WC_TagName_type<TAG>} WC_TagName_type
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="ensurevalidtag">neutral.EnsureValidTag</h2>

- jsdoc types:

```js
/**
 * @preserve
 * @template {string} T
 * @typedef {import('../../../src/web/EnsureValidTag.mts').EnsureValidTag<T>} EnsureValidTag
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="isinviewportsignal">neutral.IsInViewPortSignal</h2>

#### reference: `IsInViewPortSignal`

- signal helper to check whether element is in viewport;

```js
/**
 * @implements {VivthCleanup}
 * @extends {Signal<boolean>}
 */
```

#### reference: `IsInViewPortSignal_instance.vivthCleanup`

```js
/**
 * @override
 * - cleanup callback;
 */
```

#### reference: `new IsInViewPortSignal`

```js
/**
 * @param {Element} element
 */
```

#### reference: `IsInViewPortSignal_instance.value:getter`

- `Signal.value` reference to check if element is in viewport;

```js
/**
 * @returns {boolean}
 * @override
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="observersignal">neutral.ObserverSignal</h2>

#### reference: `ObserverSignal`

- helper to create lazy `MutationObserver`;
- use in tandem with `WC_extends`;

```js
/**
 * @implements {VivthCleanup}
 * @extends {Signal<MutationRecord[]|undefined>}
 */
```

#### reference: `ObserverSignal_instance.vivthCleanup`

```js
/**
 * @override
 * - cleanup callback;
 */
```

#### reference: `new ObserverSignal`

```js
/**
 * @param {Node} node
 * @param {ParametersFollowingN<
 * 	MutationObserver["observe"],1
 * >} mutationObserverInitArgs
 * - no default value;
 */
```

#### reference: `ObserverSignal_instance.value:getter`

```js
/**
 * @override
 */
```

#### reference: `ObserverSignal_instance.unobserve`

- unobserve element;

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_litref">neutral.WC_litRef</h2>

#### reference: `WC_litRef`

- signal to get element reference on lit render;
- warning, this class relies on creating macro task to trick lit-html render ref to get the `Element` reference, it might not be too accurate;

```js
/**
 * @template {Element} EL
 * @extends {Signal<EL|undefined>}
 */
```

#### reference: `new WC_litRef`

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_loopedsiblingsref">neutral.WC_loopedSiblingsRef</h2>

#### reference: `WC_loopedSiblingsRef`

- `Signal` to check siblingIndex of a looped component;
- automatically trigger check upon connectedCallback, by wrapping it with `this.ON` even without second argument;
- automatically trigger cleanup upon disconnectedCallback, by wrapping it with `this.ON` even without second argument;
- assumption is all sibling element must be from same class `WebCompoent`;

```html
<div>
  <!-- looped <my-component></my-component> -->
  <!-- looped <my-component></my-component> -->
  <!-- looped <my-component></my-component> -->
  <my-component></my-component>
  <!-- looped <my-component></my-component> -->
  <!-- looped <my-component></my-component> -->
</div>
```

```js
/**
 * @extends {Signal<number|undefined>}
 */
```

#### reference: `WC_loopedSiblingsRef_instance.onConnected`

- self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
- the automatic part only works on `WC_extends${suffix}`;
  > - the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
- still need to be called manually if used outside `vivth/neutral` `WebComponent`;

```js
/**
 * @type {()=>void}
 */
```

#### reference: `WC_loopedSiblingsRef_instance.onDisconnected`

- self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
- the automatic part only works on `WC_extends${suffix}`;
  > - the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
- still need to be called manually if used outside `vivth/neutral` `WebComponent`;

```js
/**
 * @type {()=>void}
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_extendsa">browser.WC_extendsA</h2>

#### reference: `WC_extendsA`

- Generates a base class for Web Component definitions.
- Note: This generator does not support `connectedMoveCallback`.
  For the needs of opting in to [connectedMoveCallback](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) functionality, use [WC_extendsB](#wc_extendsb) instead.
- This class relies heavily on complex type inference which can cause issues, during declaration file generation. To avoid "circular type" errors or build failures, set the following in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "declaration": false
  }
}
```

- By disabling `declaration`, you prevent the TypeScript compiler from attempting to resolve and export the complex recursive type definitions generated by this factory;

```js
/**
 * @template {new (...args: any[]) => HTMLElement} BASE_CONSTRUCTOR
 * @template {{
 * 	class?:string;
 * 	style?:string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * 	props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * }} STANDARD
 * @template {(BASE_CONSTRUCTOR) & {
 * 	tagName: string;
 * 	extendIs: string;
 * 	observedAttributes?: STANDARD["observedAttributes"];
 * 	namedSlots?: STANDARD["namedSlots"];
 * 	props?: STANDARD["props"];
 * }} CREATEARGS
 * @template { (new (...args: any[]) => InstanceType<BASE_CONSTRUCTOR> & {
 * 		setObservedAttributes(attributes:Partial<
 * 			Record<ArrayToKeys<STANDARD["observedAttributes"]extends readonly string[]
 * 				? STANDARD["observedAttributes"]
 * 				:never>,
 * 			string>
 * 		>):void;
 *  	props: STANDARD["props"];
 *    adoptedCallback():void;
 *    connectedCallback():void;
 *    disonnectedCallback():void;
 * 		attributeChangedCallback(name:ArrayToKeys<STANDARD["observedAttributes"]extends readonly string[]?STANDARD["observedAttributes"]:never>, oldValue:string|null, newValue:string|null): void;
 * 		ON:<OBJ extends any & {
 * 				onConnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connected"];
 * 				onDisconnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["disconnected"];
 * 				onAdopted?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["adopted"];
 * 				onAttributeChanged?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["attributeChanged"];
 * 			}>
 * 		(obj:OBJ, callbacks?:
 * 			{
 * 				connected?:(obj:OBJ)=>void;
 * 				disconnected?:(obj:OBJ)=>void;
 * 				adopted?:(obj:OBJ)=>void;
 * 				attributeChanged?:(
 * 					obj:OBJ,
 * 					name:STANDARD["observedAttributes"]extends readonly string[]
 * 						? ArrayToKeys<STANDARD["observedAttributes"]>
 * 						: never,
 * 					oldValue:string|null,
 * 					newValue:string|null
 * 				)=>void;
 * 			})=>OBJ;
 *  }) & {
 * 		tagName:string;
 * 		extendIs:string;
 *  	namedSlots: STANDARD["namedSlots"];
 *  	observedAttributes: STANDARD["observedAttributes"];
 * 		createNamedSlot: typeof WC_createNamedSlot<STANDARD>;
 * 		define:<TAG extends string, CLASSREF extends CREATEARGS>
 * 			(
 * 				tagName:WC_TagName_type<TAG>,
 * 				classRef:CLASSREF,
 * 				elementDefinitionOptions?:ElementDefinitionOptions,
 * 			)=>ReturnType<typeof WC_createElement_bind<CLASSREF>>;
 * 	}
 * } RET
 * @param {BASE_CONSTRUCTOR} Base
 * @param {STANDARD} [staticMember]
 * @returns {RET}
 */
```

- <i>example</i>:

```js
 export MyWebComponent extends WC_extendsA(HTMLElement, {...options}){
 	static create = this.define('my-webcomponent');
 }
```

#### reference: `WC_extendsA_instance.ON`

- wrapper helper to handle returned to be assigned property on `WebComponent` lifecycle callbacks;

```js
/**
 * @template {Object} OBJ
 * @param {OBJ & {
 * 	onConnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connected"];
 * 	onDisconnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["disconnected"];
 * 	onAdopted?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["adopted"];
 * 	onAttributeChanged?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["attributeChanged"];
 * }} obj
 * @param {Object} [callbacks]
 * @param {(obj:OBJ)=>void} [callbacks.connected]
 * @param {(obj:OBJ)=>void} [callbacks.disconnected]
 * @param {(obj:OBJ)=>void} [callbacks.adopted]
 * @param {(
 * 	obj:OBJ,
 * 	name:STANDARD["observedAttributes"]extends readonly string[]
 * 		? ArrayToKeys<STANDARD["observedAttributes"]>
 * 		: never,
 * 	oldValue:string|null,
 * 	newValue:string|null
 * )=>void} [callbacks.attributeChanged]
 * @returns {OBJ}
 */
```

- <i>example</i>:

```js
 // inside WebComponent context
 #mySignal = this.ON(createSignalFromExternalLib(0),{
 	disconnected:(s)=>{
 		s.cleanup(); // <-or any equivalent;
 	},
 });
 //
```

#### reference: `WC_extendsA_instance.setObservedAttributes`

```js
/**
 * @type {InstanceType<RET>["setObservedAttributes"]}
 */
```

#### reference: `WC_extendsA.createNamedSlot`

```js
/**
 * @protected
 */
```

#### reference: `WC_extendsA.define`

- to be called before calling `ClassRef.new`;

```js
/**
 * @type {<TAG extends string, CLASSREF extends CREATEARGS>
 * 			(
 * 				tagName:WC_TagName_type<TAG>,
 * 				classRef:CLASSREF,
 * 				elementDefinitionOptions?:ElementDefinitionOptions,
 * 			)=>ReturnType<typeof WC_createElement_bind<CLASSREF>>
 * 	}
 * }
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---

<h2 id="wc_extendsb">neutral.WC_extendsB</h2>

#### reference: `WC_extendsB`

- Generates a base class for Web Component definitions.
- Note: This generator does not support `connectedMoveCallback`.
  For the needs of opting in to [connectedMoveCallback](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) functionality, use [WC_extendsB](#wc_extendsb) instead.
- This class relies heavily on complex type inference which can cause issues, during declaration file generation. To avoid "circular type" errors or build failures, set the following in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "declaration": false
  }
}
```

- By disabling `declaration`, you prevent the TypeScript compiler from attempting to resolve and export the complex recursive type definitions generated by this factory;

```js
/**
 * @template {new (...args: any[]) => HTMLElement} BASE_CONSTRUCTOR
 * @template {{
 * 	class?:string;
 * 	style?:string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * 	props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * }} STANDARD
 * @template {(BASE_CONSTRUCTOR) & {
 * 	tagName: string;
 * 	extendIs: string;
 * 	observedAttributes?: STANDARD["observedAttributes"];
 * 	namedSlots?: STANDARD["namedSlots"];
 * 	props?: STANDARD["props"];
 * }} CREATEARGS
 * @template { (new (...args: any[]) => InstanceType<BASE_CONSTRUCTOR> & {
 * 		setObservedAttributes(attributes:Partial<
 * 			Record<ArrayToKeys<STANDARD["observedAttributes"]extends readonly string[]
 * 				? STANDARD["observedAttributes"]
 * 				:never>,
 * 			string>
 * 		>):void;
 * 		props?: STANDARD["props"];
 *    adoptedCallback():void;
 *    connectedCallback():void;
 *    disonnectedCallback():void;
 * 		attributeChangedCallback(name:ArrayToKeys<STANDARD["observedAttributes"]extends readonly string[]?STANDARD["observedAttributes"]:never>, oldValue:string|null, newValue:string|null): void;
 * 		ON:<OBJ extends any & {
 * 				onConnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connected"];
 * 				onConnectedMove?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connectedMove"];
 * 				onDisconnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["disconnected"];
 * 				onAdopted?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["adopted"];
 * 				onAttributeChanged?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["attributeChanged"];
 * 			}>
 * 		(obj:OBJ, callbacks?:
 * 			{
 * 				connected?:(obj:OBJ)=>void;
 * 				connectedMove?:(obj:OBJ)=>void;
 * 				disconnected?:(obj:OBJ)=>void;
 * 				adopted?:(obj:OBJ)=>void;
 * 				attributeChanged?:(
 * 					obj:OBJ,
 * 					name:STANDARD["observedAttributes"]extends readonly string[]
 * 						? ArrayToKeys<STANDARD["observedAttributes"]>
 * 						: never,
 * 					oldValue:string|null,
 * 					newValue:string|null
 * 				)=>void;
 * 			})=>OBJ;
 *  }) & {
 * 		tagName:string;
 * 		extendIs:string;
 *  	namedSlots: STANDARD["namedSlots"];
 *  	observedAttributes: STANDARD["observedAttributes"];
 * 		createNamedSlot: typeof WC_createNamedSlot<STANDARD>;
 * 		define:<TAG extends string, CLASSREF extends CREATEARGS>
 * 			(
 * 				tagName:WC_TagName_type<TAG>,
 * 				classRef:CLASSREF,
 * 				elementDefinitionOptions?:ElementDefinitionOptions,
 * 			)=>ReturnType<typeof WC_createElement_bind<CLASSREF>>;
 * 	}
 * } RET
 * @param {BASE_CONSTRUCTOR} Base
 * @param {STANDARD} [staticMember]
 * @returns {RET}
 */
```

#### reference: `WC_extendsB_instance.ON`

- wrapper helper to handle returned to be assigned property on `WebComponent` lifecycle callbacks;

```js
/**
 * @template {Object} OBJ
 * @param {OBJ & {
 * 	onConnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connected"];
 * 	onConnectedMove?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["connectedMove"];
 * 	onDisconnected?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["disconnected"];
 * 	onAdopted?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["adopted"];
 * 	onAttributeChanged?: NonNullable<Parameters<InstanceType<RET>["ON"]>[1]>["attributeChanged"];
 * }} obj
 * @param {Object} [callbacks]
 * @param {(obj:OBJ)=>void} [callbacks.connected]
 * @param {(obj:OBJ)=>void} [callbacks.connectedMove]
 * @param {(obj:OBJ)=>void} [callbacks.disconnected]
 * @param {(obj:OBJ)=>void} [callbacks.adopted]
 * @param {(
 * 	obj:OBJ,
 * 	name:STANDARD["observedAttributes"]extends readonly string[]
 * 		? ArrayToKeys<STANDARD["observedAttributes"]>
 * 		: never,
 * 	oldValue:string|null,
 * 	newValue:string|null
 * )=>void} [callbacks.attributeChanged]
 * @returns {OBJ}
 */
```

- <i>example</i>:

```js
 // inside WebComponent context
 #mySignal = this.ON(createSignalFromExternalLib(0),{
 	disconnected:(s)=>{
 		s.cleanup(); // <-or any equivalent;
 	},
 });
 //
```

#### reference: `WC_extendsB_instance.setObservedAttributes`

```js
/**
 * @type {InstanceType<RET>["setObservedAttributes"]}
 */
```

#### reference: `WC_extendsB.createNamedSlot`

```js
/**
 * @protected
 */
```

#### reference: `WC_extendsB.define`

- to be called before calling `ClassRef.new`;

```js
/**
 * @type {<TAG extends string, CLASSREF extends CREATEARGS>
 * 			(
 * 				tagName:WC_TagName_type<TAG>,
 * 				classRef:CLASSREF,
 * 				elementDefinitionOptions?:ElementDefinitionOptions,
 * 			)=>ReturnType<typeof WC_createElement_bind<CLASSREF>>
 * 	}
 * }
 */
```

\*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

---
