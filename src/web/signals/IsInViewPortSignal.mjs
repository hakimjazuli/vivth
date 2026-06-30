// @ts-check

import { Console } from '../../class/Console.mjs';
import { QChannel } from '../../class/QChannel.mjs';
import { Signal } from '../../class/Signal.mjs';
import { IsInstanceOf } from '../../function/IsInstanceOf.mjs';
import { LazyFactory } from '../../function/LazyFactory.mjs';

/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - signal helper to check whether element is in viewport;
 * @implements {VivthCleanup}
 * @extends {Signal<boolean>}
 */
export class IsInViewPortSignal extends Signal {
	/**
	 * @description
	 * @override
	 * - cleanup callback;
	 */
	vivthCleanup = async () => {
		IsInViewPortSignal.#intersectionObserver.unobserve(this.#element);
		this.remove.ref();
		IsInViewPortSignal.#mapped.delete(this.#element);
	};
	/**
	 * @description
	 * @param {Element} element
	 */
	constructor(element) {
		super(IsInViewPortSignal.#isInViewport(element));
		IsInViewPortSignal.#mapped.set(element, this);
		this.#element = element;
		IsInViewPortSignal.#intersectionObserver.observe(element);
	}
	/**
	 * @type {Element}
	 */
	#element;
	/**
	 * @type {WeakMap<Element, Signal<boolean>>}
	 */
	static #mapped = new WeakMap();
	/**
	 * @type {IntersectionObserver|undefined}
	 */
	static #intersectionObserver_;
	static #q = LazyFactory(() => new QChannel('IsInViewPort'));
	static get #intersectionObserver() {
		if (!IsInViewPortSignal.#intersectionObserver_) {
			IsInViewPortSignal.#intersectionObserver_ = new IntersectionObserver(
				IsInViewPortSignal.#intersectionObserverCallback,
				IsInViewPortSignal.#intersectionObserverInit,
			);
		}
		return IsInViewPortSignal.#intersectionObserver_;
	}
	/**
	 * @type {IntersectionObserverInit}
	 */
	static #intersectionObserverInit = {
		root: null,
		rootMargin: '0px',
		threshold: 0,
	};
	/**
	 * @type {IntersectionObserverCallback}
	 */
	static #intersectionObserverCallback = (entries) => {
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (!entry) {
				continue;
			}
			const target = entry.target;
			if (!IsInstanceOf(target, Element)) {
				continue;
			}
			IsInViewPortSignal.#q.callback(target, async ({ isLastOnQ }) => {
				await IsInViewPortSignal.#qCB(isLastOnQ, target, entry);
			});
		}
	};
	/**
	 * @param {()=>boolean} isLastOnQ
	 * @param {Element} target
	 * @param {IntersectionObserverEntry} entry
	 * @returns {Promise<void>}
	 */
	static #qCB = async (isLastOnQ, target, entry) => {
		if (!isLastOnQ()) {
			return;
		}
		const signal = IsInViewPortSignal.#mapped.get(target);
		if (!signal || !IsInstanceOf(signal, IsInViewPortSignal)) {
			return;
		}
		signal.#setSuperValue(entry.isIntersecting);
	};
	/**
	 * @param {Element} element
	 * @returns {boolean}
	 */
	static #isInViewport(element) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top < window.innerHeight &&
			rect.bottom > 0 &&
			rect.left < window.innerWidth &&
			rect.right > 0
		);
	}
	/**
	 * @param {boolean} newValue
	 */
	#setSuperValue(newValue) {
		super.value = newValue;
	}
	/**
	 * @description
	 * - `Signal.value` reference to check if element is in viewport;
	 * @returns {boolean}
	 * @override
	 */
	get value() {
		return super.value;
	}
	/**
	 * @returns {boolean}
	 * @override
	 */
	set value(_) {
		Console.error('you cannot manually set value of IsInViewPortSignal');
	}
}
