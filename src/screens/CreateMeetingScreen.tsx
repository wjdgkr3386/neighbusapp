// src/screens/CreateMeetingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import type { RootStackScreenProps } from '../../App';

type Props = RootStackScreenProps<'CreateMeeting'>;

const CreateMeetingScreen: React.FC<Props> = ({ navigation }) => {
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState('2025-12-25'); // 예시 날짜
  const [time, setTime] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [memberLimit, setMemberLimit] = useState('');
  const [description, setDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [timeAmPm, setTimeAmPm] = useState<'오전' | '오후'>('오후');

  const handleCreateMeeting = () => {
    if (!summary || !time || !locationSearch) {
      Alert.alert('입력 오류', '모임 이름, 시간, 장소를 모두 입력해주세요.');
      return;
    }
    Alert.alert('모임 생성 완료', `"${summary}" 모임이 생성되었습니다.`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButtonText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>모임 생성</Text>
        <TouchableOpacity onPress={handleCreateMeeting}>
          <Text style={[styles.headerButtonText, styles.headerButtonConfirm]}>생성</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formGroup}>
          <Text style={styles.label}>모임 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="모임의 주제를 알려주세요"
            value={summary}
            onChangeText={setSummary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>상세 설명</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="모임에 대한 자세한 내용을 공유해주세요"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1.5 }]}>
            <Text style={styles.label}>날짜</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.inputText}>{date}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>최대 인원</Text>
            <TextInput
              style={styles.input}
              placeholder="숫자만"
              value={memberLimit}
              onChangeText={setMemberLimit}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>시간</Text>
          <View style={styles.timeInputContainer}>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  timeAmPm === '오전' && styles.amPmButtonActive,
                ]}
                onPress={() => setTimeAmPm('오전')}
              >
                <Text
                  style={[
                    styles.amPmButtonText,
                    timeAmPm === '오전' && styles.amPmButtonTextActive,
                  ]}
                >
                  오전
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  timeAmPm === '오후' && styles.amPmButtonActive,
                ]}
                onPress={() => setTimeAmPm('오후')}
              >
                <Text
                  style={[
                    styles.amPmButtonText,
                    timeAmPm === '오후' && styles.amPmButtonTextActive,
                  ]}
                >
                  오후
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="2 : 00"
              value={time}
              onChangeText={setTime}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>장소</Text>
          <TextInput
            style={styles.input}
            placeholder="모임 장소를 검색하세요"
            value={locationSearch}
            onChangeText={setLocationSearch}
          />
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              외부 지도 API가 여기에 표시됩니다.
            </Text>
          </View>
          <TextInput
            style={[styles.input, { marginTop: 12 }]}
            placeholder="상세 주소 (예: 2층 카페 안쪽)"
            value={locationDetail}
            onChangeText={setLocationDetail}
          />
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={isDatePickerVisible}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDatePickerVisible(false)}
        >
          <View style={styles.calendarModalContainer}>
            <Calendar
              current={date}
              onDayPress={(day) => {
                setDate(day.dateString);
                setDatePickerVisible(false);
              }}
              markedDates={{
                [date]: { selected: true, selectedColor: '#9B7E5C' },
              }}
              theme={{
                arrowColor: '#9B7E5C',
                todayTextColor: '#9B7E5C',
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#9B7E5C',
  },
  headerButtonConfirm: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F7F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex: {
    flex: 1,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
  },
  timeInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  amPmContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    backgroundColor: '#F8F7F5',
  },
  amPmButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  amPmButtonActive: {
    backgroundColor: '#9B7E5C',
    borderRadius: 9,
  },
  amPmButtonText: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: '600',
  },
  amPmButtonTextActive: {
    color: '#FFFFFF',
  },
  timeInput: {
    flex: 1,
    textAlign: 'center',
  },
});

export default CreateMeetingScreen;
