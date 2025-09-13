// @ts-check

import { Console } from '../src/class/Console.mjs';
import { Setup } from '../src/class/Setup.mjs';
import { JSautoDOC } from '../src/doc/JSautoDOC.mjs';

const { paths, safeExit } = Setup;

new paths({
	root: process?.env?.INIT_CWD ?? process?.cwd(),
});

new safeExit({
	exitEventNames: ['SIGINT', 'SIGTERM', 'exit'],
	exitCallback: () => process.exit(0),
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
