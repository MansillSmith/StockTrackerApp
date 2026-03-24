import { useEffect, useLayoutEffect, useState} from 'react';
import { View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { PortfolioItem, PortfolioItemProps } from './PortfolioItem';
import { globalStyles } from '../styles';
import { PortfolioFormModal } from './PortfolioFormModal';

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ActionButtons } from './ActionButtons';
import { GetUnixTime } from './Utils';
type Props = NativeStackScreenProps<RootStackParamList, "Portfolios">;

type PortfolioData = {ID: number, Name:string}

export function Portfolios({ navigation }: Props){
    const [portfolioEntries, setPortfolioEntries] = useState<PortfolioData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const db = useSQLiteContext();

    async function addPortfolio(name:string){
        const unixTime = GetUnixTime(Date.now())
        const result = await db.runAsync("INSERT INTO Portfolios(Name, CreatedOnUnix) VALUES (?,?)", [name, unixTime])
        return result.lastInsertRowId
    }

    async function editPortfolio(ID:number, newName:string){
        await db.runAsync("UPDATE Portfolios SET Name = ? WHERE ID = ?", [newName, ID])
        setPortfolioEntries(prev =>
            prev.map(item =>
            item.ID === ID
                ? { ...item, Name: newName }
                : item
            )
        );
    }

    async function removePortfolio(ID:number){
        await db.runAsync("DELETE FROM Portfolios WHERE ID = ?", [ID])
        const newPorfolios = portfolioEntries.filter(i => i.ID !== ID)
        setPortfolioEntries(newPorfolios)
    }

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
            const results = await db.getAllAsync("SELECT ID, Name FROM Portfolios")
            console.log(results)
            const data: PortfolioData[] = results.map((row: any) =>({
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
                <PortfolioItem 
                    key={i.ID} 
                    ID={i.ID} 
                    Name={i.Name} 
                    onEdit={(ID, newName) => {editPortfolio(ID, newName)}} 
                    onRemove={(id:number) => {console.log("removing "+id); removePortfolio(id)}}/>
            ))}
            <PortfolioFormModal
                visible={modalVisible}
                isAdd={true}
                onClose={() => setModalVisible(false)}
                onSubmit={async (name) => {
                    const newid = await addPortfolio(name)
                    const newPortfolio: PortfolioData = {ID: newid, Name: name}
                    console.log("new portfolio:", name, newid);

                    setPortfolioEntries([...portfolioEntries, newPortfolio])
                    setModalVisible(false);
                }}
            />
        </>
    )
}