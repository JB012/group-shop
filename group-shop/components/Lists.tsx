import {View, Text, Button} from 'react-native'
import ListItem from './ListItem'

export default function Lists({seeAll} : {seeAll : boolean}) {
    return (
        <View style={{flex: 1}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20}}>
                <Text style={{fontSize: 32}}>Lists</Text>
                <Button title="Add List"></Button>
            </View>
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