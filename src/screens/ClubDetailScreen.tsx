// src/screens/ClubDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { RootStackScreenProps } from '../../App';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "오늘"
};
LocaleConfig.defaultLocale = 'ko';

type Props = RootStackScreenProps<'ClubDetail'>;

const ClubDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  // In a real app, you'd fetch this data based on the clubId
  const { clubId } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [meetings, setMeetings] = useState({
    '2025-12-20': { id: 'm1', summary: '한강 플로깅' },
    '2025-12-28': { id: 'm2', summary: '연말 총회' },
  });

  const markedDates = Object.keys(meetings).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#9B7E5C' };
    return acc;
  }, {});

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: '#D8D0C8' };
  } else if (selectedDate && markedDates[selectedDate]) {
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: '#D8D0C8' };
  }

  const clubData = {
    id: clubId,
    name: '환경 보호 동아리',
    category: '봉사',
    location: '서울시 마포구',
    imageUrl: 'https://picsum.photos/seed/picsum/400/200',
    description:
      '우리 동네를 더 깨끗하고 아름다운 곳으로 만들기 위해 모인 동아리입니다. 매주 주말 한강 공원, 경의선 숲길 등에서 플로깅 활동을 진행하며, 환경 보호 캠페인도 함께 기획하고 있습니다. 환경에 관심 있는 분이라면 누구나 환영합니다!',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <Image source={{ uri: clubData.imageUrl }} style={styles.headerImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.clubName}>{clubData.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoChip}>🏷️ {clubData.category}</Text>
            <Text style={styles.infoChip}>📍 {clubData.location}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>동아리 소개</Text>
            <Text style={styles.description}>{clubData.description}</Text>
          </View>

          {/* 모임 일정 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>모임 일정</Text>
              <TouchableOpacity
                style={styles.createMeetingButton}
                onPress={() => navigation.navigate('CreateMeeting')}
              >
                <Text style={styles.createMeetingButtonText}>+ 모임 생성</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              current={'2025-12-15'}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={markedDates}
              theme={{
                arrowColor: '#9B7E5C',
                todayTextColor: '#9B7E5C',
                selectedDayBackgroundColor: '#D8D0C8',
                dotColor: '#9B7E5C',
              }}
            />
            {selectedDate && meetings[selectedDate] && (
              <TouchableOpacity
                style={styles.meetingInfo}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MeetingDetail', {
                  meetingId: meetings[selectedDate].id,
                  date: selectedDate,
                })}
              >
                <View>
                  <Text style={styles.meetingDate}>{selectedDate}</Text>
                  <Text style={styles.meetingSummary}>{meetings[selectedDate].summary}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.joinButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert('가입', '동아리에 가입 신청을 보냈습니다.')}
        >
          <Text style={styles.joinButtonText}>동아리 가입하기</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  infoChip: {
    backgroundColor: '#F5EDE4',
    color: '#9B7E5C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden', // for borderRadius to work on iOS
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444444',
  },
  createMeetingButton: {
    backgroundColor: '#F5EDE4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  createMeetingButtonText: {
    color: '#9B7E5C',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
  },
  meetingInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F5EDE4',
    borderRadius: 8,
  },
  meetingDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C4A3A',
  },
  meetingSummary: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  joinButton: {
    backgroundColor: '#9B7E5C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#9B7E5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#D8D0C8',
    shadowOpacity: 0,
    elevation: 0,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClubDetailScreen;
