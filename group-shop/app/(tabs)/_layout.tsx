import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
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
    headerShown: false,
    tabBarIcon: ({color, size}) => (
    <FontAwesome6 name='house' iconStyle='solid'/>
    )
}}/>
<Tabs.Screen
    name="chat"
    options={{
    title: "Chat",
    headerShown: false,
    tabBarIcon: ({color, size}) => (
    <FontAwesome6 name='comment' iconStyle='solid'/>
    )
}}/>
</Tabs>
  );
}

