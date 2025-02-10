import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet } from 'react-native';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import { Colors } from './constants/styles';
import Sessions from './screens/private/training/Sessions';
import { useContext, useEffect, useState } from 'react';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import AppLoading from 'expo-app-loading';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './screens/private/settings/Settings';
import History from './screens/private/history/History';
import FlatButton from './components/ui/buttons/FlatButton';
import AddSession from './screens/private/AddSession';
import SessionDetails from './screens/private/training/SessionDetails';
import ExerciceDetails from './screens/private/training/ExerciceDetails';
import EditSession from './screens/private/EditSession';
import SessionsContextProvider from './store/sessions-context';
import Rest from './screens/private/Rest';
import EditExerciceGoal from './screens/private/EditExerciceGoal';
import ExerciceHistory from './screens/private/ExerciceHistory';
import { useFonts } from 'expo-font';
import { Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import EditUserName from './screens/private/settings/EditUserName';
import EditUserPassword from './screens/private/settings/EditUserPassword';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
  }),
});

function MainPages() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background600,
        },
        headerTintColor: 'white',
        tabBarStyle: {
          backgroundColor: Colors.background600,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.accent50,
      }}
    >
      <BottomTab.Screen
        name="Training"
        component={TrainingStack}
        options={{
          title: 'Training',
          tabBarLabel: 'Training',
          headerShown: false,
          tabBarIcon: () => <Image style={{width: 27, height: 27}} source={require('./assets/icons/training.png')} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={History}
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: () => <Image style={{width: 27, height: 27}} source={require('./assets/icons/history.png')} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerShown: false,
          tabBarIcon: () => <Image style={{width: 27, height: 27}} source={require('./assets/icons/settings.png')} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function TrainingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background600 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background800 },
      }}
    >
      <Stack.Screen name="Sessions" component={Sessions} options={({navigation}) =>  ({ 
        headerRight: () => (
          <FlatButton onPress={() => { navigation.navigate('AddSession') }}>Add</FlatButton>
        ),
       })} />
      <Stack.Screen name="SessionDetails" component={SessionDetails} />
      <Stack.Screen name="ExerciceDetails" component={ExerciceDetails as any} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background600 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background800 },
      }}
    >
      <Stack.Screen name="SettingsMain" component={Settings} />
      <Stack.Screen name="EditUserName" component={EditUserName} options={() => ({
        title: 'Edit name',
      })} />
      <Stack.Screen name="EditUserPassword" component={EditUserPassword} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background600 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background600 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.background800 },
      }}
    >
      <Stack.Screen name="MainPages" component={MainPages} options={{ headerShown: false }} />
      <Stack.Screen name="AddSession" component={AddSession} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="EditSession" component={EditSession} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="Rest" component={Rest} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="ExerciceHistory" component={ExerciceHistory as any} options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="EditExerciceGoal" component={EditExerciceGoal as any} options={{ headerShown: false, presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function Root() {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const [loaded] = useFonts({
    'Montserrat-light': Montserrat_300Light,
    'Montserrat-regular': Montserrat_400Regular,
    'Montserrat-medium': Montserrat_500Medium,
    'Montserrat-semibold': Montserrat_600SemiBold,
    'Montserrat-bold': Montserrat_700Bold,
  });

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
          authContext.authenticate(user);
      } else {
          authContext.logout();
      }
      setIsLoading(false);
    });


    return unsubscribe;
  }, []);

  if (isLoading || !loaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      {authContext.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <SessionsContextProvider>
          <Root />
        </SessionsContextProvider>
      </AuthContextProvider>
    </>
  );
}
