import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login'
import Scanner from './components/Scanner'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Welcome'}}
        />
      <Stack.Screen name="Scanner" component={Scanner} options={{title: 'Home'}} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App