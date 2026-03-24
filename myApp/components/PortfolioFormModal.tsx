import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { globalStyles } from "../styles";

export type PortfolioFormModalProps = {visible: boolean, initialValue?:string, isAdd:boolean, onClose: () => void, onSubmit: (name:string) => void}

export function PortfolioFormModal({ visible, initialValue, isAdd, onClose, onSubmit }: PortfolioFormModalProps){
    const [name, setName] = useState(initialValue ?? "");

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
                    <TextInput style={[globalStyles.input, localStyles.modelObject]}
                        placeholder="Enter Portfolio Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <View style={[localStyles.modelObject, {flexDirection:'row'}]}>
                        <Pressable style={[globalStyles.smallButton, localStyles.wideButton]}
                            onPress={() => {
                            onSubmit(name);
                            setName("");
                            onClose();
                            }}
                        >
                            <Text>Save</Text>
                        </Pressable>
                        <Pressable style={[globalStyles.smallButton, localStyles.wideButton]} onPress={onClose}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export const localStyles = StyleSheet.create({
    wideButton:{
        width:60
    },
    modelObject:{
        marginTop:10,
        marginBottom:10
    }
});