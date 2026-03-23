import { useEffect, useState} from 'react';
import { View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { PortfolioItem, PortfolioItemProps } from './PortfolioItem';
import { globalStyles } from '../styles';


export function Portfolios(){
    const [portfolioEntries, setPortfolioEntries] = useState<PortfolioItemProps[]>([]);

    const db = useSQLiteContext();

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
        <View style={globalStyles.container}>
            {portfolioEntries.map((i) => (
                <PortfolioItem key={i.ID} ID={i.ID} Name={i.Name}/>
            ))}
        </View>
    )
}