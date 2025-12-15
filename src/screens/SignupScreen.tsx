// src/screens/SignupScreen.tsx
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

type Props = RootStackScreenProps<'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useUser();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');

  const handleSignup = () => {
    if (!id || !name || !pwd) {
      Alert.alert('입력 오류', '모든 항목을 입력해 주세요.');
      return;
    }

    // 아주 간단하게 메모리 상에만 사용자 정보 저장
    setUser({
      id,
      name,
      password: pwd,
    });

    Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
      {
        text: '확인',
        onPress: () => {
          // Welcome 화면으로 돌아가기
          navigation.navigate('Welcome');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입 페이지</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
      />

      <Button title="회원가입" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;

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
