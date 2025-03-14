const exchangeRates: Record<string, number> = {
  XOF: 1,
  USD: 700,
  EUR: 650,
};

export const convertPrice = (priceXOF: number, targetCurrency: string) => {
  if (targetCurrency === 'XOF') {
    return priceXOF.toFixed(0).toString();
  }
  return (priceXOF / exchangeRates[targetCurrency]).toFixed(0);
};