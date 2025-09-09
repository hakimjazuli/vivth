export function EventObject<N extends string>(name: N): {
    [EventNameSpace]: N;
};
import { EventNameSpace } from '../common/EventNameSpace.mjs';
