// src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';

type Props = RootStackScreenProps<'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useUser();

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    if (!id || !name || !pwd || !pwdConfirm) {
      Alert.alert('입력 오류', '필수 항목을 모두 입력해 주세요.');
      return;
    }

    if (pwd !== pwdConfirm) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 사용자 정보 저장
    setUser({
      id,
      name,
      password: pwd,
    });

    Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
      {
        text: '확인',
        onPress: () => {
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 영역 */}
        <View style={styles.header}>
          <Text style={styles.titleKorean}>새로운 시작,</Text>
          <Text style={styles.titleEnglish}>NEIGHBUS와 함께</Text>
          <Text style={styles.subtitle}>간단한 정보만 입력하고 동네 친구들을 만나보세요</Text>
        </View>

        {/* 이름 & 아이디 */}
        <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            placeholderTextColor="#B8B8B8"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.halfInput}>
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
      </View>

      {/* 비밀번호 & 비밀번호 확인 */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
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
        <View style={styles.halfInput}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            placeholderTextColor="#B8B8B8"
            value={pwdConfirm}
            onChangeText={setPwdConfirm}
            secureTextEntry
          />
        </View>
      </View>

      {/* 생년월일 & 성별 */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>생년월일</Text>
          <TextInput
            style={styles.input}
            placeholder="연도. 월. 일."
            placeholderTextColor="#B8B8B8"
            value={birthDate}
            onChangeText={setBirthDate}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'male' && styles.genderButtonSelected,
              ]}
              onPress={() => setGender('male')}
            >
              <View style={styles.radioOuter}>
                {gender === 'male' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>남성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'female' && styles.genderButtonSelected,
              ]}
              onPress={() => setGender('female')}
            >
              <View style={styles.radioOuter}>
                {gender === 'female' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>여성</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 시/도 & 시/군/구 */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>시/도</Text>
          <TextInput
            style={styles.input}
            placeholder="시/도 선택"
            placeholderTextColor="#B8B8B8"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>시/군/구</Text>
          <TextInput
            style={styles.input}
            placeholder="시/군/구 선택"
            placeholderTextColor="#B8B8B8"
            value={district}
            onChangeText={setDistrict}
          />
        </View>
      </View>

      {/* 상세주소 */}
      <View style={styles.fullInput}>
        <Text style={styles.label}>상세주소</Text>
        <TextInput
          style={styles.input}
          placeholder="상세주소를 입력하세요"
          placeholderTextColor="#B8B8B8"
          value={detailAddress}
          onChangeText={setDetailAddress}
        />
      </View>

      {/* 전화번호 & 이메일 */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="010-1234-5678"
            placeholderTextColor="#B8B8B8"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#B8B8B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* 회원가입 완료 버튼 */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        activeOpacity={0.8}
      >
        <Text style={styles.signupButtonText}>회원가입 완료</Text>
      </TouchableOpacity>

        {/* 하단 로그인 링크 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 10,
  },
  titleKorean: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 2,
  },
  titleEnglish: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B7355',
    marginTop: 6,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  fullInput: {
    marginBottom: 16,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  genderButtonSelected: {
    borderColor: '#9B7E5C',
    backgroundColor: '#F9F6F2',
    borderWidth: 2,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#B8B8B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#9B7E5C',
  },
  genderText: {
    fontSize: 14,
    color: '#5C4A3A',
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: '#9B7E5C',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#9B7E5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#8B7355',
  },
  loginLink: {
    fontSize: 13,
    color: '#9B7E5C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
