import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// export type DatePickerProps = {dateString: string | undefined, setDate: (date:Date) => void, isVisible:boolean, setVisible: (isVisible:boolean) => void}
// export function DatePicker({dateString, setDate, isVisible, setVisible} :DatePickerProps){
export type DatePickerProps = {dateString: string | undefined, setDate: (date:Date) => void}
export function DatePicker({dateString, setDate} :DatePickerProps){
    const [isDateVisible, setIsDateVisibleVisible] = useState<boolean>(false)

    return (
    <View style={{marginBottom:10}}>
      <TouchableOpacity onPress={() => setIsDateVisibleVisible(true)}>
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

      <DateTimePickerModal
        isVisible={isDateVisible}
        mode="datetime"
        onConfirm={(selectedDate: Date) => {
          setDate(selectedDate);
          setIsDateVisibleVisible(false);
        }}
        onCancel={() => setIsDateVisibleVisible(false)}
      />
    </View>
  );
}