import { useSQLiteContext } from "expo-sqlite";
import { GetUnixTime } from "../../utils/Utils";
import { useEffect, useState } from "react";
import { TextInput, View, Pressable, Text, Modal } from "react-native";
import { FormPicker } from "../SimpleModals/FormPicker";
import { globalStyles } from "../../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Currency, NamedItem, RootStackParamList } from "../../types";
import { useCurrencies } from "../../hooks";
import { DatePicker } from "../SimpleModals/DatePicker";
import { SimpleModal } from "../SimpleModals/SimpleModal";

//TODO: move this!


type WalletTopUpData = { 
    Amount:number | undefined,
    WalletAccountID: number | undefined
    EquityAccountID: number | undefined,
    Description: string | undefined,
    Date: Date | undefined
}

export type WalletTopUpModal = { showModal: boolean, onClose: () => void, portfolioID:number, data?:WalletTopUpData }
export function WalletTopUpModal({ showModal, onClose, portfolioID, data }: WalletTopUpModal){
    // const { Amount, WalletAccountID, EquityAccountID, Description, Date } = data

    const { currencies } = useCurrencies();
    const [portfolioCurrency, setPortfolioCurrency] = useState<Currency | undefined>();

    // const [journalEntryTypes, setJournalEntryTypes] = useState<NamedItem[]>([]);
    const [walletAccounts, setWalletAccounts] = useState<NamedItem[]>([]);
    const [equityAccounts, setEquityAccounts] = useState<NamedItem[]>([]);

    const [formWalletAmount, setFormWalletAmount] = useState<number | undefined>(data?.Amount);
    const [formWalletAccountID, setFormWalletAccountID] = useState<number | undefined>(data?.WalletAccountID);
    const [formEquityAccountID, setFormEquityAccountID] = useState<number | undefined>(data?.EquityAccountID);
    const [formDescription, setFormDescription] = useState<string | undefined>(data?.Description);
    const [formDate, setFormDate] = useState<Date>(data?.Date ?? new Date(Date.now()))

    const db = useSQLiteContext();

    // const { PortfolioID } = route.params

    async function saveWalletTopUp(){

        // add a new journal entry
        let journalEntryID:number = 0
        console.log()
        if(formWalletAmount !== undefined && formDescription !== undefined && formDate !== undefined && formEquityAccountID !== undefined && formWalletAccountID !== undefined){
            const storeAmount = formWalletAmount*100

            const addJournalEntryQuery = `INSERT INTO JournalEntries (PortfolioID, TimestampUNIX, Description, JournalEntryTypeID) VALUES (?, ?, ?, ?)`
            const results = await db.runAsync(addJournalEntryQuery, [portfolioID, GetUnixTime(formDate.getTime()), formDescription, 1])
            journalEntryID = results.lastInsertRowId
            // console.log(journalEntryID)

            // credit equity
            // debit wallet
            if(journalEntryID !== 0){
                const addJournalLinesQuery = `INSERT INTO JournalLines (JournalEntryID, AccountID, Debit, Credit, ReportingDebit, ReportingCredit) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?)`
                await db.runAsync(addJournalLinesQuery,         [journalEntryID, formWalletAccountID, storeAmount, 0, storeAmount, 0, 
                                                                journalEntryID, formEquityAccountID, 0, storeAmount, 0, storeAmount])
            }
        }
    }

    async function clearForm(){
        [setFormDescription, setFormEquityAccountID, setFormWalletAccountID, setFormWalletAmount].map((i) => i(undefined))
    }

    useEffect(() => {

        async function getPortfolioCurrency() {
            const results:any = await db.getAllAsync('SELECT DefaultCurrencyID FROM Portfolios WHERE ID = ?', [portfolioID])
            const data:number = results[0].DefaultCurrencyID
            setPortfolioCurrency(currencies[data])
            return data
        }

        async function getAccounts(accountName:string, setter: (items: NamedItem[]) => void, currencyID:number){
            const results = await db.getAllAsync(`
                SELECT a.ID, a.Name
                FROM Accounts a
                INNER JOIN AccountTypes accT on accT.ID = a.AccountTypeID
                WHERE accT.Name = ?
                AND a.PortfolioID = ?
                AND a.DefaultCurrencyID = ?
            `, [accountName, portfolioID, currencyID])
            const data: NamedItem[] = results.map((row:any) =>({
                ID: row.ID,
                Name: row.Name
            }))
            setter(data)
        }

        async function loadData(){
            // getJournalEntryTypes()
            const currencyID = await getPortfolioCurrency()
            getAccounts("Wallet", (items) => setWalletAccounts(items), currencyID)
            getAccounts("Equity", (items) => setEquityAccounts(items), currencyID)
        }
        loadData()
    }, [portfolioID])

    return (
        <SimpleModal 
            showModal={showModal} 
            onClose={onClose} 
            onSave={() => {
                saveWalletTopUp();
                onClose();
            }}
        >
            <Text>Wallet Top Up</Text>
            <Text style={{fontSize:10}}>Only top ups in the default currency are support ({portfolioCurrency?.ShortName})</Text>
            <FormPicker label="Wallet:" items={walletAccounts} getter={formWalletAccountID} setter={(e:any) => {setFormWalletAccountID(e)}}/>
            <FormPicker label="Equity:" items={equityAccounts} getter={formEquityAccountID} setter={(e:any) => {setFormEquityAccountID(e)}}/>
            <TextInput 
                style = {[globalStyles.input, globalStyles.textInput]}
                placeholder="Top up Amount"
                value={formWalletAmount?.toLocaleString('en-NZ', {style: "currency", currency: "NZD"})}
                keyboardType="numeric"
                onChangeText={(e:any) => {setFormWalletAmount(e)}}
            />
            <DatePicker 
                dateString={formDate?.toLocaleString()} 
                // isVisible={false}
                // setVisible={(isVisible:boolean) => {}}
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