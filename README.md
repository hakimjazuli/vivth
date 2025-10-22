## HOW TO INSTALL

- example uses `npm`, you can allways use your own favourite package manager;

```shell
npm i vivth
```

## vivth

- `vivth` are intended to be a collections of usefull `primitives`, and not to be directly used as
  underlying framework;
- completely `JSruntime` agnostic:
  > - instead of `vivth` trying to guess, all runtime specific API should be provided by dev;
- contains helpers to help you write data driven javascript program, including:
  > - collections of extremely ⚡ performant `signal` classes;
  >   > - `vivth` deliberately take away `auto-subscription`:
  >   >   > - and introducing more imperative way of subsrciption yet still simple enough, which in
  >   >   >   turn, it completely removes total code blocking on previously needed auto subsrciption
  >   >   >   process on first run;
  >   >   > - and also make previously unthinkable dynamic subscription on conditionals that runs
  >   >   >   outside first run, now completely possible;
  > - collections of `queue-helper` classes;
  > - fully typed `worker-threads` abstraction;
  > - ` error as value` function helper;
  > - opionated `autoDocumentation`;
  > - opionated `bundler`:
  >   > - abstracted via `esbuild`;
  > - opionated `compiler`;
  >   > - abstracted via `pkg`, `deno`, and `bun`;

## versions:

- `1.0.0+:beta`:

  > - beta release;
  > - checking edge cases;
  > - stable API, the exposed API access are highly unlikely to changes, only the underlying code
  >   might changes for improving performance;

- `1.3.x:beta`:
  > - type should now fully fixed, even with strict ts check;

