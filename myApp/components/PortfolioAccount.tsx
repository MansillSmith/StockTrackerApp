import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles";
import { PortfolioAccountProp, RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function PortfolioAccount({ID, Name, AccountTypeID, AccountBalance}: PortfolioAccountProp){

    const navigation = useNavigation<NavProp>();
    return (
        <TouchableOpacity
            onPress={() => {
                if (AccountTypeID === 2){
                    navigation.navigate("ShareAccounts", {ID: ID})
                }
                else{
                    navigation.navigate("FinancialAccount", {ID: ID, AccountBalance: AccountBalance})
                }
            }}
        >
            <View key={ID} style={globalStyles.container}>
                <Text style={{width:'80%'}}>{Name}</Text>
                <Text style={{
                    width:'20%', 
                    textAlign:"right"
                }}>
                    ${AccountBalance.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}