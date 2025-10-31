/**
 * Description
 * @param {(
 * this:{defer:(tobeDefered:()=>Promise<void>)=>void}
 * )=>Promise<void>} cb
 * @returns {void}
 */
export function WithDefer(cb: (this: {
    defer: (tobeDefered: () => Promise<void>) => void;
}) => Promise<void>): void;
