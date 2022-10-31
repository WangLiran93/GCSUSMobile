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


const Tables = () => {
  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const tableRef = useRef([]);
  const route = useRoute();
  const [user, setUser] = useState(route.params.user)
  const [appUser, setAppUser] = useState(route.params.appUser)
  const [webSocketUrlAuth, setWebSocketUrlAuth] = useState(route.params.webSocketUrlAuth)
  const webSocket = new WebSocket(webSocketUrlAuth);

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("connection establish open")
      initialiseTable();
    };
    webSocket.onclose = () => {
      console.log("connection establish closed");
    }
    return () => {
      webSocket.close();
    };
  }, [])

  const initialiseTable = () => {
    console.log("initialise Table")
    webSocket.send(
      JSON.stringify({
      action: "getTables",
      data: "-",
      })
    );
  };

  const onSocketEvent = useCallback((message) => {
    const data = JSON.parse(message?.data);
    if ("AllTables" in data) {
        tableRef.current = data["AllTables"].sort(function (a, b) {
            return a.TableNo > b.TableNo ? 1 : -1;
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
      backgroundColor: "#A0522D",
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
      }}>{'Tables'}</Text>
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
            navigation.push('CreateTable', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: "#A0522D",            
            }}
          >{'Create'}</Text>
        </TouchableOpacity> : null}
    
    </View>
    {appUser.IsAdmin? <FlatList
      style={{
        marginHorizontal: 15,
        marginTop: 20
      }}
      data={tableRef.current}
      keyExtractor={(item, index) => index.toString()} 
      renderItem={({ item, index }) =>
        <TouchableOpacity
          key={index}
          style={{
            padding: 10,
            elevation: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#F6DDCC',
            borderColor: '#ddd',
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'center'
          }}
          onPress={() => {
            navigation.push('EditTable',
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
            {"Table No. " + item.TableNo + ' (' + item.Capacity + ' pax)     ' + item.TableStatus} 
          </Text>
        </TouchableOpacity>
      }
    /> : 
    <FlatList
      style={{
        marginHorizontal: 15,
        marginTop: 20
      }}
      data={tableRef.current}
      keyExtractor={(item, index) => index.toString()} 
      renderItem={({ item, index }) =>
        <Text
          key={index}
          style={{
            padding: 10,
            elevation: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#F6DDCC',
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
            {"Table No. " + item.TableNo + ' (' + item.Capacity + ' pax)     ' + item.TableStatus} 
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

export default Tables;