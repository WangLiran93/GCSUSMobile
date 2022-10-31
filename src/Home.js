import { useNavigation, useRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useRef, useSocket } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
 
const Home = () => {
  const navigation = useNavigation()
  const [, updateState] = React.useState();
  const usersRef = useRef([]);
  const userRef = useRef([]);
  const route = useRoute();
  const [user, setUser] = useState(route.params.user)
  const [token, setToken] = useState(route.params.user.idToken)
  const [wssToken, setWssToken] = useState("")
  const [appUser, setAppUser] = useState(route.params.appUser)
  const [webSocketUrlAuth, setWebSocketUrlAuth] = useState(route.params.webSocketUrlAuth)

  const webSocket = new WebSocket(webSocketUrlAuth);

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("connection establish open")
      initialiseUser();
    };
    webSocket.onclose = () => {
      console.log("connection establish closed");
    }
    return () => {
      webSocket.close();
    };
  }, [])


  const initialiseUser = () => {
    console.log("initialise user")
    webSocket.send(
      JSON.stringify({
      action: "getAllUsers",
      data: "-",
      })
    );
  };

  const wssSendEvent = (eventName, dataObj) => {
    webSocket.send(
      JSON.stringify({
        action: eventName,
        data: dataObj,
      })
    );
  };

  const onSocketEvent = useCallback((message) => {
    const data = JSON.parse(message?.data);
    if ("AllUsers" in data) {
      usersRef.current = data["AllUsers"].sort(function (a, b) {
        return a.DateTimeUpdated > b.DateTimeUpdated ? 1 : -1;
      });

      let googleId = usersRef.current.map((a) => a.EmailAddress);
      if (googleId.includes(user.user.id)) {
        let objIndex = usersRef.current.findIndex(
          (obj) => obj.EmailAddress === user.user.id
        );
        userRef.current.IsAdmin = usersRef.current[objIndex].IsAdmin;
        userRef.current.IsStaff = usersRef.current[objIndex].IsStaff;
        appUser.IsAdmin = userRef.current.IsAdmin;
        appUser.IsStaff = userRef.current.IsStaff;
        wssSendEvent(
          "putUser",
          {
            EmailAddress: user.user.id,
            IdentityProvider: "Google",
            PasswordHash: "---",
            Salt: "---",
            Name: user.user.name,
            IsAdmin: usersRef.current[objIndex].IsAdmin,
            IsStaff: usersRef.current[objIndex].IsStaff,
            IsSelf: true,
          },
          false
        );
      } else {
        wssSendEvent(
          "putUser",
          {
            EmailAddress: user.user.id,
            IdentityProvider: "Google",
            PasswordHash: "---",
            Salt: "---",
            Name: user.user.name,
            IsAdmin: false,
            IsStaff: false,
            IsSelf: true,
          },
          false
        );
      }
    }
    updateState({});
  }, []);

  useEffect(() => {
    webSocket.addEventListener("message", onSocketEvent);
    return () => {
      webSocket.removeEventListener("message", onSocketEvent);
    };
  }, [webSocket, onSocketEvent]);


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{
      padding: 15,
      marginTop: 25,
      backgroundColor: "#778899",
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
            navigation.push('Login')
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#fff",
            }}
          >{`LogOut`}</Text>
        </TouchableOpacity>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff"
      }}>{'Home'}</Text>
    </View>
      <View style={styles.Center}> 
        {!appUser.IsAdmin && !appUser.IsStaff ? 
        <TouchableOpacity style={styles.queue_button}>
        <Text style={styles.text_button}>Queues</Text>
        </TouchableOpacity> : null}
        {!appUser.IsAdmin && !appUser.IsStaff ? 
        <TouchableOpacity style={styles.order_button}>
        <Text style={styles.text_button}>Orders</Text>
        </TouchableOpacity> : null}         
        {appUser.IsAdmin || appUser.IsStaff ? 
        <TouchableOpacity style={styles.table_button} onPress={() => { navigation.push('Tables', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }}>
        <Text style={styles.text_button}>Tables</Text>
         </TouchableOpacity> : null}
        <TouchableOpacity style={styles.menu_button} onPress={() => { navigation.push('Menu', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }}>
        <Text style={styles.text_button}>Menu</Text>
        </TouchableOpacity>
        {appUser.IsAdmin ? 
        <TouchableOpacity style={styles.user_button} onPress={() => { navigation.push('Users', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }}>
        <Text style={styles.text_button}>Users</Text>
        </TouchableOpacity> : null}
        
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  Center: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  text_button: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  queue_button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#DB7093",
  },

  order_button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF7F50",
  },

  table_button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#A0522D",
  },

  menu_button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#4169E1",
  },

  user_button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#27AE60",
  },
});

export default Home;
