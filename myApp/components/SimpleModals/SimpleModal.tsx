import { ReactNode } from "react";
import { Modal, View } from "react-native";
import { SimpleModalButtons } from "./SimpleModalButtons";

export type SimpleModalProps = { showModal:boolean, onClose:() => void, onSave: () => void, children:ReactNode}
export function SimpleModal({ showModal, onClose, onSave, children}: SimpleModalProps){
    return (
        <Modal visible={showModal} animationType="slide" transparent>
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
                    width: "80%",
                    alignItems: 'center'
                }}>
                    {children}
                    <SimpleModalButtons onClose={onClose} onSave={onSave} />
                </View>
            </View>
        </Modal>
    )
}