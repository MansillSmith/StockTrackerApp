import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { JournalLine, RootStackParamList } from "../../types";
import { TransactionEntry, TransactionEntryData } from "./TransactionEntry";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Animated, Dimensions, Pressable, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../styles";
import { WalletTopUpModal } from "../EntryForms/WalletTopUpModal";
import { BuySharesModal } from "../EntryForms/BuySharesModal";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Transactions"
>;

const SCREEN_WIDTH = Dimensions.get('window').width;

type JournalDictionary = Record<number, JournalLine[]>;
export function Transactions({ route, navigation }: Props) {
    // modals
    const [showWalletTopUp, setShowWalletTopUp] = useState<boolean>(false)
    const [showBuySharesModal, setShowBuySharesModal] = useState<boolean>(false)

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [transactionEntries, setTransactionEntries] = useState<TransactionEntryData[]>([])
    const [selectedTransactionEntryID, setSelectedTransactionEntriesID] = useState<number> ( 0)
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

    const fetchAllData = useCallback(async () => {
        async function getJournalEntries(): Promise<TransactionEntryData[]>{
            const query = `
            SELECT ID, TimestampUNIX, Description, JournalEntryTypeID
            FROM JournalEntries
            WHERE PortfolioID = ?
            ORDER BY TimestampUNIX DESC
            `
            const results:TransactionEntryData[] = await db.getAllAsync<TransactionEntryData>(query, [PortfolioID])
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
            const results: JournalLine[] = await db.getAllAsync<JournalLine>(query, [PortfolioID])
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

            const results:TransactionEntryData[] = journalEntries.map((i:TransactionEntryData) => ({
                ID: i.ID,
                Description: i.Description,
                TimestampUNIX: i.TimestampUNIX,
                JournalEntryTypeID: i.JournalEntryTypeID,
                JournalLines: journalLines[i.ID] ?? []
            }))
            // results.map((i) => console.log(i))
            setTransactionEntries(results)
        }
        buildDataStructure()
    }, [db, PortfolioID])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    return (
        <>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {transactionEntries.map((i) => (
                    <TransactionEntry 
                        key={i.ID} 
                        data={{...i}} 
                        updateParent={fetchAllData} 
                        onShowEditButtons={(i) => {
                            selectedTransactionEntryID === i ? setSelectedTransactionEntriesID(0) : setSelectedTransactionEntriesID(i)
                        }}
                        onEdit={() => {
                            switch(i.JournalEntryTypeID){
                                case 1:
                                    return setShowWalletTopUp(true)
                                default:
                                    return null;
                            }                 
                        }} 
                        selected={i.ID === selectedTransactionEntryID} 
                    />
                ))}
            </ScrollView>
        
            <Animated.View
                style={[
                    styles.menu,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <MenuItem textValue="Wallet Top Up" onClick={() => setShowWalletTopUp(true)}/>
                <MenuItem textValue="Foreign Exchange" onClick={() => {}}/>
                <MenuItem textValue="Stock Buy" onClick={() => setShowBuySharesModal(true)}/>
                <MenuItem textValue="Stock Sell" onClick={() => {}}/>
                <TouchableOpacity onPress={toggleMenu}>
                    <Text style={{ marginTop: 20 }}>Close</Text>
                </TouchableOpacity>
            </Animated.View>

            <WalletTopUpModal
                showModal={showWalletTopUp} 
                onClose={async () => {
                    setShowWalletTopUp(false)
                    await fetchAllData()
                }} 
                portfolioID={PortfolioID}
                // TODO: if selected entry is 0 > undefined, else -> populate with the data 
                // data={selectedTransactionEntryID === 0 ? undefined : transactionEntries.filter((i) => i.ID===selectedTransactionEntryID)[0]} 
                data={undefined}
            />
            <BuySharesModal showModal={showBuySharesModal} portfolioID={PortfolioID} onClose={() => setShowBuySharesModal(false)}/>
        </>
    )
}

type MenuItemProps = { textValue:string, onClick: () => void}
function MenuItem({ textValue, onClick }: MenuItemProps){
    return (
        <TouchableOpacity onPress={onClick}>
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