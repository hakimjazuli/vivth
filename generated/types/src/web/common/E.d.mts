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
export function E<K extends keyof HTMLElementTagNameMap, RR extends Partial<HTMLElementTagNameMap[K]> & Record<string, any>>(tagName: K, attrs?: (Omit<Record<string, string | Signal<string>>, "style" | "class"> & {
    style?: string;
    class?: string;
}), props?: RR, childNodes?: ChildNode[] | Signal<ChildNode[]>): HTMLElementTagNameMap[K] & RR & {
    onDisconnected: () => void;
};
import { Signal } from '../../class/Signal.mjs';
