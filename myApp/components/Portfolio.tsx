// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import initSqlJs from 'sql.js';
import { useEffect, useState} from 'react';
import { View, Platform } from "react-native";

import { DB_NAME } from '../config/db';
import { PortfolioEntry, PortFolioEntryProps } from './PortfolioEntry';
import androidIcon from '../assets/android-icon-foreground.png';

let db;

// maybe this should be put elsewhere?
export async function initDB() {
  // if (Platform.OS === 'web') {
  //   const initSqlJs = await import('sql.js');
  //   const SQL = initSqlJs.default;
  //   db = new SQL.Database(); // creates a new in-memory database
  // } else {
  //   const SQLite = Platform.OS === 'ios' || Platform.OS === 'android'
  //     ? await import('react-native-sqlite-storage')
  //     : null;

  //   db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
  // }
  // return db;
  if (Platform.OS !== 'web') return;

  const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });

  // Fetch prebuilt database file
  const response = await fetch('/assets/stocktrackerdb.db');
  const buffer = await response.arrayBuffer();

  db = new SQL.Database(new Uint8Array(buffer));
  return db;

}

export async function executeQuery(query, params = []) {
  if (!db) await initDatabase();

  if (Platform.OS === 'web') {
    const result = db.exec(query); // returns [{ columns: [], values: [] }]
    return result;
  } else {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          query,
          params,
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  }
}

export function Portfolio() {
    const [portfolioEntries, setPortfolioEntries] = useState<PortFolioEntryProps[]>([]);

    useEffect(() => {
        async function getData(){
            await initDB();
            const results = await executeQuery('SELECT h.ShareNumber, h.SharePrice, s.Ticker FROM StockPurchaseHistory h INNER JOIN Stocks s on h.StockID = s.ID')
            const rows = results[0].rows;
            console.log(rows.length)
            const data: PortFolioEntryProps[] = []
            for (let i = 0; i < rows.length; i++){
                const row = rows.item(i)
                data.push({
                    icon: androidIcon,
                    name: row.Ticker,
                    percentChange: row.ShareNumber,
                    totalChange: row.SharePrice
                })
            }
            setPortfolioEntries(data);
        }

        getData()
    }, []
    )

    return (
        <View>
            {portfolioEntries.map((i, index) => (
                <PortfolioEntry
                key={index}
                icon={i.icon}
                name={i.name}
                totalChange={i.totalChange}
                percentChange={i.percentChange}
                />
            ))}
        </View>
    )
}