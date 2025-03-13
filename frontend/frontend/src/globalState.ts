// globalState.ts
export let globalFlag: boolean = false; // דגל בוליאני עם טיפוס

export const setGlobalFlag = (value: boolean): void => {
  globalFlag = value;
};
