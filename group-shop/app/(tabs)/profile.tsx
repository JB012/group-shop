import { View, ScrollView, Text, Pressable, Button } from "react-native"
import { useState, useEffect } from "react"
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Profile({name, id} : {name : string, id: string}) {
    const [orientation, setOrientation] = useState("");

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
                        <View style={{flex: 1, justifyContent: 'center', height: 200, backgroundColor: 'gray'}}>
                            <View style={{ flexDirection: 'row', rowGap: 10}}>  
                                <View style={{ width: 100, height: 100, borderStyle: 'solid', borderColor: 'black', borderRadius: 50}}>
                                    <Text>Photo</Text>
                                </View>
                                <View style={{ columnGap: 10}}>
                                    <Text>Name{name}</Text>
                                    <Text>ID: <Text>{id}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <Text>People</Text>
                            <Text>asdw</Text>
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
                            <Pressable><Text>Add More</Text></Pressable>
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