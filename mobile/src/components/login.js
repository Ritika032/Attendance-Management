import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "../styles/loginStyles";
import { useState } from "react";
import { login } from "../api-helper/api-helper";

const Login = ({ navigation }) => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  //const [data, setData] = useState("");

  const onPressLogin = async () => {
    try {
      setLoading(true);
      const responseData = await login(email, password);
      navigation.navigate("Scan");
    } catch (error) {
      console.error("Login failed:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter your Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => onChangeEmail(text)}
          value={email}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Enter your Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => onChangePassword(text)}
          value={password}
        />
      </View>

      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login </Text>
      </TouchableOpacity>
    </View>
  );
};
export default Login;
