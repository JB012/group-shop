import { View, ScrollView, Text, Pressable, Button, Modal, TextInput } from "react-native"
import { useState, useEffect } from "react"
import UserProfile from "@/components/User";
import { useUser } from "@clerk/clerk-expo";
import * as ScreenOrientation from 'expo-screen-orientation';
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { createClerkClient, User} from '@clerk/backend'
import axios from "axios";
import { UserType } from "../../components/UserType";
import useOrientation from "@/utils/useOrientation";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function People() {
    const orientation = useOrientation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInput, setModalInput] = useState("");
    const {isSignedIn, isLoaded, user} = useUser();
    const [search, setSearch] = useState("");
    const [allUsers, setAllUsers] = useState(Array<UserType>);
    const [searchUsers, setSearchUsers] = useState(Array<UserType>);
    const [favorites, setFavorites] = useState(Array<UserType>);
    const supabase = useSupabase();
    
    useEffect(() => {
        async function getAllUsers() {
            if (allUsers.length === 0) {
                
                const {data, error} = await supabase.from("users").select('*');

                if (!error) {
                    setAllUsers(data as UserType[]);
                    setSearchUsers(data as UserType[]);
                }
                else {
                    console.log(error);
                }
            }
        }
        
        async function getAllFavorites() {
            if (favorites.length === 0) {
                const {data, error} = await supabase.from('favorites').select().eq('userID', user!.id);
                
                if (!error) {
                    const users : UserType[] = [];

                    for (const elem of data) {
                        const {data, error} = await supabase.from('users').select().eq('id', elem.favoriteID);

                        if (!error) {
                            users.push(...data as UserType[])
                        }
                        else {
                            console.log(error);
                        }
                    }

                    setFavorites(users);
                }                
                else {
                    console.log(error);
                } 
            }
        }

        getAllUsers();
        getAllFavorites();
    }, [favorites.length, user?.id, allUsers.length, supabase, user]);


    function handleSearch(input : string ) {
        setSearch(input);

        const filteredSearchUsers = searchUsers.filter((user) => user.username.startsWith(input.toLowerCase())); 
        if (filteredSearchUsers.length === 0) {
            setSearchUsers(allUsers)
        } 
        else {
            setSearchUsers(filteredSearchUsers);
        }
    }

    function isInFavorites(id: string) {
        return favorites.find((favorite) => favorite.id === id) ? true : false;
    }

    async function addToFavorites(id : string) {
        if (!isInFavorites(id)) {
            
            const {error} = await supabase.from('favorites').insert({userID: user?.id, favoriteID: id});
            
            console.log(error);

            const {data} = await supabase.from('users').select().eq('id', id);

            setFavorites([...favorites, ...data as UserType[]]);
        }
    }

    async function removeFromFavorites(id : string) {
        if (isInFavorites(id)) {
            await supabase.from('favorites').delete().eq('userID', user!.id).eq('favoriteID', id);
            setFavorites(favorites.filter((favorite) => favorite.id !== id));
        }
        
    }

    return (
        <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
            <FontAwesome6 name="magnifying-glass" size={20} style={{position: 'absolute', top: 20, left: 20 }} iconStyle="solid" />
            <FontAwesome6 name="at" size={18} color={'#c4c4c4'} style={{position: 'absolute', top: 22, left: 50 }} iconStyle="solid" />
            <TextInput autoFocus={false} style={{paddingHorizontal: 36, borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 60}} value={search} placeholder="username" onChangeText={handleSearch} />
            <Text style={{fontSize: 18, paddingVertical: 10}}>{search === "" ? 'Favorites' : 'Search Results'}</Text>
            <ScrollView style={{flex: 1}}>
                <View style={{flex: 1, gap: 10, paddingBottom: 30}}>
                    {
                        search === "" ?
                        favorites.map((user) => <UserProfile key={user.created_at} first_name={user.first_name} last_name={user.last_name} username={user.username} id={user.id} avatar_url={user.avatar_url} created_at={user.created_at} updated_at={user.updated_at} isInFavorites={isInFavorites} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} /> ) :
                        searchUsers.map((user) => <UserProfile key={user.created_at} first_name={user.first_name} last_name={user.last_name} username={user.username} id={user.id} avatar_url={user.avatar_url} created_at={user.created_at} updated_at={user.updated_at} isInFavorites={isInFavorites} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} /> ) 
                    }
                </View>
            </ScrollView>
        </View>
    )
}