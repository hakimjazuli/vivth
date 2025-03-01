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

## exported-api-and-type-list
- [$](#$)
- [Derived](#derived)
- [Q](#q)
- [Signal](#signal)
- [New$](#new$)
- [NewDerived](#newderived)
- [NewPingFIFO](#newpingfifo)
- [NewPingUnique](#newpingunique)
- [NewSignal](#newsignal)
- [tryAsync](#tryasync)
- [trySync](#trysync)
<h2 id="$">$</h2>

- a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);- for minimal total bundle size use `function` [New$](#new$) instead;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="derived">Derived</h2>

- a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);- can be subscribed by using [New$](#new$);- for minimal total bundle size use `function` [NewDerived](#newderived) instead;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="q">Q</h2>

- class that containts static methods to generate Promise based `awaiter` inside async function, to prevent race condition, including but not limited to:> - modifying the same `Map`, `Set`(etc.) `Object`/`Instance` inside a `Promise.all`/any code that might fired simultanously;```jsimport { Q } from 'vivth';const handler = async () => {	// your code;	const { resume } = await Q.fifo() // or await Q.unique(uniqueID);	// your code that modifies and/or access same `Map`;	resume();	// the rest of your code;	return;}const runtime = async () => {	// await Promise.all(handler1, handler2, ..., handlern);}runtime();```- behaviour:> - `fifo`: call all queued callback `first in first out` style;> - `unique`: call all queued callback with the same `uniqueID` `first in first out` style, if the `uniqueID` is different it will be called in parallel;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="signal">Signal</h2>

- a class for creating signal;- can be subscribed by using [New$](#new$) or [NewDerived](#newderived);- for minimal total bundle size use `function` [NewSignal](#newSignal) instead;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="new$">New$</h2>

- function to create `autosubscriber`; - syntatic sugar for [$](#$);```jsimport { New$, NewDerived, NewSignal } from 'vivth';const signal = NewSignal(0);const derived = NewDerived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = New$(async ()=>{ // runs everytime signal.value changes; console.log(signal.value); // console.log(derived.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="newderived">NewDerived</h2>

- function to create `signal` that its value are derived from another `signal`; - syntatic sugar for [Derived](#derived);```jsimport { New$, NewDerived, NewSignal } from 'vivth';const signal = NewSignal(0);const derived = NewDerived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = New$(async ()=>{ // runs everytime derived.value changes; console.log(derived.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="newpingfifo">NewPingFIFO</h2>

- function to auto queue callbacks that will be called `first in first out` style;```js// @ts-checkimport { NewPingFIFO } from 'vivth';const debounceMS = 0; // in miliseconds, optionals, default is 0;const handler = () =>{	NewPingFIFO(async () => {		// your code	}, debounceMS);}```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="newpingunique">NewPingUnique</h2>

- function to auto queue callbacks:> - different `uniqueID`: called `first in first out` style;> - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;```js// @ts-checkimport { NewPingUnique } from 'vivth';const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;const debounceMS = 0; // in miliseconds, optionals, default is 0;const handler = () =>{	NewPingUnique(uniqueID, async () => {		// your code	}, debounceMS);}```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="newsignal">NewSignal</h2>

- function to create `signal`; - syntatic sugar for [Signal](#signal);```jsimport { New$, NewDerived, NewSignal } from 'vivth';const signal = NewSignal(0);const derived = NewDerived(async () =>{ // runs everytime signal.value changes; return signal.value * 2;});const autosubscriber = New$(async ()=>{ // runs everytime signal.value changes; console.log(signal.value);});signal.value = 1;```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="tryasync">tryAsync</h2>

- error as value for asynchronous operationreturns: Promise<[`ResultType`|`undefined`, `Error`|`undefined`]>

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>

<h2 id="trysync">trySync</h2>

- error as value for synchronous operationreturns: [`ResultType`|`undefined`, `Error`|`undefined`]

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
