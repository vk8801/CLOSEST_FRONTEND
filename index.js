import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import App from './App';
import login from './login';
import SignUpScreen from './SignUpScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './Profile';
import MatchScreen from './MatchScreen';

const Tab = createBottomTabNavigator();

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
      <MainTabs />
    </NavigationContainer>
  );
}

registerRootComponent(RootNavigator);
