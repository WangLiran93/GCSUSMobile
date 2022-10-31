import { useNavigation, useRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {WEBSOCKET_URL, REST_URL, WEB_CLIENT_ID} from "@env";


const Login = () => {
  const [user, setUser] = useState( {} )
  const [isLogIn, setIsLogIn] = useState(false)
  const [webSocketUrlAuth, setWebSocketUrlAuth] = useState(WEBSOCKET_URL)
  const [appUser, setAppUser] = useState({IsAdmin: false, IsStaff: false})

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, 
      offlineAccess: false, 
    });
    isSignedIn();
  }, [])


  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
      console.log(userInfo)
      if(userInfo.idToken){
        wssInitialise(userInfo);
      }     
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };


  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo()
    } else {
      console.log('Please Login')
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo)
    } catch (error) {
      console.log(error.message)
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };  
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser({});
    } catch (error) {
      console.error(error);
    }
  };

  const navigation = useNavigation();

  const wssInitialise = (userInfo) => {
    fetch(REST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ GoogleIdToken: userInfo.idToken }),
    })
    .then(function (response) {
      if (response.status !== 200) {
        signOut();
      }
      return response.text();
    })
    .then(function (data) {
      setIsLogIn(true);
      let wssToken = JSON.parse(data)["wssToken"];
      setWebSocketUrlAuth(WEBSOCKET_URL + "/?Auth=" + wssToken);     
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        {!user.idToken || !isLogIn ? 
        <Text style={styles.Label}>User Login</Text> : <Text style={styles.Label}>Welcome, {user.user.givenName}</Text>}
        {!user.idToken || !isLogIn ?        
        null: 
        <TouchableOpacity style={styles.Button}  onPress={() => { navigation.push('Home', {user: user, appUser: appUser, webSocketUrlAuth : webSocketUrlAuth}) }}>
        <Text style={styles.text_button}>Home Page</Text>
        </TouchableOpacity>
      }      

      {!user.idToken || !isLogIn ?         
        <GoogleSigninButton
        style={{ width: 240, height: 60, marginTop: 50 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
        /> : 
        <TouchableOpacity
        style={{
          borderColor: "#fff",
          borderWidth: 1,
          padding: 7,
          borderRadius: 10,
          backgroundColor: '#fff',
        }}
        onPress={signOut}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: "#778899",   
            marginTop: 40         
          }}
        >{'SignOut'}</Text>
      </TouchableOpacity>
      }   
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  text_button: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },

  Label: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 36,
    color: "#778899"
  },

  SignInLabel: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 36,
    marginTop: 50,
    color: "#9370DB"
  },

  Button: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#9370DB",
  },
});

export default Login;
