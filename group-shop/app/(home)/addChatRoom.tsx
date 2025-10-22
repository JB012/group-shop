import { View, Text, ScrollView, TextInput } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserType } from "@/components/UserType";
import User from "@/components/User";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

export default function Add() {
    const [searchFavorite, setSearchFavorite] = useState("");
    const [favorites, setFavorites] = useState(Array<UserType>);
    const [selectUsers, setSelectUsers] = useState(Array<string>);
    const {isSignedIn, isLoaded, user} = useUser();

    function selectUser(id: string) {
        if (!selectUsers.includes(id)) {
            setSelectUsers([...selectUsers, id]);
        }
    }

    function deselectUser(id: string) {
        if (selectUsers.includes(id)) {
            setSelectUsers(selectUsers.filter((userID) => userID !== id));
        }
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
    
    return (
        <View style={{flex: 1, paddingHorizontal: 10}}>
            <FontAwesome6 name="magnifying-glass" size={20} style={{position: 'absolute', top: 12, left: 20 }} iconStyle="solid" />
            <FontAwesome6 name="at" size={18} color={'#c4c4c4'} style={{position: 'absolute', top: 12, left: 50 }} iconStyle="solid" />
            <TextInput style={{paddingHorizontal: 36, borderWidth: 1, borderColor: 'gray', borderRadius: 100, height: 40, paddingLeft: 60}} value={searchFavorite} onChangeText={setSearchFavorite} />
            <ScrollView style={{flex: 1}}>
                {
                    favorites.map((user) => <User key={user.id} fullName={user.fullName} userName={user.userName} id={user.id}  selectUser={selectUser} deselectUser={deselectUser}/>)
                }
            </ScrollView>
        </View>
    )
}