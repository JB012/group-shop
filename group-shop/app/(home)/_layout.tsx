
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Link, Tabs } from 'expo-router';
import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SignOutButton } from '@/components/SignOutButton';
import { Menu,MenuOptions,MenuOption,MenuTrigger, renderers } from 'react-native-popup-menu';
const { Popover, SlideInMenu } = renderers;

export default function TabLayout() {
  function CustomHeader({header} : {header : string}) {
    return (
      <View style={{flexDirection: 'row', backgroundColor: 'white', height: 90, padding: 15, alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{header}</Text>
          {
            header === "People" ? <SignOutButton /> : 
            header === "Chat" ? 
            <Link href={'/(home)/addChatRoom'}>
              <Text style={{fontSize: 24}}>+</Text>
            </Link>
             : <View></View>
          }
          </View>
      </View>
    )
  }
  
  return (
    <Tabs
    screenOptions={{
    tabBarActiveTintColor: 'orange',
    tabBarStyle: {
    height: 70,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'orange',
    borderTopColor: 'orange',
    backgroundColor: 'white',
    },
    tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 10,
    }
    }}>
<Tabs.Screen
    name="index"
    options={{
    title: "Home",
    headerShown: true,
    headerShadowVisible: false,
    tabBarIcon: ({color, size}) => (
    <FontAwesome6 name='house' iconStyle='solid'/>
    )
}}/>
<Tabs.Screen
    name="chat"
    options={{
    title: "Chat",
    headerShown: true,
    header: () => <CustomHeader header={"Chat"}/>,
    headerShadowVisible: false,
    tabBarIcon: ({color, size}) => (
    <FontAwesome6 name='comment' iconStyle='solid'/>
    )
}}/>
<Tabs.Screen
    name="people"
    options={{
    title: "People",
    headerShadowVisible: false,
    header: () => <CustomHeader header={"People"}/>,
    tabBarIcon: ({color, size}) => (
    <FontAwesome6 name='people-group' iconStyle='solid'/>
    )
}}/>
<Tabs.Screen
  name='addChatRoom'
  options={{href: null}}
/>
</Tabs>
  );
}

