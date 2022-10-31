import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  useColorScheme
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';


const User = () => {

  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const usersRef = useRef([]);
  const route = useRoute();
  const [user, setUser] = useState(route.params.user)
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
      appUser.IsAdmin = usersRef.current[objIndex].IsAdmin;
      appUser.IsStaff = usersRef.current[objIndex].IsStaff;
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

  //let users = usersRef.current.map((a) => a.EmailAddress)

  return (
    <View style={styles.container}>
    <View style={{
      padding: 15,
      marginTop: 25,
      backgroundColor: "#27AE60",
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
            navigation.push('Home', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth,})
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
      }}>{'Manage Users'}</Text>
      {appUser.IsAdmin?  
      <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            borderColor: "#fff",
            borderWidth: 1,
            padding: 7,
            borderRadius: 10,
            backgroundColor: '#fff',
          }}
          onPress={() => {
            navigation.push('CreateUser', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth,})
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#27AE60",            
            }}
          >{'Create'}</Text>
        </TouchableOpacity> : null}

    </View>
    {appUser.IsAdmin? 
    <FlatList
      style={{
        marginHorizontal: 15,
        marginTop: 10
      }}
      data={usersRef.current}
      keyExtractor={(item, index) => index.toString()} 
      renderItem={({ item, index }) =>
        <TouchableOpacity
          key={index}
          style={{
            padding: 10,
            elevation: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#ECFFF4',
            borderColor: '#ddd',
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: "center"
          }}
          onPress={() => {
            navigation.push('EditUser',
              {
                record: item,
                user: user,
                appUser : appUser,
                webSocketUrlAuth : webSocketUrlAuth,
              }
            )
          }}
        >
          <Text style={{fontWeight: 'bold', color: '#008080', width: "25%"}}> {item.Name + '\n' } </Text> 
          <Text
            style={{
              fontSize: 14,
              marginLeft: 20,
              fontWeight: '400',
            }}
          >           
            {'Provider: ' + item.IdentityProvider + '\n' 
            + 'ID: xxxxx' + item.EmailAddress.substring(16, 21) + '\n' 
            + 'Last Connection: ' + item.LastWssConnection + '\n'
            + 'Last Login: ' + item.DateTimeUpdated.substring(0, 19) + '\n'
            + 'Role: ' } {item.IsAdmin && "Admin " } 
            {item.IsStaff && "Staff "}
            {!item.IsAdmin && !item.IsStaff && "Customer"} 
          </Text>
        </TouchableOpacity>
      }
    /> : <View style={{
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",  
      flex: 1,         
    }}>
      <Text  style={{
      fontSize: 24,
      fontWeight: 'bold',
      color: "#27AE60",   
      textAlign: "center",         
    }}> Error 401 {"\n\n"} Unauthorised. Page is locked. </Text>
    </View> }  
  </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff"
  }
});

export default User;