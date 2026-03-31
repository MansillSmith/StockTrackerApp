import { View, Text } from "react-native"
import { GetDateString } from "../utils/Utils"
import { FinancialAccountDetails, FinancialAccountTransactionDetails } from "./FinancialAccount"

export type FinancialAccountEntryProps = { transactionDetails: FinancialAccountTransactionDetails, accountDetails: FinancialAccountDetails}
export function FinancialAccountEntry({transactionDetails:{ID: transactionID, date, description, debit, credit}, accountDetails:{ID: accountID, Name, AccountType}}: FinancialAccountEntryProps){

    let value = debit - credit
    if(AccountType == "Credit"){
        value = value * -1
    }

    return(
        <View style={{
            width:'100%',
            height: 64,
            backgroundColor: value > 0 ? "lightblue": "pink",
            borderRadius: 10,
            marginBottom: 2,
            flexDirection:'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10
        }}>
            <View>
                <Text style={{fontWeight:'bold'}}>{description}</Text>
                <Text>{GetDateString(date)}</Text>        
            </View>
            <Text style={{fontWeight:'bold'}}>{value.toLocaleString('en-NZ', {
                style: "currency",
                currency: "NZD"
            })}</Text>
            {/* <Text>${credit.toFixed(2)}</Text> */}
        </View>
    )
}