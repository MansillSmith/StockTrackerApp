import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

export type DatePickerProps = {dateString: string | undefined, setDate: (date:Date) => void, isVisible:boolean, setVisible: (isVisible:boolean) => void}
export function DatePicker({dateString, setDate, isVisible, setVisible} :DatePickerProps){
    return (
    <View style={{marginBottom:10}}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <TextInput
          placeholder="Select date"
          value={dateString}
          editable={false} // prevents keyboard
          pointerEvents="none"
          style={{
            borderWidth: 1,
            padding: 12,
            borderRadius: 8,
          }}
        />
      </TouchableOpacity>

      {/* <DateTimePickerModal
        isVisible={isVisible}
        mode="datetime"
        onConfirm={(selectedDate) => {
          setDate(selectedDate);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      /> */}
    </View>
  );
}