import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native'
import { globalStyles } from '../../styles'

export type FormInputProps = { label:string, getter:string, setter: () => void, tiKeyboardType: KeyboardTypeOptions | undefined, placeholder:string}
export function FormInput({label, getter, setter, tiKeyboardType="default", placeholder}: FormInputProps){
    return (
        <View style={{
            flexDirection:'row',
            alignContent:'center',
            alignItems: 'center',
            width:'100%'
        }}>
            <Text style={{width:'20%'}}>{label}</Text>
            <TextInput style={[globalStyles.input, { 
                marginTop:10,
                marginBottom:10,
                width:'80%'
            }]}
                placeholder={placeholder || ""}
                value={getter}
                keyboardType={tiKeyboardType}
                onChangeText={setter}
            />
        </View>
    )
}