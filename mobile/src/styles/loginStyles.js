import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbc1ac",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#967259",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#ece0d1",
    borderRadius: 25,
    height: 70,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 60,
    color: "black",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#967159",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText:{
    color : "white",
    fontSize: 20,
  },
});
export default styles;
