import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import App from './App';
import login from './login';
import SignUpScreen from './SignUpScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './Profile';
import MatchScreen from './MatchScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import PersonalDetailsScreen from './PersonalDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="login" component={login} />
      <Tab.Screen name="Explore" component={App} />
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Discover" component={App} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Your bottom tab navigator (main app) */}
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Standalone SignUp screen */}
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="LogIn"
          component={login}
          options={{ title: 'Log In' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: 'Reset Password' }}
        />
        <Stack.Screen
          name="PersonalDetails"
          component={PersonalDetailsScreen}
          options={{ title: 'Personal Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


registerRootComponent(RootNavigator);
