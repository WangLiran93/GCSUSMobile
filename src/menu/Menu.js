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


const Menu = () => {
  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const menuRef = useRef([]);
  const route = useRoute();
  const [user, setUser] = useState(route.params.user)
  const [appUser, setAppUser] = useState(route.params.appUser)
  const [webSocketUrlAuth, setWebSocketUrlAuth] = useState(route.params.webSocketUrlAuth)
  const webSocket = new WebSocket(webSocketUrlAuth);

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("connection establish open")
      initialiseMenu();
    };
    webSocket.onclose = () => {
      console.log("connection establish closed");
    }
    return () => {
      webSocket.close();
    };
  }, [])

  const initialiseMenu = () => {
    console.log("initialise Menu")
    webSocket.send(
      JSON.stringify({
      action: "getAllMenus",
      data: "-",
      })
    );
  };

  const onSocketEvent = useCallback((message) => {
    const data = JSON.parse(message?.data);
    if ("AllMenuItems" in data) {
        menuRef.current = data["AllMenuItems"].sort(function (a, b) {
            return a.Menu > b.Menu ? 1 : -1;
          });
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
            navigation.push('Home', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
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
      }}>{'Menu'}</Text>
      {appUser.IsAdmin?   <TouchableOpacity
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
            navigation.push('CreateMenu', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#4169E1",            
            }}
          >{'Create'}</Text>
        </TouchableOpacity> : null}
    
    </View>
    {appUser.IsAdmin? <FlatList
      style={{
        marginHorizontal: 15,
        marginTop: 20
      }}
      data={menuRef.current}
      keyExtractor={(item, index) => index.toString()} 
      renderItem={({ item, index }) =>
        <TouchableOpacity
          key={index}
          style={{
            padding: 10,
            elevation: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#D4E0FF',
            borderColor: '#ddd',
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'center'
          }}
          onPress={() => {
            navigation.push('EditMenu',
              {
                record: item,
                user: user,
                appUser : appUser,
                webSocketUrlAuth : webSocketUrlAuth
              }
            )
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: 10,
              alignContent: 'center',
            }}
          >
            {item.Menu + ' - ' + item.Item + '     $' + item.Price} 
          </Text>
        </TouchableOpacity>
      }
    /> : 
    <FlatList
      style={{
        marginHorizontal: 15,
        marginTop: 20
      }}
      data={menuRef.current}
      keyExtractor={(item, index) => index.toString()} 
      renderItem={({ item, index }) =>
        <Text
          key={index}
          style={{
            padding: 10,
            elevation: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#D4E0FF',
            borderColor: '#ddd',
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: "center"
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              borderRadius: 10,
            }}
          >
            {item.Menu + ' - ' + item.Item + '     $' + item.Price} 
          </Text>
        </Text>
      }
    />}
    
  </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff"
  }
});

export default Menu;