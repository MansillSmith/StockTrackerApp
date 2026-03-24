// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import { useEffect, useState} from 'react';
import { View, Text } from "react-native";

import { DB_NAME } from '../config/db';
// import { PortfolioEntry, PortFolioEntryProps } from './PortfolioEntry';
import { PortfolioAccount } from '../types';
// import androidIcon from '../assets/android-icon-foreground.png';

import { useSQLiteContext } from 'expo-sqlite';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { globalStyles } from '../styles';

type Props = NativeStackScreenProps<
  RootStackParamList,
  "PortfolioAccounts"
>;

export function PortfolioAccounts({route}: Props) {
    const [portfolioAccounts, setPortfolioAccounts] = useState<PortfolioAccount[]>([]);

    const { ID } = route.params

    const db = useSQLiteContext();
    useEffect(() => {
        async function getData(){
            // const db = await SQLite.openDatabaseAsync('databaseName');
            // const db = await setupDatabase()
            const results = await db.getAllSync('SELECT ID, Name FROM Accounts WHERE PortfolioID = ?', [ID])
            console.log(results);
            console.log(results.length)
            const data: PortfolioAccount[] = results.map((row:any) => ({
                ID: row.ID,
                Name: row.Name
            }))
            setPortfolioAccounts(data);
        }

        getData()
    }, []
    )

    return (
        <View style={{
          width: '100%',
          height: '100%'//,
        //   backgroundColor: '#0f0',
        //   justifyContent: 'center'
        }}>
            {portfolioAccounts.map((i, index) => (
                <View key={i.ID} style={globalStyles.container}>
                    <Text>{i.Name}</Text>
                </View>
                // <PortfolioEntry
                // key={index}
                // icon={i.icon}
                // name={i.name}
                // numberOfShares={i.numberOfShares}
                // currentValue={180.4}
                // totalChange={0}
                // percentChange={0}
                // />
            ))}
        </View>
    )
}