export type RootStackParamList = {
  Portfolios: undefined;
  Accounts: undefined;
  PortfolioAccounts: { ID: number };
  // PortfolioID: { ID: number };
};

export type PortfolioAccount = {
  ID: number;
  Name:string;
}