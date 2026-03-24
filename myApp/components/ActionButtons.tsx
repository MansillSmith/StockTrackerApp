import { Pressable, Text, View} from 'react-native';
import { globalStyles } from '../styles';

// type ActionButtonsProps = {
//   onAdd: () => void;
//   onEdit: () => void;
// };


export function ActionButtons({ onAdd, onEdit, onRemove}){
    // return (
    //     <View style={{flexDirection:'row'}}>
    //         <Pressable style={globalStyles.button} onPress={onAdd}>
    //             <Text style={{fontWeight:'bold'}}>+</Text>
    //         </Pressable>
    //         <ActionButton onPressEvent=onAdd word="+"/>
    //         <Pressable style={globalStyles.button} onPress={onEdit}>
    //             <Text style={{fontWeight:'bold'}}>✏️</Text>
    //         </Pressable>
    //     </View>
    // )
        return (
        <View style={{flexDirection:'row'}}>
            <ActionButton onPressEvent={onAdd} word="+"/>
            <ActionButton onPressEvent={() => {}} word="⚙️"/>
            {/* <ActionButton onPressEvent={onRemove} word="🗑️"/> */}
        </View>
    )
}

function ActionButton({onPressEvent, word}){
    return (
        <>
            <Pressable style={globalStyles.smallButton} onPress={onPressEvent}>
                <Text style={{fontWeight:'bold'}}>{word}</Text>
            </Pressable>
        </>
    )
}