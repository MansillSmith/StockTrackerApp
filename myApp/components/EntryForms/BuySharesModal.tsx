import { View, Text, TextInput, StyleSheet } from "react-native";
import { SimpleModal } from "../SimpleModals/SimpleModal";
import { globalStyles } from "../../styles";
import { useEffect, useState } from "react";
import { DatePicker } from "../SimpleModals/DatePicker";
import { FormPicker } from "../SimpleModals/FormPicker";
import { useSQLiteContext } from "expo-sqlite";
import { NamedItem, Stock } from "../../types";

export type BuySharesModalProps = { showModal: boolean, portfolioID:number, onClose: () => void,}
export function BuySharesModal({ showModal, portfolioID, onClose}: BuySharesModalProps){
    const [walletAccounts, setWalletAccounts] = useState<NamedItem[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [transactionFeeAccounts, setTransacitonFeeAccounts] = useState<NamedItem[]>([]);

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
        async function getAccounts(accountName:string, setter: (items: NamedItem[]) => void){
            const results = await db.getAllAsync(`
                SELECT a.ID, a.Name
                FROM Accounts a
                INNER JOIN AccountTypes accT on accT.ID = a.AccountTypeID
                WHERE accT.Name = ?
                AND a.PortfolioID = ?
                --AND a.DefaultCurrencyID = ?
            `, [accountName, portfolioID])
            const data: NamedItem[] = results.map((row:any) =>({
                ID: row.ID,
                Name: row.Name
            }))
            setter(data)
        }

        async function getStocks(){
            const results = await db.getAllAsync(`
                SELECT s.ID as StockID, s.Name as StockName, s.Ticker, sm.ID as MarketID, sm.MarketName
                FROM Stocks s
                INNER JOIN StockMarket sm on sm.ID = s.MarketID
            `)
            const data:Stock[] = results.map((row:any) => ({
                ID: row.StockID,
                Name: row.StockName,
                Ticker: row.Ticker,
                StockMarket: { ID: row.MarketID, MarketName: row.MarketName}
            }))
            setStocks(data)
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
            setTransacitonFeeAccounts(results)
        }

        getAccounts("Wallet", (items) => setWalletAccounts(items))
        getStocks()
        getTransactionFeeAccounts()
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
            {/* if the wallet is not the default currency, then add foreign exchange */}
            <FormPicker label="Share:" items={stocks} getter={formStock} setter={(e:any) => {setFormStock(e)}} labelKey="Ticker"/>
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
            <View style={styles.horizontalContainer}>
                <View style = {[globalStyles.input, globalStyles.textInput, {width:'48%'}]}>
                    <FormPicker label="Tx Fee:" items={transactionFeeAccounts} getter={formTransactionFeeAccount} setter={(e:any) => {setFormTransactionFeeAccount(e)}}/>
                </View>
                <TextInput 
                    style = {[globalStyles.input, globalStyles.textInput, {width:'48%'}]}
                    placeholder="Transaction Fee"
                    value={formTransactionFee?.toString()}
                    keyboardType="default"
                    onChangeText={(e:any) => { setFormTransactionFee(e)}}
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