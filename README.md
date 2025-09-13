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
  > - opionated `bundler`;

## versions:

- `1.0.0:b`:
  > - beta release;
  > - checking edge cases;
  > - stable API, the exposed API access are highly unlikely to changes, only the underlying code
  >   might changes for improving performance;

<h2 id="list-of-exported-api-and-typehelpers">list of exported API and typehelpers</h2>

 - [CompileMJS](#compilemjs)
 - [EsBundler](#esbundler)
 - [Console](#console)
 - [Derived](#derived)
 - [Effect](#effect)
 - [EnvSignal](#envsignal)
 - [EventSignal](#eventsignal)
 - [ListDerived](#listderived)
 - [ListSignal](#listsignal)
 - [Paths](#paths)
 - [QChannel](#qchannel)
 - [SafeExit](#safeexit)
 - [Setup](#setup)
 - [Signal](#signal)
 - [WorkerMainThread](#workermainthread)
 - [WorkerResult](#workerresult)
 - [WorkerThread](#workerthread)
 - [Base64URL](#base64url)
 - [EventNameSpace](#eventnamespace)
 - [JSautoDOC](#jsautodoc)
 - [CreateImmutable](#createimmutable)
 - [EventCheck](#eventcheck)
 - [EventObject](#eventobject)
 - [IsAsync](#isasync)
 - [LazyFactory](#lazyfactory)
 - [Timeout](#timeout)
 - [Try](#try)
 - [TryAsync](#tryasync)
 - [TrySync](#trysync)
 - [TsToMjs](#tstomjs)
 - [WriteFileSafe](#writefilesafe)
 - [AnyButUndefined](#anybutundefined)
 - [QCBReturn](#qcbreturn)
 - [QCBFIFOReturn](#qcbfiforeturn)
 - [MutationType](#mutationtype)
 - [ListArg](#listarg)
 - [IsListSignal](#islistsignal)
 - [ExtnameType](#extnametype)

<h2 id="compilemjs">CompileMJS</h2>


#### reference:`CompileMJS`
- function to bundle to single mjs file, including the workerThread;

```js
/**
 * @param {Object} options  
 * @param {string} options.entryPoint  
 * @param {string} options.outputNoExt  
 * - no extention needed, result will always be '.mjs';  
 * @param {BufferEncoding} options.encoding  
 * @param {boolean} [options.minify]  
 * - default false;  
 * @param {boolean} [options.asBinary]  
 * - default false;  
 * @returns {Promise<ReturnType<typeof WriteFileSafe>>}  
 */
```
 - <i>example</i>:
```js 
 import { Paths, CompileMJS } from 'vivth';  
  
 new Paths({  
 	root: process?.env?.INIT_CWD ?? process?.cwd(),  
 });  
  
 CompileMJS({  
 	entryPoint: '/index.mjs',  
 	encoding: 'utf-8',  
 	outputNoExt: '/test/compiled',  
 	minify: false,  
 	asBinary: true,  
 });
 
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
 * - the import statements on the content should use absolute path from project root, prefixed with forward slash;  
 * @param {string} options.extension  
 * @param {boolean} [options.asBinary]  
 * @param {Omit<Parameters<build>[0], 'entryPoints'|'bundle'|'write'|'format'|'sourcemap'|'external'|'stdin'>} [esbuildOptions]  
 * @returns {Promise<ReturnType<typeof TryAsync<string>>>}  
 */
```
 - <i>example</i>:
```js 
 import { EsBundler } from 'vivth';  
  
 const bundledString = EsBundler(,  
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

<h2 id="console">Console</h2>


#### reference:`Console`
- class with static methods to print to standard console with added style;


#### reference:`Console.log`


```js
/**
 * @param {any} data 	 
 * @returns {void}
 */
```

#### reference:`Console.info`


```js
/**
 * @param {any} data 	 
 * @returns {void}
 */
```

#### reference:`Console.warn`


```js
/**
 * @param {any} data 	 
 * @returns {void}
 */
```

#### reference:`Console.error`


```js
/**
 * @param {any} data 	 
 * @returns {void}
 */
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="derived">Derived</h2>


#### reference:`Derived`
- a class for creating derived version of [Signal](#signal);

```js
/**
 * @template V  
 * @extends Signal<V>
 */
```

#### reference:`new Derived`
- Derived used [Signal](#signal) and [Effect](#effect) under the hood;

```js
/**
 * @param {(effectInstanceOptions:Effect["options"])=>Promise<V>} derivedFunction 	 
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

#### reference:`Derived_instance.value:getter`
- the most recent value of the instance 	 
- can be turn into reactive with Effect or Derived instantiation;

```js
/**
 * @type {V}
 */
```

#### reference:`Derived_instance.value:setter`
- Derived instance value cannot be manually assigned; 	 
- it's value should always be determined by it's own `derivedFunction`;

```js
/**
 * @private 	 
 * @type {V}
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


#### reference:`new Effect`


```js
/**
 * @param {(arg0:Effect["options"])=>Promise<void>} effect 	 
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
 		}) => { 	 
 			Console.log(subscribe(double).value); // effect listen to double changes 	 
 			const a = double.value; //  no need to wrap double twice with $ 	 
 }) 	 
 	 
 count.value++;
 
```

#### reference:`Effect_instance.options.subscribe`
- normally it's passed as argument to constructor, however it is also accessible from `options` property;

```js
/**
 * @template {Signal} S 		 
 * @param {S} signal 		 
 * @returns {S} 		 
 */
```
 - <i>example</i>:
```js 	 
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
 const effect = new Effect(async () => { 		 
 	// code 		 
 }) 		 
 effect.options.removeEffect();
 
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
 const effect = new Effect(async ()=>{ 	 
 	// code 	 
 }) 	 
 effect.run();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="envsignal">EnvSignal</h2>


#### reference:`EnvSignal`
- non browser API;  
- uses [Signal](#signal) and [Derived](#derived) under the hood;

```js
/**
 * @template V
 */
```

#### reference:`new EnvSignal`
- create `EnvSignal` instance;

```js
/**
 * @param {V} initialValue
 */
```

#### reference:`EnvSignal_instance.env`
- exposed property to listen to;

```js
/**
 * @type {Derived<V>} 	 
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
 * @param {V} correctedValue 	 
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

```js
/**
 * @template {IsListSignal} isList  
 * - boolean;
 */
```

#### reference:`EventSignal.map`
- `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;

```js
/**
 * @type {Map<string, EventSignal>}
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
 * @returns {Promise<EventSignal>} 	 
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
 * @type {Signal|ListSignal}
 */
```

#### reference:`EventSignal_instance.listen`
- is [Derived](#derived) or [ListDerived](#listderived) instance, depending on the `isList` argument; 	 
- can be used as listener when passed down value shouldn't be modified manually; 	 
- is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;

```js
/**
 * @type {Derived|ListDerived}
 */
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
 		 
 EventSignal.remove.subscriber('yourEventSignalName', yourEffectInstance);
 
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
 eventSignal_instance.remove.subscriber(yourEffectInstance);
 
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
 eventSignal_instance.remove.ref();
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="listderived">ListDerived</h2>


#### reference:`ListDerived`
- class to create `dervivedList` that satisfy `Array<Record<string, string>>`;  
- usefull for `derivedLoops`, e.g. temporary search values;  
- is a `Derived` instance;

```js
/**
 * @template {ListArg} LA  
 * @extends {Derived<LA[]>}
 */
```

#### reference:`new ListDerived`


```js
/**
 * @param {(effectInstanceOptions:Effect["options"])=>Promise<LA[]>} derivedFunction 	 
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
 * @template {import('../types/ListArg.mjs').ListArg} LA  
 * @extends {Signal<LA[]>}
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
 * @param {LA[]} [value] 	 
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
 * @type {LA[]}
 */
```

#### reference:`ListSignal_instance.value:setter`
- you cannot mannually set`value` `ListSignal_instance`;

```js
/**
 * @private 	 
 * @type {LA[]}
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
 * @type {Array<LA>}
 */
```

#### reference:`ListSignal_instance.arrayMethods.push`
- appends new elements to the end;

```js
/**
 * @param {...LA} listArg 			 
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
 * @param  {...LA} listArg 			 
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
 * @param {LA[]} listArgs 			 
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
 * @param {...LA} listArg 			 
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
 * @param {Partial<LA>} listArg 			 
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

<h2 id="paths">Paths</h2>


#### reference:`Paths`
- class helpers to define pathReference;  
- is a singleton;


#### reference:`new Paths`


```js
/**
 * @param {Object} options 	 
 * @param {string} options.root 	 
 * - browser: location.origin 	 
 * - node/bun compatible: process?.env?.INIT_CWD ?? process?.cwd(); 	 
 * - deno: Deno.env.get("INIT_CWD") ?? Deno.cwd(); need for `deno run --allow-env --allow-read your_script.ts` 	 
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
 * @type {string}
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
 	 
 Paths.normalize('file:\\D:\\myFile.mjs'); // return 'file://D://myFile.mjs'
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="qchannel">QChannel</h2>


#### reference:`QChannel`
- class for `Queue` handling;

```js
/**
 * @template {AnyButUndefined} T
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
 * @template ResultType 			 
 * @param {()=>Promise<ResultType>} asyncCallback 			 
 * @returns {Promise<[ResultType|undefined, Error|undefined]>} 			 
 */
```
 - <i>example</i>:
```js 		 
 const [result, error] = await QChannel.fifo.callback(async () = > { 			 
 	// code 			 
 })
 
```

#### reference:`QChannel_instance.clear`
- clear up all queued on the instance; 	 
- only clear up the reference, the already called will not be stoped;

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
 * @param {T} keyID 	 
 * @returns {Promise<QCBReturn>} 	 
 */
```
 - <i>example</i>:
```js  
 const q = new QChannel(); 	 
 const handler = async () => { 	 
 	const { resume, isLastOnQ } = await q.key(keyID); 	 
 	// if (!isLastOnQ) { // imperative debounce if needed 	 
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
 * @template ResultType 	 
 * @param {T} keyID 	 
 * @param {(options:Omit<QCBReturn, "resume">)=>Promise<ResultType>} asyncCallback 	 
 * @returns {Promise<[ResultType|undefined, Error|undefined]>} 	 
 */
```
 - <i>example</i>:
```js  
 const q = new QChannel(); 	 
 const [result, error] = await q.callback(keyID, async ({ isLastOnQ }) = > { 	 
 	// if (!isLastOnQ) { // imperative debounce if needed 	 
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

```js
/**
 * @template {[string, ...string[]]} eventNames
 */
```

#### reference:`SafeExit.instance`
- only accessible after instantiation;

```js
/**
 * @type {SafeExit}
 */
```

#### reference:`new SafeExit`


```js
/**
 * @param {Object} options 	 
 * @param {eventNames} options.eventNames 	 
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
 * - if your exit callback doesn't uses `process` global object you need to input on the SafeExit instantiation 	 
 */
```
 - <i>example</i>:
```js  
 import { SafeExit, Console } from 'vivth'; 	 
 	 
 new SafeExit({ 	 
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
 	 
 SafeExit.instance.addCallback(()=>{ 	 
 	// code 	 
 })
 
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
 	// exitEventNames are blank by default, you need to manually name them all; 	 
 	exitEventNames: ['SIGINT', 'SIGTERM', ...otherExitEventNames], 	 
 	// optional deno example 	 
 	exitCallbackListeners = (eventName) => { 	 
 		const sig = Deno.signal(eventName); 	 
 			for await (const _ of sig) { 	 
 				SafeExit.instance.exiting.correction(true); 	 
 				sig.dispose(); 	 
 				Console.info(`safe exit via "${eventName}"`); 	 
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
 	 
 Setup.workerMain({ 	 
 	workerClass: async () => await (import('worker_threads')).Worker, 	 
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


 - <i>example</i>:
```js  
 import { Setup } from 'vivth'; 	 
 	 
 Setup.workerThread({ parentPort: async () => await import('node:worker_threads') }); 	 
 // that is the default value, if your parentPort/equivalent API is not that; 	 
 // you need to call this method;
 
```

*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>

<h2 id="signal">Signal</h2>


#### reference:`Signal`
- a class for creating effect to signals;

```js
/**
 * @template Value
 */
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
 * @param {(options:{signalInstance:Signal<Value>})=>Promise<void>} [callback] 		 
 * @returns {void} 		 
 */
```
 - <i>example</i>:
```js 	 
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

#### reference:`new Signal`


```js
/**
 * @param {Value} value 	 
 */
```
 - <i>example</i>:
```js  
 import { Signal, Effect } from  'vivth'; 	 
 	 
 const count = new Signal(0);
 
```

#### reference:`Signal_instance.prev:getter`
- value before change;

```js
/**
 * @type {Value}
 */
```

#### reference:`Signal_instance.value:getter`
- value after change;

```js
/**
 * @type {Value} 	 
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
 const oneMoreThanCount = new Effect(async ({ subscribe }) =>{ 	 
 	return subscribe(count).value + 1; // reactive 	 
 })
 
```

#### reference:`Signal_instance.value:setter`
- assign new value then automatically notify all subscribers;

```js
/**
 * @type {Value} 	 
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

```js
/**
 * @template {WorkerThread} WT
 */
```

#### reference:`WorkerMainThread.setup`
- need to be called first, before any `WorkerMainThread` instantiation:

```js
/**
 * @param {Object} param0 	 
 * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass 	 
 * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator 	 
 * ```js 	 
 *	async(relativePath) => { 	 
 *		// verify whether relativePath exist, then return the full path 	 
 *		// use fetch | fs, chained with Paths.instance.root + WorkerMainThread.basePath; 	 
 *	} 	 
 * ``` 	 
 * @param {typeof WorkerMainThread["basePath"]} [param0.basePath] 	 
 * - additonal realtivePath from rootPath; 	 
 * - default: ''; 	 
 */
```
 - <i>example</i>:
```js  
 import { WorkerMainThread } from 'vivth'; 	 
 	 
 WorkerMainThread.setup({ 	 
 	workerClass: async () => await (import('worker_threads')).Worker, 	 
 	basePath: 'public/assets/js/workers', 	 
 	pathValidator: async (workerPath, root, base) => { 	 
 		const res = await fetch(`${root}/${base}/${workerPath}`); 	 
 		// might also check wheter it need base or not 	 
 		return await res.ok; 	 
 	}, 	 
 });
 
```

#### reference:`WorkerMainThread.workerClass`
- reference for `Worker` class; 	 
- edit via `setup`;

```js
/**
 * @type {()=>Promise<typeof Worker|typeof import('worker_threads').Worker>}
 */
```

#### reference:`WorkerMainThread.basePath`
- reference for worker file `basePath`; 	 
- edit via `setup`;

```js
/**
 * @type {string}
 */
```

#### reference:`WorkerMainThread.pathValidator`
- reference for validating path; 	 
- edit via `setup`;

```js
/**
 * @type {(paths:{worker: string, root:string, base: string})=>Promise<string>}
 */
```

#### reference:`new WorkerMainThread`
- create Worker_instance;

```js
/**
 * @param {string} handler 	 
 * - if `isInline` === `false`, `handler` should be: 	 
 * >- pointing to worker thread file; WHICH 	 
 * >- the path must be relative to `projectRoot`; 	 
 * - if `isInline` === `true`, `handler` should be 	 
 * >- string literal of prebundled worker thread script; OR 	 
 * >- manually made string literal of worker thread script; 	 
 * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options] 	 
 * @param {boolean} [isInline] 	 
 */
```
 - <i>example</i>:
```js  
 import { WorkerMainThread } from 'vivth'; 	 
 	 
 export const myDoubleWorker = new WorkerMainThread('./doubleWorkerThread.mjs');
 
```

#### reference:`WorkerMainThread.isBrowser:getter`
- check whether js run in browser

```js
/**
 * @type {boolean}
 */
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
 * @type {Derived<WorkerResult<WT["Post"]>>} 	 
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
 * @type {(event: WT["Receive"])=>void} 	 
 */
```
 - <i>example</i>:
```js  
 import { myDoubleWorker } from './myDoubleWorker.mjs'; 	 
 	 
 myDoubleWorker.postMessage(90);
 
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

```js
/**
 * @template Receive  
 * @template Post
 */
```

#### reference:`WorkerThread.setup`
- need to be called and exported as new `WorkerThread` class reference;

```js
/**
 * @template Receive_ 	 
 * @template Post_ 	 
 * @param {{parentPort:()=>Promise<any>}} parentPortRef 	 
 * - correct parentPort reference; 	 
 * @returns {typeof WorkerThread<Receive_, Post_>} 	 
 */
```
 - <i>example</i>:
```js  
 import { WorkerThread } from 'vivth'; 	 
 	 
 WorkerThread.setup({ parentPort: async () => await import('node:worker_threads') }); 	 
 // that is the default value, if your parentPort/equivalent API is not that; 	 
 // you need to call this method;
 
```

#### reference:`new WorkerThread`
- instantiate via created class from `setup` static method;

```js
/**
 * @param {WorkerThread["handler"]} handler 	 
 */
```
 - <i>example</i>:
```js  
 import { MyWorkerThread } from './MyWorkerThread.mjs'; 	 
 	 
 const doubleWorker = new MyWorkerThread((ev, isLastOnQ) => { 	 
 	// if(!isLastOnQ) { 	 
 	// 	return null; // can be used for imperative debouncing; 	 
 	// } 	 
 	return ev = ev * 2; 	 
 });
 
```

#### reference:`WorkerThread_instance.handler`
- type helper;

```js
/**
 * @type {(ev: Receive, isLastOnQ:boolean) => Post}
 */
```

#### reference:`WorkerThread_instance.Receive`
- helper type, hold no actual value;

```js
/**
 * @type {Receive}
 */
```

#### reference:`WorkerThread_instance.Post`
- helper type, hold no actual value;

```js
/**
 * @type {Post}
 */
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
 * @returns {string}  
 */
```
 - <i>example</i>:
```js 
 import { Base64URL } from 'vivth'  
 import { fileString } from './fileString.mjs';  
  
 Base64URL(fileString, 'application/javascript', btoa);
 
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
>>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` is documentation/generation results;


#### reference:`new JSautoDOC`


```js
/**
 * @param {Object} [options] 	 
 * @param {Object} [options.paths] 	 
 * @param {string} [options.paths.file] 	 
 * - entry point; 	 
 * @param {string} [options.paths.readMe] 	 
 * - readme target; 	 
 * @param {string} [options.paths.dir] 	 
 * - source directory; 	 
 * @param {string} [options.copyright] 	 
 * @param {string} [options.tableOfContentTitle] 	 
 * @param {import('chokidar').ChokidarOptions} [options.option] 	 
 * - ChokidarOptions; 	 
 */
```
 - <i>example</i>:
```js  
 import { Console, Setup, JSautoDOC } from 'vivth'; 	 
 	 
 const { paths, safeExit } = Setup; 	 
 	 
 new paths({ 	 
 	root: process?.env?.INIT_CWD ?? process?.cwd(), 	 
 }); 	 
 	 
 new safeExit({ 	 
 	exitEventNames: ['SIGINT', 'SIGTERM', 'exit'], 	 
 	exitCallbackListeners: (eventName) => { 	 
 		process.once(eventName, function () { 	 
 			safeExit.instance.exiting.correction(true); 	 
 			Console.log(`safe exit via "${eventName}"`); 	 
 		}); 	 
 	}, 	 
 }); 	 
 	 
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
 * @template {Object} P  
 * @template {Object} O  
 * @param {string} keyName  
 * @param {P} parent  
 * @param {(this:P)=>O} object  
 * @param {Object} [options]  
 * @param {boolean} [options.lazy]  
 * @return {O}  
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
 * @template {string} N  
 * @param {N} name  
 * @returns {{[EventNameSpace]: N}}  
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
 * @template T  
 * @param {() => T} factory  
 * @returns {T & {[unwrapLazy]: string}}  
 * - the unwrapLazy prop can be accessed to force instatiation/call;  
 * >- `unwrapLazy` prop name can be checked by checking the list of possible prop, from your ide;  
 * >- as of version 1.0.0, value is `vivth:unwrapLazy;`;  
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
 * @template {string} Key  
 * @template ReturnType_  
 * @template {Record<  
 * 	Key,  
 * 	() => Promise<ReturnType_>  
 * >} RecordTryType  
 * @param {RecordTryType} tryRecord  
 * @returns {Promise<  
 * 	[[keyof RecordTryType, ReturnType_], undefined]  
 * 	| [[undefined, undefined], Error]  
 * >}  
 */
```
 - <i>example</i>:
```js 
 import { Try } from 'vivth';  
  
 const [[key, result], error] = await Try({  
 	someRuntime: async () => {  
 		// asuming on this one doesn't naturally throw error,  
 		// yet you need to continue to next key,  
 		// instead of returning,  
 		// you should throw new Error(something);  
 	},  
 	browser: async () => {  
 		return location?.origin;  
 		// if no error, stop other key function from running;  
 		// key = 'browser'  
 		// result = location?.origin;  
 		// error = undefined;  
 		// if error;  
 		// run nodeOrBun;  
 	},  
 	nodeOrBun: async () => {  
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
 * @template ResultType  
 * @param {()=>Promise<ResultType>} asyncFunction_  
 * @returns {Promise<[ResultType|undefined, Error|undefined]>}  
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
 * @template ResultType  
 * @param {()=>ResultType} function_  
 * @returns {[ResultType|undefined, Error|undefined]}  
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

<h2 id="writefilesafe">WriteFileSafe</h2>


#### reference:`WriteFileSafe`
- function to create file by recursively mkdir the dirname of the outFile;  
- also returing promise of result & error as value;

```js
/**
 * @param {string} outFile  
 * @param {string} content  
 * @param {import('node:fs').WriteFileOptions} options  
 * @returns {Promise<ReturnType<typeof TryAsync<void>>>}  
 */
```
 - <i>example</i>:
```js 
 import { WriteFileSafe } from 'vivth';  
  
 const [_, writeError] = await TryAsync(async () => {  
 	return await WriteFileSafe(  
 		'/some/path.mjs',  
 		'console.log("hello-world!!");',  
 		{ encoding: 'utf-8' }  
 	);  
 });
 
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

<h2 id="qcbreturn">QCBReturn</h2>

- jsdoc types:

```js
/**
 * - return type of Q callback;
 * @typedef {{resume:()=>void, isLastOnQ:boolean}} QCBReturn
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

<h2 id="listarg">ListArg</h2>

- jsdoc types:

```js
/**
 * - ListSignal argument type;
 * @typedef {Record<string, string>} ListArg
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

<h2 id="extnametype">ExtnameType</h2>

- jsdoc types:

```js
/**
 * - jsRuntime extention naming convention;
 * @typedef {`.${string}`} ExtnameType
 */
```
*) <sub>[go to list of exported API and typehelpers](#list-of-exported-api-and-typehelpers)</sub>