export const getAccountsQuery = 
`
SELECT a.ID, a.Name, a.AccountTypeID, t.AccountBalance
FROM (
    SELECT 
	    a.id,
	    COALESCE(SUM(CASE WHEN nbt.Name = 'Debit' THEN 1 ELSE -1 END * (jl.ReportingDebit - jl.ReportingCredit)),0)/100.0 as AccountBalance
    FROM Accounts a
    INNER JOIN AccountTypes at on at.ID = a.AccountTypeID
    INNER JOIN AccountingAccountTypes aat on aat.ID = at.AccountingAccountTypeID
    INNER JOIN NormalBalanceTypes nbt on nbt.ID = aat.NormalBalanceTypeID
    LEFT JOIN  JournalLines jl on jl.AccountID = a.ID
    WHERE a.PortfolioID = ?
    GROUP BY jl.AccountID
) t
INNER JOIN Accounts a on a.ID = t.ID
ORDER BY a.AccountTypeID, a.Name
`

export const getSharesQuery = 
`
SELECT s.ID, s.Name, s.Ticker, s.Icon, t.TotalQuantity, t.TotalAmount
FROM (
	SELECT 
		s.ID,
		SUM(CASE WHEN jet.Name = 'Stock Buy' THEN 1 ELSE -1 END * jl.Quantity) as TotalQuantity,
		SUM(jl.Debit - jl.Credit)/100.0 as TotalAmount
	FROM Accounts a
	INNER JOIN  JournalLines jl on jl.AccountID = a.ID
	INNER JOIN JournalEntries je on je.ID = jl.JournalEntryID
	INNER JOIN JournalEntryTypes jet on jet.ID = je.JournalEntryTypeID
	INNER JOIN Stocks s on s.ID = jl.StockID
	WHERE a.ID = ?
	GROUP BY s.ID
) t
INNER JOIN Stocks s ON t.ID = s.ID
`

export const getFinancialAccountTransactions = 
`
SELECT je.ID as JournalEntryID, je.TimestampUNIX, je.Description, jl.Debit/100.0 as Debit, jl.Credit/100.0 as Credit
FROM Accounts a
INNER JOIN JournalLines jl on jl.AccountID = a.ID
INNER JOIN JournalEntries je on je.ID = jl.JournalEntryID
WHERE a.ID = ?
ORDER BY TimestampUNIX DESC
`

export const getFinancialAcccountDetails = 
`
SELECT a.ID, a.Name, nbt.Name as AccountType
FROM Accounts a
INNER JOIN AccountTypes accT on a.AccountTypeID = accT.ID
INNER JOIN AccountingAccountTypes aat on aat.ID = acct.AccountingAccountTypeID
INNER JOIN NormalBalanceTypes nbt on nbt.ID = aat.NormalBalanceTypeID
WHERE a.ID = ?
`