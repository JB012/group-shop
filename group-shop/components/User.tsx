import {View, Text, Pressable, Button, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserType } from './UserType';
import { Menu,MenuOptions,MenuOption,MenuTrigger, renderers  } from 'react-native-popup-menu';
const { Popover, SlideInMenu } = renderers;

export default function User({fullName, userName, id, favorites, setFavorites} : {fullName : string, userName : string,  id : string, favorites?: UserType[], setFavorites:  (value: React.SetStateAction<UserType[]>) => void}) {
    const {isSignedIn, isLoaded, user} = useUser();
    const [added, setAdded] = useState(false);
  
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



    async function handlePopup() {
        setAdded(false);
        setFavorites(favorites!.filter((user) => user.id !== id));
        
        await axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/removeFavorite`, {currentUserID: user!.id, favoriteID: id});
        
        return false;
    }

    async function handleOnClose() {
        if (added) {
            const findUser = favorites?.find((user) => user.id === id);
            if (!findUser) {
                setFavorites([...favorites!, {fullName: fullName, userName: userName, id: id}]);
                await axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/addFavorite`, {currentUserID: user!.id, favoriteID: id});
            }
        }
        else {
            setFavorites(favorites!.filter((user) => user.id !== id));
            await axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/removeFavorite`, {currentUserID: user!.id, favoriteID: id});
        }
        
        return false;
    }

    return (
        <Menu renderer={SlideInMenu} onClose={handleOnClose}>
            <MenuTrigger>
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
                        <View>
                            <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                                <MenuTrigger><Text style={{fontSize:24, fontWeight: 'bold'}}>...</Text></MenuTrigger>
                                <MenuOptions>
                                    <MenuOption value={'message'} text='Message' />
                                    <MenuOption value={"remove"} onSelect={handlePopup} >
                                        <Text style={{color:"red"}}>{"Remove from Favorites"}</Text>
                                    </MenuOption>
                                    <MenuOption value={'block'}><Text style={{color: 'red'}}>Block</Text></MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View> 
                        : user?.id !== id ?
                        <Button onPress={() => axios.post(`http://${process.env.EXPO_PUBLIC_LOCAL_IP}:5000/users/addFavorite`, {currentUserID: user?.id, favoriteID: id}).then(res => {if (res.status === 200) {setAdded(true); setFavorites([...favorites!, {fullName: fullName, userName: userName, id: id}])}})} title="Add"></Button>
                        : <View></View>
                    }
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {width: '100%', height: '50%', padding: 10}}}>
                <ScrollView>
                    <View style={{paddingVertical: 20, gap: 10}}>
                        <View style={{ width: 80, height: 80, backgroundColor: 'red', borderRadius: 40}}>
                        </View>
                        <View>
                            <Text style={{fontSize: 18}}>{fullName}</Text>
                            <Text style={{fontSize: 14}}>@{userName}</Text>
                        </View>
                    </View>
                    {
                        user!.id !== id ?
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MenuOption style={{flex: 1, width: 105, alignItems: 'center'}} value={added ? "remove" : "add"} onSelect={() => {setAdded(!added); return false;}}>
                            <FontAwesome6 name='star' size={24} color={added ? "#ffe814" : ""} iconStyle={added ? "solid" : undefined} />
                            <Text>{added ? "Remove from Favorites" : "Add from favorites"}</Text>
                        </MenuOption>
                        <MenuOption style={{flex: 1, width: 105, alignItems: 'center'}} value="message">
                            <FontAwesome6 name='message' size={24}/>
                            <Text>Message</Text>
                        </MenuOption>
                        <MenuOption style={{flex: 1, width: 105, alignItems: 'center'}} value="block">
                            <FontAwesome6 name='ban'size={24} iconStyle='solid' color={'red'} />
                            <Text>Block</Text>
                        </MenuOption>
                        </View> :
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text>It&apos;s you!</Text>
                        </View>
                    }
                </ScrollView>
            </MenuOptions>
        </Menu>
    )
}