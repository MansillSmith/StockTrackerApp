import { useState, useEffect, ReactNode, useMemo } from "react";
import { Currencies, Currency, CurrencyContext } from "../types";
import { useSQLiteContext } from "expo-sqlite";

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencies, setCurrencies] = useState<Currencies>({});

  const db = useSQLiteContext();

  useEffect(() => {
    const loadCurrencies = async () => {
      const results = await db.getAllAsync<Currency>(
        "SELECT ID, Name, ShortName, Symbol FROM Currencies"
      );

      const dict: Currencies = Object.fromEntries(
        results.map(row => [row.ID, row])
      );

      setCurrencies(dict);
    };

    loadCurrencies();
  }, []);

  // memoize value so context consumers only re-render when currencies change
  const value = useMemo(() => ({ currencies, setCurrencies }), [currencies]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};