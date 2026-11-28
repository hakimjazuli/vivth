import { QChannel } from '../class/QChannel.mjs';
/**
 * @description
 * - is a [QChannel](#qchannel) instance helper to queue operations;
 * - use with certain unique object, preferably cached;
 * - avoid use primitive like, number | string | etc, if there would be possible name collision, as it will silently runs the callback anyway;
 * > - you can ofcourse still use them for wails `Events` names;
 * @type {QChannel<any>}
 * @example
 * import { WailsMainQ } from 'vivth/neutral';
 * const myCallback = async({ isLastOnQ })=>{
 * 	if (!isLastOnQ()) {
 * 		return;
 * 	}
 *   // code
 * }
 * WailsMainQ.callback(
 *  myCallback, // id
 *  myCallback // actual callback to run
 * );
 */
export declare const WailsMainQ: QChannel<any>;
