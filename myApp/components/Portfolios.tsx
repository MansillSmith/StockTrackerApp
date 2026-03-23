import { useEffect, useLayoutEffect, useState} from 'react';
import { View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { PortfolioItem, PortfolioItemProps } from './PortfolioItem';
import { globalStyles } from '../styles';
import { PortfolioFormModal } from './PortfolioFormModal';

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ActionButtons } from './ActionButtons';
type Props = NativeStackScreenProps<RootStackParamList, "Portfolios">;


export function Portfolios({ navigation }: Props){
    const [portfolioEntries, setPortfolioEntries] = useState<PortfolioItemProps[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const db = useSQLiteContext();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <ActionButtons
            onAdd={() => setModalVisible(true)}
            onEdit={() => {}}
            />
        ),
        });
    }, [navigation]);

    useEffect(() => {
        async function getData(){
            const results = await db.getAllAsync("SELECT ID, Name FROM Portfolios")
            console.log(results)
            const data: PortfolioItemProps[] = results.map((row: any) =>({
                ID: row.ID,
                Name: row.Name
            }));

            setPortfolioEntries(data)
        }
        
        getData()
    }, []);

    return(
        <>
            {portfolioEntries.map((i) => (
                <PortfolioItem key={i.ID} ID={i.ID} Name={i.Name}/>
            ))}
            <PortfolioFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={(name) => {
                console.log("new portfolio:", name);
                setModalVisible(false);
                }}
            />
        </>
    )
}