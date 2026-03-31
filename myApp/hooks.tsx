import { useContext } from "react";
import { CurrencyContext } from "./types";

export const useCurrencies = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrencies must be used within CurrencyProvider");
  return context;
};