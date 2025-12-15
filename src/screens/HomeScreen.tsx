// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Modal,
  PanResponder,
} from 'react-native';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';

type Props = RootStackScreenProps<'Home'>;

const CATEGORIES = ['전체', '운동', '문화예술', '요리', '독서', '여행', '봉사', '기타'];

const CLUBS = [
  {
    id: '1',
    name: '마포구 달리기 크루',
    category: '운동',
    description: '매주 주말 아침, 한강을 따라 함께 달려요! 초보자도 대환영입니다.',
    members: 24,
    location: '서울시 마포구',
    imageEmoji: '🏃‍♂️',
  },
  {
    id: '2',
    name: '동네 책방 탐방',
    category: '독서',
    description: '숨겨진 동네 책방을 찾아다니며 독서의 즐거움을 나눕니다.',
    members: 8,
    location: '서울시 서대문구',
    imageEmoji: '📚',
  },
  {
    id: '3',
    name: '유기견 봉사 모임',
    category: '봉사',
    description: '주말마다 유기견 보호소에 방문하여 아이들을 돌보고 산책시키는 봉사활동',
    members: 15,
    location: '서울시 용산구',
    imageEmoji: '🐶',
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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

  const handleSearch = () => {
    console.log('검색:', searchQuery, '카테고리:', selectedCategory);
    // 검색 로직 구현
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper} {...panResponder.panHandlers}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>동아리</Text>
          <Text style={styles.subtitle}>관심사로 함께하는 우리 동네 모임</Text>
        </View>

        {/* 카테고리 선택 */}
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={styles.categoryButtonFull}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryText}>{selectedCategory}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <Text style={styles.searchLabel}>검색어</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="동아리명, 활동 내용 검색..."
                placeholderTextColor="#B8B8B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonIcon}>🔍</Text>
              <Text style={styles.searchButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 동아리 목록 (예시) */}
        <View style={styles.clubListSection}>
          <Text style={styles.sectionTitle}>추천 동아리</Text>

          {CLUBS.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={styles.clubCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ClubDetail', { clubId: club.id })}
            >
              <View style={styles.clubImage}>
                <Text style={styles.clubImageText}>{club.imageEmoji}</Text>
              </View>
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubCategory}>🏷️ {club.category}</Text>
                <Text style={styles.clubDescription} numberOfLines={2}>
                  {club.description}
                </Text>
                <View style={styles.clubFooter}>
                  <Text style={styles.clubMembers}>👥 {club.members}명</Text>
                  <Text style={styles.clubLocation}>📍 {club.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Board')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>게시판</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>채팅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyPage')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>마이</Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 선택 모달 */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.categoryModalContainer}>
            <Text style={styles.categoryModalTitle}>카테고리 선택</Text>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  selectedCategory === category && styles.categoryOptionActive,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    selectedCategory === category && styles.categoryOptionTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
  },
  categoryRow: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  categoryButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5C4A3A',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#8B7355',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 14,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9B7E5C',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#9B7E5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clubListSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 16,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clubImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F5EDE4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clubImageText: {
    fontSize: 32,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 4,
  },
  clubCategory: {
    fontSize: 12,
    color: '#9B7E5C',
    marginBottom: 6,
  },
  clubDescription: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 8,
  },
  clubFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  clubMembers: {
    fontSize: 12,
    color: '#B8B8B8',
  },
  clubLocation: {
    fontSize: 12,
    color: '#B8B8B8',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // 활성 상태
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#8B7355',
  },
  navLabelActive: {
    color: '#5C4A3A',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryOptionActive: {
    backgroundColor: '#F5EDE4',
  },
  categoryOptionText: {
    fontSize: 15,
    color: '#5C4A3A',
    textAlign: 'center',
  },
  categoryOptionTextActive: {
    fontWeight: '600',
    color: '#9B7E5C',
  },
});
