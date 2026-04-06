import { Picker } from '@react-native-picker/picker'
import { View, Text } from 'react-native'

export type FormPickerProps = { label:string, items:any[], getter:any, setter:(e:any) => void, labelKey?:string, showText?:boolean}
export function FormPicker( { label, items, getter, setter, labelKey="Name", showText=true}:FormPickerProps){
    return (
        <View style={{
            flexDirection:'row',
            alignContent:'center',
            alignItems: 'center',
            width:'100%'
        }}>
            {showText && <Text style={{width:'20%'}}>{label}</Text>}
            <Picker style={{height:50, width:'80%'}}
                selectedValue={getter}
                onValueChange={setter}
            >
                {
                    items.map((i:any) => (
                        <Picker.Item key={i.ID} label={i[labelKey]} value={i.ID}/>
                    ))
                }
            </Picker>
        </View>
    )
}