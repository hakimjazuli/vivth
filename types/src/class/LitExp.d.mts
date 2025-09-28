/**
 * @description
 * - class helper to created opionated regex helper;
 * - named capture uses `es6+` feature, you might need to add polyfill to target extremely old browser;
 * - class name refer to `Literal Expression`;
 * - please be patient when using this class;
 * >- destructuring is meant for extensive typehelper;
 * >- and destructuring can lead to unhandled error here and there;
 * >- therefore error as value is introduced to help to prevent error on runtime;
 * @template {LitExpKeyType} KEYS
 */
export class LitExp<KEYS extends import("../types/LitExpKeyType.mjs").LitExpKeyType> {
    /**
     * @typedef {import("../types/LitExpKeyType.mjs").LitExpKeyType} LitExpKeyType
     */
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
    static prepare: (keysAndDefaultValuePair: KEYS_1) => ReturnType<typeof TrySync<(templateStringArray: TemplateStringsArray, ...values: (keyof KEYS_1)[]) => LitExp<KEYS_1>>>;
    /**
     * @template {LitExpKeyType} KEYS
     * @param {KEYS} instance_rules
     * @param {(keyof KEYS)[]} intance_values
     * @param {(value:keyof KEYS, regex:RegExp|false)=>ReturnType<typeof TrySync<string>>} valueHandler
     * @param {TemplateStringsArray} strings
     * @returns {ReturnType<typeof TrySync<string[]>>}
     */
    static #processTemplate: (instance_rules: KEYS_1, intance_values: (keyof KEYS_1)[], valueHandler: (value: keyof KEYS_1, regex: RegExp | false) => ReturnType<typeof TrySync<string>>, strings: TemplateStringsArray) => ReturnType<typeof TrySync<string[]>>;
    /**
     * @template {LitExpKeyType} KEYS
     * @param {RegExp|false} regex
     * @param {keyof KEYS} value
     * @returns {ReturnType<typeof TrySync<string>>}
     */
    static #namedChapture: (value: keyof KEYS_1, regex: RegExp | false) => ReturnType<typeof TrySync<string>>;
    /**
     * @private
     * @param {KEYS} keys
     * @param {TemplateStringsArray} templateStringArray
     * @param {...(keyof KEYS)} values
     */
    private constructor();
    /**
     * @description
     * - instance methods for generating things;
     */
    make: {
        /**
         * @instance make
         * @description
         * - to make string based on the template literal;
         * @param {Partial<ReturnType<LitExp<KEYS>["evaluate"]["execGroups"]>>[0]["result"]} overrides
         * @returns {string}
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
        string: (overrides: Partial<ReturnType<LitExp<KEYS>["evaluate"]["execGroups"]>>[0]["result"]) => string;
    } & {
        "vivth:unwrapLazy;": () => {
            /**
             * @instance make
             * @description
             * - to make string based on the template literal;
             * @param {Partial<ReturnType<LitExp<KEYS>["evaluate"]["execGroups"]>>[0]["result"]} overrides
             * @returns {string}
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
            string: (overrides: Partial<ReturnType<LitExp<KEYS>["evaluate"]["execGroups"]>>[0]["result"]) => string;
        };
    };
    /**
     * @description
     * - methods collections to evaluate string with `Literal Expression`;
     */
    evaluate: {
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
        execGroups: (string: string, options: {
            flags: ConstructorParameters<typeof RegExp>[1];
            whiteSpaceSensitive: boolean;
            absoluteLeadAndFollowing: boolean;
        }) => ReturnType<typeof TrySync<{
            result: {
                whole: string;
                named: Record<keyof KEYS, string>;
            };
            regexp: RegExp;
        }>>;
        /**
         * @instance evaluate
         * @description
         * - to match all and grouped based on `key`;
         * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0]} string
         * @param {Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], 'absoluteLeadAndFollowing'>} options
         * @returns {ReturnType<typeof TrySync<{result:{whole:string[], named:Array<Record<keyof KEYS, string>>},
         * regexp: RegExp}>>
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
         * 		result: {
         * 				whole: [whole0, whole1],
         * 				named: [
         * 					{ myKey: myKeyExec0, },
         * 					{ myKey: myKeyExec1, },
         * 				],
         * 			},
         * 		regexp
         * 	} = resultOfMatchedAllAndGrouped;
         *
         * 	console.log(whole0); // "templateLiteral:Something;"
         * 	console.log(whole1); // "templateLiteral:SomethingElse;"
         * 	console.log(myKeyExec0); // "Something"
         * 	console.log(myKeyExec1); // "SomethingElse"
         * })()
         */
        matchedAllAndGrouped: (string: Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0], options: Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], "absoluteLeadAndFollowing">) => ReturnType<typeof TrySync<{
            result: {
                whole: string[];
                named: Array<Record<keyof KEYS, string>>;
            };
            regexp: RegExp;
        }>>;
    } & {
        "vivth:unwrapLazy;": () => {
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
            execGroups: (string: string, options: {
                flags: ConstructorParameters<typeof RegExp>[1];
                whiteSpaceSensitive: boolean;
                absoluteLeadAndFollowing: boolean;
            }) => ReturnType<typeof TrySync<{
                result: {
                    whole: string;
                    named: Record<keyof KEYS, string>;
                };
                regexp: RegExp;
            }>>;
            /**
             * @instance evaluate
             * @description
             * - to match all and grouped based on `key`;
             * @param {Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0]} string
             * @param {Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], 'absoluteLeadAndFollowing'>} options
             * @returns {ReturnType<typeof TrySync<{result:{whole:string[], named:Array<Record<keyof KEYS, string>>},
             * regexp: RegExp}>>
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
             * 		result: {
             * 				whole: [whole0, whole1],
             * 				named: [
             * 					{ myKey: myKeyExec0, },
             * 					{ myKey: myKeyExec1, },
             * 				],
             * 			},
             * 		regexp
             * 	} = resultOfMatchedAllAndGrouped;
             *
             * 	console.log(whole0); // "templateLiteral:Something;"
             * 	console.log(whole1); // "templateLiteral:SomethingElse;"
             * 	console.log(myKeyExec0); // "Something"
             * 	console.log(myKeyExec1); // "SomethingElse"
             * })()
             */
            matchedAllAndGrouped: (string: Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[0], options: Omit<Parameters<LitExp<KEYS>["evaluate"]["execGroups"]>[1], "absoluteLeadAndFollowing">) => ReturnType<typeof TrySync<{
                result: {
                    whole: string[];
                    named: Array<Record<keyof KEYS, string>>;
                };
                regexp: RegExp;
            }>>;
        };
    };
    #private;
}
import { TrySync } from '../function/TrySync.mjs';
