export function CreateImmutable<P extends unknown, O extends unknown>(parent: P, keyName: string, object: (this: P) => O, { lazy }?: {
    lazy?: boolean;
}): O;
