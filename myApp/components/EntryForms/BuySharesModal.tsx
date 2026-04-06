import { View, Text, TextInput, StyleSheet } from "react-native";
import { SimpleModal } from "../SimpleModals/SimpleModal";
import { globalStyles } from "../../styles";
import { useEffect, useState } from "react";
import { DatePicker } from "../SimpleModals/DatePicker";
import { FormPicker } from "../SimpleModals/FormPicker";
import { useSQLiteContext } from "expo-sqlite";
import { Currency, NamedItem, Stock } from "../../types";
import { useCurrencies } from "../../hooks";

type WalletData = { ID: number, Name:string, CurrencyID: number}
export type BuySharesModalProps = { showModal: boolean, portfolioID:number, onClose: () => void,}
export function BuySharesModal({ showModal, portfolioID, onClose}: BuySharesModalProps){
    const { currencies } = useCurrencies();
    const [portfolioCurrency, setPortfolioCurrency] = useState<Currency | undefined>();

    const [walletAccounts, setWalletAccounts] = useState<WalletData[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [transactionFeeAccounts, setTransactionFeeAccounts] = useState<NamedItem[]>([]);

    const [formWalletAccountID, setFormWalletAccountID] = useState<number | undefined>();
    const [formStock, setFormStock] = useState<Stock | undefined>();
    const [formAmount, setFormAmount] = useState<number | undefined>();
    const [formPurchaseAmount, setFormPurchaseAmount] = useState<number | undefined>();
    const [formTransactionFeeAccount, setFormTransactionFeeAccount] = useState<NamedItem | undefined>();
    const [formTransactionFee, setFormTransactionFee] = useState<number | undefined>();
    const [formDate, setFormDate] = useState<Date>(new Date(Date.now()))
    const [formDescription, setFormDescription] = useState<string | undefined>();

    const db = useSQLiteContext()

    async function saveData(){

    } 

    useEffect(() => {
        async function getPortfolioCurrency() {
            const results:any = await db.getAllAsync('SELECT DefaultCurrencyID FROM Portfolios WHERE ID = ?', [portfolioID])
            const data:number = results[0].DefaultCurrencyID
            setPortfolioCurrency(currencies[data])
            return data
        }

        async function getAccounts(accountName:string, setter: (items: WalletData[]) => void, selectedSetter: (selected: NamedItem) => void){
            const results = await db.getAllAsync(`
                SELECT a.ID, a.Name, a.DefaultCurrencyID
                FROM Accounts a
                INNER JOIN AccountTypes accT on accT.ID = a.AccountTypeID
                WHERE accT.Name = ?
                AND a.PortfolioID = ?
                --AND a.DefaultCurrencyID = ?
            `, [accountName, portfolioID])
            const data: WalletData[] = results.map((row:any) =>({
                ID: row.ID,
                Name: row.Name,
                CurrencyID: row.CurrrencyID
            }))
            setter(data)
            selectedSetter(data[0])
        }

        async function getStocks(){
            const results = await db.getAllAsync(`
                SELECT s.ID as StockID, s.Name as StockName, s.Ticker, sm.ID as MarketID, sm.MarketName
                FROM Stocks s
                INNER JOIN StockMarket sm on sm.ID = s.MarketID
                ORDER BY s.Ticker
            `)
            const data:Stock[] = results.map((row:any) => ({
                ID: row.StockID,
                Name: row.StockName,
                Ticker: row.Ticker,
                StockMarket: { ID: row.MarketID, MarketName: row.MarketName}
            }))
            setStocks(data)
            setFormStock(data[0])
        }

        async function getTransactionFeeAccounts(){
            // TODO: update this to some sort of schema thing
            const results = await db.getAllAsync<NamedItem>(`
                SELECT a.ID, a.Name
                FROM Accounts a
                INNER JOIN AccountTypes accT on accT.ID = a.AccountTypeID
                WHERE a.PortfolioID = ?
                AND acct.Name = 'Transaction Fees'
            `, [portfolioID])
            setTransactionFeeAccounts(results)
            setFormTransactionFeeAccount(results[0])
        }

        getAccounts("Wallet", (items) => setWalletAccounts(items), (selected) => setFormWalletAccountID(selected.ID))
        getStocks()
        getTransactionFeeAccounts()
        getPortfolioCurrency()
    }, [showModal])

    return (
        <SimpleModal 
            showModal={showModal} 
            onClose={onClose} 
            onSave={async () => {
                onClose()
                await saveData()
            }}
        >
            <Text>Buy Shares</Text>
            <FormPicker label="Wallet:" items={walletAccounts} getter={formWalletAccountID} setter={(e:any) => {setFormWalletAccountID(e)}}/>
            <FormPicker label="Share:" items={stocks} getter={formStock} setter={(e:any) => {setFormStock(e)}} labelKey="Ticker"/>
            { formWalletAccountID !== portfolioCurrency?.ID && <Text>Put Exchange Fees here</Text>}
            <View style={styles.horizontalContainer}>
                <View style = {[{width:'70%'}]}>
                    <FormPicker label="Tx Fee:" items={transactionFeeAccounts} getter={formTransactionFeeAccount} setter={(e:any) => {setFormTransactionFeeAccount(e)}} showText={transactionFeeAccounts.length > 1}/>
                </View>
                <TextInput 
                    style = {[globalStyles.input, globalStyles.textInput, {width:'28%'}]}
                    placeholder="Transaction Fee"
                    value={formTransactionFee?.toString()}
                    keyboardType="default"
                    onChangeText={(e:any) => { setFormTransactionFee(e)}}
                />
            </View>
            <View style={styles.horizontalContainer}>
                <TextInput 
                    style = {[globalStyles.input, globalStyles.textInput, {width:'48%'}]}
                    placeholder="Amount"
                    value={formAmount?.toString()}
                    keyboardType="default"
                    onChangeText={(e:any) => { setFormAmount(e)}}
                />
                <TextInput 
                    style = {[globalStyles.input, globalStyles.textInput, {width:'48%'}]}
                    placeholder="Price"
                    value={formPurchaseAmount?.toString()}
                    keyboardType="default"
                    onChangeText={(e:any) => { setFormPurchaseAmount(e)}}
                />
            </View>
            <DatePicker 
                dateString={formDate?.toLocaleString()} 
                setDate = {(e:Date) => {setFormDate(e)}}
            />
            <TextInput 
                style = {[globalStyles.input, globalStyles.textInput]}
                placeholder="Description"
                value={formDescription}
                keyboardType="default"
                onChangeText={(e:any) => { setFormDescription(e)}}
            />
        </SimpleModal>
    )
}

const styles = StyleSheet.create({
    horizontalContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent: 'space-between'
    }
})