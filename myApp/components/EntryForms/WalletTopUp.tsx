import { useSQLiteContext } from "expo-sqlite";
import { GetUnixTime } from "../../utils/Utils";
import { useEffect, useState } from "react";
import { TextInput, View, Pressable, Text } from "react-native";
import { FormPicker } from "../FormPicker";
import { globalStyles } from "../../styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Currency, RootStackParamList } from "../../types";
import { useCurrencies } from "../../hooks";
import { DatePicker } from "../DatePicker";

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
    const { currencies } = useCurrencies();
    const [portfolioCurrency, setPortfolioCurrency] = useState<Currency | undefined>();

    // const [journalEntryTypes, setJournalEntryTypes] = useState<NamedItem[]>([]);
    const [walletAccounts, setWalletAccounts] = useState<NamedItem[]>([]);
    const [equityAccounts, setEquityAccounts] = useState<NamedItem[]>([]);

    const [formWalletAmount, setFormWalletAmount] = useState<number | undefined>();
    const [formWalletAccountID, setFormWalletAccountID] = useState<number | undefined>();
    const [formEquityAccountID, setFormEquityAccountID] = useState<number | undefined>();
    const [formDescription, setFormDescription] = useState<string | undefined>();
    const [formDate, setFormDate] = useState<Date | undefined>()

    const db = useSQLiteContext();

    const { PortfolioID } = route.params

    async function saveWalletTopUp(){
        // add a new journal entry
        let journalEntryID:number = 0
        if(formWalletAmount !== undefined && formDescription !== undefined && formDate !== undefined && formEquityAccountID !== undefined && formWalletAccountID !== undefined){
            const addJournalEntryQuery = `INSERT INTO JournalEntries (TimestampUNIX, Description, JournalEntryTypeID) VALUES (?, ?, ?)`
            const results = await db.runAsync(addJournalEntryQuery, [GetUnixTime(formDate.getTime()), formDescription, 1])
            journalEntryID = results.lastInsertRowId

            // credit equity
            // debit wallet
            if(journalEntryID !== 0){
                const addJournalLinesQuery = `INSERT INTO JournalLines (JournalEntryID, AccountID, Debit, Credit, ReportingDebit, ReportingCredit) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?)`
                await db.runAsync(addJournalLinesQuery,         [journalEntryID, formWalletAccountID, formWalletAmount, 0, formWalletAmount, 0, 
                                                                journalEntryID, formEquityAccountID, 0, formWalletAmount, 0, formWalletAmount])
            }
        }
    }

    async function clearForm(){
        [setFormDate, setFormDescription, setFormEquityAccountID, setFormWalletAccountID, setFormWalletAmount].map((i) => i(undefined))
    }

    useEffect(() => {
        // async function getJournalEntryTypes() {
        //     const results = await db.getAllAsync("SELECT ID, Name FROM JournalEntryTypes")
        //     const data: NamedItem[] = results.map((row:any) => ({
        //         ID: row.ID,
        //         Name: row.Name
        //     }))
        //     setJournalEntryTypes(data)
        // }

        async function getPortfolioCurrency() {
            const results = await db.getAllAsync('SELECT DefaultCurrencyID FROM Portfolios WHERE ID = ?', [PortfolioID])
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
            `, [accountName, PortfolioID, currencyID])
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
    }, [PortfolioID])

    return (
        <View style={{
            alignItems:'center'
        }}>
            <View style={{
                width:'95%'
            }}>
                <Text>Only top ups in the default currency are support ({portfolioCurrency?.ShortName})</Text>
                <FormPicker label="Wallet" items={walletAccounts} getter={formWalletAccountID} setter={(e:any) => {setFormWalletAccountID(e)}}/>
                <FormPicker label="Equity" items={equityAccounts} getter={formEquityAccountID} setter={(e:any) => {setFormEquityAccountID(e)}}/>
                <TextInput 
                    style = {[globalStyles.input, {marginBottom:10}]}
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
                    style = {[globalStyles.input, {marginBottom:10}]}
                    placeholder="Description"
                    value={formDescription}
                    keyboardType="default"
                    onChangeText={(e:any) => { setFormDescription(e)}}
                />
            </View>
            <View style={[{flexDirection:'row'}]}>
                <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]}
                    onPress={() => {
                        // onSubmit(name);
                        // setName("");

                        saveWalletTopUp();
                        // navigation.goBack()
                        // clearForm()
                    }}
                >
                    <Text>Save</Text>
                </Pressable>
                {/* <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]}>
                    <Text>Cancel</Text>
                </Pressable> */}
            </View>
        </View>
    )
}