import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { PortfolioEntryChange } from "./PortfolioEntryChange";

export type PortFolioEntryProps = { icon:ImageSourcePropType, name:string, totalChange:number, percentChange:number};

export function PortfolioEntry({icon, name, totalChange, percentChange}: PortFolioEntryProps) {
    return(
        <View style={styles.container}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 20
            }}>
            <Image source={icon} style={styles.icon}/>
            <Text>{name}</Text>
          </View>
          <PortfolioEntryChange totalChange={totalChange} percentChange={percentChange}></PortfolioEntryChange>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { 
    // flex:1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCC',
    borderRadius: 20,
    width: '100%',
    marginTop: 2,
    marginBottom: 2
  },
  icon: { 
    width: 50,
    height: 50,
    borderRadius: 25
 },
});