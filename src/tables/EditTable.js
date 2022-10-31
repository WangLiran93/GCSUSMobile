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
import SelectList from 'react-native-dropdown-select-list';


const EditTable = () => {
  const navigation = useNavigation();
  const [, updateState] = React.useState();
  const route = useRoute();
  const [tableNo, setTableNo] = useState(route.params.record.TableNo)
  const [capacity, setCapacity] = useState(route.params.record.Capacity)
  const [tableStatus, setTableStatus] = useState(route.params.record.TableStatus)
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

  const deleteTable = (TableNo, Capacity) => {
    wssSendEvent(
      "deleteTable",
      {
        TableNo: TableNo,
        Capacity: Capacity,
      }
    );
  };

  const deleteButtonAlert = () =>
    Alert.alert(
    "Delete Table",
    "Are you sure to delete this item? Press OK to proceed.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => navigation.push('Tables', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }
    ]
  );

  const updateTable = (TableNo, Capacity, TableStatus) => {
    wssSendEvent(
      "putTable",
      {
        TableNo: TableNo,
        Capacity: Capacity,
        TableStatus: TableStatus,
      }
    );
  };

  const updateButtonAlert = () =>
    Alert.alert(
    "Update Table",
    "Are you sure to update this item? Press OK to proceed.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => navigation.push('Tables', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth}) }
    ]
  );

  const selectData = [{key:'Vacant',value:'Vacant'}, {key:'Occupied',value:'Occupied'},];

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
            navigation.push('Tables', {user: user, appUser : appUser, webSocketUrlAuth : webSocketUrlAuth})
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
      }}>{'Edit Table'}</Text>
    </View>
    <StatusBar style="auto" />
    <Text>{"\n"}</Text>
      <View style={styles.inputView}>
        <Text style={styles.Label}>Table Number</Text>
        <Text style={styles.Text}>{ tableNo }</Text>
      </View>
 
      <View style={styles.inputView}>
        <Text style={styles.Label}>Capacity</Text>
        <Text style={styles.Text}>{ capacity }</Text> 
      </View>

      <View style={styles.SelectView}>
        <Text style={styles.Label}>Status</Text>
        <SelectList setSelected={setTableStatus} data={selectData} color={'#ECFFF4'} defaultOption={{ key: tableStatus, value: tableStatus }} />
      </View>

      <View style={styles.containerBtn}>      
        <TouchableOpacity style={styles.UpdateBtn} onPress={() => {updateTable(tableNo, capacity, tableStatus), updateButtonAlert()}}>
        <Text style={styles.ButtonText}>UPDATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.DeleteBtn} onPress={() => {deleteTable(tableNo, capacity), deleteButtonAlert()}}>
        <Text style={styles.ButtonText}>DELETE</Text>
        </TouchableOpacity>
      </View>    
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
    backgroundColor: "#F6DDCC",
    textAlign: "center",
    width: "50%"
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
    alignContent: "center",
  },

  ButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  },

  SelectView: {    
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
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

export default EditTable;