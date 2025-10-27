import {View, Text, Button, Pressable} from 'react-native'
import ListItem from './ListItem'
import { useSupabase } from '@/providers/SupabaseProvider';
export default function Lists({seeAll} : {seeAll : boolean}) {
    
    const supabase = useSupabase();

    async function test() {
        const {data, error} = await supabase.from('Test').insert({test: 'Testing insert 2'});
        console.log(error);
    }

    return (
        <View style={{flex: 1}}>
            <Pressable style={{paddingVertical: 12, alignSelf: 'center'}}><Text style={{paddingVertical: 5}}>Add Lists</Text></Pressable>
            <View style={{flex: 1, rowGap: 12}}>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                <ListItem title={'Name'} date={'Date'}/>
                {seeAll === false && <Button onPress={test} title="See More"></Button>}
            </View>
        </View>
    )
}