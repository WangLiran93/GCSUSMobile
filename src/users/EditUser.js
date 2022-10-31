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
import CheckBox from '@react-native-community/checkbox';


const EditUser = () => {
  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const route = useRoute();
  const [provider, setProvider] = useState(route.params.record.IdentityProvider)
  const [name, setName] = useState(route.params.record.Name)
  const [id, setId] = useState(route.params.record.EmailAddress)
  const [lastWssConnection, setLastWssConnection] = useState(route.params.record.LastWssConnection)
  const [dateTimeUpdated, setDateTimeUpdated] = useState(route.params.record.DateTimeUpdated)
  const [isAdmin, setIsAdmin] = useState(route.params.record.IsAdmin)
  const [isStaff, setIsStaff] = useState(route.params.record.IsStaff)
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

  const deleteUser = (IdentityProvider, EmailAddress) => {
    wssSendEvent(
      "deleteUser",
      {
        IdentityProvider: IdentityProvider,
        EmailAddress: EmailAddress,
      }
    );
  };

  const deleteButtonAlert = () =>
    Alert.alert(
    "Delete User",
    "Are you sure to delete this user? Press OK to proceed.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => navigation.push('Users', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }
    ]
  );

  const updateUser = (Provider, Id, Name, IsAdmin, IsStaff) => {
    wssSendEvent(
      "putUser",
      {
        IdentityProvider: Provider,
        EmailAddress: Id,
        Name: Name,
        IsAdmin: IsAdmin,
        IsStaff: IsStaff,
        IsSelf: false,
      },
      true
    );
  };

  const updateButtonAlert = () =>
    Alert.alert(
    "Update User",
    "Are you sure to update this user? Press OK to proceed.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => navigation.push('Users', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }
    ]
  );

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
            navigation.push('Users', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
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
      }}>{'Edit User'}</Text>
    </View>
    <StatusBar style="auto" />
    {appUser.IsAdmin? <View>
      <Text>{"\n"}</Text>
       <View style={styles.TextView}>
        <Text style={styles.Label}>Provider</Text>
        <Text style={styles.Text}>{ provider }</Text>
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>Name</Text>
        <Text style={styles.Text}>{ name }</Text>
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>ID</Text>
        <Text style={styles.Text}>{ id }</Text>
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>LastWssConnection</Text>
        <Text style={styles.Text}>{ lastWssConnection }</Text>
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>Last Login</Text>
        <Text style={styles.Text}>{ dateTimeUpdated.substring(0, 19) }</Text>
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>Is Admin?</Text>
        <CheckBox
          style={{marginLeft: 70, marginRight: 200,}}
          value={isAdmin}
          onValueChange={(isAdmin) => setIsAdmin(isAdmin)}
        />
      </View>

      <View style={styles.TextView}>
        <Text style={styles.Label}>Is Staff?</Text>
        <CheckBox
          style={{marginLeft: 80, marginRight: 200,}}
          value={isStaff}
          onValueChange={(isStaff) => setIsStaff(isStaff)}
        />
      </View>

      <View style={styles.containerBtn}>      
        <TouchableOpacity style={styles.UpdateBtn} onPress={() => {updateUser(provider, id, name, isAdmin, isStaff), updateButtonAlert()}}>
        <Text style={styles.ButtonText}>UPDATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.DeleteBtn} onPress={() => {deleteUser(provider, id), deleteButtonAlert()}}>
        <Text style={styles.ButtonText}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </View> : <View style={{
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
      backgroundColor: "#fff",
  },

  containerBtn: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row"
},
  
  Text: {
    height: 40,
    flex: 1,
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    borderWidth: 0,
    fontSize: 14,
    backgroundColor: "#F2F3F4",
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
    width: "80%"
  },

  Label: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#27AE60",
    marginLeft: 20,
    marginRight: 20,
  },

  inputView: {    
    height: 60,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },

  TextView: {    
    height: 40,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
  },

  ButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  },

  UpdateBtn: {
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

  DeleteBtn: {
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
    backgroundColor: "indianred",
  },
});

export default EditUser;