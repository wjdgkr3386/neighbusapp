// src/screens/MyPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  PanResponder,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';

type Props = RootStackScreenProps<'MyPage'>;

// Dummy data for "My Meetings"
const MY_MEETINGS = [
  { id: 'm1', title: '정기 독서 토론', clubName: '함께 책 읽기', date: '2025.12.25' },
  { id: 'm2', title: '야간 러닝 (5km)', clubName: '한강 야간 러닝크루', date: '2025.12.27' },
  { id: 'm3', title: '크리스마스 케이크 만들기', clubName: '주말 베이킹', date: '2025.12.24' },
];


const MyPage: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const hintAnimation = useRef(new Animated.Value(-50)).current;

  // Side menu hint animation
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(hintAnimation, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(hintAnimation, {
        toValue: -50,
        duration: 500,
        delay: 1500,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
  }, [hintAnimation]);

  // 스와이프 제스처 감지
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Start detecting swipe after 10 pixels
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Open menu if swiped more than 30 pixels to the right
        if (gestureState.dx > 30) {
          setShowSideMenu(true);
        }
      },
    })
  ).current;

  const handleSettings = () => {
    console.log('설정 클릭');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.sideMenuHint, { transform: [{ translateX: hintAnimation }] }]}>
        <Text style={styles.hintArrow}>›</Text>
      </Animated.View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        {...panResponder.panHandlers}
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>프로필 이미지</Text>
            </View>
          </View>

          <Text style={styles.nickname}>{user?.name || '닉네임'} 님</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>서울시 마포구</Text>
          </View>
        </View>

        {/* 통계 섹션 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>가입 동아리</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>참여 예정 모임</Text>
            <Text style={styles.statValue}>2</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>작성 글</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
        </View>

        {/* 내 동아리 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionTitle}>내 동아리</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clubScroll}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.clubCard}>
                <View style={styles.clubImage}>
                  <Text style={styles.clubImageIcon}>✉️</Text>
                </View>
                <Text style={styles.clubName}>환경 동아리</Text>
                <Text style={styles.clubStatus}>(운영진)</Text>
              </View>
            ))}
            <View style={styles.clubCard}>
              <View style={styles.clubImage}>
                <Text style={styles.clubImageIcon}>✉️</Text>
              </View>
              <Text style={styles.clubName}>달밤 동아리</Text>
              <Text style={styles.clubStatus}>(멤버)</Text>
            </View>
            <View style={styles.clubCard}>
              <View style={styles.clubImage}>
                <Text style={styles.clubImageIcon}>✉️</Text>
              </View>
              <Text style={styles.clubName}>서수 동아리</Text>
              <Text style={styles.clubStatus}>(멤버)</Text>
            </View>
          </ScrollView>
        </View>

        {/* 내 모임 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>✅</Text>
            <Text style={styles.sectionTitle}>내 모임</Text>
          </View>
          {MY_MEETINGS.map(meeting => (
            <TouchableOpacity key={meeting.id} style={styles.myMeetingCard} activeOpacity={0.7}>
              <View style={styles.myMeetingInfo}>
                <Text style={styles.myMeetingClubName}>{meeting.clubName}</Text>
                <Text style={styles.myMeetingTitle}>{meeting.title}</Text>
              </View>
              <Text style={styles.myMeetingDate}>{meeting.date}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* 하단 네비게이션 */}
      <BottomNavBar currentScreen="MyPage" />

      {/* 사이드 메뉴 */}
      <SideMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  sideMenuHint: {
    position: 'absolute',
    left: 0,
    top: '45%',
    width: 50,
    height: 60,
    backgroundColor: 'rgba(155, 126, 92, 0.7)',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    paddingLeft: 5,
    zIndex: 10,
  },
  hintArrow: {
    fontSize: 30,
    color: 'white',
    fontWeight: '200',
  },
  container: {
    // flex: 1 is removed
  },
  contentContainer: {
    paddingBottom: 100, // Added padding for BottomNavBar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  settingsButton: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 24,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8DDD0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D8D0C8',
  },
  profileImageText: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: '#8B7355',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  clubScroll: {
    paddingHorizontal: 20,
  },
  clubCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  clubImage: {
    width: 100,
    height: 80,
    backgroundColor: '#F5EDE4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D8D0C8',
  },
  clubImageIcon: {
    fontSize: 30,
  },
  clubName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C4A3A',
    textAlign: 'center',
    marginBottom: 2,
  },
  clubStatus: {
    fontSize: 11,
    color: '#8B7355',
  },
  myMeetingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  myMeetingInfo: {
    flex: 1,
  },
  myMeetingClubName: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
  },
  myMeetingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  myMeetingDate: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A67C52',
  },
});