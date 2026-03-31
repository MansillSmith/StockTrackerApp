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

export type PortfolioItemData = {ID: number, Name:string}

export type FormInputProps = {label:string, getter:any, setter: (text:string) => void, tiKeyboardType?:any, placeholder?:string}