import Lists from "@/components/Lists";
import Receipts from "@/components/Receipts";
import { ScrollView, StyleSheet, Pressable, View, Text } from "react-native";
import { useState } from "react";

export default function Tab() {
    const [selectedTab, setSelectedTab] = useState("Lists");
    //TODO: Swipe between tabs
    return (
    <ScrollView style={{backgroundColor: 'white',flex: 1, flexGrow: 1, paddingLeft: 10, paddingRight: 10, marginBottom: 5}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Pressable onPress={() => setSelectedTab("Lists")} style={selectedTab === "Lists" ? styles.selectedTab : {flex: 1}}>
                <Text style={{alignSelf: 'center', paddingVertical: 10}}>Lists</Text>
            </Pressable>
            <Pressable onPress={() => setSelectedTab("Receipts")} style={selectedTab === "Receipts" ? styles.selectedTab : {flex: 1}}>
                <Text style={{alignSelf: 'center', paddingVertical: 10}}>Receipts</Text>
            </Pressable>
        </View>
        {
            selectedTab === "Lists" ? 
            <Lists seeAll={false} /> : 
            <Receipts seeAll={false} />
        }
    </ScrollView> 
    );
}

const styles = StyleSheet.create(
    {
        selectedTab: {
            flex: 1, 
            borderBottomColor: 'blue', 
            borderBottomWidth: 3,
            padding: 0
        }
    }
)