import {View, Text, Button, Pressable} from 'react-native'
import ListItem from './ListItem'
export default function Lists({seeAll} : {seeAll : boolean}) {

    return (
        <View style={{flex: 1}}>
            <Pressable style={{paddingVertical: 12, alignSelf: 'center'}}><Text style={{paddingVertical: 5}}>Add Lists</Text></Pressable>
            <View style={{flex: 1, rowGap: 12}}>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                {seeAll === false && <Button title="See More"></Button>}
            </View>
        </View>
    )
}