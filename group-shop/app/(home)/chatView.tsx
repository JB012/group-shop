import ChatRoom from "@/components/ChatRoom";
import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

interface ChatRoomProp {
  title: string,
  id: number,
  description?: string
}

export default function Chat() {
  const [chatRooms, setChatRooms] = useState(Array<ChatRoomProp>);
  
  return (
    <ScrollView>
      <View style={{flex: 1}}>
          <ChatRoom title="New chat" id={2} description="New chatroom"/>
      </View>
    </ScrollView>
  );
}