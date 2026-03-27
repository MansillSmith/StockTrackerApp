import { View, Text } from "react-native"
import { GetDateString } from "../utils/Utils"

export type FinancialAccountEntryProps = {ID: number, date:Date, description:string, debit:number, credit:number}

export function FinancialAccountEntry({ID, date, description, debit, credit}: FinancialAccountEntryProps){
    console.log(GetDateString(date))
    return(
        <View style={{
            width:'100%',
            height: 64,
            backgroundColor: 'lightblue',
            borderRadius: 10,
            marginBottom: 5
        }}>
            <View style={{
                flexDirection:'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{paddingLeft: 10}}>{GetDateString(date)}</Text>
                <Text style={{marginRight: 10}}>{description}</Text>
            </View>
            <Text>${debit.toFixed(2)}</Text>
            <Text>${credit.toFixed(2)}</Text>
        </View>
    )
}