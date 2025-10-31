// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { TrySync } from '../function/TrySync.mjs';

/**
 * @description
 * - class helper to created opionated regex helper;
 * - named capture uses `es6+` feature, you might need to add polyfill to target extremely old browser;
 * - class name refer to `Literal Expression`;
 * - please be patient when using this class;
 * >- destructuring is meant for extensive typehelper;
 * >- and destructuring can lead to unhandled error here and there;
 * >- therefore error as value is introduced to help to prevent error on runtime;
 * - made primarily for generating string file, that are purely managed programatically;
 * @template {LitExpKeyType} KEYS
 */
export class LitExp {
	/**
	 * @typedef {import("../types/LitExpKeyType.mjs").LitExpKeyType} LitExpKeyType
	 */

	/**
	 * @description
	 * - to escape special chars from string literal;
	 * - returned value can be used to create instance of RegExp;
	 * @param {string} string
	 * @returns {string}
	 * @example
	 * import { LitExp } from 'vivt';
	 *
	 * const escapedLiteral = LitExp.escape(`something[][;alerk325]`);
	 * new RegExp(escapedLiteral, 'g');
	 */
	static escape = (string) => {
		return string.replace(/[.*+?^${}()|[\]\\\]]/g, '\\$&');
	};
	/**
	 * @description
	 * - constructor helper;
	 * - under the hood it is an abstraction of `RegExp`, with more template literal touch;
	 * >- you can apply inline `RegExp` features on the string template literal(as constructor RegExp arg0);
	 * >>- by doing so you are opting in to make:
	 * >>>- your regex detection more robust; but
	 * >>>- `litExp_instance.make.string` to be `unusable`;
	 * >>- also mind the needs of escape for special characters;
	 * @template {LitExpKeyType} KEYS
	 * @param {KEYS} keysAndDefaultValuePair
	 * - keys and whether to override regex detection;
	 * >- example:
	 * ```js
	 *  myKey: /myCustomCapture/ // all flags will be stripped;
	 * ```
	 * - default value === `false` is "[\\s\\S]*?", as in whiteSpace and nonWhiteSpace 0 to more occurence;
	 * @returns {ReturnType<typeof TrySync<(templateStringArray:TemplateStringsArray,
	 * ...values:(keyof KEYS)[]
	 * )=>LitExp<KEYS>>>}
	 * - placement of `key` will determine the named capture group will be placed in the template literal;
	 * - it is recomended to not end template literal with any of the `key`s as the regex detection might failed to detects the boundary of the end of matched string of that capture group;
	 * @example
	 * import { LitExp } from 'vivth';
	 *
	 * (()=>{
	 * 	const [liteal, errorPrep] = LitExp.prepare({
	 * 		myKey: /myCustomCapture/, // is placed on (?<myKey>myCustomCapture)
	 * 		// use false to place "[\\s\\S]\*?" instead;
	 * 		...keyCaptureLogicPair
	 * 	})
	 * 	if (errorPrep) {
	 * 		console.error(error);
	 * 		return;
	 * 	}
	 * 	 const litExp_instance = liteal`templateLiteral:${'myKey'};`
	 * 	// recommended to end the template literal with any string but `key`;
	 * })()
	 */
	static prepare(keysAndDefaultValuePair) {
		return TrySync(() => {
			for (const key in keysAndDefaultValuePair) {
				const regex = keysAndDefaultValuePair[key];
				const capture = !regex ? `[\\s\\S]*?` : regex.source;
				if (capture.match(/\(\<\w+\>[\s\S]*?\)/g)) {
					throw Error('trying to add named capture');
				}
			}
			return (templateStringArray, ...values) =>
				new LitExp(keysAndDefaultValuePair, templateStringArray, ...values);
		});
	}
	/**
	 * @private
	 * @param {KEYS} keys
	 * @param {TemplateStringsArray} templateStringArray
	 * @param {...(keyof KEYS)} values
	 */
	constructor(keys, templateStringArray, ...values) {
		this.#templateStringArray = templateStringArray;
		this.#keyRules = keys;
		this.#values = values;
	}
	/**
	 * @type {KEYS}
	 */
	#keyRules;
	/**
	 * @type {TemplateStringsArray}
	 */
	#templateStringArray;
	/**
	 * @type {(keyof KEYS)[]}
	 */
	#values;
	/**
	 * @template {LitExpKeyType} KEYS
	 * @param {KEYS} instance_rules
	 * @param {(keyof KEYS)[]} intance_values
	 * @param {(value:keyof KEYS, regex:RegExp|false)=>ReturnType<typeof TrySync<string>>} valueHandler
	 * @param {TemplateStringsArray} strings
	 * @returns {ReturnType<typeof TrySync<string[]>>}
	 */
	static #processTemplate(instance_rules, intance_values, valueHandler, strings) {
		return TrySync(() => {
			/**
			 * @type {string[]}
			 */
			const result = [];
			const values = intance_values;
			const stringsLength = strings.length;
			for (let i = 0; i < stringsLength; i++) {
				const string = strings[i];
				if (string === undefined) {
					throw new Error('string undefined');
				}
				if (i + 1 == stringsLength && string === '') {
					result.push('(?:\\s+?|;|,|$|)');
				} else {
					result.push(LitExp.escape(string));
				}
				if (i < values.length) {
					const value = values[i];
					if (value === undefined || instance_rules[value] === undefined) {
						continue;
					}
					const [valueHandled, errorValue] = valueHandler(value, instance_rules[value]);
					if (errorValue || valueHandled === '') {
						throw errorValue;
					}
					result.push(valueHandled);
				}
			}
			return result;
		});
	}
	/**
	 * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1] &
	 * { absoluteLeadAndFollowing: boolean }} options
	 * @returns {ReturnType<typeof TrySync<RegExp>>}
	 */
	#regExp = ({ flags, whiteSpaceSensitive, absoluteLeadAndFollowing }) => {
		return TrySync(() => {
			let regExpStringCache;
			if (this.#regExpStringCache === undefined) {
				const [regExpStringCache, error] = LitExp.#processTemplate(
					this.#keyRules,
					this.#values,
					LitExp.#namedChapture,
					this.#templateStringArray
				);
				if (error) {
					throw error;
				}
				this.#regExpStringCache = regExpStringCache.join('');
			}
			if (whiteSpaceSensitive) {
				regExpStringCache = this.#regExpStringCache;
			} else {
				regExpStringCache = this.#regExpStringCache.replace(/\s+/g, `\\s+`);
			}
			return new RegExp(
				absoluteLeadAndFollowing ? `\^${regExpStringCache}\$` : regExpStringCache,
				flags
			);
		});
	};
	/**
	 * @param {Parameters<LitExp<KEYS>["evaluate"]["matchedAllAndGrouped"]>[1]} options
	 * @returns {ReturnType<typeof TrySync<RegExp>>}
	 */
	#regexToMatchAll = ({ flags, whiteSpaceSensitive }) => {
		return TrySync(() => {
			let regExpToMatchStringCache;
			if (this.#regExpToMatchStringCache === undefined) {
				const [regExpToMatchStringCache, error] = LitExp.#processTemplate(
					this.#keyRules,
					this.#values,
					LitExp.#namedChapture,
					this.#templateStringArray
				);
				if (error || regExpToMatchStringCache === undefined) {
					throw error;
				}
				this.#regExpToMatchStringCache = regExpToMatchStringCache.join('');
			}
			if (whiteSpaceSensitive) {
				regExpToMatchStringCache = this.#regExpToMatchStringCache;
			} else {
				regExpToMatchStringCache = this.#regExpToMatchStringCache.replace(/\s+/g, `\\s+`);
			}
			return new RegExp(`\(${regExpToMatchStringCache}\)`, flags);
		});
	};
	/**
	 * @typedef {ReturnType<LitExp<KEYS>["evaluate"]["execGroups"]>} ExecGroups
	 * @typedef {ExecGroups extends [infer First, ...any] ? First : undefined} FirstGroup
	 * @typedef {FirstGroup extends { result: any } ? Partial<FirstGroup["result"]> : undefined} Overrides
	 */
	/**
	 * @description
	 * - instance methods for generating things;
	 */
	make = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @instance make
			 * @description
			 * - to make string based on the template literal;
			 * @param {Partial<{ [K in keyof KEYS]?: string }>} overrides
			 * @returns {string|undefined}
			 * @example
			 * import { LitExp } from 'vivth';
			 *
			 * const [literal, errorPreparing] = LitExp.prepare({
			 * 	myKey: false,
			 * 	...keyCaptureLogicPair
			 * })
			 *
			 * // asuming no error
			 * litExp_instance = `templateLiteral:${'myKey'};`;
			 * const [result, error] = litExp_instance.make.string({
			 * 	myKey: 'actualvalue',
			 * });
			 *
			 * console.log(result); // "templateLiteral:actualvalue;"
			 */
			string: (overrides) => {
				return TrySync(() => {
					const [res, error] = LitExp.#processTemplate(
						this_.#keyRules,
						this_.#values,
						// @ts-expect-error
						(key) => {
							return TrySync(() => {
								return overrides[key];
							});
						},
						this_.#templateStringArray
					);
					if (error) {
						throw error;
					}
					return res.join('');
				})[0];
			},
		};
	});
	/**
	 * @type {string|undefined}
	 */
	#regExpStringCache;
	/**
	 * @template {LitExpKeyType} KEYS
	 * @param {RegExp|false} regex
	 * @param {keyof KEYS} value
	 * @returns {ReturnType<typeof TrySync<string>>}
	 */
	static #namedChapture(value, regex) {
		return TrySync(() => {
			const capture = regex === false ? `[\\s\\S]*?` : regex.source;
			return `(?<${value.toString()}>${capture})`;
		});
	}
	/**
	 * @type {string|undefined}
	 */
	#regExpToMatchStringCache;
	/**
	 * @description
	 * - methods collections to evaluate string with `Literal Expression`;
	 */
	evaluate = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @instance evaluate
			 * @description
			 * - to exec and grouped based on `key`;
			 * @param {string} string
			 * @param {Object} options
			 * @param {ConstructorParameters<typeof RegExp>[1]} options.flags
			 * @param {boolean} options.whiteSpaceSensitive
			 * - true: leave any whitespace as is to be used as regex detection;
			 * - false: convert all whitespace to `\s+`;
			 * @param {boolean} options.absoluteLeadAndFollowing
			 * - false: standard capture;
			 * - true: add `^` and `$` to capture definition:
			 * >- meaning string will have to match starting and end of line from capture definition;
			 * @returns {ReturnType<typeof TrySync<{
			 * result:{ whole:string, named: Record<keyof KEYS, string>},
			 * regexp:RegExp}>>
			 * }
			 * @example
			 * import { LitExp } from 'vivth';
			 *
			 * const [literal, errorPreparing] = LitExp.prepare({
			 * 	myKey: false,
			 * 	...keyCaptureLogicPair
			 * })
			 *
			 * // asuming no eror
			 * const litExp_instance = literal`templateLiteral:${'myKey'};`
			 *
			 * const [{
			 * 		result:{ // asuming there's no error
			 * 			named: { myKey },
			 * 			whole,
			 * 		},
			 * 		regex, // for reference
			 * 	}, error] = litExp_instance.evaluate.execGroups(
			 * 	`templateLiteral:Something;`,
			 * 	{ ...options }
			 * )
			 *
			 * console.log(whole); // "templateLiteral:Something;"
			 * console.log(myKey); // "Something"
			 */
			execGroups(string, options) {
				// @ts-expect-error
				return TrySync(() => {
					const [regexp, error] = this_.#regExp(options);
					if (error) {
						throw error;
					}
					const execResult = regexp.exec(string);
					if (execResult === null) {
						return undefined;
					}
					const whole = execResult[1];
					const named = execResult?.groups;
					const result = { named, whole };
					if (named === undefined) {
						throw new Error(
							JSON.stringify({
								regexpSource: regexp.source,
								message: 'no match is found',
								sugestion: 'make sure all `keys` values will capture any scenario',
							})
						);
					}
					return { result, regexp };
				});
			},
			/**
			 * @instance evaluate
			 * @description
			 * - to match all and grouped based on `key`;
			 * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0]} string
			 * @param {Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], 'absoluteLeadAndFollowing'>} options
			 * @returns {ReturnType<typeof TrySync<import('../types/LitExpResultType.mjs').LitExpResultType<KEYS>>>
			 * }
			 * @example
			 * import { LitExp, Console } from 'vivth';
			 *
			 * const [literal, errorPreparing] = LitExp.prepare({
			 * 	myKey: false,
			 * 	...keyCaptureLogicPair
			 * })
			 *
			 * // asuming no error;
			 * litExp_instance = literal`templateLiteral:${'myKey'};`
			 *
			 * const [resultOfMatchedAllAndGrouped, error] = litExp_instance.evaluate.matchedAllAndGrouped(
			 * 	`templateLiteral:Something;
			 * 	templateLiteral:SomethingElse;`,
			 * 	{ ...options }
			 * )
			 * (()=>{
			 * 	if (error) {
			 * 		Console.error(error);
			 * 		return;
			 * 	}
			 * 	const {
			 * 		result: { whole, named },
			 * 		regexp
			 * 	} = resultOfMatchedAllAndGrouped;
			 *
			 *	named.foreach(({myKey})=>{
			 *		// code
			 *	})
			 *	whole.foreach((capturedString)=>{
			 *		// code
			 *	})
			 * })()
			 */
			matchedAllAndGrouped: (string, options) => {
				return TrySync(() => {
					const [regexp, error] = this.#regexToMatchAll(options);
					if (error) {
						throw error;
					}
					/**
					 * @type {Array<Record<keyof KEYS, string>>}
					 */
					const named = [];
					/**
					 * @type {Array<string>}
					 */
					const whole = [];
					/**
					 * @type {{whole:string[], named:Array<Record<keyof KEYS, string>>}}
					 */
					const result = { named, whole };
					const matchedAll = string.matchAll(regexp);
					for (const match of matchedAll) {
						if (match.groups === undefined) {
							throw new Error(
								JSON.stringify({
									regexpSource: regexp.source,
									message: 'no match is found',
									sugestion: 'make sure all `keys` values will capture any scenario',
								})
							);
						}
						whole.push(match[1] ?? '');
						// @ts-expect-error
						named.push(match.groups);
					}
					return { result, regexp };
				});
			},
		};
	});
}
