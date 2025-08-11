## HOW TO INSTALL
```shell
npm i vivth
```
```shell
bun i vivth
```

## vivth
- contains helpers to help you write autosubscriber pattern javascript program, including:
>- collections of signal based functions and classes;
>- collections of queue helper functions and classes;

- `vivth` technically can run in any `js runtime`, since it uses non platform specific api;
- it is written specifically to be used as a primitives for javascript library or runtime, so there are no complex abstraction is, nor will be, added in `vivth` it self;

### version
- 0.11.x: drop function wrapper for all classes, for better runtime performance
## exported-api-and-type-list
- [$](#$)
- [Derived](#derived)
- [PingFIFO](#pingfifo)
- [PingUnique](#pingunique)
- [Q](#q)
- [Signal](#signal)
- [NewQBlock](#newqblock)
- [TryAsync](#tryasync)
- [TrySync](#trysync)
<h2 id="$">$</h2>

- a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);```jsimport { $, Derived, Signal } from 'vivth';const signal = new Signal(0);const derived = new Derived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = new $(async ()=>{ // runs everytime signal.value changes; console.log(signal.value); // console.log(derived.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="derived">Derived</h2>

- a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);```jsimport { $, Derived, Signal } from 'vivth';const signal = new Signal(0);const derived = new Derived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = new $(async ()=>{ // runs everytime derived.value changes; console.log(derived.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="pingfifo">PingFIFO</h2>

```js/** * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails */```- a class for Queue;- function to auto queue callbacks that will be called `first in first out` style;```js// @ts-checkimport { PingFIFO } from 'vivth';const debounceMS = 0; // in miliseconds, optionals, default is 0;const handler = () =>{	new PingFIFO(async () => {		// your code	}, debounceMS);}```- this class provides `QFIFO.makeQClass`;>- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;>- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="pingunique">PingUnique</h2>

- a class for Queue;> - different `uniqueID`: called `first in first out` style;> - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;```js// @ts-checkimport { PingUnique } from 'vivth';const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;const debounceMS = 0; // in miliseconds, optionals, default is 0;const handler = () =>{ new PingUnique(uniqueID, async () => {		// your code	}, debounceMS);}```- this class provides `QUnique.makeQClass`;>- this method will setup `QUnique` to use the inputed `queueMap`(as arg0) as centralized lookup for queue managed by `QUnique`;>- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Map<any, [()=>Promise<any>,number]>` as lookups;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="q">Q</h2>

- class that containts static methods to generate Promise based `awaiter` inside async function, to prevent race condition, including but not limited to:> - modifying the same `Map`, `Set`(etc.) `Object`/`Instance` inside a `Promise.all`/any code that might fired simultanously;```jsimport { Q } from 'vivth';const handler = async () => {	// your code;	const { resume } = await Q.fifo() // or await Q.unique(uniqueID);	// your code that modifies and/or access same `Map`;	resume();	// the rest of your code;	return;}const runtime = async () => {	// await Promise.all(handler1, handler2, ..., handlern);}runtime();```- behaviour:> - `fifo`: call all queued callback `first in first out` style;> - `unique`: call all queued callback with the same `uniqueID` `first in first out` style, if the `uniqueID` is different it will be called in parallel;- this class provides `Q.makeQClass`;>- this method will setup `Q` to use the inputed `uniqueMap`(as arg0) as centralized lookup for queue managed by `Q`;>- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<Map<any, Promise<any>>>` as lookups;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="signal">Signal</h2>

- a class for creating signal;```jsimport { $, Derived, Signal } from 'vivth';const signal = new Signal(0);const derived = new Derived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = new $(async ()=>{ // runs everytime signal.value changes; console.log(signal.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="newqblock">NewQBlock</h2>

- a function for Queue;- will wait next execution of the same `arg1`:`objectReferenceID`, without blocking other calls;```js// @ts-checkimport { NewQBlock } from 'vivth'; const objectReferenceID = 'yourUniqueID'; // can be anything, reference to object is preferable;const handler = () =>{	NewQBlock(async () => {		// your code	 }, objectReferenceID //- default, will refer to `arg0`:`asyncCallaback`; );}```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="tryasync">TryAsync</h2>

- error as value for asynchronous operationreturns: Promise<[`ResultType`|`undefined`, `Error`|`undefined`]>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="trysync">TrySync</h2>

- error as value for synchronous operationreturns: [`ResultType`|`undefined`, `Error`|`undefined`]

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
