/**
 * - return type of Q callback fifo;
 */
export type QCBFIFOReturn = Omit<import("./QCBReturn.mjs").QCBReturn, "isLastOnQ">;
