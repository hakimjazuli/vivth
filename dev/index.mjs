// @ts-check

import { __JSDev } from '@html_first/js_lib_template';

new __JSDev({
	filePath: './index.mjs',
	folderPath: './src',
	readMePath: './README.md',
	copyright: ['developed and published under MIT license,'],
	description: [
		'## HOW TO INSTALL',
		'```shell',
		'npm i vivth',
		'```',
		'```shell',
		'bun i vivth',
		'```',
		'',
		'## vivth',
		'- contains helpers to help you write autosubscriber pattern javascript program, including:',
		'>- collections of signal based functions and classes;',
		'>- collections of queue helper functions and classes;',
		'',
		'- `vivth` technically can run in any `js runtime`, since it uses non platform specific api;',
		'- it is written specifically to be used as a primitives for javascript library or runtime, so there are no complex abstraction is, nor will be, added in `vivth` it self;',
		'',
		'### version',
		'- 0.11.x: drop function wrapper for all classes, for better runtime performance',
	],
}).run();
