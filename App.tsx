// App.tsx 최종 수정 코드

import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// **1. 화면 컴포넌트 Import**
import SignupScreen from './src/screens/SignupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

// 🚨🚨🚨 UserContext Import 추가 🚨🚨🚨
// 경로에 주의하세요. 'src/context/UserContext'에서 가져와야 합니다.
import { UserProvider } from './src/context/UserContext'; 

// **2. Route 목록 및 타입 정의 (필수)**
export type RootStackParamList = {
  Welcome: undefined;
  Signup: undefined;
};

// **3. 개별 화면의 Props 타입 정의 (필수)**
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* 🚨🚨🚨 UserProvider로 NavigationContainer 감싸기 🚨🚨🚨 */}
      <UserProvider>
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="Welcome">
            <RootStack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ title: '환영합니다' }}
            />
            <RootStack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: '회원가입' }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </UserProvider>
      
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // 스타일은 그대로 유지
});

export default App;