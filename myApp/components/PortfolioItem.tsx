import { View, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { globalStyles } from '../styles';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export type PortfolioItemProps = {ID:number, Name:string}

// const navigation = useNavigation();

export function PortfolioItem({ID, Name}: PortfolioItemProps){
    const navigation = useNavigation<NavProp>();
    return(
        // <View><Text>{Name}</Text></View>
        <TouchableOpacity onPress={() => navigation.navigate("PortfolioAccounts", {ID: ID})}>
            <View style={globalStyles.container}>
                <Text>{Name}</Text>
            </View>
        </TouchableOpacity>
    )
}