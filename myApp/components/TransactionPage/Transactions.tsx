import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { JournalLine, RootStackParamList } from "../../types";
import { TransactionEntry, TransactionEntryProps } from "./TransactionEntry";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Animated, Dimensions, Pressable, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Transactions"
>;

const SCREEN_WIDTH = Dimensions.get('window').width;

type JournalDictionary = Record<number, JournalLine[]>;
export function Transactions({ route, navigation }: Props) {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [transactionEntries, setTransactionEntries] = useState<TransactionEntryProps[]>([])
    const db = useSQLiteContext();
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

    const { PortfolioID } = route.params 

    const toggleMenu = () => {
        setIsOpenMenu((prevOpen) => {
            const nextState = !prevOpen;
            
            Animated.timing(slideAnim, {
                toValue: nextState ? SCREEN_WIDTH - 300 : SCREEN_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }).start();

            return nextState;
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <Pressable style={globalStyles.smallButton} onPress={() => toggleMenu()}>
                <Text>+</Text>
            </Pressable>
        ),
        });
    }, [navigation]);

    useEffect(() => {
        async function getJournalEntries(): Promise<TransactionEntryProps[]>{
            const query = `
            SELECT ID, TimestampUNIX, Description
            FROM JournalEntries
            WHERE PortfolioID = ?
            ORDER BY TimestampUNIX DESC
            `
            const results:TransactionEntryProps[] = db.getAllSync<TransactionEntryProps>(query, [PortfolioID])
            // setTransactionEntries(results)
            return results
        }

        async function getJournalLines(): Promise<JournalDictionary>{
            const query = `
            SELECT jl.ID, jl.JournalEntryID, s.Ticker as StockName, jl.Quantity, a.name as AccountName, jl.Debit/100.0 as Debit, jl.Credit/100.0 as Credit, jl.ReportingDebit/100.0 as ReportingDebit, jl.ReportingCredit/100.0 as ReportingCredit
            FROM JournalLines jl
            INNER JOIN JournalEntries je on je.ID = jl.JournalEntryID
            INNER JOIN Accounts a on a.ID = jl.AccountID
            LEFT JOIN Stocks s on s.ID = jl.StockID
            WHERE je.PortfolioID = ?
            `
            const results: JournalLine[] = db.getAllSync<JournalLine>(query, [PortfolioID])
            return results.reduce<JournalDictionary>((acc, row) => {
                const key = row.JournalEntryID;

                if (!acc[key]) {
                    acc[key] = [];
                }

                acc[key].push(row);
                return acc;
            }, {});
        }

        async function buildDataStructure(){
            const journalEntries = await getJournalEntries()
            const journalLines = await getJournalLines()
            
            // console.log(journalEntries)
            // console.log()
            // console.log(journalLines)
            // console.log()

            const results:TransactionEntryProps[] = journalEntries.map((i:TransactionEntryProps) => ({
                ID: i.ID,
                Description: i.Description,
                TimestampUNIX: i.TimestampUNIX,
                JournalLines: journalLines[i.ID] ?? []
            }))
            // results.map((i) => console.log(i))
            setTransactionEntries(results)
        }

        buildDataStructure()
    }, [PortfolioID])

    return (
        <>
            {transactionEntries.map((i) => (
                <TransactionEntry key={i.ID} {...i}/>
            ))}
        
            <Animated.View
                style={[
                    styles.menu,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <MenuItem textValue="Wallet Top Up" navigationPage="WalletTopUp" ID={1} navigation={navigation}/>
                <MenuItem textValue="Foreign Exchange" navigationPage={undefined} ID={1} navigation={navigation}/>
                <MenuItem textValue="Stock Buy" navigationPage={undefined} ID={1} navigation={navigation}/>
                <MenuItem textValue="Stock Sell" navigationPage={undefined} ID={1} navigation={navigation}/>
                <MenuItem textValue="Delete/Edit" navigationPage={undefined} ID={1} navigation={navigation}/>
                <TouchableOpacity onPress={toggleMenu}>
                    <Text style={{ marginTop: 20 }}>Close</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

type MenuItemProps = { textValue:string, navigationPage:string | undefined, ID:number, navigation:any}
function MenuItem({ textValue, navigationPage, ID, navigation }: MenuItemProps){
    return (
        <TouchableOpacity 
            onPress={() => {
                navigationPage !== undefined && navigation.navigate(navigationPage, {PortfolioID: ID})
            }}
        >
            <Text style={styles.item} >{textValue}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 60,
    marginLeft: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 6,
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#f2f2f2',
    padding: 20,
    elevation: 5,
  },
  item: {
    fontSize: 18,
    marginVertical: 10,
  },
});