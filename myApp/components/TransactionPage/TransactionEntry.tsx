import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { JournalLine } from "../../types";
import { GetDate, GetDateString } from "../../utils/Utils";
import { useState } from "react";
import { EditDeleteButtons } from "../EditDeleteButtons";
import { DeleteItemForm } from "../EntryForms/DeleteItemForm";
import { useSQLiteContext } from "expo-sqlite";
import { WalletTopUpModal } from "../EntryForms/WalletTopUpModal";

export type TransactionEntryData = { ID: number, Description: string, JournalEntryTypeID:number, TimestampUNIX: number, JournalLines: JournalLine[]}
export type TransactionEntryProps = { updateParent: () => void, onShowEditButtons: (ID:number) => void, onEdit: () => void, selected:boolean, data:TransactionEntryData}
export function TransactionEntry({ updateParent, onShowEditButtons, onEdit, selected, data }: TransactionEntryProps){
    const { ID, Description, JournalEntryTypeID, TimestampUNIX, JournalLines } = data

    // const [selected, setSelected] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false)
    // const [showEditForm, setShowEditForm] = useState<boolean>(false)

    const debitJournalLines: JournalLine[] = JournalLines.filter((val) => val.Debit > 0)
    const creditJournalLines: JournalLine[] = JournalLines.filter((val) => val.Credit > 0)

    const db = useSQLiteContext()

    async function DeleteEntry(ID:number){
        const query:string = `
        DELETE FROM JournalEntries WHERE ID = ?;
        DELETE FROM JournalLines WHERE JournalEntryID = ?;
        `
        await db.runAsync(query, [ID, ID])
    }

    return (
        <>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5
            }}>
                <TouchableOpacity style={[{
                    // backgroundColor: '#CCC',

                }, selected? {width: '75%'} : {width: '100%'}]}
                    onLongPress={ () => {
                        // setSelected(!selected)
                        onShowEditButtons(ID)
                    }}
                >
                    <View style ={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        backgroundColor: '#CCC',
                        paddingLeft: 5,
                        paddingRight: 5,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5
                    }}>
                        <Text style={{ fontWeight: 'bold' }}>{GetDateString(GetDate(TimestampUNIX))}</Text>
                        <Text style={{ marginLeft: 10, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{Description}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // backgroundColor: '#00f'
                    }}>
                        <View style={[styles.column]}>
                        {
                            debitJournalLines.map((i) =>(
                                <JournalLineView key={i.ID} {...i}/>
                            ))
                        }
                        </View>
                        <View style={[styles.column]}>
                        {
                            creditJournalLines.map((i) =>(
                                <JournalLineView key={i.ID} {...i}/>
                            ))
                        }
                        </View>
                    </View>
                </TouchableOpacity>
                { selected && <EditDeleteButtons onEdit={() => {onEdit()}} onRemove={() => setShowDelete(true)}/>}
            </View>
            <DeleteItemForm 
                onSave={() => {
                    DeleteEntry(ID)
                    setShowDelete(false)
                    updateParent()
                }}
                onClose={() => setShowDelete(false)} 
                showModal={showDelete} 
            />
        </>
    )
}

function JournalLineView({ ID, JournalEntryID, StockName, Quantity, AccountName, Debit, Credit, ReportingDebit, ReportingCredit }: JournalLine){
    let value = 0
    let reportingvalue = 0
    if (Debit > 0){
        value += Debit
        reportingvalue += ReportingDebit
    }
    else {
        value += Credit
        reportingvalue += ReportingCredit
    }

    return (
        <View style={{
            // backgroundColor: '#0f0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
            paddingLeft: 5,
            paddingRight: 5
        }}>
            <Text style={{ flex: 1 }}>{AccountName}</Text>
            <View style={{alignItems: 'flex-start'}}>
                {/* TODO: Fix locale strings */}
                <Text>{reportingvalue === value? value.toLocaleString('en-NZ', {style: "currency", currency: "NZD"}) : "(" + value.toString() + ")"}</Text>
                {reportingvalue !== value && <Text>{reportingvalue.toLocaleString('en-NZ', {style: "currency", currency: "NZD"})}</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    column:{
        width:'48%',
        alignItems:'flex-start',
        backgroundColor: '#CCC',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
        // height: 10
    }
})