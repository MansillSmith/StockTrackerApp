import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useLayoutEffect, useState } from "react";
import { getFinancialAcccountDetails, getFinancialAccountTransactions } from "../utils/Queries";
import { FinancialAccountEntry, FinancialAccountEntryProps } from "./FinancialAccountEntry";
import { GetDate, GetDateString } from "../utils/Utils";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "FinancialAccount"
>;

type FinancialAccountDetails = { ID: number, Name:string, AccountType:string } 
export function FinancialAccount({route, navigation}: Props){
    const [accountEntries, setAccountEntries] = useState<FinancialAccountEntryProps[]>([]);
    const [accountDetails, setAccountDetails] = useState<FinancialAccountDetails>();

    const db = useSQLiteContext();
    const { ID } = route.params

    useLayoutEffect(() => {
        if (!accountDetails) return;

        navigation.setOptions({
            title: accountDetails?.Name ?? "Account"
        });
    }, [accountDetails]);

    useEffect(() => {
        async function getTransactions(){
            const results = await db.getAllSync(getFinancialAccountTransactions, [ID])
            console.log("Date Is", GetDate(1753744200))
            console.log("Formatted date is:", GetDateString(GetDate(1753744200)))
            console.log("RESULTS:", results);
            const data: FinancialAccountEntryProps[] = results.map((row:any) => ({
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
                Name: row.name,
                AccountType: row.AccountType
            }
            setAccountDetails(data)
        }

        getTransactions()
    }, [])

    return (
        <View>
            {accountEntries.map((i) =>(
                <FinancialAccountEntry key={i.ID} {...i}/>
            ))}
        </View>
    )
}