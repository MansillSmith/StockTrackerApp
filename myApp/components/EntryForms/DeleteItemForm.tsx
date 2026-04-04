import { Modal, View, Text, Pressable } from "react-native";
import { globalStyles } from "../../styles";

export type DeleteItemFormProps = { showModal:boolean, onClose: () => void, onSave: () => void}
export function DeleteItemForm({ showModal, onClose, onSave }: DeleteItemFormProps){
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
                    <Text style={{ fontWeight: 'bold' }}>Are you sure?</Text>
                    <View style={[{flexDirection:'row'}]}>
                        <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]} onPress={onSave}>
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