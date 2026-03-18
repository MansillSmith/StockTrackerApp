import { View, Text as RNText, TextProps, StyleSheet} from "react-native"

type PortfolioEntryChangeProps = {totalChange:number, percentChange:number}

function Text(props: TextProps) {
  return <RNText {...props} style={[styles.text, props.style]} />;
}

export function PortfolioEntryChange({totalChange, percentChange}: PortfolioEntryChangeProps) {
    return (
        <View style={[
            styles.container,
            {
                backgroundColor: totalChange >= 0 ? '#0f0' : '#f00',
                borderRadius: 20,
                width: 100,
                flexDirection:'row',
                alignItems: 'center'
            }
        ]}>
            <Text style={{fontSize:25}}>{totalChange > 0 ? "+" : "-"}</Text>
            <View style={{
                marginLeft: 'auto',
                marginRight: 15
            }}>
                <Text>{totalChange}</Text>
                <Text>{percentChange}%</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  text: { 
    fontSize: 15,
    color: "#fff",
    fontWeight: 'bold'
  },
  container:{
    borderRadius: 20
  }
});