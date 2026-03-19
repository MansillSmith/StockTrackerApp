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
                backgroundColor: totalChange > 0 ? '#0f0' : totalChange < 0 ? '#f00' : '#ccc',
                borderRadius: 10,
                width: 80,
                flexDirection:'row',
                alignItems: 'center',
                marginRight: 5
            }
        ]}>
            <Text style={{fontSize:25, marginLeft: 5}}>{totalChange > 0 ? "+" : "-"}</Text>
            <View style={{
                marginLeft: 'auto',
                marginRight: 15
            }}>
                <Text>{totalChange.toFixed(2)}</Text>
                <Text>{percentChange.toFixed(2)}%</Text>
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
    borderRadius: 10
  }
});