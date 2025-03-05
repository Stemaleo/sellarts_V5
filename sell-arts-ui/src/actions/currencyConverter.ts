const exchangeRates: Record<string, number> = {
  XOF: 1,
  USD: 700,
  EUR: 650,
};

export const convertPrice = (priceXOF: number, targetCurrency: string) => {
  if (targetCurrency === 'XOF') {
    return priceXOF.toString();
  }
  return (priceXOF / exchangeRates[targetCurrency]).toFixed(2);
};