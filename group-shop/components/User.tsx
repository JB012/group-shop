import {View, Text, Pressable, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Checkbox } from 'expo-checkbox';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { UserType } from './UserType';
import { Menu,MenuOptions,MenuOption,MenuTrigger, renderers  } from 'react-native-popup-menu';
const { Popover, SlideInMenu } = renderers;

interface UserProp {
    fullName : string, 
    userName : string,  
    id : string, 
    addToFavorites?: (user: UserType) => void, 
    removeFromFavorites?: (user: UserType) => void, 
    isInFavorites?: (id: string) => boolean, 
    selectUser?: (id : string) => void, 
    deselectUser?: (id : string) => void
}

export default function User({fullName, userName, id, selectUser, deselectUser, isInFavorites, addToFavorites, removeFromFavorites} : UserProp) {
    const {isSignedIn, isLoaded, user} = useUser();
    const [added, setAdded] = useState(isInFavorites?.(id));
    const [checked, setChecked] = useState(false);

    async function handlePopup() {
        setAdded(false);
        removeFromFavorites?.({fullName, userName, id});
        
        return false;
    }

    async function handleOnClose() {
        if (added) {
            addToFavorites?.({fullName, userName, id});
        }
        else {
            removeFromFavorites?.({fullName, userName, id});
        }
        
        return false;
    }

    function handleCheckBox() {
        setChecked(!checked);

        if (!checked) {
            deselectUser?.(id);
        }
        else {
            selectUser?.(id);
        }
    }

    return (
        <Menu renderer={SlideInMenu} onClose={handleOnClose}>
            <MenuTrigger disabled={selectUser ? true : false}>
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
                        added && !selectUser ? 
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
                        : !selectUser && user?.id !== id ?
                        <Button onPress={() => {addToFavorites?.({fullName, userName, id}); setAdded(true);}} title="Add"></Button>
                        : 
                        <View>
                            <Checkbox style={{margin: 8}} value={checked} onValueChange={handleCheckBox} />  
                        </View>
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
                            <Text>{added ? "Remove from Favorites" : "Add to favorites"}</Text>
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