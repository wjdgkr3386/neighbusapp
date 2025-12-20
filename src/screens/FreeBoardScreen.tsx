// src/screens/FreeBoardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'FreeBoard'>;

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

const FreeBoardScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
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
    console.log('검색:', searchQuery);
    // 검색 로직 구현
  };

  const handleWritePost = () => {
    navigation.navigate('FreeBoardWrite');
  };

  const handlePostClick = (post: Post) => {
    navigation.navigate('FreeBoardDetail', { postId: post.id });
  };

  const filteredPosts = POSTS.filter(post => post.category !== '공지');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        {...panResponder.panHandlers}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>자유게시판</Text>
          <Text style={styles.subtitle}>우리 동네 이야기를 나눠요</Text>
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
      <BottomNavBar currentScreen="Freeboard" />

      {/* 사이드 메뉴 */}
      <SideMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        navigation={navigation}
      />

      {/* 글쓰기 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleWritePost}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FreeBoardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
  },
  scrollView: {
    // 이 스타일은 이제 특별한 것이 필요 없습니다.
  },
  contentContainer: {
    paddingBottom: 100, // 하단 네비게이션 바 높이만큼 여백 추가
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: theme.colors.primary,
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
    color: theme.colors.white,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
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
    color: theme.colors.textPrimary,
    paddingVertical: 14,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: theme.colors.primary,
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
    color: theme.colors.white,
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
    color: theme.colors.textPrimary,
  },
  postCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  postCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: theme.colors.bodyBg,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  postDate: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
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
    color: theme.colors.textPrimary,
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
    color: theme.colors.textLight,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 100, // 하단 네비게이션 바 위에 위치하도록 조정
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabIcon: {
    fontSize: 30,
    color: theme.colors.white,
    lineHeight: 30, // 아이콘 수직 정렬
  },
});
