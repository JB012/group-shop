import ChatRoom from "@/components/ChatRoom";
import { ChatRoomType } from "@/components/ChatRoomType";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";


export default function Chat() {
  const [chatRooms, setChatRooms] = useState(Array<ChatRoomType>);
  const supabase = useSupabase();

  useEffect(() => {
    async function getChatRooms() {
      const {data, error} = await supabase.from('chatroom').select('*');
      if (!error) {
        setChatRooms(data as ChatRoomType[]);
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