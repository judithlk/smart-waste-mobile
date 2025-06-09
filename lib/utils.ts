export const getFullError = (error: any) =>
  JSON.stringify(error, Object.getOwnPropertyNames(error));
