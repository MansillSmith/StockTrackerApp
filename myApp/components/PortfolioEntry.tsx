import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { PortfolioEntryChange } from "./PortfolioEntryChange";

type PortFolioEntryProps = { icon:ImageSourcePropType, name:string};

export function PortfolioEntry({icon, name}: PortFolioEntryProps) {
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
          <PortfolioEntryChange totalChange={123} percentChange={12.1}></PortfolioEntryChange>
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