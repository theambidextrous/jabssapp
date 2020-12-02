import React from "react";
import {
  Platform,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// import Icon from '@expo/vector-icons';
import Icon from "react-native-vector-icons/Ionicons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { LinearGradient } from "expo-linear-gradient";

import WelcomeScreen from "./WelcomeScreen";
import ActivityScreen from "./ActivityScreen";
import SupportScreen from "./SupportScreen";

import colors from "../config/colors";

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ActivityStack = createStackNavigator();
const SupportStack = createStackNavigator();
// const { signOut } = React.useContext(AuthContext);
const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="EntryPoint"
    activeColor={colors.white}
    style={{ backgroundColor: colors.primary_darker, }}
    barStyle={{backgroundColor: colors.primary_darker, height:70,}}
  >
    <Tab.Screen
      name="EntryPoint"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Send money",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-paper-plane" color={color} size={30} />
        ),
      }}
    />
    <Tab.Screen
      name="Activity"
      component={ActivityStackScreen}
      options={{
        tabBarLabel: "My activities",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-stats" color={color} size={30}/>
        ),
      }}
    />
    <Tab.Screen
      name="Support"
      component={SupportStackScreen}
      options={{
        tabBarLabel: "Support",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-headset" color={color} size={30} />
        ),
      }}
    />
  </Tab.Navigator>
);

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator
    screenOptions={{
      headerBackground:() => {
        return(
          <LinearGradient
          colors={[colors.primary_dark, colors.primary_darker, colors.primary_darker]}
          style={{ flex: 1 }}
        />
        )
      },
      headerStyle: {
        backgroundColor: colors.primary_darker,
        height:80,
        ...Platform.select({
          ios: {
            shadowColor: colors.black,
            shadowOffset: {width: 1, height: 3},
            shadowOpacity: 0.5,
            shadowRadius:2,
          },
          android: {
            elevation: 4,
          },
      })
      },
      headerTintColor: colors.white,
      headerTitleAlign: "left",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize:18,
        marginLeft:-20
      },
    }}
  >
    <HomeStack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{
        title: "Send money",
        headerLeft: () => (
          <Icon.Button
            name="ios-paper-plane"
            size={30}
            backgroundColor="transparent"
            onPress={() => null }
          ></Icon.Button>
        ),
        headerRight: () => (
          <MIcon.Button
            name="account-circle"
            size={30}
            backgroundColor="transparent"
            onPress={() => navigation.navigate('MyAccount') }
          ></MIcon.Button>
        ),
      }}
    />
  </HomeStack.Navigator>
);
const ActivityStackScreen = ({ navigation }) => (
  <ActivityStack.Navigator
  screenOptions={{
    headerBackground:() => {
      return(
        <LinearGradient
        colors={[colors.primary_dark, colors.primary_darker, colors.primary_darker]}
        style={{ flex: 1,}}
      />
      )
    },
    headerStyle: {
      height:80,
    },
    headerTintColor: colors.white,
    headerTitleAlign: "left",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize:18,
      marginLeft:-20
    },
  }}
  >
    <ActivityStack.Screen
      name="Activities"
      component={ActivityScreen}
      options={{
        title: "My activities",
        headerLeft: () => (
          <MIcon.Button
            name="chart-bar"
            size={30}
            backgroundColor='transparent'
            onPress={() => null}
          ></MIcon.Button>
        ),
        headerRight: () => (
          <MIcon.Button
            name="account-circle"
            size={30}
            backgroundColor="transparent"
            onPress={() => navigation.navigate('MyAccount') }
          ></MIcon.Button>
        ),
      }}
    />
  </ActivityStack.Navigator>
);

const SupportStackScreen = ({ navigation }) => (
  <SupportStack.Navigator
  screenOptions={{
    headerBackground:() => {
      return(
        <LinearGradient
        colors={[colors.primary_dark, colors.primary_darker, colors.primary_darker]}
        style={{ flex: 1 }}
      />
      )
    },
    headerStyle: {
      backgroundColor: colors.primary_darker,
      height:80,
      ...Platform.select({
        ios: {
          shadowColor: colors.black,
          shadowOffset: {width: 1, height: 3},
          shadowOpacity: 0.5,
          shadowRadius:2,
        },
        android: {
          elevation: 4,
        },
    })
    },
    headerTintColor: colors.white,
    headerTitleAlign: "left",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize:18,
      marginLeft:-20
    },
  }}
  >
    <SupportStack.Screen
      name="Support"
      component={SupportScreen}
      options={{
        title: "Support",
        headerLeft: () => (
          <Icon.Button
            name="ios-headset"
            size={40}
            backgroundColor='transparent'
            onPress={() => null }
          ></Icon.Button>
        ),
        headerRight: () => (
          <MIcon.Button
            name="account-circle"
            size={30}
            backgroundColor="transparent"
            onPress={() => navigation.navigate('MyAccount') }
          ></MIcon.Button>
        ),
      }}
    />
  </SupportStack.Navigator>
);
export default MainTabScreen;
