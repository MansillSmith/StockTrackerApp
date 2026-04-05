import { Pressable, View, Text } from "react-native";
import { globalStyles } from "../../styles";

export type SimpleModalButtonsProps = { onSave: () => void, onClose: () => void}
export function SimpleModalButtons({ onSave, onClose }: SimpleModalButtonsProps){
    return (
        <View style={[{flexDirection:'row'}]}>
            <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]} onPress={() => onSave()}>
                <Text>Save</Text>
            </Pressable>
            <Pressable style={[globalStyles.smallButton, globalStyles.wideButton]} onPress={() => onClose()}>
                <Text>Cancel</Text>
            </Pressable>
        </View>
    )
}