import { View, Text, ScrollView, TextInput, Pressable, Platform, Image, Alert, BackHandler } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserType } from "@/components/UserType";
import User from "@/components/User";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Link, useRouter } from "expo-router";
import useOrientation from "@/utils/useOrientation";
import * as ImagePicker from 'expo-image-picker';
import { useSupabase } from "@/providers/SupabaseProvider";
import { KeyboardController, KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function Add() { 
    const orientation = useOrientation();
    const [searchFavorite, setSearchFavorite] = useState("");
    const [favorites, setFavorites] = useState(Array<UserType>);
    const [searchUsers, setSearchUsers] = useState(Array<UserType>);
    const [selectUsers, setSelectUsers] = useState(Array<UserType>);
    const [clickedNext, setClickedNext] = useState(false);
    const [chatRoomName, setChatRoomName] = useState("");
    const {isSignedIn, isLoaded, user} = useUser();
    const [image, setImage] = useState<string | null>(null);
    const supabase = useSupabase();
    const router = useRouter();
    
    async function selectUser(id : string) {
        const {data} = await supabase.from('users').select().eq("id", id);
        const [user] : UserType[] = data as UserType[];
        
        if (!selectUsers.includes(user)) {
            setSelectUsers([...selectUsers, user]);
        }
    }

    async function deselectUser(id : string) {
        const {data} = await supabase.from('users').select().eq("id", id);
        const [user] : UserType[] = data as UserType[];

        if (selectUsers.includes(user)) {
            setSelectUsers(selectUsers.filter((someUser) => someUser.id !== user.id));
        }
    }

    function isSelected(id : string) {
        return selectUsers.some((user) => user.id === id);
    }

    function setDefaultChatTitle() {
        const sortedSelectUsers = selectUsers.sort((userA, userB) => userA.first_name.localeCompare(userB.first_name));
        if (selectUsers.length > 1) {
            if (user!.firstName!.localeCompare(sortedSelectUsers[0].first_name) < 0) {
                return `${user!.firstName} and ${selectUsers.length} others`;
            }
            
            return `${sortedSelectUsers[0].first_name} and ${selectUsers.length} others`;
        }

        return `${selectUsers[0].first_name} ${selectUsers[0].last_name}`;
    }

    useEffect(() => {
         async function getAllFavorites() {
            if (favorites.length === 0) {
                const {data, error} = await supabase.from('favorites').select().eq('userID', user!.id);
                
                if (!error) {
                    const users : UserType[] = [];

                    for (const elem of data) {
                        const {data, error} = await supabase.from('users').select().eq('id', elem.favoriteID);

                        if (!error) {
                            users.push(...data as UserType[]);
                        }
                        else {
                            console.log(error);
                        }
                    }

                    setFavorites(users);
                    setSearchUsers(users);
                }                
                else {
                    console.log(error);
                } 
            }
        }


        getAllFavorites();

        if (Platform.OS === "android") {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (clickedNext) {
                    setClickedNext(!clickedNext);
                    return true;
                }

                return false;
            });


            return () => backHandler.remove();
        }
    }, [clickedNext, favorites.length, supabase, user, user?.id]);
    
    function handleSearch(input : string ) {
        setSearchFavorite(input);

        const filteredSearchUsers = searchUsers.filter((user) => user.username.startsWith(input.toLowerCase())); 
        if (filteredSearchUsers.length === 0) {
            setSearchUsers(favorites);
        } 
        else {
            setSearchUsers(filteredSearchUsers);
        }
    }

    async function handleAddChatRoom() {
        const {error} = await supabase.from('chatroom').insert({owner_id: user?.id, name: chatRoomName === "" ? setDefaultChatTitle() : chatRoomName, 
        type: searchUsers.length > 1 ? "group" : "direct", avatar_url: image});
        
        if (!error) {
            router.navigate("/(home)/chatView");
        }
        else {
            Alert.alert(error.message);
        } 
    }

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
                        <Pressable onPress={handleAddChatRoom} style={{borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 80, height: 30, backgroundColor: 
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
                    <TextInput style={{borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 70}} value={searchFavorite} onChangeText={handleSearch} />
                    <ScrollView style={{flex: 1}}>
                        {
                            searchFavorite === "" ?
                            favorites.map((user) => <User key={user.created_at} first_name={user.first_name} last_name={user.last_name} username={user.username} id={user.id} avatar_url={user.avatar_url} created_at={user.created_at} updated_at={user.updated_at} isSelected={isSelected} selectUser={selectUser} deselectUser={deselectUser}/> ) :
                            searchUsers.map((user) => <User key={user.created_at} first_name={user.first_name} last_name={user.last_name} username={user.username} id={user.id} avatar_url={user.avatar_url} created_at={user.created_at} updated_at={user.updated_at} isSelected={isSelected} selectUser={selectUser} deselectUser={deselectUser} /> ) 
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