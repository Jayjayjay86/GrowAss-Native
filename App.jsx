import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './componants/screens/home/HomeScreen';
import ListScreen from './componants/screens/list/ListScreen';
import CreateScreen from './componants/screens/create/CreateScreen';
import SettingsScreen from './componants/screens/settings/SettingsScreen';
import SalesScreen from './componants/screens/sales/SalesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Strains') {
              iconName = focused ? 'leaf-sharp' : 'leaf-outline';
            } else if (route.name === 'Create') {
              iconName = focused ? 'add-circle' : 'create-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings-sharp' : 'settings-outline';
            } else if (route.name === 'Sales') {
              iconName = focused ? 'cash' : 'cash-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Strains" component={ListScreen} />
        <Tab.Screen name="Sales" component={SalesScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
