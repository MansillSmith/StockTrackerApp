import { useSQLiteContext } from "expo-sqlite";
import { GetUnixTime } from "../../utils/Utils";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { FormPicker } from "../FormPicker";
import { globalStyles } from "../../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

//TODO: move this!
type NamedItem = {ID: number, Name:string}

// type WalletTopUp = { 
//     Amount:number | undefined,
//     WalletAccountID: number | undefined
//     EquityAccountID: number | undefined,
//     Description: string | undefined,
//     Date: Date | undefined
// }

type Props = NativeStackScreenProps<
  RootStackParamList,
  "WalletTopUp"
>;

// export type WalletTopUpProps = { portfolioID:number }
export function WalletTopUp({ route, navigation }: Props){
    const [journalEntryTypes, setJournalEntryTypes] = useState<NamedItem[]>([]);
    const [walletAccounts, setWalletAccounts] = useState<NamedItem[]>([]);
    const [equityAccounts, setEquityAccounts] = useState<NamedItem[]>([]);

    const [formWalletAmount, setFormWalletAmount] = useState<number | undefined>();
    const [formWalletAccountID, setFormWalletAccountID] = useState<number | undefined>();
    const [formEquityAccountID, setFormEquityAccountID] = useState<number | undefined>();
    const [formDescription, setFormDescription] = useState<string | undefined>();
    const [formDate, setFormDate] = useState<Date | undefined>()

    const db = useSQLiteContext();

    const { PortfolioID } = route.params

    // async function saveWalletTopUp(walletTopUp:WalletTopUp){
    //     // add a new journal entry
    //     let journalEntryID:number = 0
    //     if(walletTopUp.Amount !== undefined && walletTopUp.Description !== undefined && walletTopUp.Date !== undefined && walletTopUp.EquityAccountID !== undefined && walletTopUp.WalletAccountID !== undefined){
    //         const addJournalEntryQuery = `INSERT INTO JournalEntries (TimestampUNIX, Description, JournalEntryTypeID) VALUES (?, ?, ?)`
    //         const results = await db.runAsync(addJournalEntryQuery, [GetUnixTime(walletTopUp.Date.getTime()), walletTopUp.Description, 1])
    //         journalEntryID = results.lastInsertRowId

    //         // credit equity
    //         // debit wallet
    //         if(journalEntryID !== 0){
    //             const addJournalLinesQuery = `INSERT INTO JournalLines (JournalEntryID, AccountID, Debit, Credit, ReportingDebit, ReportingCredit) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?)`
    //             const results = await db.runAsync(addJournalLinesQuery, [journalEntryID, walletTopUp.WalletAccountID, walletTopUp.Amount, null, "TODO", null, journalEntryID, walletTopUp.EquityAccountID, null, walletTopUp.Amount, null, "TODO"])
    //         }
    //     }
    // }

    useEffect(() => {
        async function getJournalEntryTypes() {
            const results = await db.getAllAsync("SELECT ID, Name FROM JournalEntryTypes")
            const data: NamedItem[] = results.map((row:any) => ({
                ID: row.ID,
                Name: row.Name
            }))
            setJournalEntryTypes(data)
        }

        async function getAccounts(accountName:string, setter: (items: NamedItem[]) => void){
            const results = await db.getAllAsync(`
                SELECT a.ID, a.Name
                FROM Accounts a
                INNER JOIN AccountTypes accT on accT.ID = a.AccountTypeID
                WHERE accT.Name = ?
                AND a.PortfolioID = ?
            `, [accountName, PortfolioID])
            const data: NamedItem[] = results.map((row:any) =>({
                ID: row.ID,
                Name: row.Name
            }))
            console.log(data)
            setter(data)
        }

        getJournalEntryTypes()
        getAccounts("Wallet", (items) => setWalletAccounts(items))
        getAccounts("Equity", (items) => setEquityAccounts(items))
    }, [PortfolioID])

    return (
         <View>
            <FormPicker label="Wallet" items={walletAccounts} getter={formWalletAccountID} setter={(e:any) => {setFormWalletAccountID(e)}}/>
            <FormPicker label="Equity" items={equityAccounts} getter={formEquityAccountID} setter={(e:any) => {setFormEquityAccountID(e)}}/>
            <TextInput 
                style = {[globalStyles.input, {marginBottom:10}]}
                placeholder="Top up Amount"
                value={formWalletAmount?.toLocaleString('en-NZ', {style: "currency", currency: "NZD"})}
                keyboardType="numeric"
                onChangeText={(e:any) => {setFormWalletAmount(e)}}
            />
            {/* <DatePicker 
                dateString={transactionData?.Date?.toLocaleString()} 
                isVisible={dateModalVisible}
                setVisible={(isVisible:boolean) => {setDateModalVisible(isVisible)}}
                setDate = {(e:Date) => {
                    console.log("setting date to ", e)
                    setTransactionData(prev => {
                        if (!prev || prev.type !== "WalletTopUp") return prev

                        return {
                            ...prev,
                            Date: e
                        }
                    })
                }}
            /> */}
            <TextInput 
                style = {[globalStyles.input, {marginBottom:10}]}
                placeholder="Description"
                value={formDescription}
                keyboardType="default"
                onChangeText={(e:any) => { setFormDescription(e)}}
            />
        </View>
    )
}