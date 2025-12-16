// src/screens/MyPage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import { useUser } from '../context/UserContext';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';

type Props = RootStackScreenProps<'MyPage'>;

const MyPage: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [showSideMenu, setShowSideMenu] = useState(false);

  // 스와이프 제스처 감지
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          setShowSideMenu(true);
        }
      },
    })
  ).current;

  const handleSettings = () => {
    console.log('설정 클릭');
  };

  const handleEditProfile = () => {
    console.log('프로필 수정');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper} {...panResponder.panHandlers}>
        {/* 헤더 */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editProfileText}>프로필 수정</Text>
          </TouchableOpacity>
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

        {/* 다가오는 모임 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📅</Text>
            <Text style={styles.sectionTitle}>다가오는 모임</Text>
          </View>

          <View style={styles.meetingCard}>
            <Text style={styles.meetingNumber}>1.</Text>
            <Text style={styles.meetingTitle}>[러닝크루] 한강 10km 달리기 / 12.10 (일) 19:00</Text>
          </View>
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
      </View>
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  wrapper: {
    flex: 1,
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
  container: {
    flex: 1,
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
  editProfileButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#9B7E5C',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B7E5C',
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
  meetingCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  meetingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
    marginRight: 8,
  },
  meetingTitle: {
    flex: 1,
    fontSize: 13,
    color: '#5C4A3A',
  },
});
