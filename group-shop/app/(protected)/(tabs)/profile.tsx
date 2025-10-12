import { View, ScrollView, Text, Pressable, Button, Modal, TextInput } from "react-native"
import { useState, useEffect } from "react"
import User from "@/components/User";

import * as ScreenOrientation from 'expo-screen-orientation';
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

//TODO: Search bar for People section

export default function Profile({name, id} : {name : string, id: string}) {
    const [orientation, setOrientation] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInput, setModalInput] = useState("");

    function getOrientation(orientationEnum : number) {
        if (orientationEnum === 1 || orientationEnum === 2) {
            return "Portrait";
        }

        return "Landscape";
    }
    useEffect(() => {
        function handleOrientation(event : ScreenOrientation.OrientationChangeEvent) {
            setOrientation(getOrientation(event.orientationInfo.orientation));
        }
        
        const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientation);

        if (orientation === "") {
            ScreenOrientation.getOrientationAsync().then(orientationEnum => (orientationEnum === 1 || orientationEnum === 2) ? setOrientation("Portrait") : setOrientation('Landscape'))
        }

        return () => ScreenOrientation.removeOrientationChangeListener(subscription);
    }, [orientation]);

    return (
        <View style={{flex: 1}}>
            {
                    orientation === "Portrait" ?
                    <ScrollView style={{flex: 1, paddingLeft: 10, paddingTop: 10, paddingRight: 10, marginBottom: 5}}>
                        <Modal style={{margin: 10}} visible={modalVisible}>
                            <View style={{flex: 1, padding: 10}}>
                                <FontAwesome6 name="magnifying-glass" size={20} style={{position: 'absolute', top: 20, left: 20 }} iconStyle="solid" />
                                <TextInput style={{paddingHorizontal: 36, borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40}} value={modalInput} onChangeText={setModalInput} />
                                <ScrollView style={{flex: 1, paddingTop: 20}}>
                                    <User name="john" id="john" added={false}/>
                                    {/* Users show up here */}
                                </ScrollView>
                            </View>
                            <Button title="Close" onPress={() => setModalVisible(false)}></Button>
                        </Modal>
                        <View style={{flex: 1, justifyContent: 'center', padding: 10, height: 200, backgroundColor: 'gray'}}>
                            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', gap: 50}}>  
                                <View style={{ width: 100, height: 100, backgroundColor: 'red', borderRadius: 50}}>
                                </View>
                                <View style={{ columnGap: 10}}>
                                    <Text>Name{name}</Text>
                                    <Text>ID: <Text>{id}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 24}}>People</Text>
                             <Pressable onPress={() => setModalVisible(true)}><Text>Add More</Text></Pressable>
                        </View>
                        <ScrollView>
                            <User name="John" id="john" added={true} />
                            <User name="John" id="john" added={true} />
                        </ScrollView>
                        </View>
                    </ScrollView>
                :
                <View style={{flex: 1, flexDirection: 'row', gap: 10, padding: 10}}>
                    <View style={{width: 300, height: 175, backgroundColor: 'gray'}}>
                        <View style={{flex: 1, padding: 10, alignItems: 'center', flexDirection: 'row', gap: 50}}>
                            <View style={{width: 100, height: 100, borderRadius: 50, backgroundColor: 'red'}}>
                            </View>
                            <View style={{flex: 1, columnGap: 10}}>
                                <Text>Name: {name}</Text>
                                <Text>ID: {id}</Text>    
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>People</Text>
                            <Pressable onPress={() => setModalVisible(true)}><Text>Add More</Text></Pressable>
                        </View>
                        <ScrollView>
                            <Text>Person 1</Text>
                        </ScrollView>
                    </View>
                </View>
            }
        </View>
    )
}