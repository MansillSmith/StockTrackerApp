import { Modal, View, Pressable, Text, TextInput, TouchableOpacity } from "react-native"
import { globalStyles } from "../styles";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { FormInput } from "./SimpleModals/FormInput";
import { FormPicker } from "./SimpleModals/FormPicker";
import { DatePicker } from "./SimpleModals/DatePicker";
import { GetUnixTime } from "../utils/Utils";



type NamedItem = {ID: number, Name:string}

type WalletTopUp = { 
    type: "WalletTopUp",
    Amount:number | undefined,
    WalletAccountID: number | undefined
    EquityAccountID: number | undefined,
    Description: string | undefined,
    Date: Date | undefined
}
type StockBuy = { type: "StockBuy"}
type TransactionData = WalletTopUp | StockBuy

export type TransactionModalProps = {visible: boolean, portfolioID: number, onClose: () => void, onSubmit: (name:string) => void}
export function TransactionModal({visible, portfolioID, onClose, onSubmit}: TransactionModalProps){
    const [journalEntryTypes, setJournalEntryTypes] = useState<NamedItem[]>([]);
    const [selectedEntryTypeID, setSelectedEntryTypeID] = useState<number | undefined>();
    const [transactionData, setTransactionData] = useState<TransactionData | undefined>();

    const [walletAccounts, setWalletAccounts] = useState<NamedItem[]>([]);
    const [equityAccounts, setEquityAccounts] = useState<NamedItem[]>([]);

    const [dateModalVisible, setDateModalVisible] = useState<boolean>(false);

    const db = useSQLiteContext();

    function saveTransactionData(data:TransactionData){
        if(data.type === "WalletTopUp"){
            saveWalletTopUp(data)
        }
    }

    async function saveWalletTopUp(walletTopUp:WalletTopUp){
        // add a new journal entry
        let journalEntryID:number = 0
        if(walletTopUp.Amount !== undefined && walletTopUp.Description !== undefined && walletTopUp.Date !== undefined && walletTopUp.EquityAccountID !== undefined && walletTopUp.WalletAccountID !== undefined){
            const addJournalEntryQuery = `INSERT INTO JournalEntries (TimestampUNIX, Description, JournalEntryTypeID) VALUES (?, ?, ?)`
            const results = await db.runAsync(addJournalEntryQuery, [GetUnixTime(walletTopUp.Date.getTime()), walletTopUp.Description, 1])
            journalEntryID = results.lastInsertRowId

            // credit equity
            // debit wallet
            if(journalEntryID !== 0){
                const addJournalLinesQuery = `INSERT INTO JournalLines (JournalEntryID, AccountID, Debit, Credit, ReportingDebit, ReportingCredit) VALUES (?,?,?,?,?,?), (?,?,?,?,?,?)`
                const results = await db.runAsync(addJournalLinesQuery, [journalEntryID, walletTopUp.WalletAccountID, walletTopUp.Amount, null, "TODO", null, journalEntryID, walletTopUp.EquityAccountID, null, walletTopUp.Amount, null, "TODO"])
            }
        }
    }

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
            `, [accountName, portfolioID])
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
    }, [portfolioID])

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}>
                <View style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%"
                }}>
                    <Text>Add Transaction</Text>

                    <View style={{
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ width:'20%'}}>Select:</Text>
                        <Picker 
                            style={{height:50, width:'80%'}}
                            selectedValue={selectedEntryTypeID}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedEntryTypeID(itemValue);
                                switch (itemValue) {
                                    case 1:
                                        setTransactionData({ type: "WalletTopUp", Amount: undefined, WalletAccountID: undefined, EquityAccountID: undefined, Description: undefined, Date:undefined })
                                        break
                                    case 2:
                                        setTransactionData({ type: "StockBuy" })
                                        break
                                }
                            }}
                        >
                            {journalEntryTypes.map((i) =>(
                                <Picker.Item key={i.ID} label={i.Name} value={i.ID}/>
                            ))}
                        </Picker>
                    </View>

                    { selectedEntryTypeID == 1 && transactionData?.type === "WalletTopUp" &&
                        <>
                            {/* <FormInput label="Wallet" getter="abc" setter={(e) => {}} placeholder="abc" tiKeyboardType="default"/> */}
                            {/* <FormInput label="Equity" getter="def" setter={(e) => {}} placeholder="abc" tiKeyboardType="default"/> */}
                            <FormPicker label="Wallet" items={walletAccounts} getter={transactionData?.WalletAccountID} setter={(e:any) => {
                                setTransactionData(prev => {
                                    if (!prev || prev.type !== "WalletTopUp") return prev
                                    return {
                                        ...prev,
                                        WalletAccountID: e ? parseInt(e) : undefined
                                    }
                                })
                            }}/>
                            <FormPicker label="Equity" items={equityAccounts} getter={transactionData?.EquityAccountID} setter={(e:any) => {
                                setTransactionData(prev => {
                                    if (!prev || prev.type !== "WalletTopUp") return prev
                                    return {
                                        ...prev,
                                        EquityAccountID: e ? parseInt(e) : undefined
                                    }
                                })
                            }}/>
                            <TextInput 
                                style = {[globalStyles.input, {marginBottom:10}]}
                                placeholder="Top up Amount"
                                value={transactionData?.Amount?.toLocaleString('en-NZ', {style: "currency", currency: "NZD"})}
                                keyboardType="numeric"
                                onChangeText={(e:any) => {
                                    setTransactionData(prev => {
                                        if (!prev || prev.type !== "WalletTopUp") return prev

                                        return {
                                            ...prev,
                                            Amount: e ? parseFloat(e) : undefined
                                        }
                                    })
                                }}
                            />
                            <DatePicker 
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
                            />
                            <TextInput 
                                style = {[globalStyles.input, {marginBottom:10}]}
                                placeholder="Description"
                                value={transactionData?.Description}
                                keyboardType="default"
                                onChangeText={(e:any) => {
                                    setTransactionData(prev => {
                                        if (!prev || prev.type !== "WalletTopUp") return prev

                                        return {
                                            ...prev,
                                            Description: e
                                        }
                                    })
                                }}
                            />
                        </>
                    }
                    <View style={[{flexDirection:'row'}]}>
                        <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]}
                            onPress={() => {
                                // onSubmit(name);
                                // setName("");
                                if(transactionData !== undefined){
                                    console.log(transactionData)
                                    saveTransactionData(transactionData)
                                    onClose();
                                }
                            }}
                        >
                            <Text>Save</Text>
                        </Pressable>
                        <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]} onPress={onClose}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

// type WalletTopUpProps = {
//     amount: number | undefined,
//     setAmount: (value:number | undefined) => void
// }
// function WalletTopUp({amount, setAmount}: WalletTopUpProps){
//     // const [amount, setAmount] = useState<number | undefined>()

//     return (
//         <FormInput label="Amount" getter={amount} setter={(e) => {setAmount(e ? parseFloat(e) : undefined)}} placeholder="Top up amount" tiKeyboardType="numeric" />
//     )
// }

