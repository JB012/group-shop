import {View, Text, Pressable, Button } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

export default function User({name, id, added} : {name : string, id : string, added : boolean}) {
    return (
        <View style={{flex: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <View style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 25}}>
                </View>
                <View style={{flex: 1}}>
                    <Text>{name}</Text>
                    <Text>ID: {id}</Text>
                </View>
            </View>
            {
                added ? <FontAwesome6 name='ellipsis' size={20} iconStyle='solid'/> : <Button title="Add"></Button>
            }
        </View>
    )
}