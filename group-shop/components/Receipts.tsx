import { View, Text, Button } from "react-native"
import ReceiptItem from "./ReceiptItem"

export default function Receipts({seeAll} : {seeAll : boolean}) {
    return (
        <View style={{flex: 1}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20}}>
                <Text style={{fontSize: 32}}>Receipts</Text>
                <Button title="Add Receipt"></Button>
            </View>
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