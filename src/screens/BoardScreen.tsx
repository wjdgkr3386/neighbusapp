// src/screens/BoardScreen.tsx
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

type Props = RootStackScreenProps<'Board'>;

const CATEGORIES = ['전체', '공지', '자유', '질문', '정보', '후기', '동아리', '기타'];

type Post = {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
};

const POSTS: Post[] = [
  {
    id: '1',
    category: '공지',
    title: '12월 동네 행사 안내',
    content: '이번 달 우리 동네에서 진행되는 다양한 행사를 소개합니다...',
    author: '관리자',
    date: '2시간 전',
    views: 124,
    comments: 8,
    likes: 15,
  },
  {
    id: '2',
    category: '후기',
    title: '한강 러닝크루 후기',
    content: '지난 주말 한강에서 진행한 러닝 모임 너무 좋았어요!',
    author: '러닝매니아',
    date: '5시간 전',
    views: 89,
    comments: 12,
    likes: 23,
  },
  {
    id: '3',
    category: '질문',
    title: '마포구 맛집 추천 부탁드려요',
    content: '이번 주말에 친구들과 만날 곳을 찾고 있는데 추천해주실 수 있나요?',
    author: '맛집탐험가',
    date: '1일 전',
    views: 156,
    comments: 24,
    likes: 18,
  },
  {
    id: '4',
    category: '동아리',
    title: '환경 동아리 신규 회원 모집합니다',
    content: '함께 동네를 깨끗하게 만들어갈 분들을 찾습니다!',
    author: '환경지킴이',
    date: '2일 전',
    views: 234,
    comments: 31,
    likes: 42,
  },
];

const BoardScreen: React.FC<Props> = ({ navigation }) => {
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

  const handleWritePost = () => {
    navigation.navigate('BoardWrite');
  };

  const handlePostClick = (post: Post) => {
    navigation.navigate('BoardDetail', { postId: post.id });
  };

  const filteredPosts = selectedCategory === '전체'
    ? POSTS
    : POSTS.filter(post => post.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper} {...panResponder.panHandlers}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>게시판</Text>
          <Text style={styles.subtitle}>우리 동네 이야기를 나눠요</Text>
        </View>

        {/* 카테고리 및 작성 버튼 */}
        <View style={styles.actionRow}>
          {/* 카테고리 선택 */}
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryText}>{selectedCategory}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* 글쓰기 버튼 */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleWritePost}
            activeOpacity={0.8}
          >
            <Text style={styles.createIcon}>✏️</Text>
            <Text style={styles.createText}>글쓰기</Text>
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
                placeholder="제목, 내용 검색..."
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

        {/* 게시글 목록 */}
        <View style={styles.postListSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최신 게시글</Text>
            <Text style={styles.postCount}>{filteredPosts.length}개</Text>
          </View>

          {filteredPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => handlePostClick(post)}
              activeOpacity={0.7}
            >
              <View style={styles.postHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{post.category}</Text>
                </View>
                <Text style={styles.postDate}>{post.date}</Text>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent} numberOfLines={2}>
                {post.content}
              </Text>

              <View style={styles.postFooter}>
                <View style={styles.postAuthor}>
                  <Text style={styles.authorIcon}>👤</Text>
                  <Text style={styles.authorName}>{post.author}</Text>
                </View>
                <View style={styles.postStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>👁️</Text>
                    <Text style={styles.statText}>{post.views}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>💬</Text>
                    <Text style={styles.statText}>{post.comments}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>❤️</Text>
                    <Text style={styles.statText}>{post.likes}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>게시판</Text>
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

export default BoardScreen;

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
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  categoryButton: {
    flex: 1,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9B7E5C',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#9B7E5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  createText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  postListSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  postCount: {
    fontSize: 14,
    color: '#8B7355',
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F5EDE4',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9B7E5C',
  },
  postDate: {
    fontSize: 12,
    color: '#B8B8B8',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5C4A3A',
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 12,
  },
  statText: {
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
