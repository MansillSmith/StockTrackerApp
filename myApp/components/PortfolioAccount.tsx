import { View, Text } from "react-native";
import { globalStyles } from "../styles";
import { PortfolioAccountProp } from "../types";

export function PortfolioAccount({ID, Name, AccountTypeID, AccountBalance}: PortfolioAccountProp){
    return (
        <View key={ID} style={globalStyles.container}>
            <Text style={{width:'80%'}}>{Name}</Text>
            <Text style={{
                width:'20%', 
                textAlign:"right"
            }}>
                ${Math.abs(AccountBalance).toFixed(2)}
            </Text>
        </View>
    )
}