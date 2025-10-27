import { View, Text, ScrollView, TextInput, Pressable, Platform, KeyboardAvoidingView, Image } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserType } from "@/components/UserType";
import User from "@/components/User";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Link } from "expo-router";
import useOrientation from "@/utils/useOrientation";
import * as ImagePicker from 'expo-image-picker';

export default function Add() { 
    const orientation = useOrientation();
    const [searchFavorite, setSearchFavorite] = useState("");
    const [favorites, setFavorites] = useState(Array<UserType>);
    const [selectUsers, setSelectUsers] = useState(Array<UserType>);
    const [clickedNext, setClickedNext] = useState(false);
    const [chatRoomName, setChatRoomName] = useState("");
    const {isSignedIn, isLoaded, user} = useUser();
    const [image, setImage] = useState<string | null>(null);
    
    function selectUser(user: UserType) {
        if (!selectUsers.includes(user)) {
            setSelectUsers([...selectUsers, user]);
        }
    }

    function deselectUser(user: UserType) {
        if (selectUsers.includes(user)) {
            setSelectUsers(selectUsers.filter((someUser) => someUser.id !== user.id));
        }
    }

     function setDefaultChatTitle() {
        return selectUsers.length > 1 ? `${selectUsers[0].fullName.split(" ")[0]} and ${selectUsers.slice(1).length} others` :
        `${selectUsers[0].fullName}`;
    }

    useEffect(() => {
        function getAllFavorites() {
            if (favorites.length === 0) {
                axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/${user?.id}/favorites`).then((res) => setFavorites(res.data))
                .catch((err) => console.log(err))
            }
        }

        getAllFavorites();

    }, [favorites.length, user?.id]);
    
    async function handleImage() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    //Header is defined here because the data of the selected users is needed. 
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, paddingHorizontal: 10, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', backgroundColor: 'white', height: 90, padding: 5, alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                    {
                        !clickedNext ?
                        
                        <Link href={"/(home)/chatView"}><FontAwesome6 name="arrow-left" iconStyle="solid" size={18} /></Link> 
                        :<FontAwesome6 name="arrow-left" iconStyle="solid" size={18} onPress={() => setClickedNext(false)} />
                    }   
                    {
                        !clickedNext ? 
                        <Pressable onPress={() => setClickedNext(true)} style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 80, height: 30, backgroundColor: 
                        selectUsers.length === 0 ? 'gainsboro' : Platform.OS === "ios" ? "#007AFF" : "#2196F3"}} disabled={selectUsers.length === 0 ? true : false}>
                            <Text style={{color: "white"}}>Next</Text>
                        </Pressable> :
                        <Pressable onPress={() => setClickedNext(true)} style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 80, height: 30, backgroundColor: 
                        selectUsers.length === 0 ? 'gainsboro' : Platform.OS === "ios" ? "#007AFF" : "#2196F3"}}>
                            <Text style={{color: 'white'}}>Finish</Text>
                        </Pressable>
                    }
                </View>
            </View>
            {
                !clickedNext ?
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, paddingVertical: 5}}>Add favorites to your chatroom</Text>
                    <FontAwesome6 name="magnifying-glass" size={20} style={{position: 'absolute', top: 40, left: 20 }} iconStyle="solid" />
                    <FontAwesome6 name="at" size={18} color={'#c4c4c4'} style={{position: 'absolute', top: 40, left: 50 }} iconStyle="solid" />
                    <TextInput style={{borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 70}} value={searchFavorite} onChangeText={setSearchFavorite} />
                    <ScrollView style={{flex: 1}}>
                        {
                            favorites.map((user) => <User key={user.id} fullName={user.fullName} userName={user.userName} id={user.id}  selectUser={selectUser} deselectUser={deselectUser}/>)
                        }
                    </ScrollView>
                </View> :
                orientation === "Portrait" ? 
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{fontSize: 16, paddingVertical: 5}}>Edit Chat Photo (optional)</Text>
                            {
                                image ? 
                                <Pressable onPress={() => setImage(null)}>
                                    <Text>Remove Image</Text>
                                </Pressable> : 
                                <View />
                            }
                        </View>
                        <Pressable onPress={() => handleImage()} style={{flex: 1, alignItems: 'center'}}>
                            <View style={{ flex: 1,width: 200, height: 200, borderRadius: 100, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                {image ? <Image source={{ uri: image }} style={{width: 200, height: 200, borderRadius: 100}} /> :
                                <FontAwesome6 name="user-group" style={{width: 200,backgroundColor: 'white', height: 200, borderRadius: 100, textAlign: 'center', textAlignVertical: 'center'}} size={120} iconStyle="solid"/>}                
                                <FontAwesome6 style={{ backgroundColor: 'gainsboro', position: 'absolute', textAlign: 'center', textAlignVertical: 'center', width: 64, height: 64, borderRadius: 32}} name="camera" size={48} iconStyle="solid" />
                            </View>  
                        </Pressable>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, paddingVertical: 5}}>Edit Chat Title (optional)</Text>
                        <View>
                            <TextInput style={{borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 10}} value={chatRoomName === "" ? setDefaultChatTitle() : chatRoomName} onChangeText={setChatRoomName} />
                        </View>
                        
                    </View>
                </ScrollView> :
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, paddingVertical: 5}}>Edit Chat Photo (optional)</Text>
                        <Pressable onPress={() => handleImage()} style={{flex: 1}}>
                            <View style={{ flex: 1}}>
                                {image && <Image source={{ uri: image }} style={{width: 140, height: 140, borderRadius: 70}} />}                
                                <FontAwesome6 style={{ backgroundColor: 'gainsboro', position: 'absolute', top: 80, left: 100, textAlign: 'center', textAlignVertical: 'center', width: 64, height: 64, borderRadius: 32}} name="camera" size={48} iconStyle="solid" />
                            </View>   
                        </Pressable>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, paddingVertical: 5}}>Edit Chat Title (optional)</Text>
                        <View>
                            <TextInput style={{borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 10}} value={chatRoomName} onChangeText={setChatRoomName} />
                        </View>
                    </View>
                </View>
            }
        </KeyboardAvoidingView>
    )
}