export type DevTestCB = (testName: string, testCallback: () => Promise<boolean>) => Promise<{
    removeId: () => void;
}>;