<h2 id="list-of-exported-api-and-typehelpers">list of exported API and typehelpers</h2>

 - [CompileJS](#compilejs)
 - [CreateESPlugin](#createesplugin)
 - [EsBundler](#esbundler)
 - [FSInline](#fsinline)
 - [FSInlineAnalyzer](#fsinlineanalyzer)
 - [Console](#console)
 - [Derived](#derived)
 - [Effect](#effect)
 - [EnvSignal](#envsignal)
 - [EventSignal](#eventsignal)
 - [FileSafe](#filesafe)
 - [ListDerived](#listderived)
 - [ListSignal](#listsignal)
 - [LitExp](#litexp)
 - [Paths](#paths)
 - [QChannel](#qchannel)
 - [SafeExit](#safeexit)
 - [Setup](#setup)
 - [Signal](#signal)
 - [WorkerMainThread](#workermainthread)
 - [Base64URL](#base64url)
 - [Base64URLFromFile](#base64urlfromfile)
 - [EventNameSpace](#eventnamespace)
 - [JSautoDOC](#jsautodoc)
 - [CreateImmutable](#createimmutable)
 - [EventCheck](#eventcheck)
 - [EventObject](#eventobject)
 - [GetRuntime](#getruntime)
 - [IsAsync](#isasync)
 - [LazyFactory](#lazyfactory)
 - [Timeout](#timeout)
 - [Try](#try)
 - [TryAsync](#tryasync)
 - [TrySync](#trysync)
 - [TsToMjs](#tstomjs)
 - [AnyButUndefined](#anybutundefined)
 - [ExtnameType](#extnametype)
 - [IsListSignal](#islistsignal)
 - [ListArg](#listarg)
 - [LitExpKeyType](#litexpkeytype)
 - [LitExpResultType](#litexpresulttype)
 - [MutationType](#mutationtype)
 - [QCBFIFOReturn](#qcbfiforeturn)
 - [QCBReturn](#qcbreturn)
 - [Runtime](#runtime)
 - [WorkerResult](#workerresult)
 - [WorkerThread](#workerthread)
 - [ToBundledJSPlugin](#tobundledjsplugin)

<h2 id="compilejs">CompileJS</h2>


#### reference:`CompileJS`
- function to compile `.ts`|`.mts`|`.mjs` file, into a single executable;  
- also generate js representation;  
- uses [pkg](https://www.npmjs.com/package/pkg), [bun](https://bun.com/docs/bundler/executables), and [deno](https://docs.deno.com/runtime/reference/cli/compile/) compiler under the hood;  
>- they are used only as packaging agent, and doesn't necessarily supports their advanced feature, such as, assets bundling(use [FSInline](#fsinline) instead);  
>- `WorkerThread` will be converted to inline using `FSInline` too;  
 
!!!WARNING!!!  
!!!WARNING!!!  
!!!WARNING!!!  
 
- This function does not obfuscate and will not prevent decompilation. Do not embed environment variables or sensitive information inside `options.entryPoint`;  
- It is designed for quick binarization, allowing execution on machines without `Node.js`, `Bun`, or `Deno` installed;  
- The resulting binary will contain `FSInline` and `WorkerMainThread` target paths Buffers, which are loaded into memory at runtime. If your logic depends on the file system, use `node:fs` or `node:fs/promises` APIs and ship external files alongside the binary (not compiled);  
 
!!!WARNING!!!  
!!!WARNING!!!  
!!!WARNING!!!

```js
/**
 * @param {Object} options  
 * @param {string} options.entryPoint  
 * - need to be manually prefixed;  
 * @param {BufferEncoding} [options.encoding]  
 * - write and read encoding for the sources;  
 * - default: `utf-8`;  
 * @param {boolean} options.minifyFirst  
 * - minify the bundle before compilation;  
 * @param {string} options.outDir  
 * - need manual prefix;  
 * @param {'pkg'|'bun'|'deno'} [options.compiler]  
 * - default: no comilation, just bundling;  
 * - `bun` and `pkg` is checked, if there's bug on `deno`, please report on github for issues;  
 * @param {Record<string, string>} [options.compilerArguments]  
 * - `key` are to used as `--keyName`;  
 * - value are the following value of the key;  
 * - no need to add the output/outdir, as it use the `options.outDir`;  
 * @param {ReturnType<CreateESPlugin>[]} [options.esBundlerPlugins]  
 * - plugins for `EsBundler`;  
 * @return {ReturnType<typeof TryAsync<{compileResult:Promise<any>|undefined,  
 * commandCalled: string|undefined;  
 * compiledBinFile: string|undefined;  
 * bundledJSFile:string|undefined  
 * }>>}  
 */
```
 - <i>example</i>:
```js 
 import { join } from 'node:path';  
  
 import { CompileJS, Paths } from 'vivth';  
  
 const [[resultPkg, errorPkg], [resultBun, errorBun]] = await Promise.all([  
 	CompileJS({  
 		entryPoint: join(Paths.root, '/dev'),  
 		minifyFirst: true,  
 		outDir: join(Paths.root, '/dev-pkg'),  
 		compiler: 'pkg',  
 		compilerArguments: {  
 			target: ['node18-win-x64'],  
 		},  
 		esBundlerPlugins: [],  
 	}),  
 	CompileJS({  
 		entryPoint: join(Paths.root, '/dev'),  
 		minifyFirst: true,  
 		outDir: join(Paths.root, '/dev-pkg'),  
 		compiler: 'bun',  
 		compilerArguments: {  
 			target: ['bun-win-x64'],  
 		},  
 		esBundlerPlugins: [],  
 	}),  
 ])
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="createesplugin">CreateESPlugin</h2>


#### reference:`CreateESPlugin`
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
 import { CreateESPlugin } from 'vivth';  
  
 export const pluginAddCopyRight = CreateESPlugin(  
 	'MyCopyrightDeclaration',  
 	async (build) => {  
 		// build script;  
 	}  
 );
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="esbundler">EsBundler</h2>


#### reference:`EsBundler`
- opinionated bundler for extension below using esbuild;  
- bundles all imports into a single output string;

```js
/**
 * @param {Object} options  
 * @param {string} options.content  
 * - the code can also uses composites from the result from multiple readFiles;  
 * @param {string} options.root  
 * - use dirname of said fileString path;  
 * @param {'.mts'|'.ts'|'.mjs'} options.extension  
 * @param {boolean} [options.withBinHeader]  
 * @param {Omit<Parameters<build>[0],  
 * 'entryPoints'|'bundle'|'write'|'sourcemap'>  
 * } [esbuildOptions]  
 * @returns {ReturnType<typeof TryAsync<string>>}  
 */
```
 - <i>example</i>:
```js 
 import { EsBundler } from 'vivth';  
  
 const bundledString = EsBundler(  
 	{  
 		content: ``,  
 		extension: '.mts',  
 		...options  
 	},  
 	{  
 	...esbuildOptions,  
 });
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="fsinline">FSInline</h2>


#### reference:`FSInline`
- class helper to inline file;  
- use only if you are planning to use [CompileJS](#compilejs);


#### reference:`FSInline.vivthFSInlineFile`
- declare entrypoint of file inlining; 	 
>- on the dev time, it's just regullar `readFile` from `node:fs/promises`; 	 
>- on the compiled, it will read file from `FSInline.vivthFSInlinelists`

```js
/**
 * @param {string} filePathFromProject 	 
 * - doesn't require prefix; 	 
 * @returns {Promise<Buffer<ArrayBuffer>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { FSInline } from 'vivth'; 	 
 	 
 (await FSInline.vivthFSInlineFile('/assets/text.txt')).toString('utf-8');
 
```

#### reference:`FSInline.vivthFSInlineDir`
- declare entrypoint of file inlining, include all files on `dir` and `subdir` that match the `fileRule`;

```js
/**
 * @param {string} dirPathFromProject 	 
 * - doesn't require prefix; 	 
 * @param {RegExp} fileRule 	 
 * @returns {Promise<typeof FSInline["vivthFSInlineFile"]>} 	 
 */
```
 - <i>example</i>:
```js  
 import { FSInline } from 'vivth'; 	 
 	 
 export const pngAssets = await FSInline.vivthFSInlineDir('/assets', /.png$/g);
 
```

#### reference:`FSInline.vivthFSInlinelists`
- placeholder for FSInline; 	 
- it's remain publicly accessible so it doesn't mess with regex analyze on bundle; 	 
- shouldn't be manually accessed; 	 
>- access via `FSInline.vivthFSInlineFile` or `FSInline.vivthFSInlineDir`;

```js
/**
 * @type {Record<string, Buffer<ArrayBuffer>>}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="fsinlineanalyzer">FSInlineAnalyzer</h2>


#### reference:`FSInlineAnalyzer`
- collections of static method to analyze content for `FSInline`;


#### reference:`FSInlineAnalyzer.finalContent`
- to be used on bundled content;

```js
/**
 * @param {string} content 	 
 * @param {'cjs'|'esm'} format 	 
 * @returns {ReturnType<typeof TryAsync<string>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { readFile } from 'node:fs/promises'; 	 
 	 
 import { FSInlineAnalyzer } from 'vivth'; 	 
 	 
 const [resultFinalContent, errorFinalContent] = await FSInlineAnalyzer.finalContent( 	 
 	await readFile('./resultESBunlded.mjs', {encoding: 'utf-8'}), 	 
 	'esm' 	 
 );
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="console">Console</h2>


#### reference:`Console`
- class with static methods to print to standard console with bare minimum ANSI styles;


#### reference:`Console.log`


```js
/**
 * @param {any} data 	 
 * @returns {void} 	 
 */
```
 - <i>example</i>:
```js  
 import { Console } from 'vivth'; 	 
 	 
 Console.log({ 	 
 	hello: 'world!!', 	 
 });
 
```

#### reference:`Console.info`


```js
/**
 * @param {any} data 	 
 * @returns {void} 	 
 */
```
 - <i>example</i>:
```js  
 import { Console } from 'vivth'; 	 
 	 
 Console.info({ 	 
 	hello: 'world!!', 	 
 });
 
```

#### reference:`Console.warn`


```js
/**
 * @param {any} data 	 
 * @returns {void} 	 
 */
```
 - <i>example</i>:
```js  
 import { Console } from 'vivth'; 	 
 	 
 Console.warn({ 	 
 	hello: 'world!!', 	 
 });
 
```

#### reference:`Console.error`


```js
/**
 * @param {any} data 	 
 * @returns {void} 	 
 */
```
 - <i>example</i>:
```js  
 import { Console } from 'vivth'; 	 
 	 
 Console.error({ 	 
 	hello: 'world!!', 	 
 });
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="derived">Derived</h2>


#### reference:`Derived`
- a class for creating derived version of [Signal](#signal);

```js
/**
 * @template VALUE  
 * @extends Signal<VALUE>
 */
```

#### reference:`new Derived`
- Derived used [Signal](#signal) and [Effect](#effect) under the hood;

```js
/**
 * @param {(effectInstanceOptions:Omit<Effect["options"] & 	 
 * Derived<VALUE>["options"], unwrapLazy>) => 	 
 * Promise<VALUE>} derivedFunction 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal, Derived } from  'vivth'; 	 
 	 
 const count = new Signal(0); 	 
 const double = new Derived(async({ 	 
 		subscribe, 	 
 		// : registrar callback for this derived instance, immediately return the signal instance 	 
 	}) => { 	 
 	return subscribe(count).value + count.value; 	 
 	// double listen to count changes, by returning the value, double.value also changes 	 
 	// notice the count.value are accessed double, but it's all safe, 	 
 	// since the wrapped one is the only one that are recorded as notifier. 	 
 }); 	 
 	 
 count.value++;
 
```

#### reference:`Derived_instance.options`
- additional helper to be accessed on effect;


#### reference:`Derived_instance.options.dontUpdate`
- return this value tandem with `isLastCalled`, to not to update the value of this instance, even when returning early;

```js
/**
 * @type {Object} 			 
 */
```
 - <i>example</i>:
```js 		 
 import { Signal, Derived } from  'vivth'; 			 
 			 
 const count = new Signal(0); 			 
 const double = new Derived(async({ 			 
 		subscribe, 			 
 		dontUpdate, 			 
 		isLastCalled, 			 
 	}) => { 			 
 		const currentValue = subscribe(count).value; 			 
 		if (!(await isLastCalled(10))) { 			 
 		return dontUpdate; 			 
 		} 			 
 		const res = await fetch(`some/path/${curentValue.toString()}`); 			 
 		if (!(await isLastCalled())) { 			 
 		return dontUpdate; // this will prevent race condition, even if the earlier fetch return late; 			 
 		} 			 
 		return res; 			 
 }); 			 
 			 
 count.value++;
 
```

#### reference:`Derived_instance.value:getter`
- the most recent value of the instance 	 
- can be turn into reactive with Effect or Derived instantiation; 	 
- initial value are always `undefined`, make sure to put a check before consuming(inside an `Effect`);

```js
/**
 * @returns {VALUE} 	 
 * @override
 */
```

#### reference:`Derived_instance.value:setter`
- Derived instance value cannot be manually assigned; 	 
- it's value should always be determined by it's own `derivedFunction`;

```js
/**
 * @private 	 
 * @type {VALUE} 	 
 * @override
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="effect">Effect</h2>


#### reference:`Effect`
- a class for creating effect;  
- compared to previous class <b>$</b> reactivity model, `Effect`:  
>- doesn't autosubscribe at first run;  
>- it is using passed <b>$</b> named `arg0` options as subscriber;  
>- doesn't block other queues during first run(previously blocks other queues to safely register signal autoscubscriber);  
>- now can dynamically subscribes to signal, even on conditionals, that are not run during first run;


#### reference:`Effect_instance.options`
- collections of lazy methods to handle effect calls of this instance;


#### reference:`Effect_instance.options.isLastCalled:getter`


```js
/**
 * @returns {(timeoutMS?:number)=>Promise<boolean>} 			 
 * - timeoutMS only necessary if the operation doesn't naturally await; 			 
 * - if it's operation such as `fetch`, you can just leave it blank; 			 
 */
```
 - <i>example</i>:
```js 		 
 			 
 import { Effect } from 'vivth'; 			 
 			 
 const effect = new Effect(async ({ isLastCalled }) => { 			 
 	if (!(await isLastCalled(100))) { 			 
 		return; 			 
 	} 			 
 	// OR 			 
 	const res = await fetch('some/path'); 			 
 	if (!(await isLastCalled( 			 
 		// no need to add timeoutMS argument, as fetch are naturally add delay; 			 
 	))) { 			 
 		return; 			 
 	} 			 
 })
 
```

#### reference:`Effect_instance.options.subscribe`
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @template V 			 
 * @param {Signal<V>} signal 			 
 * @returns {Signal<V>} 			 
 */
```
 - <i>example</i>:
```js 		 
 import { Effect } from 'vivth'; 			 
 			 
 const effect = new Effect(async () => { 			 
 	// code 			 
 }) 			 
 effect.options.subscribe(signalInstance);
 
```

#### reference:`Effect_instance.options.removeEffect`
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @type {()=>void} 			 
 */
```
 - <i>example</i>:
```js 		 
 import { Effect } from 'vivth'; 			 
 			 
 const effect = new Effect(async () => { 			 
 	// code 			 
 }) 			 
 effect.options.removeEffect();
 
```

#### reference:`new Effect`


```js
/**
 * @param {( arg0: 	 
 * Omit<Effect["options"], typeof unwrapLazy> 	 
 * ) => 	 
 * Promise<void>} effect 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal, Derived, Effect, Console } from  'vivth'; 	 
 	 
 const count = new Signal(0); 	 
 const double = new Derived( async({$}) => $(count).value * 2); // double listen to count changes 	 
 new Effect(async ({ 	 
 			subscribe, // : registrar callback for this effect instance, immediately return the signal instance 	 
 			removeEffect, // : disable this effect instance from reacting to dependency changes; 	 
 			isLastCalled, // : check whether this callback run is this instant last called effect; 	 
 		}) => { 	 
 			Console.log(subscribe(double).value); // effect listen to double changes 	 
 			const a = double.value; //  no need to wrap double twice with $ 	 
 }) 	 
 	 
 count.value++;
 
```

#### reference:`Effect_instance.run`
- normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;

```js
/**
 * @returns {void} 	 
 */
```
 - <i>example</i>:
```js  
 import { Effect } from 'vivth'; 	 
 	 
 const effect = new Effect(async ()=>{ 	 
 	// code 	 
 }) 	 
 effect.run();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="envsignal">EnvSignal</h2>


#### reference:`EnvSignal`
- uses [Signal](#signal) and [Derived](#derived) under the hood;

```js
/**
 * @template VALUE
 */
```

#### reference:`new EnvSignal`
- create `EnvSignal` instance;

```js
/**
 * @param {VALUE} initialValue
 */
```

#### reference:`EnvSignal_instance.env`
- exposed property to listen to;

```js
/**
 * @type {Derived<VALUE>} 	 
 */
```
 - <i>example</i>:
```js  
 import { EnvSignal, Effect } from 'vivth'; 	 
 	 
 export const myEnv = new EnvSignal(true); 	 
 new Effect(async ({ subscribe }) => { 	 
 	const myEnvValue = subscribe(myEnv.env).value; 	 
 	// code 	 
 })
 
```

#### reference:`EnvSignal_instance.correction`
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
 import { EnvSignal } from 'vivth'; 	 
 	 
 export const myEnv = new EnvSignal(true); 	 
 	 
 // somewhere else on the program 	 
 import { myEnv } from './myEnv.mjs' 	 
 	 
 myEnv.correction(false); // this will notify all subscribers;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="eventsignal">EventSignal</h2>


#### reference:`EventSignal`
- Signal implementation for `CustomEvent`, to dispatch and listen;  
- it's based on string as key, so it can be listened/dispatched even without direct instance reference;

```js
/**
 * @template {IsListSignal} ISLIST  
 * - boolean;
 */
```

#### reference:`EventSignal.map`
- `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;

```js
/**
 * @type {Map<string, EventSignal<any>>}
 */
```

#### reference:`EventSignal.get`
- the constructor it self is set to `private`; 	 
- it's globally queued: 	 
>- the `Promise` nature is to prevent race condition on creating the instance;

```js
/**
 * @param {string} stringName 	 
 * @param {IsListSignal} [isList_] 	 
 * @returns {Promise<EventSignal<any>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { EventSignal } from 'vivth'; 	 
 	 
 const myEventSignal = await EventSignal.get('dataEvent');
 
```

#### reference:`EventSignal_instance.dispatch`
- is [Signal](#signal) or [ListSignal](#listsignal) instance, depending on the `isList` argument; 	 
- if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time; 	 
- is `lazily` created;

```js
/**
 * @type {Signal<any>|ListSignal<any>} 	 
 */
```
 - <i>example</i>:
```js  
 import { EventSignal, Effect, Console } from 'vivth'; 	 
 	 
 const myEventSignal = await EventSignal.get('dataEvent', false); 	 
 	 
 new Effect(({ subscribe })=>{ 	 
 	const listenValue = subscribe(myEventSignal.dispatch).value; 	 
 	// dispatch can be used as two way communication; 	 
 	Console.log({ listenValue }); 	 
 }) 	 
 myEventSignal.dispatch.value = 'hey';
 
```

#### reference:`EventSignal_instance.listen`
- is [Derived](#derived) or [ListDerived](#listderived) instance, depending on the `isList` argument; 	 
- can be used as listener when passed down value shouldn't be modified manually; 	 
- is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;

```js
/**
 * @type {Derived<any>|ListDerived<any>} 	 
 */
```
 - <i>example</i>:
```js  
 import { EventSignal, Effect, Console } from 'vivth'; 	 
 	 
 const myEventSignal = await EventSignal.get('dataEvent', false); 	 
 	 
 new Effect(({ subscribe })=>{ 	 
 	const listenValue = subscribe(myEventSignal.listen).value; 	 
 	// listen can be used only as listener for one way communication; 	 
 	Console.log({ listenValue }); 	 
 }) 	 
 myEventSignal.dispatch.value = 'hey';
 
```

#### reference:`EventSignal.remove`
- methods of this static property is lazily created; 	 
- remove signal and effect subscription of the named `EventSignal_instance`;


#### reference:`EventSignal.remove.subscriber`
- remove subscriber from the named `EventSignal_instance`;

```js
/**
 * @param {string} name 		 
 * @param {import('./Effect.mjs').Effect} effect 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal } from 'vivth'; 		 
 		 
 EventSignal.remove.subscriber('yourEventSignalName', myEffectInstance);
 
```

#### reference:`EventSignal.remove.allSubscribers`
- remove all subscribers from the named `EventSignal_instance`;

```js
/**
 * @param {string} name 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal } from 'vivth'; 		 
 		 
 EventSignal.remove.allSubscribers('yourEventSignalName');
 
```

#### reference:`EventSignal.remove.refs`
- remove reference of the `proxySignals` of the named `EventSignal_instance`;

```js
/**
 * @param {string} name 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal } from 'vivth'; 		 
 		 
 EventSignal.remove.refs('yourEventSignalName');
 
```

#### reference:`EventSignal_instance.remove.subscriber`
- remove subscriber from the `EventSignal_instance`;

```js
/**
 * @param {import('./Effect.mjs').Effect} effect 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal, Effect, Console } from 'vivth'; 		 
 		 
 const myEventSignal = await EventSignal.get('dataEvent', false); 		 
 		 
 const myEffectInstance = new Effect(({ subscribe })=>{ 		 
 	const listenValue = subscribe(myEventSignal.dispatch).value; 		 
 	Console.log({ listenValue }); 		 
 }) 		 
 myEventSignal.dispatch.value = 'hey'; 		 
 eventSignal_instance.remove.subscriber(myEffectInstance);
 
```

#### reference:`EventSignal_instance.remove.allSubscribers`
- remove allSubscribers from the `EventSignal_instance`;

```js
/**
 * @type  {()=>void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal, Effect, Console } from 'vivth'; 		 
 		 
 const myEventSignal = await EventSignal.get('dataEvent', false); 		 
 		 
 const myEffectInstance = new Effect(({ subscribe })=>{ 		 
 	const listenValue = subscribe(myEventSignal.dispatch).value; 		 
 	Console.log({ listenValue }); 		 
 }) 		 
 myEventSignal.dispatch.value = 'hey'; 		 
 eventSignal_instance.remove.allSubscribers();
 
```

#### reference:`EventSignal_instance.remove.ref`
- remove reference of the `proxySignals` of the `EventSignal_instance`;

```js
/**
 * @type {()=>void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { EventSignal, Effect, Console } from 'vivth'; 		 
 		 
 const myEventSignal = await EventSignal.get('dataEvent', false); 		 
 		 
 const myEffectInstance = new Effect(({ subscribe })=>{ 		 
 	const listenValue = subscribe(myEventSignal.dispatch).value; 		 
 	Console.log({ listenValue }); 		 
 }); 		 
 		 
 eventSignal_instance.remove.ref();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="filesafe">FileSafe</h2>


#### reference:`FileSafe`
- collection of static methods of file access with added safety to mkdir before proceeding;


#### reference:`FileSafe.write`
- method to create file safely by recursively mkdir the dirname of the outFile; 	 
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<writeFile>[0]} outFile 	 
 * @param {Parameters<writeFile>[1]} content 	 
 * @param {Parameters<writeFile>[2]} [options] 	 
 * @returns {ReturnType<typeof TryAsync<void>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { join } from 'node:path'; 	 
 import { FileSafe, Paths } from 'vivth'; 	 
 	 
 const [, errorWrite] = await FileSafe.write( 	 
 	join(Paths.root, '/some/path.mjs'), 	 
 	`console.log("hello-world!!");`, 	 
 	{ encoding: 'utf-8' } 	 
 );
 
```

#### reference:`FileSafe.copy`
- method to copy file/dir safely by recursively mkdir the dirname of the dest; 	 
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<typeof copyFile>[0]} sourceFile 	 
 * @param {Parameters<typeof copyFile>[1]} destinationFile 	 
 * @param {Parameters<typeof copyFile>[2]} mode 	 
 * @returns {ReturnType<typeof TryAsync<void>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { join } from 'node:path'; 	 
 import { FileSafe, Paths } from 'vivth'; 	 
 	 
 const [, errorWrite] = await FileSafe.copy( 	 
 	join(Paths.root, '/some/path.mjs'), 	 
 	join(Paths.root, '/other/path.copy.mjs'), 	 
 	{ encoding: 'utf-8' } 	 
 );
 
```

#### reference:`FileSafe.rename`
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
 import { join } from 'node:path'; 	 
 import { FileSafe, Paths } from 'vivth'; 	 
 	 
 const [, errorRename] = await FileSafe.rename( 	 
 	join(Paths.root, 'some/path'), 	 
 	join(Paths.root, 'other/path'), 	 
 );
 
```

#### reference:`FileSafe.rm`
- function to remove dir and file; 	 
- also returning promise of result & error as value;

```js
/**
 * @param {Parameters<rm>[0]} path 	 
 * @param {Parameters<rm>[1]} [rmOptions] 	 
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
```

#### reference:`FileSafe.mkdir`
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
 import { join } from 'node:path'; 	 
 import { FileSafe, Paths } from 'vivth'; 	 
 	 
 const [str, errorMkDir] = await FileSafe.mkdir(join(Paths.root, '/some/path/example'));
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="listderived">ListDerived</h2>


#### reference:`ListDerived`
- class to create `dervivedList` that satisfy `Array<Record<string, string>>`;  
- usefull for `derivedLoops`, e.g. temporary search values;  
- is a `Derived` instance;

```js
/**
 * @template {ListArg} LISTARG  
 * @extends {Derived<LISTARG[]>}
 */
```

#### reference:`new ListDerived`


```js
/**
 * @param {(effectInstanceOptions:Omit<Effect["options"], 	 
 * unwrapLazy>)=> 	 
 * Promise<LISTARG[]>} derivedFunction 	 
 */
```
 - <i>example</i>:
```js  
 import { ListSignal, ListDerived } from 'vivth'; 	 
 	 
 const listExample = new ListSignal([ 	 
 	{key1: "test1"}, 	 
 	{key1: "test2"}, 	 
 ]); 	 
 	 
 export const listDerivedExample = new ListDerived(async({ subscribe }) => { 	 
 	// becarefull to not mutate the reference value 	 
 	return subscribe(listExample).value.filter((val) => { 	 
 		// subscribe(listExample).structuredClone can be used as alternative 	 
 		// filter logic 	 
 	}) 	 
 });
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="listsignal">ListSignal</h2>


#### reference:`ListSignal`
- class to create list that satisfy `Array<Record<string, string>>`.

```js
/**
 * @template {import('../types/ListArg.mjs').ListArg} LISTARG  
 * @extends {Signal<LISTARG[]>}
 */
```

#### reference:`ListSignal.isValid`
- Checks if the input is an array whose first item (if present) is a plain object 	 
- with string keys and string values. Allows empty arrays.

```js
/**
 * @param {unknown} value - The value to validate. 	 
 * @returns {value is Array<Record<string, string>>} True if the first item is a valid string record or array is empty.
 */
```

#### reference:`new ListSignal`
- usefull for `loops`;

```js
/**
 * @param {LISTARG[]} [value] 	 
 */
```
 - <i>example</i>:
```js  
 import { ListSignal } from 'vivth'; 	 
 	 
 const listExample = new ListSignal([ 	 
      {key1: "test1",}, 	 
      {key1: "test2",}, 	 
 ]);
 
```

#### reference:`ListSignal_instance.value:getter`
- reference to original inputed `value`;

```js
/**
 * @returns {LISTARG[]} 	 
 * @override
 */
```

#### reference:`ListSignal_instance.value:setter`
- you cannot mannually set`value` `ListSignal_instance`;

```js
/**
 * @private 	 
 * @type {LISTARG[]} 	 
 * @override
 */
```

#### reference:`ListSignal_instance.arrayMethods`
- methods collection that mimics `Array` API; 	 
- calling this methods will notify subscribers for changes, except for some;


#### reference:`ListSignal_instance.arrayMethods.structuredClone:getter`
- reference to structuredClone elements of `value`; 			 
- calling doesn't notify

```js
/**
 * @returns {Array<LISTARG>}
 */
```

#### reference:`ListSignal_instance.arrayMethods.push`
- appends new elements to the end;

```js
/**
 * @param {...LISTARG} listArg 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.shift`
- removes the first element;

```js
/**
 * @type {()=>void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.unshift`
- inserts new element at the start;

```js
/**
 * @param  {...LISTARG} listArg 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.slice`
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

#### reference:`ListSignal_instance.arrayMethods.replace`
- replace whole `List` data with new array.

```js
/**
 * @param {LISTARG[]} listArgs 			 
 * - new array in place of the deleted array. 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.splice`
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

#### reference:`ListSignal_instance.arrayMethods.swap`
- swap `List` data between two indexes;

```js
/**
 * @param {number} indexA 			 
 * @param {number} indexB 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.modify`
- modify `List` element at specific index;

```js
/**
 * @param {number} index 			 
 * @param {Partial<LISTARG>} listArg 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.remove`
- remove `List` element at specific index;

```js
/**
 * @param {number} index 			 
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.reverse`
- reverses the elements in an `List` in place.

```js
/**
 * @returns {void}
 */
```

#### reference:`ListSignal_instance.arrayMethods.pop`
- removes the last element;

```js
/**
 * @returns {void}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="litexp">LitExp</h2>


#### reference:`LitExp`
- class helper to created opionated regex helper;  
- named capture uses `es6+` feature, you might need to add polyfill to target extremely old browser;  
- class name refer to `Literal Expression`;  
- please be patient when using this class;  
>- destructuring is meant for extensive typehelper;  
>- and destructuring can lead to unhandled error here and there;  
>- therefore error as value is introduced to help to prevent error on runtime;

```js
/**
 * @template {LitExpKeyType} KEYS
 */
```

#### reference:`LitExp.escape`
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
 import { LitExp } from 'vivt'; 	 
 	 
 const escapedLiteral = LitExp.escape(`something[][;alerk325]`); 	 
 new RegExp(escapedLiteral, 'g');
 
```

#### reference:`LitExp.prepare`
- constructor helper; 	 
- under the hood it is an abstraction of `RegExp`, with more template literal touch; 	 
>- you can apply inline `RegExp` features on the string template literal(as constructor RegExp arg0); 	 
>>- by doing so you are opting in to make: 	 
>>>- your regex detection more robust; but 	 
>>>- `litExp_instance.make.string` to be `unusable`; 	 
>>- also mind the needs of escape for special characters;

```js
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
```
 - <i>example</i>:
```js  
 import { LitExp } from 'vivth'; 	 
 	 
 (()=>{ 	 
 	const [liteal, errorPrep] = LitExp.prepare({ 	 
 		myKey: /myCustomCapture/, // is placed on (?<myKey>myCustomCapture) 	 
 		// use false to place "[\\s\\S]*?" instead; 	 
 		...keyCaptureLogicPair 	 
 	}) 	 
 	if (errorPrep) { 	 
 		console.error(error); 	 
 		return; 	 
 	} 	 
 	 const litExp_instance = liteal`templateLiteral:${'myKey'};` 	 
 	// recommended to end the template literal with any string but `key`; 	 
 })()
 
```

#### reference:`LitExp_instance.make`
- instance methods for generating things;


#### reference:`LitExp_instance.make.string`
- to make string based on the template literal;

```js
/**
 * @param {Partial<{ [K in keyof KEYS]?: string }>} overrides 			 
 * @returns {string|undefined} 			 
 */
```
 - <i>example</i>:
```js 		 
 import { LitExp } from 'vivth'; 			 
 			 
 const [literal, errorPreparing] = LitExp.prepare({ 			 
 	myKey: false, 			 
 	...keyCaptureLogicPair 			 
 }) 			 
 			 
 // asuming no error 			 
 litExp_instance = `templateLiteral:${'myKey'};`; 			 
 const [result, error] = litExp_instance.make.string({ 			 
 	myKey: 'actualvalue', 			 
 }); 			 
 			 
 console.log(result); // "templateLiteral:actualvalue;"
 
```

#### reference:`LitExp_instance.evaluate`
- methods collections to evaluate string with `Literal Expression`;


#### reference:`LitExp_instance.evaluate.execGroups`
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
 * - true: add `^` and `<h2 id="litexp">LitExp</h2>

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
 import { LitExp } from 'vivth'; 			 
 			 
 const [literal, errorPreparing] = LitExp.prepare({ 			 
 	myKey: false, 			 
 	...keyCaptureLogicPair 			 
 }) 			 
 			 
 // asuming no eror 			 
 const litExp_instance = literal`templateLiteral:${'myKey'};` 			 
 			 
 const [{ 			 
 		result:{ // asuming there's no error 			 
 			named: { myKey }, 			 
 			whole, 			 
 		}, 			 
 		regex, // for reference 			 
 	}, error] = litExp_instance.evaluate.execGroups( 			 
 	`templateLiteral:Something;`, 			 
 	{ ...options } 			 
 ) 			 
 			 
 console.log(whole); // "templateLiteral:Something;" 			 
 console.log(myKey); // "Something"
 
```

#### reference:`LitExp_instance.evaluate.matchedAllAndGrouped`
- to match all and grouped based on `key`;

```js
/**
 * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0]} string 			 
 * @param {Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], 'absoluteLeadAndFollowing'>} options 			 
 * @returns {ReturnType<typeof TrySync<import('../types/LitExpResultType.mjs').LitExpResultType<KEYS>>> 			 
 * } 			 
 */
```
 - <i>example</i>:
```js 		 
 import { LitExp, Console } from 'vivth'; 			 
 			 
 const [literal, errorPreparing] = LitExp.prepare({ 			 
 	myKey: false, 			 
 	...keyCaptureLogicPair 			 
 }) 			 
 			 
 // asuming no error; 			 
 litExp_instance = literal`templateLiteral:${'myKey'};` 			 
 			 
 const [resultOfMatchedAllAndGrouped, error] = litExp_instance.evaluate.matchedAllAndGrouped( 			 
 	`templateLiteral:Something; 			 
 	templateLiteral:SomethingElse;`, 			 
 	{ ...options } 			 
 ) 			 
 (()=>{ 			 
 	if (error) { 			 
 		Console.error(error); 			 
 		return; 			 
 	} 			 
 	const { 			 
 		result: { whole, named }, 			 
 		regexp 			 
 	} = resultOfMatchedAllAndGrouped; 			 
 			 
 named.foreach(({myKey})=>{ 			 
 	// code 			 
 }) 			 
 whole.foreach((capturedString)=>{ 			 
 	// code 			 
 }) 			 
 })()
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="paths">Paths</h2>


#### reference:`Paths`
- class helpers to define pathReference;  
- is a singleton;  
- most of functionality need to access `Paths.root`, if you get warning, you can instantiate `Paths` before running anything;


#### reference:`new Paths`


```js
/**
 * @param {Object} options 	 
 * @param {string} options.root 	 
 * - browser: 	 
 * ```js 	 
 * location.origin 	 
 * ``` 	 
 * - node/bun compatible: 	 
 * ```js 	 
 * process?.env?.INIT_CWD ?? process?.cwd() 	 
 * ``` 	 
 * - deno: need for `deno run --allow-env --allow-read your_script.ts`: 	 
 * ```js 	 
 * Deno.env.get("INIT_CWD") ?? Deno.cwd() 	 
 * ``` 	 
 * - pkg: 	 
 * ```js 	 
 * __dirname 	 
 * ``` 	 
 * - other: you need to check your JSRuntime for the rootPath reference; 	 
 */
```
 - <i>example</i>:
```js  
 import { Paths } from 'vivth'; 	 
 	 
 new Paths({ 	 
 	root: location.origin, 	 
 })
 
```

#### reference:`Paths.root:getter`
- reference for rootPath 	 
- `Paths` needed to be instantiated via: 	 
>- `Paths` constructor; 	 
>- `Setup.paths` constructor;

```js
/**
 * @type {string|undefined}
 */
```

#### reference:`Paths.normalize`
- normalize path separator to forward slash `/`;

```js
/**
 * @param {string} path_ 	 
 * @returns {string} 	 
 */
```
 - <i>example</i>:
```js  
 import { Paths } from 'vivth'; 	 
 	 
 Paths.normalize('file:\\D:\\myFile.mjs'); //  "file://D://myFile.mjs"
 
```

#### reference:`Paths.normalizesForRoot`
- normalize path separator to forward slash `/`; 	 
- then starts with forward slash `/`;

```js
/**
 * @param {string} path_ 	 
 * @returns {`/${string}`} 	 
 */
```
 - <i>example</i>:
```js  
 import { Paths } from 'vivth'; 	 
 	 
 Paths.normalizesForRoot('path\\myFile.mjs'); //  "/path/myFile.mjs"
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="qchannel">QChannel</h2>


#### reference:`QChannel`
- class for `Queue` handling;

```js
/**
 * @template {AnyButUndefined} DEFINEDANY
 */
```

#### reference:`QChannel.makeQClass`
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
 import { QChannel } from 'vivth'; 	 
 	 
 const myMappedQref = (window['myMappedQref'] = new Map()); 	 
 export const MyQClass = QChannel.makeQClass(myMappedQref);
 
```

#### reference:`QChannel.fifo`
- first in first out handler


#### reference:`QChannel.fifo.key`
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

#### reference:`QChannel.fifo.callback`
- blocks execution for subsequent calls until the current one finishes.

```js
/**
 * @template RESULT 			 
 * @param {()=>Promise<RESULT>} asyncCallback 			 
 * @returns {Promise<[RESULT|undefined, Error|undefined]>} 			 
 */
```
 - <i>example</i>:
```js 		 
 const [result, error] = await QChannel.fifo.callback(async () = > { 			 
 	// code 			 
 })
 
```

#### reference:`QChannel_instance.close`
- disable queue; 	 
- when `closed`, `isLastOnQ` will allways return `false`;

```js
/**
 * @returns {void}
 */
```

#### reference:`QChannel_instance.open`
- enable queue; 	 
- when `opened`, `isLastOnQ` will evaluate whether calls are actually the last of queue;

```js
/**
 * @returns {void}
 */
```

#### reference:`QChannel_instance.key`
- each `QChannelInstance` are managing it's own `queue`, and will not `await` for other `QChannelInstance`; 	 
- caveat: 	 
>- need to manually call resume(); 	 
>- slightly more performant than `callback`;

```js
/**
 * @param {DEFINEDANY} keyID 	 
 * @returns {Promise<QCBReturn>} 	 
 */
```
 - <i>example</i>:
```js  
 const q = new QChannel('channel name'); 	 
 const handler = async () => { 	 
 	const { resume, isLastOnQ } = await q.key(keyID); 	 
 	// if (!isLastOnQ()) { // imperative debounce if needed 	 
 	// 	resume(); 	 
 	// 	return; 	 
 	// } 	 
 	// don't forget to call resume before any returns; 	 
 	// blocks only if keyID is the same, until resume is called; 	 
 	resume(); // don't forget to call resume before any returns; 	 
 	return 'something'; 	 
 } 	 
 handler();
 
```

#### reference:`QChannel_instance.callback`
- `callbackBlock` with error as value: 	 
- caveat: 	 
>- no need to manually call resume(); 	 
>- slightly less performant than `callback`;

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
 const q = new QChannel('channel name'); 	 
 const [result, error] = await q.callback(keyID, async ({ isLastOnQ }) = > { 	 
 	// if (!isLastOnQ()) { // imperative debounce if needed 	 
 	// 	return; 	 
 	// } 	 
 	// code 	 
 })
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="safeexit">SafeExit</h2>


#### reference:`SafeExit`
- class helper for describing how to Safely Response on exit events  
- singleton;  
- most of functionality might need to access `SafeExit.instance.exiting`, if you get warning, you can instantiate `SafeExit` before running anything;


#### reference:`SafeExit.instance`
- only accessible after instantiation;

```js
/**
 * @type {SafeExit|undefined}
 */
```

#### reference:`new SafeExit`


```js
/**
 * @param {Object} options 	 
 * @param {[string, ...string[]]} options.eventNames 	 
 * - eventNames are blank by default, you need to manually name them all; 	 
 * - 'exit' will be omited, as it might cause async callbacks failed to execute; 	 
 * - example: 	 
 * ```js 	 
 *  ['SIGINT', 'SIGTERM'] 	 
 * ``` 	 
 * @param {()=>void} options.terminator 	 
 * - standard node/bun: 	 
 * ```js 	 
 * () => process.exit(0), 	 
 * ``` 	 
 * - Deno: 	 
 * ```js 	 
 * () => Deno.exit(0), 	 
 * ``` 	 
 * @param {(eventName:string)=>void} [options.listener] 	 
 * - default value 	 
 * ```js 	 
 * (eventName) => { 	 
 * 	process.once(eventName, function () { 	 
 * 		SafeExit.instance.exiting.correction(true); 	 
 * 		Console.log(`safe exit via "${eventName}"`); 	 
 * 	}); 	 
 * }; 	 
 * ``` 	 
 * - example Deno: 	 
 * ```js 	 
 * (eventName) => { 	 
 * 	const sig = Deno.signal(eventName); 	 
 * 		for await (const _ of sig) { 	 
 * 			exiting.correction(true); 	 
 * 			sig.dispose(); 	 
 * 			Console.log(`safe exit via "${eventName}"`); 	 
 * 		} 	 
 * } 	 
 * ``` 	 
 * - if your exit callback doesn't uses `process` global object you need to input on the SafeExit instantiation 	 
 */
```
 - <i>example</i>:
```js  
 import { SafeExit, Console } from 'vivth'; 	 
 	 
 new SafeExit({ 	 
 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames], 	 
 	terminator : () => process.exit(0), // OR on deno () => Deno.exit(0), 	 
 	// optional deno example 	 
 	listener : (eventName) => { 	 
 		const sig = Deno.signal(eventName); 	 
 			for await (const _ of sig) { 	 
 				exiting.correction(true); 	 
 				sig.dispose(); 	 
 				Console.log(`safe exit via "${eventName}"`); 	 
 			} 	 
 	} 	 
 });
 
```

#### reference:`SafeExit_instance.exiting`
- optional exit event registration, by listening to it inside an `Effect`; 	 
- when the value is `true`, meaning program is exitting;

```js
/**
 * @type {EnvSignal<boolean>}
 */
```

#### reference:`SafeExit_instance.addCallback`
- optional exit event registration; 	 
- the callbacks will be called when exiting;

```js
/**
 * @param {()=>(Promise<void>)} cb 	 
 */
```
 - <i>example</i>:
```js  
 import { SafeExit } from 'vivth'; 	 
 	 
 const exitCallback () => { 	 
 	// code 	 
 } 	 
 SafeExit.instance.addCallback(exitCallback);
 
```

#### reference:`SafeExit_instance.removeCallback`
- optional exit event removal; 	 
- the callbacks will be removed from registered via `addCallback` exiting;

```js
/**
 * @param {()=>(Promise<void>)} cb 	 
 */
```
 - <i>example</i>:
```js  
 import { SafeExit } from 'vivth'; 	 
 	 
 const exitCallback () => { 	 
 	// code 	 
 } 	 
 SafeExit.instance.addCallback(exitCallback); 	 
 	 
 SafeExit.instance.removeCallback(exitCallback);
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="setup">Setup</h2>


#### reference:`Setup`
- class with collections of methods/constructors for setting up necessary variables for vivth internal functionalities;


#### reference:`Setup.safeExit`
- proxy `SafeExit_instance` for Setup


 - <i>example</i>:
```js  
 import { Setup, Console } from 'vivth'; 	 
 	 
 new Setup.safeExit({ 	 
 	// eventNames are blank by default, you need to manually name them all; 	 
 	// 'exit' will be omited, as it might cause async callbacks failed to execute; 	 
 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames], 	 
 	terminator = () => process.exit(0), // OR on deno () => Deno.exit(0), 	 
 	// optional deno example 	 
 	listener = (eventName) => { 	 
 		const sig = Deno.signal(eventName); 	 
 			for await (const _ of sig) { 	 
 				exiting.correction(true); 	 
 				sig.dispose(); 	 
 				Console.log(`safe exit via "${eventName}"`); 	 
 			} 	 
 	} 	 
 });
 
```

#### reference:`Setup.paths`
- proxy `Paths_instance` for Setup;


 - <i>example</i>:
```js  
 import { Setup } from 'vivth'; 	 
 	 
 new Setup.paths({ 	 
 	root: location.origin, // browser example 	 
 })
 
```

#### reference:`Setup.workerMain`
- proxy `WorkerMainThread_instance` for Setup;


 - <i>example</i>:
```js  
 import { Setup } from 'vivth'; 	 
 import { Worker } from 'node:worker_threads'; 	 
 	 
 Setup.workerMain({ 	 
 	workerClass: Worker, 	 
 	basePath: 'public/assets/js/workers', 	 
 	pathValidator: async (workerPath, root, base) => { 	 
 		const res = await fetch(`${root}/${base}/${workerPath}`); 	 
 		// might also check wheter it need base or not 	 
 		return await res.ok; 	 
 	}, 	 
 });
 
```

#### reference:`Setup.workerThread`
- correct `parentPort` reference when needed; 	 
- export to create new reference to be use to create new WorkerThread instance;


 - <i>example</i>:
```js  
 import { Setup } from 'vivth'; 	 
 import { parentPort } from 'node:worker_threads'; 	 
 	 
 export const MyWorkerThreadRef = Setup.workerThread({parentPort}); 	 
 // that is the default value, if your parentPort/equivalent API is not that; 	 
 // you need to call this method;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="signal">Signal</h2>


#### reference:`Signal`
- a class for creating effect to signals;

```js
/**
 * @template VALUE
 */
```

#### reference:`new Signal`
- create a `Signal`;

```js
/**
 * @param {VALUE} value 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal, Effect } from  'vivth'; 	 
 	 
 const count = new Signal(0);
 
```

#### reference:`Signal_instance.subscribers`
- subsrcibers reference of this instance;


#### reference:`Signal_instance.subscribers.setOf`
- subscribedEffects

```js
/**
 * @type {Set<Effect>}
 */
```

#### reference:`Signal_instance.subscribers.notify`
- manually notify on non primitive value or value that have depths;

```js
/**
 * @param {(options:{signalInstance:Signal<VALUE>})=>Promise<void>} [callback] 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
 import { Signal } from 'vivth'; 		 
 		 
 // for deep signal like array or object you can: 		 
 const arraySignal = new Signal([1,2]); 		 
 arraySignal.value.push(3); 		 
 arraySignal.subscribers.notify(); 		 
 		 
 // OR for more complex mutation: 		 
 const objectSignal = new Signal({a:'test', b:'test'}); 		 
 objectSignal.subscribers.notify(async ({ signalInstance }) => { 		 
 	signalInstance.value['c'] = 'testc'; 		 
 	signalInstance.value['d'] = 'testd'; 		 
 });
 
```

#### reference:`Signal_instance.remove`
- collection of remove methods


#### reference:`Signal_instance.remove.subscriber`
- remove effect subscriber to react from this instance value changes;

```js
/**
 * @param {Effect} effectInstance 		 
 * @returns {void}
 */
```

#### reference:`Signal_instance.remove.allSubscribers`
- remove all effect subscribers to react from this instance value changes;

```js
/**
 * @type {()=>void}
 */
```

#### reference:`Signal_instance.remove.ref`
- remove this instance from `vivth` reactivity engine, and nullify it's own value;

```js
/**
 * @type {()=>void}
 */
```

#### reference:`Signal_instance.prev:getter`
- value before change;

```js
/**
 * @returns {VALUE|undefined}
 */
```

#### reference:`Signal_instance.value:getter`
- value after change;

```js
/**
 * @returns {VALUE} 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal, Effect, Derived } from  'vivth'; 	 
 	 
 const count = new Signal(0); 	 
 count.value; // not reactive 	 
 	 
 new Effect(async ({ subscribe }) =>{ 	 
 	const countValue = subscribe(count).value; // reactive 	 
 }) 	 
 const oneMoreThanCount = new Derived(async ({ subscribe }) =>{ 	 
 	return subscribe(count).value + 1; // reactive 	 
 })
 
```

#### reference:`Signal_instance.value:setter`
- assign new value then automatically notify all subscribers;

```js
/**
 * @type {VALUE} 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal } from  'vivth'; 	 
 	 
 const count = new Signal(0); 	 
 count.value++; 	 
 // OR 	 
 count.value = 9;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="workermainthread">WorkerMainThread</h2>


#### reference:`WorkerMainThread`
- class helper to create `Worker` instance;  
- before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;

```js
/**
 * @template {WorkerThread<any, any>} WT
 */
```

#### reference:`WorkerMainThread.setup`
- need to be called first, before any `WorkerMainThread` instantiation:

```js
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
```
 - <i>example</i>:
```js  
 import { Worker } from 'node:worker_threads'; 	 
 import { WorkerMainThread } from 'vivth'; 	 
 	 
 WorkerMainThread.setup({ 	 
 	workerClass: Worker, 	 
 	pathValidator: async ({worker, root}) => { 	 
 		const res = await fetch(`${root}/${worker}`); 	 
 		if (res.ok) { 	 
 			return res 	 
 		} 	 
 		const res2 = await fetch(`${root}/someAdditionalPath/${worker}`); 	 
 		if (res2.ok) { 	 
 			return res2 	 
 		} 	 
 	}, 	 
 });
 
```

#### reference:`WorkerMainThread.workerClass`
- reference for `Worker` class; 	 
- edit via `setup`;

```js
/**
 * @type {typeof Worker|typeof import('worker_threads').Worker}
 */
```

#### reference:`WorkerMainThread.pathValidator`
- reference for validating path; 	 
- edit via `setup`;

```js
/**
 * @type {(paths:{worker: string, root:string})=>Promise<string>}
 */
```

#### reference:`WorkerMainThread.newVivthWorker`
- create Worker_instance;

```js
/**
 * @param {string} handler 	 
 * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options] 	 
 * @returns {WorkerMainThread<WT>} 	 
 */
```
 - <i>example</i>:
```js  
 import { WorkerMainThread } from 'vivth'; 	 
 	 
 export const myDoubleWorker = WorkerMainThread.newVivthWorker('./doubleWorkerThread.mjs');
 
```

#### reference:`WorkerMainThread_instance.terminate`
- terminate all signals that are used on this instance;

```js
/**
 * @type {()=>void}
 */
```

#### reference:`WorkerMainThread_instance.receiverSignal`
- result signal of the processed message;

```js
/**
 * @type {Derived<WorkerResult<WT["POST"]>>} 	 
 */
```
 - <i>example</i>:
```js  
 import { Effect } from 'vivth'; 	 
 import { myDoubleWorker } from './myDoubleWorker.mjs'; 	 
 	 
 const doubleReceiverSignal = myDoubleWorker.receiverSignal; 	 
 new Effect(async({ subscribe }) => { 	 
 	const value = subscribe(doubleReceiverSignal).value; 	 
 	// code 	 
 })
 
```

#### reference:`WorkerMainThread_instance.postMessage`
- callback to send message to the worker thread;

```js
/**
 * @type {(event: WT["RECEIVE"])=>void} 	 
 */
```
 - <i>example</i>:
```js  
 import { myDoubleWorker } from './myDoubleWorker.mjs'; 	 
 	 
 myDoubleWorker.postMessage(90);
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="base64url">Base64URL</h2>


#### reference:`Base64URL`
- create inline base64 url;  
- usage:  
>- can be extremely usefull to display file on desktop app webview, without exposing http server;

```js
/**
 * @param {string} fileString  
 * @param {string} mimeType  
 * @param {(string:string)=>string} btoaFunction  
 * - check your js runtime `btoa`;  
 * - node compatible:  
 * ```js  
 * (str, prevBufferEncoding) =>  
 * 	Buffer.from(str, prevBufferEncoding).toString('base64')  
 * ```  
 * @returns {string}  
 */
```
 - <i>example</i>:
```js 
 import { Base64URL } from 'vivth'  
 import fileString from './fileString.mjs';  
  
 Base64URL(fileString, 'application/javascript', btoa);
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="base64urlfromfile">Base64URLFromFile</h2>


#### reference:`Base64URLFromFile`
- create inline base64 url;  
- usage:  
>- can be extremely usefull to display file on desktop app webview, without exposing http server;  
>- when using `FSInline`, use [Base64URL](#base64url) instead;

```js
/**
 * @param {string} filePath  
 * @returns {Promise<string>}  
 */
```
 - <i>example</i>:
```js 
 import { join } from 'node:path'  
  
 import { Base64URLFromFile, Paths } from 'vivth'  
  
 await Base64URLFromFile(join(Paths.root, '/path/to/file'));
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="eventnamespace">EventNameSpace</h2>


#### reference:`EventNameSpace`
- namespacing for event, string as ID, related API;

```js
/**
 * @type {'vivthEvent'}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="jsautodoc">JSautoDOC</h2>


#### reference:`JSautoDOC`
- class for auto documenting mjs package/project, using jsdoc;  
- this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;  
- this class also is used to generate this `README.md`;  
- behaviours:  
>1) add `"at"noautodoc` on self closing jsdoc comment to opt out from generating documentation on said file;  
>>- auto export must follows the following rules, and there's no way to override;  
>2) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.pahts.file`;  
>3) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.pahts.file`;  
>4) create `README.md` based on, `options.paths.dir` and `README.src.md`;  
>5) extract `"at"description` jsdoc:  
>>- on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;  
>>- `"at"description` are treated as plain `markdown`;  
>>- first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;  
>>- `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;  
>>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` documentation/generation results;  
>6) this types of arrow functions will be converted to regullar function, for concise type emition:  
>>- validly exported function;  
>>- static/instance method(s) with generic template;  
>7) transpile `.ts` and `.mts` to `.mjs` same name and directory;


#### reference:`new JSautoDOC`


```js
/**
 * @param {Object} [options] 	 
 * @param {Object} [options.paths] 	 
 * @param {string} options.paths.file 	 
 * - entry point; 	 
 * @param {string} options.paths.readMe 	 
 * - readme target; 	 
 * @param {string} options.paths.dir 	 
 * - source directory; 	 
 * @param {string} [options.copyright] 	 
 * @param {string} [options.tableOfContentTitle] 	 
 * @param {import('chokidar').ChokidarOptions} [options.option] 	 
 * - ChokidarOptions; 	 
 */
```
 - <i>example</i>:
```js  
 import { JSautoDOC } from 'vivth'; 	 
 	 
  new JSautoDOC({ 	 
 	paths: { dir: 'src', file: 'index.mjs', readMe: 'README.md' }, 	 
 	copyright: 'this library is made and distributed under MIT license;', 	 
 	tableOfContentTitle: 'list of exported API and typehelpers', 	 
 }); 	 
  
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="createimmutable">CreateImmutable</h2>


#### reference:`CreateImmutable`
- function for create immutable object;  
- usefull for binding immutable object to global for shared object:  
>- e.g. to window object in browser;

```js
/**
 * @template {Object} PARENT  
 * @template {Object} OBJECT  
 * @param {string} keyName  
 * @param {PARENT} parent  
 * @param {(this:PARENT)=>OBJECT} object  
 * @param {Object} [options]  
 * @param {boolean} [options.lazy]  
 * @return {OBJECT}  
 */
```
 - <i>example</i>:
```js 
 import { CreateImmutable } from 'vivth';  
  
 const mappedObject = new Map();  
  
 CreateImmutable(window, 'mySharedObject', {  
 	setMap(name_, value) => {  
 		mappedObject.set(name_, value)  
 	},  
 	getMap(name_) => mappedObject.get(name_),  
 })
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="eventcheck">EventCheck</h2>


#### reference:`EventCheck`
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
 import { EventCheck } from 'vivth';  
 import { incomingMessage } from './some/where.mjs';  
  
 const eventObjectPayload = EventObject('worker:exit');  
 // assuming `incomingMessage`, also created using EventObject('worker:exit');  
 // or manually {[EventNameSpace]:'worker:exit'};  
 // which either will result true;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="eventobject">EventObject</h2>


#### reference:`EventObject`
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
 import { EventCheck } from 'vivth';  
 import { incomingMessage } from './some/where.mjs';  
  
 const eventObjectPayload = EventObject('worker:exit');  
 // assuming `incomingMessage`, also created using EventObject('worker:exit');  
 // or manually {[EventNameSpace]:'worker:exit'};  
 // which either will result true;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="getruntime">GetRuntime</h2>


#### reference:`GetRuntime`
- detects the current JavaScript runtime;

```js
/**
 * @type {()=>Runtime}  
 */
```
 - <i>example</i>:
```js 
 import { GetRuntime } form 'vivth';  
  
 const runtime = GetRuntime();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="isasync">IsAsync</h2>


#### reference:`IsAsync`
- function helper for checking whether `functionReference` is async;

```js
/**
 * @param {(...any:any)=>(any|Promise<any>)} functionReference  
 * @returns {boolean}  
 */
```
 - <i>example</i>:
```js 
 import { IsAsync } from 'vivth';  
  
 const a = function (params) {  
 	// code  
 }  
 const b = async () => {  
 	// code  
 }  
  
 IsAsync(a); // false  
 IsAsync(b); // true
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="lazyfactory">LazyFactory</h2>


#### reference:`LazyFactory`
- function helper for creating lazyObject:  
>- usefull for lazily instantiating an object, since instance naturally have props/methods;

```js
/**
 * @template FACTORY  
 * @param {() => FACTORY} factory  
 * @returns {FACTORY & {[unwrapLazy]: ()=> FACTORY}}  
 * - the unwrapLazy prop can be accessed to force instatiation/call;  
 * >- `unwrapLazy` prop name can be checked by checking the list of possible prop, from your ide;  
 * >- as of version `1.0.0`, value is `vivth:unwrapLazy;`;  
 */
```
 - <i>example</i>:
```js 
 import { LazyFactory } from  'vivth';  
  
 class MyClass{  
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
 import { myInstance } from './myInstance.mjs';  
  
 const a = myInstance; // not yet initiated;  
 const b = a.myProp // imediately initiated;  
 // OR  
 myInstance["vivth:unwrapLazy;"]() // forcefully call the callback;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="timeout">Timeout</h2>


#### reference:`Timeout`
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
 import { Timeout } from 'vivth';  
  
 const test = async () => {  
   // code0  
   await Timeout(1000);  
   // code1  
 }  
 test();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="try">Try</h2>


#### reference:`Try`
- function for error as value for chained operations;  
- utility function to brute force which key is able to run;  
- usefull to flatten indentation for error handlings;  
- caveat:  
>- run in sequence, awaiting each key bofore running next key;

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
 * 	| [[undefined, undefined], Error|undefined]  
 * >}  
 */
```
 - <i>example</i>:
```js 
 import { Try } from 'vivth';  
  
 const [[key, result], error] = await Try({  
 	someRuntime: async ( prevError ) => {  
 		// asuming on this one doesn't naturally throw error,  
 		// yet you need to continue to next key,  
 		// instead of returning,  
 		// you should throw new Error(something);  
 	},  
 	browser: async ( prevError ) => {  
 		return location?.origin;  
 		// if no error, stop other key function from running;  
 		// key = 'browser'  
 		// result = location?.origin;  
 		// error = undefined;  
 		// if error;  
 		// run nodeOrBun;  
 	},  
 	nodeOrBun: async ( prevError ) => {  
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

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="tryasync">TryAsync</h2>


#### reference:`TryAsync`
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
 import { TryAsync } from 'vivth';  
  
 let [res, error] = await TryAsync(async () => {  
 	return await fetch('./someAPI/Path');  
 });  
  
 [res, error] = await TryAsync(async () => {  
 	if(!res.ok) {  
 		throw new Error(404);  
 	}  
 	return await res.json();  
 })
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="trysync">TrySync</h2>


#### reference:`TrySync`
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
 import { readFileSync } from 'fs';  
 import { TrySync } from './yourModule.js';  
  
 const [data, error] = TrySync(() => {  
 	return readFileSync('./some/file.txt', 'utf-8');  
 });
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="tstomjs">TsToMjs</h2>


#### reference:`TsToMjs`
- turn `.mts`||`.ts` file into `.mjs`, no bundling, just translation;  
- on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;  
>- uses `"at"preserve` to register `jsdoc` inline;

```js
/**
 * @param {string} path_  
 * - path from `Paths.root`;  
 * @param {Object} [options]  
 * @param {string} [options.overrideDir]  
 * - default: write conversion to same directory;  
 * - path are relative to project root;  
 * @param {BufferEncoding} [options.encoding]  
 * - default: `utf-8`;  
 * @returns {Promise<void>}  
 */
```
 - <i>example</i>:
```js 
 import { TsToMjs } from 'vivth';  
  
 TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideDir: './other/dir' });
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="anybutundefined">AnyButUndefined</h2>

- jsdoc types:

```js
/**
 * - type helper for ID or objects;
 * @typedef {{}|null|number|string|boolean|symbol|bigint|function} AnyButUndefined
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="extnametype">ExtnameType</h2>

- jsdoc types:

```js
/**
 * - jsRuntime extention naming convention;
 * @typedef {`.${string}`} ExtnameType
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="islistsignal">IsListSignal</h2>

- jsdoc types:

```js
/**
 * - `EnvSignal.get` argument whether signal need to be a list or not;
 * @typedef {boolean} IsListSignal
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="listarg">ListArg</h2>

- jsdoc types:

```js
/**
 * - ListSignal argument type;
 * @typedef {Record<string, string>} ListArg
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="litexpkeytype">LitExpKeyType</h2>

- jsdoc types:

```js
/**
 * @typedef {Record<string, RegExp|false>} LitExpKeyType
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="litexpresulttype">LitExpResultType</h2>

- jsdoc types:

```js
/**
 * @template {import('./src/types/LitExpKeyType.mjs').LitExpKeyType} KEYS
 * @typedef {{result:{whole:string[], named:Array<Record<keyof KEYS, string>>},
 * regexp: RegExp}} LitExpResultType
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="mutationtype">MutationType</h2>

- jsdoc types:

```js
/**
 * - `ListSignal` mutation type;
 * @typedef {'push'|'unshift'|'splice'|'swap'|'modify'|'shift'|'remove'} MutationType
 * - instance method: serves as helper to mutate, and notify for `effects`;
 * > - `slice` uses `splice` in the background, you don't need to manually reindex when using it;
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="qcbfiforeturn">QCBFIFOReturn</h2>

- jsdoc types:

```js
/**
 * - return type of Q callback fifo;
 * @typedef {Omit<import("./src/types/QCBReturn.mjs").QCBReturn, "isLastOnQ">} QCBFIFOReturn
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="qcbreturn">QCBReturn</h2>

- jsdoc types:

```js
/**
 * - return type of Q callback;
 * @typedef {{resume:()=>void, isLastOnQ:()=>boolean}} QCBReturn
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="runtime">Runtime</h2>

- jsdoc types:

```js
/**
 * @description
 * - for popular runtimes check;
 * @typedef {'node' | 'bun' | 'deno' | 'browser' | 'unknown'} Runtime
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="workerresult">WorkerResult</h2>


#### reference:`WorkerResult`
- typeHelper for `Worker` message passing;  
- uses error as value instead;

```js
/**
 * @template POST
 */
```

#### reference:`WorkerResult_instance.data`
- result value;

```js
/**
 * @type {POST}
 */
```

#### reference:`WorkerResult_instance.error`
- error value;

```js
/**
 * @type {Error|string|undefined}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="workerthread">WorkerThread</h2>


#### reference:`WorkerThread`
- class helper for `WorkerThread` creation;  
- before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;

```js
/**
 * @template RECEIVE  
 * @template POST
 */
```

#### reference:`WorkerThread.setup`
- need to be called and exported as new `WorkerThread` class reference;

```js
/**
 * @template RECEIVE 	 
 * @template POST 	 
 * @param {{parentPort:import('worker_threads')["parentPort"]}} refs 	 
 * -example: 	 
 * ```js 	 
 * import { parentPort } from 'node:worker_threads'; 	 
 * ``` 	 
 * @returns {typeof WorkerThread<RECEIVE, POST>} 	 
 */
```
 - <i>example</i>:
```js  
 import { WorkerThread } from 'vivth'; 	 
 import { parentPort } from 'node:worker_threads'; 	 
 	 
 export const MyWorkerThreadRef = WorkerThread.setup({ parentPort });
 
```

#### reference:`new WorkerThread`
- instantiate via created class from `setup` static method;

```js
/**
 * @param {WorkerThread<RECEIVE, POST>["handler"]} handler 	 
 */
```
 - <i>example</i>:
```js  
 import { MyWorkerThread } from './MyWorkerThread.mjs'; 	 
 	 
 const doubleWorker = new MyWorkerThread((ev, isLastOnQ) => { 	 
 	// if(!isLastOnQ()) { 	 
 	// 	return null; // can be used for imperative debouncing; 	 
 	// } 	 
 	// await fetch('some/path') 	 
 	// if(!isLastOnQ()) { 	 
 	// 	return; 	 
 	// } 	 
 	return ev = ev * 2; 	 
 });
 
```

#### reference:`WorkerThread_instance.handler`
- type helper;

```js
/**
 * @type {(ev: RECEIVE, isLastOnQ:QCBReturn["isLastOnQ"]) => POST}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="tobundledjsplugin">ToBundledJSPlugin</h2>


#### reference:`ToBundledJSPlugin`
- generate `esbuild.Plugin` for changing dev time file into runtime file;  
- on using esbuild with this plugin, it will replace any module that have similiar file name but ended with Bundled(before extname);  
>- works on `.mts`|`.ts`|`.mjs`|`.cjs`|`.js`;  
>- `anyFileName.mjs` -> seek for and use `anyFileNameBundled.mjs`, if not found use `anyFileName.mjs`;

```js
/**
 * @param {string} includedInPath  
 * - is generalized, you can freely uses forward or backward slash;  
 * @returns {ReturnType<CreateESPlugin>}  
 */
```
 - <i>example</i>:
```js 
 import { ToBundledJSPlugin } from 'vivth';  
  
 export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>