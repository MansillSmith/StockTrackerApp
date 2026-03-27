export type RootStackParamList = {
  Portfolios: undefined;
  Accounts: undefined;
  PortfolioAccounts: { ID: number };
  // PortfolioID: { ID: number };
  ShareAccounts: {ID: number};
  FinancialAccount: {ID: number};
};

export type PortfolioAccountProp = {
  ID: number;
  Name:string;
  AccountTypeID: number;
  AccountBalance: number
}

export type PortfolioItemData = {ID: number, Name:string}
