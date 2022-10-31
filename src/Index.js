import * as React from 'react';
import { useNavigation, useRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Home from './Home';
import Menu from './menu/Menu';
import CreateMenu from './menu/CreateMenu';
import EditMenu from './menu/EditMenu';
import Users from './users/Users';
import CreateUser from './users/CreateUser';
import EditUser from './users/EditUser';
import Tables from './tables/Tables';
import CreateTable from './tables/CreateTable';
import EditTable from './tables/EditTable';

const Stack = createNativeStackNavigator();
const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >  
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="CreateMenu" component={CreateMenu} />
        <Stack.Screen name="EditMenu" component={EditMenu} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="Tables" component={Tables} />
        <Stack.Screen name="CreateTable" component={CreateTable} />
        <Stack.Screen name="EditTable" component={EditTable} />
      </Stack.Navigator>
    </NavigationContainer>          
  );
};
export default Index;
