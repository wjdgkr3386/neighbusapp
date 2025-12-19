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
import { BASE_URL } from '../config';
import { Picker } from '@react-native-picker/picker';

type Props = RootStackScreenProps<'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useUser();

  const [name, setName] = useState('');
  const [id, setId] = useState(''); // username
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const [selectedCategory, setSelectedCategory] = useState("sports");
  const [city, setCity] = useState('');       // 시/도
  const [district, setDistrict] = useState(''); // 시/군/구
  const [detailAddress, setDetailAddress] = useState(''); // 상세주소

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    
    // 1. 유효성 검사 (성별 체크 추가)
    if (!id || !name || !pwd || !pwdConfirm || !gender) {
      Alert.alert('입력 오류', '모든 필수 항목(성별 포함)을 입력해 주세요.');
      return;
    }

    if (pwd !== pwdConfirm) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 2. 서버 전송 데이터 구성 (성별 변환: male -> M, female -> F)
      const signupData = {
        username: id,
        password: pwd,
        name: name,
        birth: birthDate,
        sex: gender === 'male' ? 'M' : 'F', // 서버 형식에 맞게 변환
        phone: phone,
        email: email,

        // 요청하신 대로 시/도, 시/군/구는 int형 기본값(1)로 유지하고 주소 텍스트만 보냄
        province: 1,
        city: 1,
        address: `${city} ${district} ${detailAddress}`.trim(), // 입력받은 주소 합쳐서 전송
      };

      console.log('전송 데이터 확인:', signupData);

      // 3. fetch 요청
      const url = `${BASE_URL}/api/mobile/account/insertSignup`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      console.log('서버 응답:', result);

      // 4. 응답 처리
      if (result.status === 1) {
        Alert.alert('회원가입 완료', '환영합니다! 로그인 해주세요.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        console.log("에러 응답:", result);
        Alert.alert('회원가입 실패', '다시 시도해 주세요.\n(이미 존재하는 아이디일 수 있습니다)');
      }

    } catch (error: any) {
      console.error('Signup Error:', error);
      Alert.alert('통신 오류', '서버와 연결할 수 없습니다.\n' + error.message);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 */}
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
              placeholder="이름"
              placeholderTextColor="#B8B8B8"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디"
              placeholderTextColor="#B8B8B8"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* 비밀번호 */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
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
              placeholder="확인"
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
              placeholder="YYMMDD"
              placeholderTextColor="#B8B8B8"
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
                onPress={() => setGender('male')}
              >
                <Text style={styles.genderText}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
                onPress={() => setGender('female')}
              >
                <Text style={styles.genderText}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 주소 */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Picker
              selectedValue={selectedCategory} // 현재 선택된 값
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue) // 값이 바뀌면 state 업데이트
              }>
              <Picker.Item label="운동" value="sports" />
              <Picker.Item label="독서" value="reading" />
              <Picker.Item label="맛집 탐방" value="food" />
            </Picker>
            <Text style={styles.label}>시/도</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 서울"
              placeholderTextColor="#B8B8B8"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>시/군/구</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 강남구"
              placeholderTextColor="#B8B8B8"
              value={district}
              onChangeText={setDistrict}
            />
          </View>
        </View>
        <View style={styles.fullInput}>
          <Text style={styles.label}>상세주소</Text>
          <TextInput
            style={styles.input}
            placeholder="상세주소 입력"
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
              placeholder="01012345678"
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
              placeholder="email@example.com"
              placeholderTextColor="#B8B8B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>회원가입 완료</Text>
        </TouchableOpacity>

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
  safeArea: { flex: 1, backgroundColor: '#F5EDE4' },
  container: { flex: 1 },
  contentContainer: { padding: 24, maxWidth: 500, width: '100%', alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  titleKorean: { fontSize: 28, fontWeight: '700', color: '#5C4A3A' },
  titleEnglish: { fontSize: 32, fontWeight: '700', color: '#5C4A3A', marginBottom: 12 },
  subtitle: { fontSize: 13, color: '#8B7355' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  halfInput: { width: '48%' },
  fullInput: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#5C4A3A', marginBottom: 6 },
  input: {
    backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#D8D0C8', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#333333'
  },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 48 },
  genderButton: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA',
    borderWidth: 1.5, borderColor: '#D8D0C8', borderRadius: 10, marginHorizontal: 3
  },
  genderButtonSelected: { borderColor: '#9B7E5C', backgroundColor: '#F9F6F2', borderWidth: 2 },
  genderText: { fontSize: 14, color: '#5C4A3A', fontWeight: '500' },
  signupButton: {
    backgroundColor: '#9B7E5C', borderRadius: 10, paddingVertical: 15, alignItems: 'center',
    marginTop: 20, marginBottom: 20
  },
  signupButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { fontSize: 13, color: '#8B7355' },
  loginLink: { fontSize: 13, color: '#9B7E5C', fontWeight: '600', textDecorationLine: 'underline' },
});