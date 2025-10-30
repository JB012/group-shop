import ChatRoom from "@/components/ChatRoom";
import { useSupabase } from "@/providers/SupabaseProvider";
import { UUID } from "crypto";
import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

interface ChatRoomProp {
  id: UUID,
  created_at: string,
  owner: string,
  name: string,
  members: string,

  description?: string
}

export default function Chat() {
  const [chatRooms, setChatRooms] = useState(Array<ChatRoomProp>);
  const supabase = useSupabase();

  useEffect(() => {
    async function getChatRooms() {
      const {data, error} = await supabase.from('chatroom').select('*');
      if (!error) {
        setChatRooms(data as ChatRoomProp[]);
      }
      else {
        console.log(error);
      }
    }

    getChatRooms();
  }, [supabase]);

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        {
          chatRooms.map((chatRoom) => <ChatRoom key={chatRoom.id} owner={chatRoom.owner} name={chatRoom.name} id={chatRoom.id} members={chatRoom.members}  />)
        }
      </View>
    </ScrollView>
  );
}