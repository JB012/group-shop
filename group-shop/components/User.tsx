import {View, Text, Pressable, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Checkbox } from 'expo-checkbox';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { UserType } from './UserType';
import { Menu,MenuOptions,MenuOption,MenuTrigger, renderers  } from 'react-native-popup-menu';
const { Popover, SlideInMenu } = renderers;

interface UserProp { 
    avatar_url: string,
    created_at: string,
    updated_at: string,
    first_name: string,
    last_name: string,
    username : string,  
    id : string, 
    addToFavorites?: (id : string) => Promise<void>, 
    removeFromFavorites?: (id : string) => Promise<void>, 
    isInFavorites?: (id: string) => boolean, 
    selectUser?: (id : string) => Promise<void>,
    deselectUser?: (id : string) => Promise<void>,
    isSelected?: (id : string) => boolean
}

export default function User({first_name, last_name, username, id, isSelected, selectUser, deselectUser, isInFavorites, addToFavorites, removeFromFavorites} : UserProp) {
    const {isSignedIn, isLoaded, user} = useUser();
    const [added, setAdded] = useState(isInFavorites?.(id));
    const [checked, setChecked] = useState(isSelected?.(id));

    async function handlePopup() {
        setAdded(false);
        removeFromFavorites?.(id);
        
        return false;
    }

    async function handleOnClose() {
        if (added) {
            addToFavorites?.(id);
        }
        else {
            removeFromFavorites?.(id);
        }
        
        return false;
    }

    function handleCheckBox() {
        setChecked(!checked);

        if (checked) {
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
                            <Text>{`${first_name} ${last_name}`}</Text>
                            <Text>@{username}</Text>
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
                        <Button onPress={() => {addToFavorites?.(id); setAdded(true);}} title="Add"></Button>
                        : user?.id !== id ?
                        <View>
                            <Checkbox style={{margin: 8}} value={checked} onValueChange={handleCheckBox} />  
                        </View>
                        : <View/>
                    }
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: {width: '100%', height: '50%', padding: 10}}}>
                <ScrollView>
                    <View style={{paddingVertical: 20, gap: 10}}>
                        <View style={{ width: 80, height: 80, backgroundColor: 'red', borderRadius: 40}}>
                        </View>
                        <View>
                            <Text style={{fontSize: 18}}>{`${first_name} ${last_name}`}</Text>
                            <Text style={{fontSize: 14}}>@{username}</Text>
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