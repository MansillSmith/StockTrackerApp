import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { globalStyles } from "../styles";
import { PortfolioItemData } from "../types";
import { FormInput } from "./FormInput";

export type PortfolioFormModalProps = {visible: boolean, portfolioItemData?:PortfolioItemData, isAdd:boolean, onClose: () => void, onSubmit: (name:string) => void}

export function PortfolioFormModal({ visible, portfolioItemData, isAdd, onClose, onSubmit }: PortfolioFormModalProps){
    const [name, setName] = useState<string>(portfolioItemData?.Name ?? "");
    const [order, setOrder] = useState<number | undefined>(portfolioItemData?.ID ?? -1);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}>
                <View style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%"
                }}>
                    <Text style={localStyles.modelObject}>
                        { isAdd ? "Add " : "Edit"} Porfolio
                    </Text>
                    <FormInput label={"Name"} getter={name} setter={setName} placeholder="Enter Portfolio Name"/>
                    {order !== -1 && 
                        <FormInput 
                            label="Order" 
                            getter={order === undefined ? "" : order.toString()}
                            tiKeyboardType="numeric"
                            setter={(text) => {
                                if (text === ""){
                                    setOrder(undefined)
                                    return
                                }
                                setOrder(parseInt(text, 10))
                            }}
                        />                        
                    }

                    {/* Save close buttons*/}
                    <View style={[localStyles.modelObject, {flexDirection:'row'}]}>
                        <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]}
                            onPress={() => {
                            onSubmit(name);
                            setName("");
                            onClose();
                            }}
                        >
                            <Text>Save</Text>
                        </Pressable>
                        <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]} onPress={onClose}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

// type FormInputProps = {label:string, getter:any, setter: (text:string) => void, tiKeyboardType?:any, placeholder?:string}
// function FormInput({label, getter, setter, tiKeyboardType="default", placeholder}: FormInputProps){
//     return (
//         <View style={{
//             flexDirection:'row',
//             alignContent:'center',
//             alignItems: 'center',
//             width:'100%'
//         }}>
//             <Text style={{width:'20%'}}>{label}</Text>
//             <TextInput style={[globalStyles.input, localStyles.modelObject, {width:'80%'}]}
//                 placeholder={placeholder || ""}
//                 value={getter}
//                 keyboardType={tiKeyboardType}
//                 onChangeText={setter}
//             />
//         </View>
//     )
// }

export const localStyles = StyleSheet.create({
    modelObject:{
        marginTop:10,
        marginBottom:10
    }
});