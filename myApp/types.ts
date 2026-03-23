export type RootStackParamList = {
  Portfolios: undefined;
  PortfolioAccounts: { ID: number };
  // PortfolioID: { ID: number };
};

export type PortfolioAccount = {
  ID: number;
  Name:string;
}