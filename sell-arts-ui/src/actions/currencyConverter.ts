const exchangeRates: Record<string, number> = {
  XOF: 1,
  USD: 700,
  EUR: 650,
};
export const convertPrice = (priceXOF: number | null | undefined, targetCurrency: string) => {
  // Return 0 if price is null or undefined
  if (priceXOF === null || priceXOF === undefined) {
    return "0";
  }
  
  if (targetCurrency === 'XOF') {
    return priceXOF.toFixed(0).toString();
  }
  
  // Check if the exchange rate exists
  if (!exchangeRates[targetCurrency]) {
    return "0";
  }
  
  return (priceXOF / exchangeRates[targetCurrency]).toFixed(0);
};