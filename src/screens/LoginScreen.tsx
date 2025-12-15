// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';

// App.tsx의 RootStackParamList에 'Login'을 추가해야 합니다.
// 예: type RootStackParamList = { Welcome: undefined; Signup: undefined; Login: undefined; };
type Props = RootStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser } = useUser();

  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = () => {
    if (!id || !pwd) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // 저장된 사용자 정보와 일치하는지 확인
    if (user && user.id === id && user.password === pwd) {
      Alert.alert('로그인 성공', `${user.name}님, 환영합니다!`, [
        {
          text: '확인',
          onPress: () => {
            // 앱의 메인 화면으로 이동 (여기서는 Welcome으로 가정)
            navigation.navigate('Welcome');
          },
        },
      ]);
    } else {
      Alert.alert(
        '로그인 실패',
        '아이디 또는 비밀번호가 일치하지 않습니다.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인 페이지</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
      />

      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
});
