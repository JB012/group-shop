import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect } from "react";
import { View, Text, ScrollView, TextInput, Platform } from "react-native";
import { KeyboardController, KeyboardAvoidingView } from "react-native-keyboard-controller";

//TODO: Retrieve chatroom via id in useEffect
export default function ChatRoom() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

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

    return () => navigation.setOptions({
      tabBarStyle: undefined, tabBarLabelStyle: undefined
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', backgroundColor: 'white', height: 90, padding: 15, alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20}}>
                  <FontAwesome6 name="arrow-left" iconStyle="solid" size={18} onPress={() => navigate('/(home)/chatView')} />
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>Chat Title</Text>
                </View>
                <FontAwesome6 name="ellipsis" iconStyle="solid" size={24} />
              </View>
            </View>
            <ScrollView style={{flex: 1}}>
              <Text>Message</Text>
            </ScrollView>
            <TextInput multiline={true} placeholder="Enter message" style={{paddingLeft: 50, paddingRight: 100, textAlignVertical: 'top', backgroundColor: 'white', marginBottom: 0}}  />
      </View>
    </KeyboardAvoidingView>
  )
}