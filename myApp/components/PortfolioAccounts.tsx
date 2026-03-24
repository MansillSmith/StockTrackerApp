// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState} from 'react';
import { View, Text } from "react-native";

import { DB_NAME } from '../config/db';
// import { PortfolioEntry, PortFolioEntryProps } from './PortfolioEntry';
import { PortfolioAccountProp } from '../types';
// import androidIcon from '../assets/android-icon-foreground.png';

import { useSQLiteContext } from 'expo-sqlite';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { globalStyles } from '../styles';
import { PortfolioAccount } from './PortfolioAccount';
import { ActionButtons } from './ActionButtons';

type Props = NativeStackScreenProps<
  RootStackParamList,
  "PortfolioAccounts"
>;

export function PortfolioAccounts({ route, navigation }: Props) {
    const [modalVisible, setModalVisible] = useState<Boolean>(false)
    const [portfolioAccounts, setPortfolioAccounts] = useState<PortfolioAccountProp[]>([]);

    const { ID } = route.params

    const db = useSQLiteContext();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <ActionButtons
            onAdd={() => setModalVisible(true)}
            onEdit={() => {}}
            onRemove={() => {}}
            />
        ),
        });
    }, [navigation]);

    useEffect(() => {
        async function getData(){
            // const db = await SQLite.openDatabaseAsync('databaseName');
            // const db = await setupDatabase()
            // const results = await db.getAllSync("SELECT ID, Name FROM Accounts WHERE PortfolioID = ?", [ID])
            {/* put this somewhere common */}
            const query = `SELECT a.ID, a.Name, a.AccountTypeID, t.AccountBalance
            FROM (
                SELECT a.ID, COALESCE(SUM(jl.ReportingDebit - jl.ReportingCredit), 0)/100.0 as AccountBalance
                FROM Accounts a
                LEFT JOIN  JournalLines jl on jl.AccountID = a.ID
                LEFT JOIN JournalEntries je on je.ID = jl.JournalEntryID
                LEFT JOIN JournalEntryTypes jet on jet.ID = je.JournalEntryTypeID
                WHERE a.PortfolioID = ?
                GROUP BY jl.AccountID
            ) t
            INNER JOIN Accounts a on a.ID = t.ID
            ORDER BY a.AccountTypeID, a.Name
            `

            const results = await db.getAllSync(query, [ID])
            console.log(results);
            console.log(results.length)
            const data: PortfolioAccountProp[] = results.map((row:any) => ({
                ID: row.ID,
                Name: row.Name,
                AccountTypeID: row.AccountTypeID,
                AccountBalance: row.AccountBalance
            }))
            setPortfolioAccounts(data);
        }

        getData()
    }, []
    )

    return (
        <View style={{
          width: '100%',
          height: '100%',
        //   backgroundColor: '#0f0',
          alignItems: "center"
        }}>
            {portfolioAccounts.map((i, index) => (
                <PortfolioAccount key={i.ID} {...i}/>
            ))}
        </View>
    )
}