import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";

export type PortfolioFormModalProps = {visible: boolean, onClose: () => void, onSubmit: (name:string) => void}

export function PortfolioFormModal({ visible, onClose, onSubmit }: PortfolioFormModalProps){
    const [name, setName] = useState("");

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
                    <Text style={{ color: "red" }}>MODAL OPEN</Text>
                    <Text>Hi</Text>
                    <Pressable
                        onPress={() => {
                        onSubmit(name);
                        setName("");
                        onClose();
                        }}
                    >
                        <Text>Save</Text>
                    </Pressable>

                    <Pressable onPress={onClose}>
                        <Text>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}