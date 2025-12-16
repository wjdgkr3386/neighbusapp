// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';

type Props = RootStackScreenProps<'Login'>;

// 더미 사용자 목록
const DUMMY_USERS = [
  {
    id: 'test',
    uuid: '550e8400-e29b-41d4-a716-446655440099',
    name: '테스트 유저',
    password: '1234',
  },
  {
    id: 'user1',
    uuid: '550e8400-e29b-41d4-a716-446655440098',
    name: '홍길동',
    password: 'pass123',
  },
];

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useUser();

  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = () => {
    if (!id || !pwd) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // 더미 사용자 목록에서 일치하는 사용자 찾기
    const foundUser = DUMMY_USERS.find(
      (u) => u.id === id && u.password === pwd
    );

    if (foundUser) {
      // 로그인 성공 - 사용자 정보 저장
      setUser(foundUser);
      Alert.alert('로그인 성공', `${foundUser.name}님, 환영합니다!`, [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('Home');
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

  const handleGoogleLogin = () => {
    Alert.alert('구글 로그인', '구글 로그인 기능은 준비 중입니다.');
  };

  const handleFindAccount = () => {
    Alert.alert('안내', '아이디/비밀번호 찾기 기능은 준비 중입니다.');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {/* 헤더 영역 */}
          <View style={styles.header}>
            <Text style={styles.titleKorean}>함께하는 이웃</Text>
            <Text style={styles.titleEnglish}>NEIGHBUS</Text>
            <Text style={styles.subtitle}>로그인하고 동네 친구들을 만나보세요</Text>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.formContainer}>
            {/* 아이디 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이디</Text>
              <TextInput
                style={styles.input}
                placeholder="아이디를 입력하세요"
                placeholderTextColor="#B8B8B8"
                value={id}
                onChangeText={setId}
                autoCapitalize="none"
              />
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor="#B8B8B8"
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry
              />
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            {/* 구글 로그인 버튼 */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>구글 아이디로 로그인</Text>
            </TouchableOpacity>
          </View>

          {/* 하단 링크 */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleFindAccount}>
              <Text style={styles.footerText}>아이디 / 비밀번호 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>|</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.footerText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  titleKorean: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 2,
  },
  titleEnglish: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B7355',
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#5C4A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333333',
  },
  loginButton: {
    backgroundColor: '#9B7E5C',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#9B7E5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 8,
  },
  googleButtonText: {
    color: '#5C4A3A',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#8B7355',
  },
  divider: {
    fontSize: 13,
    color: '#8B7355',
    marginHorizontal: 10,
  },
});

