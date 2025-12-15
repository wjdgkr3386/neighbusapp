// src/screens/WelcomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';

type Props = RootStackScreenProps<'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (!user) {
      setMessage('먼저 회원가입을 해주세요.');
      return;
    }

    if (loginId === user.id && loginPwd === user.password) {
      setMessage(`${user.name}님, 로그인 완료되었습니다!`);
    } else {
      setMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 페이지</Text>

      {/* 회원가입 페이지로 이동 */}
      <Button
        title="회원가입 하러 가기"
        onPress={() => navigation.navigate('Signup')}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>로그인</Text>

        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={loginId}
          onChangeText={setLoginId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={loginPwd}
          onChangeText={setLoginPwd}
          secureTextEntry
        />

        <Button title="로그인" onPress={handleLogin} />

        {message !== '' && (
          <Text style={styles.message}>{message}</Text>
        )}

        {user && (
          <Text style={styles.info}>
            (가입된 사용자: {user.id} / {user.name})
          </Text>
        )}
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#007700',
  },
  info: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
  },
});
