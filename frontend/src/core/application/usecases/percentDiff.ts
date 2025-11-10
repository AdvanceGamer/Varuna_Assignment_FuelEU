export const percentDiff = (comparison: number, baseline: number) =>
  baseline === 0 ? 0 : ((comparison / baseline) - 1) * 100;
