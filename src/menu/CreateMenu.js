import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  Alert 
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateMenu = () => {
  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const route = useRoute();
  const [menu, setMenu] = useState("")
  const [item, setItem] = useState("")
  const [price, setPrice] = useState("")
  const [user, setUser] = useState(route.params.user)
  const [appUser, setAppUser] = useState(route.params.appUser)
  const [webSocketUrlAuth, setWebSocketUrlAuth] = useState(route.params.webSocketUrlAuth)
  const webSocket = new WebSocket(webSocketUrlAuth);

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("connection establish open")
    };
    webSocket.onclose = () => {
      console.log("connection establish closed");
    }
    return () => {
      webSocket.close();
    };
  }, [])

  const wssSendEvent = (eventName, dataObj) => {
    webSocket.send(
      JSON.stringify({
        action: eventName,
        data: dataObj,
      })
    );
  };

  const createMenu = (Menu, Item, Price) => {
    wssSendEvent(
      "putMenu",
      {
        Menu: Menu,
        Item: Item,
        Price: Price,
      }
    );
  };

  const createButtonAlert = () =>
    Alert.alert(
    "Create Menu",
    "Are you sure to create this item? Press OK to proceed.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => navigation.push('Menu', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }
    ]
  );

  return (
    <View style={styles.container}>
      <View style={{
      padding: 15,
      marginTop: 25,
      backgroundColor: "#4169E1",
      alignItems: "center",
      justifyContent: 'center'
    }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            borderColor: "#fff",
            borderWidth: 1,
            padding: 7,
            borderRadius: 10
          }}
          onPress={() => {
            navigation.push('Menu', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#fff",
            }}
          >{`Back`}</Text>
        </TouchableOpacity>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff"
      }}>{'Create Menu'}</Text>
    </View>
    <StatusBar style="auto" />
    {appUser.IsAdmin? 
    <View> 
      <Text>{"\n"}</Text>
      <View style={styles.inputView}>
      <Text style={styles.Label}>Category</Text>
        <TextInput
          style={styles.TextInput}
          value={menu}
          onChangeText={(menu) => setMenu(menu)}
        />
      </View>
 
      <View style={styles.inputView}>
        <Text style={styles.Label}>Name</Text>
        <TextInput
          style={styles.TextInput}
          value={item}
          onChangeText={(item) => setItem(item)}
        />
      </View>

      <View style={styles.inputView}>
        <Text style={styles.Label}>Price ($)</Text>
        <TextInput
          style={styles.TextInput}
          value={price}
          onChangeText={(price) => setPrice(price)}
        />
      </View>

      <View style={styles.containerBtn}>      
        <TouchableOpacity style={styles.CreateBtn} onPress={() => {createMenu(menu, item, price), createButtonAlert()}}>
        <Text style={styles.ButtonText}>CREATE</Text>
        </TouchableOpacity>
      </View>
    </View> 
    : <View style={{
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",  
      flex: 1,         
    }}>
      <Text  style={{
      fontSize: 24,
      fontWeight: 'bold',
      color: "#4169E1",   
      textAlign: "center",         
    }}> Error 401 {"\n\n"} Unauthorised. Page is locked. </Text>
    </View>}
    
  </View>
  
  );
};
 
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
  },

  containerBtn: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
},

  TextInput: {
    height: 30,
    flex: 1,
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    borderWidth: 0,
    fontSize: 16,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#D4E0FF",
    textAlign: "center",
    width: "50%"
  },

  Label: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#4169E1"
  },

  inputView: {    
    height: 60,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },

  ButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  },

  CreateBtn: {
    padding: 10,
    width: "40%",
    borderRadius: 25,
    height: 50,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "lightgreen",
  },

});

export default CreateMenu;