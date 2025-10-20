import {View, Text, Pressable, Button, TouchableOpacity } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserType } from './UserType';
import { Menu,MenuOptions,MenuOption,MenuTrigger, renderers  } from 'react-native-popup-menu';
const { Popover } = renderers;

export default function User({fullName, userName, id, favorites, setFavorites} : {fullName : string, userName : string,  id : string, favorites?: UserType[], setFavorites:  (value: React.SetStateAction<UserType[]>) => void}) {
    const {isSignedIn, isLoaded, user} = useUser();
    const [added, setAdded] = useState(false);
    const [moreOptions, setMoreOptions] = useState(false);
  
    useEffect(() => {
        async function findUserInLoggedUsersFavorites() {
            const favorites : UserType[] = (await axios.get(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/${user?.id}/favorites`)).data;
            
            const findFavorite = favorites.find((json) => json.id === id);

            if (findFavorite !== undefined) {
                setAdded(true);
            }
            else {
                setAdded(false);
            }
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
                added ? 
                <View style={{position: 'relative'}}>
                    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                        <MenuTrigger><Text style={{fontSize:24, fontWeight: 'bold'}}>...</Text></MenuTrigger>
                        <MenuOptions>
                            <MenuOption value={'remove'} text='Remove from Favorites' />
                            <MenuOption value={'message'} text='Message' />
                            <MenuOption value={'block'}><Text style={{color: 'red'}}>Block</Text></MenuOption>
                        </MenuOptions>
                    </Menu>
                </View> 
                : user?.id !== id ?
                <Button onPress={() => axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/addFavorite`, {currentUserID: user?.id, favoriteID: id}).then(res => {if (res.status === 200) {setAdded(true); setFavorites([...favorites!, {fullName: fullName, userName: userName, id: id}])}})} title="Add"></Button>
                : <View></View>
            }
            {
                moreOptions ?
                <View style={{flex: 1,  position: 'absolute', zIndex: 1, backgroundColor: 'white', left: 165, top: 45, outlineColor: 'black', outlineWidth: 1, borderRadius: 10, padding: 5, gap: 10}}>
                    <View>
                        <TouchableOpacity><Text>Remove from favorites</Text></TouchableOpacity>
                        <TouchableOpacity><Text>Messsage</Text></TouchableOpacity>
                        <TouchableOpacity><Text>Block</Text></TouchableOpacity>
                    </View>
                </View> : 
                <View></View>
            }
        </View>
    )
}