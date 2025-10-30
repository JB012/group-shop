import { useSupabase } from "@/providers/SupabaseProvider";
import { LegendList, LegendListRef, LegendListRenderItemProps } from "@legendapp/list"
import { UUID } from "crypto"
import { useEffect, useRef, useState } from "react"
import { View, Text, Alert } from "react-native";

interface MessageData {
    id: UUID,
    created_at: string,
    chatroom_id: UUID,
    content: string,
    member_id: string
}

interface Payload {
    event: string,
    payload: MessageData,
    type: string
}

export default function Messages({channel_id} : {channel_id: UUID}) {
    const [messages, setMessages] = useState(Array<MessageData>);
    const listRef = useRef<LegendListRef | null>(null)
    
    const supabase = useSupabase();

    const renderItem = ({ item } : LegendListRenderItemProps<MessageData>) => {
            return (
                <View>
                    <Text>{item.content}</Text>
                </View>
            )
        }

    useEffect(() => {
        async function retrieveMessages() {
            const {data, error} = await supabase.from('messages').select().eq('chatroom_id', channel_id).order('created_at', {ascending: true});
            if (!error) {
                setMessages(data as MessageData[]);
            }
            else {
                Alert.alert(error.message);
            }
        }

        retrieveMessages();

        const myChannel = supabase.channel('test-channel')
    
        myChannel
        .on(
            'broadcast',
            { event: 'input' }, // Listen for "shout". Can be "*" to listen to all events
            (payload : Payload) => setMessages([...messages, payload.payload])
        )
        .subscribe();
    }, [channel_id, messages, supabase]);

    return (
        <LegendList
            style={{flex: 1, backgroundColor: 'gainsboro'}}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            recycleItems={true}
            alignItemsAtEnd={true}
        >
        </LegendList>
    )
}