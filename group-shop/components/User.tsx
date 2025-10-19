import {View, Text, Pressable, Button } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function User({fullName, userName, id} : {fullName : string, userName : string,  id : string}) {
    const {isSignedIn, isLoaded, user} = useUser();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function findUserInLoggedUsersFavorites() {
            const favorites : [] = (await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/${user?.id}/favorites`)).data;
            
            const findFavorite = favorites.find((userID) => userID === id);

            if (findFavorite !== undefined) {
                setAdded(true);
            }

            setAdded(false);
        }

        findUserInLoggedUsersFavorites();
    }, [id, user?.id]);

    return (
        <View style={{flex: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <View style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 25}}>
                </View>
                <View style={{flex: 1}}>
                    <Text>{fullName}</Text>
                    <Text>@{userName}</Text>
                </View>
            </View>
            {
                added ? <FontAwesome6 name='ellipsis' size={20} iconStyle='solid'/> : 
                <Button onPress={() => axios.post('http://localhost:5000/users/addFavorite', {currentUser: user?.id, userToAdd: id}).then(res => {if (res.status === 200) setAdded(true)})} title="Add"></Button>
            }
        </View>
    )
}