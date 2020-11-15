export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const hex2bin = (hex: string): string => {
  return ('00000000' + parseInt(hex, 16).toString(2)).substr(-8);
};
