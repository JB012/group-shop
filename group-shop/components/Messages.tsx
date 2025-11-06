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
            if (messages.length === 0) {
                console.log('change');
                const {data, error} = await supabase.from('messages').select().eq('chatroom_id', channel_id)
                .order('created_at', {ascending: true});
                
                if (!error) {
                    setMessages(data as MessageData[]);
                }
                else {
                    Alert.alert(error.message);
                }
            }
        }

        retrieveMessages();

        const myChannel = supabase.channel('test-channel');
        myChannel.on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
        }, (payload) => {console.log(JSON.stringify(payload.new)); setMessages([...messages, payload.new as MessageData])}).subscribe();

        return () => {
            supabase.removeChannel(myChannel);
        }
    }, [channel_id, messages, messages.length, supabase]);

    return (
        <LegendList
            style={{flex: 1, backgroundColor: 'gainsboro', flexDirection: 'column'}}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id ?? "unknown"}
            recycleItems={true}
            alignItemsAtEnd={true}
            maintainScrollAtEnd={true}
            maintainVisibleContentPosition={true}
            maintainScrollAtEndThreshold={0.1}
            estimatedItemSize={100}
            initialContainerPoolRatio={messages.length + 10}
        >
        </LegendList>
    )
}