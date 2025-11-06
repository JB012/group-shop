import { ChatRoomType } from "@/components/ChatRoomType";
import Messages from "@/components/Messages";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { UUID } from "crypto";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Platform, Pressable, Alert } from "react-native";
import { KeyboardController, KeyboardAvoidingView } from "react-native-keyboard-controller";

//TODO: Retrieve chatroom via id in useEffect
export default function ChatRoom() {
  const { id } = useLocalSearchParams<{id : UUID}>();
  const {isSignedIn, isLoaded, user} = useUser();
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const supabase = useSupabase();
  const [chatRoomData, setChatRoomData] = useState<ChatRoomType>();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: 'none',
        padding: 0,
        margin: 0
      }, 
      tabBarLabelStyle: {
        marginBottom: 0
      }
    });

    async function getChatRoom() {
      const {data, error} = await supabase.from('chatroom').select().eq('id', id);

      if (!error) {
        setChatRoomData(data[0] as ChatRoomType);
      }
      else {
        console.log(error);
      }
    }

    getChatRoom();

    return () => navigation.setOptions({
      tabBarStyle: undefined, tabBarLabelStyle: undefined
    });
  }, [id, navigation, supabase]);

  async function handleSend() {
    const {error} = await supabase.from('messages').insert({content: input, chatroom_id: id, member_id: user?.id})
    if (error) {
      Alert.alert(error.message);
    }
    else {  
      setInput("");
    }
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 1}>
      <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', backgroundColor: 'white', height: 90, padding: 15, alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20}}>
                  <FontAwesome6 name="arrow-left" iconStyle="solid" size={18} onPress={() => navigate('/(home)/chatView')} />
                  <Text numberOfLines={1} style={{fontSize: 20, fontWeight: 'bold'}}>{chatRoomData?.name}</Text>
                </View>
                <FontAwesome6 name="ellipsis" iconStyle="solid" size={24} />
              </View>
            </View>
            <Messages channel_id={id}/>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10}}>
              <Pressable><FontAwesome6 name="plus" size={22} iconStyle="solid" /></Pressable>
              <TextInput value={input} onChangeText={setInput} multiline={true} placeholder="Enter message" style={{flex: 1, textAlignVertical: 'top', backgroundColor: 'white', marginBottom: 0}}  />
              <FontAwesome6 name="face-smile" size={22} />
              <Pressable disabled={input === "" ? true : false} onPress={handleSend} style={{borderRadius: 100, width: 60, height: 30, backgroundColor: input === "" ? 'gainsboro' : Platform.OS === "ios" ? "#007AFF" : "#2196F3", alignItems: 'center', justifyContent: 'center'}}><Text style={{color: 'white'}}>Send</Text></Pressable>
            </View>
      </View>
    </KeyboardAvoidingView>
  )
}