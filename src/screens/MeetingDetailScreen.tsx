// src/screens/MeetingDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';

type Props = RootStackScreenProps<'MeetingDetail'>;

const MeetingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { meetingId, date } = route.params;

  // In a real app, you'd fetch this data based on the meetingId
  const meetingData = {
    id: meetingId,
    date: date,
    summary: '한강 플로깅',
    time: '오후 2:00',
    location: '한강공원 입구',
    description: '가벼운 옷차림으로 오셔서 함께 한강공원을 따라 걸으며 쓰레기를 줍는 플로깅 활동입니다. 필요한 모든 물품(장갑, 집게, 봉투)은 제공됩니다. 동아리 멤버들과 함께 환경도 지키고 건강도 챙기는 의미있는 시간을 보내요!',
    participants: ['김리더', '박부원', '이신입', '최회원', '정회원'],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>모임 상세</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{new Date(meetingData.date).getDate()}</Text>
          </View>
          <Text style={styles.meetingSummary}>{meetingData.summary}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>🗓️</Text>
              <Text style={styles.infoLabel}>날짜</Text>
              <Text style={styles.infoValue}>{meetingData.date}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoLabel}>시간</Text>
              <Text style={styles.infoValue}>{meetingData.time}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoLabel}>장소</Text>
              <Text style={styles.infoValue}>{meetingData.location}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>모임 설명</Text>
            <Text style={styles.description}>{meetingData.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>참석자 ({meetingData.participants.length}명)</Text>
            <View style={styles.participantList}>
              {meetingData.participants.map((name, index) => (
                <Text key={index} style={styles.participantName}>
                  {name}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.rsvpButton} activeOpacity={0.8}>
          <Text style={styles.rsvpButtonText}>참석하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: '#5C4A3A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  dateBadge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#9B7E5C',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dateBadgeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  meetingSummary: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBox: {
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  participantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantName: {
    backgroundColor: '#F5EDE4',
    color: '#9B7E5C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  rsvpButton: {
    backgroundColor: '#9B7E5C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MeetingDetailScreen;
