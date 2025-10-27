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

export default function People() {
    const orientation = useOrientation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInput, setModalInput] = useState("");
    const {isSignedIn, isLoaded, user} = useUser();
    const [search, setSearch] = useState("");
    const [allUsers, setAllUsers] = useState(Array<UserType>);
    const [searchUsers, setsearchUsers] = useState(Array<UserType>);
    const [favorites, setFavorites] = useState(Array<UserType>);
    
    
    useEffect(() => {
        function getAllUsers() {
            if (allUsers.length === 0) {
                axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users`).then((res) => {setAllUsers(res.data); setsearchUsers(res.data)})
                .catch((err) => console.log(err))
            }
        }
        
        function getAllFavorites() {
            if (favorites.length === 0) {
                axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/${user?.id}/favorites`).then((res) => setFavorites(res.data))
                .catch((err) => console.log(err))
            }
        }
    }, [favorites.length, user?.id, allUsers.length]);


    function handleSearch(input : string ) {
        setSearch(input);

        const filteredSearchUsers = searchUsers.filter((user) => user.userName.startsWith(input.toLowerCase())); 
        if (filteredSearchUsers.length === 0) {
            setsearchUsers(allUsers)
        } 
        else {
            setsearchUsers(filteredSearchUsers);
        }
    }

    function isInFavorites(id: string) {
        return favorites.find((favorite) => favorite.id === id) ? true : false;
    }

    async function addToFavorites(someUser : UserType) {
        if (!isInFavorites(someUser.id)) {
            await axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/addFavorite`, {currentUserID: user!.id, favoriteID: someUser.id});
            setFavorites([...favorites, someUser]);
        }
    }

    async function removeFromFavorites(someUser : UserType) {
        if (isInFavorites(someUser.id)) {
            await axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/removeFavorite`, {currentUserID: user!.id, favoriteID: someUser.id});
            setFavorites(favorites.filter((favorite) => favorite.id !== someUser.id));
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
                        favorites.map((user) => <UserProfile key={user.id} fullName={user.fullName} userName={user.userName} id={user.id} isInFavorites={isInFavorites} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} /> ) :
                        searchUsers.map((user) => <UserProfile key={user.id} fullName={user.fullName} userName={user.userName} id={user.id} isInFavorites={isInFavorites} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} /> ) 
                    }
                </View>
            </ScrollView>
        </View>
    )
}