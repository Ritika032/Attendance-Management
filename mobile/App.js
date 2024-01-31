import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/components/login";
import Scan from "./src/components/scan";
import Result from "./src/components/result";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Student Login" }}
        />
        <Stack.Screen
          name="Scan"
          component={Scan}
          options={{ title: "Scanning QR Code" }}
        />
        <Stack.Screen
          name="Result"
          component={Result}
          options={{ title: "Marked or not Marked" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
