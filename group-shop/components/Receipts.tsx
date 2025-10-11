import { View, Text, Pressable, Button } from "react-native"
import ReceiptItem from "./ReceiptItem"

export default function Receipts({seeAll} : {seeAll : boolean}) {
    return (
        <View style={{flex: 1}}>
            <Pressable style={{paddingVertical: 12, alignSelf: 'center'}}><Text style={{paddingVertical: 5}}>Add Receipts</Text></Pressable>
            <View style={{flex: 1, rowGap: 12}}>
                <ReceiptItem store={'Name'} date={'Date'} itemsCount={7}/>
                <ReceiptItem store={'Name'} date={'Date'} itemsCount={5}/>
                <ReceiptItem store={'Name'} date={'Date'} itemsCount={5}/>
                <ReceiptItem store={'Name'} date={'Date'} itemsCount={5}/>
                {seeAll === false && <Button title="See More"></Button>}
            </View>
        </View>   
    )
}