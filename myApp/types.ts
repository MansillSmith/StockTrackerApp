import { createContext } from "react";

export type RootStackParamList = {
  Portfolios: undefined;
  Accounts: undefined;
  PortfolioAccounts: { ID: number };
  // PortfolioID: { ID: number };
  ShareAccounts: {ID: number};
  FinancialAccount: {ID: number, AccountBalance:number};
};

export type PortfolioAccountProp = {
  ID: number;
  Name:string;
  AccountTypeID: number;
  AccountBalance: number
}

export type PortfolioItemData = {ID: number, Name:string, DefaultCurrencyID: number}

export type FormInputProps = {label:string, getter:any, setter: (text:string) => void, tiKeyboardType?:any, placeholder?:string}

export type Currency = {ID: number, Name:string, ShortName:string, Symbol:string}
export type Currencies = Record<number, Currency>
type CurrencyContextType = {
  currencies: Currencies;
  setCurrencies: React.Dispatch<React.SetStateAction<Currencies>>;
};

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);