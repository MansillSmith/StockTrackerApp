import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Pressable, View, Text} from 'react-native';
import { useEffect, useLayoutEffect, useState } from "react";
import { getSharesQuery } from "../utils/Queries";
import { useSQLiteContext } from "expo-sqlite";
import { PortfolioEntry, PortFolioEntryProps } from "./PortfolioEntry";

import tempImage from '../assets/favicon.png'
import { globalStyles } from "../styles";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "ShareAccounts"
>;

export function ShareAccounts({route, navigation}: Props){
    const [getShareAccounts, setShareAccounts] = useState<PortFolioEntryProps[]>([]);
    const [getTriggerCount, setTriggerCount] = useState<number>(0);

    const db = useSQLiteContext();
    const { ID } = route.params

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <Pressable 
                style={globalStyles.smallButton} 
                onPress={() => {
                    console.log('API Button Clicked')
                    setTriggerCount(getTriggerCount + 1)}
                }
            >
                <Text>=</Text>
            </Pressable>
        ),
        });
    }, [navigation]);

    useEffect(() => {
        async function getData(){
            const results = await db.getAllSync(getSharesQuery, [ID])
            const data: PortFolioEntryProps[] = results.map((row:any) => ({
                ID: row.ID,
                icon: row.Icon,
                purchaseValue: row.TotalAmount,
                numberOfShares: row.TotalQuantity,
                name: row.Ticker
            }))
            setShareAccounts(data)
        }

        getData()
    }, [])

    return(
        <View style={{
            backgroundColor: '#f00',
            width: '100%',
            height: '100%'
            // alignItems: "center"
        }}>
            <View>
                <View style={{
                    backgroundColor:'#CCC',
                    width:'100%',
                    height: '50%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontWeight:'bold'}}>TODO: Chart Here</Text>
                </View>
                {getShareAccounts.map((i, index) => (
                    <PortfolioEntry key={i.ID} {...i} triggerCount={getTriggerCount}/>
                ))}
            </View>
        </View>
    )
}