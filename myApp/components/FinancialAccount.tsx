import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { View, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useLayoutEffect, useState } from "react";
import { getFinancialAcccountDetails, getFinancialAccountTransactions } from "../utils/Queries";
import { FinancialAccountEntry, FinancialAccountEntryProps } from "./FinancialAccountEntry";
import { GetDate, GetDateString } from "../utils/Utils";
import { useCurrencies } from "../hooks";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "FinancialAccount"
>;

export type FinancialAccountTransactionDetails = {ID: number, date:Date, description:string, debit:number, credit:number}
export type FinancialAccountDetails = { ID: number, Name:string, AccountType:string } 
export function FinancialAccount({route, navigation}: Props){
    // need to get the currency of the portfolio
    // check if the currencies are different

    const { currencies, setCurrencies } = useCurrencies();

    const [accountEntries, setAccountEntries] = useState<FinancialAccountTransactionDetails[]>([]);
    const [accountDetails, setAccountDetails] = useState<FinancialAccountDetails>();

    const db = useSQLiteContext();
    const { ID, AccountBalance } = route.params

    useLayoutEffect(() => {
        // if (!accountDetails) return;
        navigation.setOptions({
            title: accountDetails?.Name || "Account"
        });
    }, [accountDetails, navigation]);

    useEffect(() => {
        async function getTransactions(){
            const results = await db.getAllSync(getFinancialAccountTransactions, [ID])
            // console.log("Date Is", GetDate(1753744200))
            // console.log("Formatted date is:", GetDateString(GetDate(1753744200)))
            // console.log("RESULTS:", results);
            const data: FinancialAccountTransactionDetails[] = results.map((row:any) => ({
                ID: row.JournalEntryID,
                date: GetDate(row.TimestampUNIX),
                description: row.Description,
                debit: row.Debit,
                credit: row.Credit
            }))
            setAccountEntries(data)
        }

        async function getAccountDetails(){
            const results = await db.getAllSync(getFinancialAcccountDetails, [ID])
            // check if theres a row?
            const row:any = results[0]
            const data: FinancialAccountDetails = {
                ID: row.ID,
                Name: row.Name,
                AccountType: row.AccountType
            }
            setAccountDetails(data)
        }
        // console.log(AccountBalance)
        getTransactions()
        getAccountDetails()
    }, [])

    if (!accountDetails){
        return(<Text>Loading</Text>)
    }

    if(accountEntries.length ===0 ){
        return (<Text>No Entries...</Text>)
    }

    return (
        <View>
            {AccountBalance !== null && AccountBalance !== undefined && 
                <View style={{
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 5,
                    padding: 10
                }}>
                    <Text style={{fontWeight:'bold'}}>Balance:</Text>
                    <Text style={{fontWeight:'bold'}}> {AccountBalance.toLocaleString('en-NZ', {
                        style: "currency",
                        currency: "NZD"
                    })}</Text>
                </View>
            }
            {accountEntries.map((i) =>(
                <FinancialAccountEntry key={i.ID} transactionDetails={i} accountDetails={accountDetails}/>
            ))}
        </View>
    )
}