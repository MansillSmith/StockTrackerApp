import { createContext } from "react";

export type RootStackParamList = {
  Portfolios: undefined;
  Accounts: undefined;
  PortfolioAccounts: { ID: number };
  // PortfolioID: { ID: number };
  ShareAccounts: {ID: number};
  FinancialAccount: {ID: number, AccountBalance:number};
  WalletTopUp: {PortfolioID: number};
  Transactions: {PortfolioID: number};
};

export type PortfolioAccountProp = {
  ID: number;
  Name:string;
  AccountTypeID: number;
  AccountBalance: number
}

export type NamedItem = {ID: number, Name:string}
export type PortfolioItemData = NamedItem

export type Currency = {ID: number, Name:string, ShortName:string, Symbol:string}
export type Currencies = Record<number, Currency>
type CurrencyContextType = {
  currencies: Currencies;
  setCurrencies: React.Dispatch<React.SetStateAction<Currencies>>;
};

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export type JournalLine = { ID:number, JournalEntryID: number, StockName: string | undefined, Quantity:number | undefined, AccountName: string, Debit:number, Credit:number, ReportingDebit:number, ReportingCredit:number }
export type StockMarket = {ID: number, MarketName:string}
export type Stock = {ID: number, Name:string, Ticker:string, StockMarket:StockMarket }