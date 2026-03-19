// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import { useEffect, useState} from 'react';
import { View } from "react-native";

import { DB_NAME } from '../config/db';
import { PortfolioEntry, PortFolioEntryProps } from './PortfolioEntry';
import androidIcon from '../assets/android-icon-foreground.png';

import { useSQLiteContext } from 'expo-sqlite';


export function Portfolio() {
    const [portfolioEntries, setPortfolioEntries] = useState<PortFolioEntryProps[]>([]);

    const db = useSQLiteContext();
    useEffect(() => {
        async function getData(){
            // const db = await SQLite.openDatabaseAsync('databaseName');
            // const db = await setupDatabase()
            const results = await db.getAllSync('SELECT h.ShareNumber, h.SharePrice, s.Ticker FROM StockPurchaseHistory h INNER JOIN Stocks s on h.StockID = s.ID')
            console.log(results);
            console.log(results.length)
            const data: PortFolioEntryProps[] = []
            for (let i = 0; i < results.length; i++){
                const row = results[i]
                data.push({
                    icon: androidIcon,
                    name: row.Ticker,
                    numberOfShares: row.ShareNumber
                })
            }
            setPortfolioEntries(data);
        }

        getData()
    }, []
    )

    return (
        <View style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0f0',
          justifyContent: 'center'
        }}>
            {portfolioEntries.map((i, index) => (
                <PortfolioEntry
                key={index}
                icon={i.icon}
                name={i.name}
                numberOfShares={i.numberOfShares}
                currentValue={180.4}
                totalChange={0}
                percentChange={0}
                />
            ))}
        </View>
    )
}