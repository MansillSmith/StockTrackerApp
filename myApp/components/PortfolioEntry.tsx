import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { PortfolioEntryChange } from "./PortfolioEntryChange";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export type PortFolioEntryProps = { ID: number, icon:ImageSourcePropType, name:string, numberOfShares:number, purchaseValue:number, triggerCount?:number};

export function PortfolioEntry({ID, icon, name, numberOfShares, purchaseValue, triggerCount}: PortFolioEntryProps) {
  const [loading, setLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState<number | undefined>(undefined);

  const baseUrl = "https://www.alphavantage.co/query";

  const params = new URLSearchParams();
  params.append("function", "GLOBAL_QUOTE");
  params.append("symbol", name);
  

  const db = useSQLiteContext();
  

    useEffect(() => {
        async function getData(){
            const results:any = await db.getAllSync("SELECT APIKey FROM User")
            const apiKey = results[0].APIKey

            params.append("apikey", apiKey);
            const finalUrl = `${baseUrl}?${params.toString()}`;

            fetch(finalUrl)
                .then(res => res.json())
                .then(data => {
                // Extract the price
                const CurrentValue:number = parseFloat(data["Global Quote"]["05. price"]);
                console.log("Calling API...")
                setCurrentValue(CurrentValue)
                setLoading(false)
                })
                .catch(err => {
                console.error("Error fetching stock data:", err);
                setLoading(false)
                });
    //   setLoading(false)
    }

    if(triggerCount != null && triggerCount > 0){
        console.log(triggerCount)
        getData()
    }
    else{
        setLoading(false)
    }
  }, [triggerCount])


    if (loading) {
        return <Text>Loading</Text>
    }

    const totalChange = currentValue !== undefined ? ((currentValue ?? 1)*numberOfShares)-purchaseValue : 0;
    const percentChange = currentValue !== undefined ? ((((currentValue ?? 1)*numberOfShares)-purchaseValue)/purchaseValue)*100.0 : 0;
    const imageUri = `data:image/png;base64,${icon}`;

    return(
        <View style={styles.container}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
            }}>
            <Image source={{uri: imageUri}} style={styles.icon} resizeMode="contain"/>
            <Text style={{fontWeight:'bold', fontSize:20}}>{name}</Text>
            <Text style={styles.minorNumber}>{numberOfShares.toFixed(3)}</Text>
            <Text style={styles.minorNumber}>${purchaseValue.toFixed(2)}</Text>
            <Text style={styles.minorNumber}>
                {currentValue !== undefined ? `$${((currentValue ?? 1) * numberOfShares).toFixed(2)}`: ""}
            </Text>
          </View>
          <PortfolioEntryChange 
            totalChange={totalChange} 
            percentChange={percentChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: { 
   flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 👈 key for left/right split
    backgroundColor: '#CCC',
    borderRadius: 10,
    width: '100%', // 👈 fill parent width
    height: 50,
    paddingHorizontal: 10, // space inside left/right edges
    marginVertical: 2,
  },
  icon: { 
    width: 50,
    height: 50,
    borderRadius: 25
  },
  minorNumber:{
    marginLeft: 5
  }
});