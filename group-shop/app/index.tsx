import { Text, View, Button } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>GroupShop</Text>
      <Link href={'/auth/login'}><Button title="Log In"></Button></Link>
    </View>
  );
}
