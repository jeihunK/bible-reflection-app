import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import NewEntryScreen from '../screens/NewEntryScreen';
import BibleSearchScreen from '../screens/BibleSearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReflectionScreen from '../screens/ReflectionScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import ReflectionsListScreen from '../screens/ReflectionsListScreen';

// Icons for navigation (we'll use simple text for now)
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6B73FF',
        tabBarInactiveTintColor: '#6C757D',
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarLabel: 'Journal',
        }}
      />
      <Tab.Screen 
        name="BibleSearch" 
        component={BibleSearchScreen}
        options={{
          tabBarLabel: 'Bible',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#F8F9FA',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="NewEntry" 
          component={NewEntryScreen}
          options={{ 
            title: 'New Journal Entry',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: '#6B73FF',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: '600',
            },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen 
          name="Reflection" 
          component={ReflectionScreen}
          options={{ 
            title: 'Bible Reflection',
            presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
          options={{ 
            title: 'Privacy Policy',
            headerStyle: {
              backgroundColor: '#6B73FF',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: '600',
            },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen 
          name="TermsOfService" 
          component={TermsOfServiceScreen}
          options={{ 
            title: 'Terms of Service',
            headerStyle: {
              backgroundColor: '#6B73FF',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: '600',
            },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen 
          name="ReflectionsList" 
          component={ReflectionsListScreen}
          options={{ 
            title: 'My Reflections',
            headerStyle: {
              backgroundColor: '#6B73FF',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: '600',
            },
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;