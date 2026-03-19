import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { PortfolioEntryChange } from "./PortfolioEntryChange";

export type PortFolioEntryProps = { icon:ImageSourcePropType, name:string, numberOfShares:number, currentValue:number, totalChange:number, percentChange:number};

export function PortfolioEntry({icon, name, numberOfShares, currentValue, totalChange, percentChange}: PortFolioEntryProps) {
    return(
        <View style={styles.container}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
            }}>
            <Image source={icon} style={styles.icon}/>
            <Text style={{fontWeight:'bold', fontSize:20}}>{name}</Text>
            <Text style={styles.minorNumber}>{numberOfShares.toFixed(3)}</Text>
            <Text style={styles.minorNumber}>${currentValue.toFixed(2)}</Text>
          </View>
          <PortfolioEntryChange totalChange={totalChange} percentChange={percentChange}></PortfolioEntryChange>
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