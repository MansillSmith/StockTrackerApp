// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState} from 'react';
import { View, Text, Pressable } from "react-native";

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

import { getAccountsQuery } from '../utils/Queries';
import { TransactionModal } from './TransactionModal';

type Props = NativeStackScreenProps<
  RootStackParamList,
  "PortfolioAccounts"
>;

export function PortfolioAccounts({ route, navigation }: Props) {
    const [addAccountModalVisible, setaddAccountModalVisible] = useState<Boolean>(false)
    const [transactionModalVisible, setTransactionModalVisble] = useState<boolean>(false);
    const [portfolioAccounts, setPortfolioAccounts] = useState<PortfolioAccountProp[]>([]);

    const { ID } = route.params

    const db = useSQLiteContext();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <>
            <ActionButtons
                onAdd={() => setaddAccountModalVisible(true)}
                onEdit={() => {}}
                onRemove={() => {}}
            />
            <Pressable onPress={() => {
                setTransactionModalVisble(true)
            }} style={globalStyles.smallButton}>
                <Text>📁</Text>
            </Pressable>
            </>

        ),
        });
    }, [navigation]);

    useEffect(() => {
        async function getData(){
            // const db = await SQLite.openDatabaseAsync('databaseName');
            // const db = await setupDatabase()
            // const results = await db.getAllSync("SELECT ID, Name FROM Accounts WHERE PortfolioID = ?", [ID]
            const results = await db.getAllSync(getAccountsQuery, [ID])
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
        <TransactionModal
            visible={transactionModalVisible}
            portfolioID={ID}
            onClose={() => setTransactionModalVisble(false)}
            onSubmit={() => {}}
        />
        </View>
    )
}