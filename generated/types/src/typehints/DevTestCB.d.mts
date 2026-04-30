export type DevTestCB = (testName: string, testCallback: () => Promise<boolean>) => {
    removeId: () => void;
};
