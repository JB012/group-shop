import Lists from "@/components/Lists";
import Receipts from "@/components/Receipts";
import { ScrollView } from "react-native";

export default function Tab() {
    return (
    <ScrollView style={{flex: 1, flexGrow: 1, paddingLeft: 10, paddingTop: 10, paddingRight: 10, marginBottom: 5}}>
        <Lists seeAll={false} />
        <Receipts seeAll={false} />
    </ScrollView> 
    );
}