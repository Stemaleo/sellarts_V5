import { useCurrency } from "@/context/CurrencyContext";

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <select value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
      <option value="USD">USD ($)</option>
      <option value="EUR">EUR (€)</option>
      <option value="XOF">XOF (CFA)</option>
    </select>
  );
};

export default CurrencySelector;
