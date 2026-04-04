import { Pressable, Text, StyleSheet } from "react-native"

export type EditDeleteButtonsProps = { onEdit: () => void, onRemove: () => void}
export function EditDeleteButtons({ onEdit, onRemove }: EditDeleteButtonsProps){
    return (
        <>
            <Pressable style={localStyles.button} onPress={() => onEdit()}>
                <Text>✏️</Text>
            </Pressable>
            <Pressable style={localStyles.button} onPress={() => onRemove()}>
                <Text>🗑️</Text>
            </Pressable>
        </>
    )
}

const localStyles = StyleSheet.create({
    button:{
        width:'10%',
        height:50,
        borderRadius:10,
        backgroundColor: '#CCC',
        // backgroundColor:'#f00',
        justifyContent: 'center',
        alignItems: 'center',
    }
})