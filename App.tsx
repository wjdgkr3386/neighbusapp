// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { UserProvider } from './src/context/UserContext';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';

// 네비게이션 스택에 포함될 화면들의 타입을 정의합니다.
export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
};

// 각 화면 컴포넌트에서 navigation, route prop의 타입을 지정하기 위한 헬퍼 타입을 만듭니다.
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ title: '환영합니다' }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: '회원가입' }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: '로그인' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;