/* eslint-disable @typescript-eslint/no-unused-vars */
export const formatCurrency = (
  value: number,
  currency: string,
  lang = 'es'
) => {
  return `${currency} ${value.toFixed(2)}`;
};
