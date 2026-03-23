import { Pressable, Text, View} from 'react-native';
import { globalStyles } from '../styles';

type ActionButtonsProps = {
  onAdd: () => void;
  onEdit: () => void;
};


export function ActionButtons({ onAdd, onEdit }: ActionButtonsProps){
    return (
        <View style={{flexDirection:'row'}}>
            <Pressable style={globalStyles.button} onPress={onAdd}>
                <Text style={{fontWeight:'bold'}}>+</Text>
            </Pressable>
            <Pressable style={globalStyles.button} onPress={onEdit}>
                <Text style={{fontWeight:'bold'}}>✏️</Text>
            </Pressable>
        </View>
    )
}