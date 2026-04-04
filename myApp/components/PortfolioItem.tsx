import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { globalStyles } from '../styles';
import { useState } from "react";
import { PortfolioFormModal } from "./PortfolioFormModal";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// export type PortfolioItemProps = {ID:number, Name:string, onEdit: (ID:number, newName:string) => void, onRemove: (ID:number) => void}
export type PortfolioItemProps = {ID:number, Name:string, onEdit: (ID:number, newName:string) => void, onRemove: any}

// const navigation = useNavigation();

export function PortfolioItem({ID, Name, onEdit, onRemove}: PortfolioItemProps){
    const [showEdit, setShowEdit] = useState(false);
    const [isEditItem, setIsEditItem] = useState(false);

    const navigation = useNavigation<NavProp>();
    return(
        // <View><Text>{Name}</Text></View>
        <View style={{
            flexDirection:'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <TouchableOpacity 
                style={[ globalStyles.container,  showEdit ? {width:'75%'} : {width:'100%'}]}
                onPress={() => navigation.navigate("PortfolioAccounts", {ID: ID})}
                onLongPress={() => setShowEdit(!showEdit)}
            >
                <View style={showEdit && {width:'75%'}}>
                <   Text>{Name}</Text>
                </View>
            </TouchableOpacity>
            { showEdit && (
                <>
                    <Pressable style={localStyles.button} onPress={() => {setIsEditItem(true)}}>
                        <Text>✏️</Text>
                    </Pressable>
                    <Pressable style={localStyles.button} onPress={() => onRemove(ID)}>
                        <Text>🗑️</Text>
                    </Pressable>
                </>
            )}
            <PortfolioFormModal
                visible={isEditItem}
                isAdd={false}
                portfolioItemData={{ID, Name}}
                onClose={() => setIsEditItem(false)}
                onSubmit={async (name) =>{
                    await onEdit(ID, name)
                    console.log("editing ID " + ID + "to name: " + name)
                    setIsEditItem(false)
                }}
            />
        </View>
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