import { UUID } from "crypto"
import { useRouter } from "expo-router"
import { View, Text, Pressable, TouchableHighlight } from "react-native"

export default function ChatRoom({avatar_url, name, members, id} : {id: UUID, avatar_url?: string, name : string, owner: string, members: string}) {
    const router = useRouter();

    return (
        <TouchableHighlight onPress={() => {router.navigate(`/(home)/chatRoom/[${id}]`)}}>
                <View style={{flex: 1, padding: 10, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 25}}>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 18}}>{name}</Text>
                            <View style={{ width: 24, height: 24, backgroundColor: 'red', borderRadius: 12}}>
                                <Text style={{color: 'white', alignSelf: 'center'}}>1</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 14, color: 'gray'}}>Latest message</Text>
                            <Text style={{fontSize: 14, color: 'gray'}}>Date</Text>
                        </View>
                        
                    </View>
                </View>
        </TouchableHighlight>
    )
}