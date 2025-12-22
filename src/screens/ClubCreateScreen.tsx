// src/screens/ClubCreateScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'ClubCreate'>;

const ClubCreateScreen: React.FC<Props> = ({ navigation }) => {
  const [clubName, setClubName] = useState('');
  const [category, setCategory] = useState('운동');
  const [province, setProvince] = useState('서울');
  const [city, setCity] = useState('마포구');
  const [description, setDescription] = useState('');

  const handleCreateClub = () => {
    if (!clubName.trim() || !description.trim()) {
      Alert.alert('입력 오류', '동아리 이름과 소개를 모두 입력해주세요.');
      return;
    }

    // In a real app, you would send this data to a server.
    console.log({
      clubName,
      category,
      province,
      city,
      description,
    });

    Alert.alert('생성 완료', '새로운 동아리가 생성되었습니다!', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>동아리 생성</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>동아리 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="동아리 이름을 입력하세요"
            placeholderTextColor={theme.colors.textLight}
            value={clubName}
            onChangeText={setClubName}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="운동" value="운동" />
              <Picker.Item label="스터디" value="스터디" />
              <Picker.Item label="취미" value="취미" />
              <Picker.Item label="여행" value="여행" />
              <Picker.Item label="기타" value="기타" />
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>활동 지역</Text>
          <View style={styles.regionContainer}>
            <View style={[styles.pickerWrapper, styles.flexOne]}>
              <Picker
                selectedValue={province}
                onValueChange={(itemValue) => setProvince(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="서울" value="서울" />
                <Picker.Item label="경기" value="경기" />
              </Picker>
            </View>
            <View style={[styles.pickerWrapper, styles.flexOne]}>
              <Picker
                selectedValue={city}
                onValueChange={(itemValue) => setCity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="마포구" value="마포구" />
                <Picker.Item label="강남구" value="강남구" />
                <Picker.Item label="종로구" value="종로구" />
              </Picker>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.label}>동아리 소개</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="동아리에 대해 자유롭게 소개해주세요."
            placeholderTextColor={theme.colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>대표 이미지</Text>
          <TouchableOpacity style={styles.imagePickerButton} activeOpacity={0.7}>
            <Text style={styles.imagePickerIcon}>📷</Text>
            <Text style={styles.imagePickerText}>이미지 선택</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateClub}>
          <Text style={styles.createButtonText}>생성하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClubCreateScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  headerRight: {
    width: 28, // to balance the back button
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  multilineInput: {
    minHeight: 120,
    lineHeight: 22,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 12,
    justifyContent: 'center',
  },
  picker: {
    // On iOS, picker has its own UI, so we can't style it much here.
    // On Android, this can be used for basic styling.
  },
  regionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  imagePickerButton: {
    height: 100,
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 30,
  },
  imagePickerText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 8,
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
