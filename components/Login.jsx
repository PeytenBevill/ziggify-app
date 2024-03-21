import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert
} from "react-native";
import { useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";

export default function Login({ navigation }) {
  const [userID, setUserID] = useState('')
  const [password, setPassword] = useState('')
  const [companyAccount, setCompanyAccount] = useState('')

  const handleLogin = async () => {
    try {
      if (userID && password && companyAccount) {
        // Fetch user data
        const res = await fetch(
          `https://ziggify-backend.onrender.com/user/${userID}`
        );
        const data = await res.json();
        // Check if user data matches input values
        if (
          data &&
          data[0].password === password &&
          data[0].companyAccount === companyAccount
        ) {
          // console.log(data[0].companyName);
          navigation.navigate("Scanner", {
            companyAccount,
            companyName: data[0].companyName,
          });
        } else {
          // Handle invalid login
          Alert.alert(
            "Error logging in",
            "Invalid userID, password, or company account ID",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
          setUserID("");
          setPassword("");
          setCompanyAccount("");
        }
      } else {
        console.error("Invalid input values");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "#F24822" }}>
        Zi<Text style={{ color: "#F4D26C" }}>ggi</Text>fy
      </Text>

      <Card
        style={{
          marginTop: 20,
          borderWidth: 1,
          padding: 4,
          borderRadius: 5,
          shadowColor: "black",
          shadowOpacity: 0.9,
          height: 250,
          width: 250,
        }}
      >
        <TextInput
          placeholder="userID"
          style={{
            borderWidth: 1,
            padding: 2,
            borderRadius: 5,
            margin: 10,
            height: 30,
          }}
          onChangeText={(typed) => setUserID(typed)}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={{
            borderWidth: 1,
            padding: 2,
            borderRadius: 5,
            margin: 10,
            height: 30,
          }}
          onChangeText={(typed) => setPassword(typed)}
        />
        <TextInput
          placeholder="company account ID"
          style={{
            borderWidth: 1,
            padding: 2,
            borderRadius: 5,
            margin: 10,
            height: 30,
          }}
          onChangeText={(typed) => setCompanyAccount(typed)}
        />
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F24822",
            borderRadius: 5,
            padding: 4,
            margin: 10,
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Login</Text>
        </Pressable>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(239 246 255)",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
