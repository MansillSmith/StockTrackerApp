import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";

type PortFolioEntryProps = { icon:ImageSourcePropType, name:string};

export function PortfolioEntry({icon, name}: PortFolioEntryProps) {
    return(
        <View style={styles.container}>
            <Image source={icon} style={styles.icon}/>
            <Text>{name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 20
  },
  icon: { 
    width: 50,
    height: 50,
    borderRadius: 25
 },
});