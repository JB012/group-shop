import { View, Text } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

export default function ListItem({title, date} : {title: string, date: string}) {
    return (
        <View style={{display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center'}}>
            <FontAwesome6 name="list" size={24} iconStyle="solid" />
            <View style={{display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View>    
                    <Text style={{fontSize: 24}}>{title}</Text>
                    <Text>Updated on {date}</Text>
                </View>
                <FontAwesome6 name="ellipsis" size={18} iconStyle="solid" />
            </View>
        </View>
    )
}