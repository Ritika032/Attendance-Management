import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Result = () => {
  const route = useRoute();
  const status = route.params.status;
  return (
    <View style={styles.container}>
      <View>
        <Icon
          name="check-circle"
          size={50}
          color="#4CAF50"
          style={styles.icon}
        />
        <Text style={styles.text}>Attendance Marked Successfully</Text>
      </View>
      {/* {status ? (
        <View>
          <Icon
            name="check-circle"
            size={50}
            color="#4CAF50"
            style={styles.icon}
          />
          <Text style={styles.text}>Attendance Marked Successfully</Text>
        </View>
      ) : (
        <View>
          <Icon name="close" size={50} color="red" style={styles.icon} />
          <Text style={styles.text}>Attendance Already Marked or Invalid QR</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default Result;
