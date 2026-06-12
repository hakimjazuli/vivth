// @ts-check

import { Effect } from '../../class/Effect.mjs';
import { Signal } from '../../class/Signal.mjs';
import { WalkThrough } from '../../class/WalkThrough.mjs';
import { ForInSync } from '../../function/ForInSync.mjs';
import { IsTypeOf } from '../../function/IsTypeOf.mts';

/**
 * @param {Element} element
 * @param {ChildNode[]} childNodes
 * @returns {void}
 */
const modifyChild = (element, childNodes) => {
	const len = Math.max(element.childNodes.length, childNodes.length);
	/**
	 * @type {ChildNode[]}
	 */
	const shouldBeRemoved = [];
	for (let i = 0; i < len; i++) {
		const currentChildNode = element.childNodes[i];
		const shouldBeChildNode = childNodes[i];
		if (currentChildNode) {
			if (shouldBeChildNode) {
				if (currentChildNode !== shouldBeChildNode) {
					currentChildNode.replaceWith(shouldBeChildNode);
				}
			} else {
				shouldBeRemoved.push(currentChildNode);
			}
		} else {
			if (shouldBeChildNode) {
				element.append(shouldBeChildNode);
			} else {
				break;
			}
		}
	}
	for (let i = 0; i < shouldBeRemoved.length; i++) {
		shouldBeRemoved[i]?.remove();
	}
};

/**
 * @description
 * - helper function to create element;
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
 * @example
 * const text = new Text('hello');
 * const div = E('div',{
 * 		class: 'p-1 m-1',
 * 		id: 'my-div',
 * 	},
 * 	{
 * 		onclick(e){
 * 			console.log(e);
 * 		},
 * 	},
 * 	[text],
 * )
 * // fine grain modify
 * text.nodeValue = 'hello world';
 */
export function E(
	tagName,
	attrs = {},
	// @ts-expect-error
	props = {},
	childNodes = [],
) {
	const element = document.createElement(tagName);
	/**
	 * @type {Set<()=>any>}
	 */
	const setOFDisconnected = new Set();
	ForInSync(attrs, (key, value) => {
		if (IsTypeOf(value, 'string')) {
			element.setAttribute(key, value);
		} else {
			const effect = new Effect(async ({ subscribe }) => {
				element.setAttribute(key, subscribe(value).value);
			});
			value.subscribers.setOf.add(effect);
			setOFDisconnected.add(() => {
				value.vivthCleanup();
				effect.vivthCleanup();
			});
		}
	});
	ForInSync(props, (key, value) => {
		// @ts-expect-error
		element[key] = value;
	});
	if (Array.isArray(childNodes)) {
		element.append(...childNodes);
	} else {
		const effect = new Effect(async ({ subscribe }) => {
			modifyChild(element, subscribe(childNodes).value);
		});
		childNodes.subscribers.setOf.add(effect);
		setOFDisconnected.add(effect.vivthCleanup);
	}
	return Object.assign(element, {
		...props,
		onDisconnected: () => {
			WalkThrough.set(setOFDisconnected, (cb) => {
				cb();
			});
			element.remove();
		},
	});
}
