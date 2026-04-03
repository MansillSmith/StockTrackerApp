// import SQLite from 'react-native-sqlite-storage';
// import * as SQLite from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState, useRef} from 'react';
import { View, Text, Pressable, Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";

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
// import { TransactionModal } from './TransactionModal';

type Props = NativeStackScreenProps<
  RootStackParamList,
  "PortfolioAccounts"
>;

const SCREEN_WIDTH = Dimensions.get('window').width;

export function PortfolioAccounts({ route, navigation }: Props) {
    const [addAccountModalVisible, setaddAccountModalVisible] = useState<Boolean>(false)
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [portfolioAccounts, setPortfolioAccounts] = useState<PortfolioAccountProp[]>([]);
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

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
                toggleMenu()
            }} style={globalStyles.smallButton}>
                <Text>☰</Text>
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
        <Animated.View
            style={[
            styles.menu,
            { transform: [{ translateX: slideAnim }] },
            ]}
        >
            <MenuItem textValue="Wallet Top Up" navigationPage="WalletTopUp" ID={ID} navigation={navigation}/>
            <MenuItem textValue="Foreign Exchange" navigationPage={undefined} ID={ID} navigation={navigation}/>
            <MenuItem textValue="Stock Buy" navigationPage={undefined} ID={ID} navigation={navigation}/>
            <MenuItem textValue="Stock Sell" navigationPage={undefined} ID={ID} navigation={navigation}/>
            <MenuItem textValue="Delete/Edit" navigationPage={undefined} ID={ID} navigation={navigation}/>
            <TouchableOpacity onPress={toggleMenu}>
                <Text style={{ marginTop: 20 }}>Close</Text>
            </TouchableOpacity>
        </Animated.View>

        {/* <TransactionModal
            visible={transactionModalVisible}
            portfolioID={ID}
            onClose={() => setTransactionModalVisble(false)}
            onSubmit={() => {}}
        /> */}
        </View>
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