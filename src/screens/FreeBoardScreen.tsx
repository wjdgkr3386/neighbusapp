// src/screens/FreeBoardScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
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
  { id: '1', category: '공지', title: '12월 동네 행사 안내', content: '이번 달 우리 동네에서 진행되는 다양한 행사를 소개합니다. 많은 참여 바랍니다. 특히 크리스마스 이벤트가...', author: '관리자', date: '2시간 전', views: 124, comments: 8, likes: 15 },
  { id: '2', category: '후기', title: '한강 러닝크루 후기', content: '지난 주말 한강에서 진행한 러닝 모임 너무 좋았어요! 날씨도 좋고 사람들도 좋고, 완벽한 주말이었습니다.', author: '러닝매니아', date: '5시간 전', views: 89, comments: 12, likes: 23 },
  { id: '3', category: '질문', title: '마포구 맛집 추천 부탁드려요', content: '이번 주말에 친구들과 만날 곳을 찾고 있는데, 조용하고 분위기 좋은 곳으로 추천해주실 수 있나요?', author: '맛집탐험가', date: '1일 전', views: 156, comments: 24, likes: 18 },
  { id: '4', category: '동아리', title: '환경 동아리 신규 회원 모집합니다', content: '함께 동네를 깨끗하게 만들어갈 분들을 찾습니다! 매주 토요일 오후에 모여서 활동합니다.', author: '환경지킴이', date: '2일 전', views: 234, comments: 31, likes: 42 },
];

const FreeBoardScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('최신순');
  const [showSideMenu, setShowSideMenu] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 30) setShowSideMenu(true);
      },
    })
  ).current;

  const handleWritePost = () => navigation.navigate('FreeBoardWrite');
  const handlePostClick = (post: Post) => navigation.navigate('FreeBoardDetail', { postId: post.id });
  const handleSortPress = () => console.log('Sort button pressed. Current order:', sortOrder);

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostClick(item)}
      activeOpacity={0.8}
    >
      <View style={styles.postCardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primaryLight }]}>
          <Text style={[styles.categoryBadgeText, { color: theme.colors.primary }]}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postSnippet} numberOfLines={2}>{item.content}</Text>
      <View style={styles.postCardFooter}>
        <Text style={styles.authorText}>{item.author} · {item.date}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>♥ {item.likes}</Text>
          <Text style={styles.statText}>💬 {item.comments}</Text>
          <Text style={styles.statText}>👁️ {item.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>자유게시판</Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="관심있는 글을 검색해보세요..."
              placeholderTextColor={theme.colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <Text style={styles.sortButtonText}>{sortOrder}</Text>
            <Text style={styles.sortButtonIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={POSTS}
          renderItem={renderPostItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <BottomNavBar currentScreen="Freeboard" />

      <SideMenu visible={showSideMenu} onClose={() => setShowSideMenu(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default FreeBoardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFF8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  searchIcon: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: theme.colors.textPrimary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  sortButtonIcon: {
    fontSize: 10,
    marginLeft: 6,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  postCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  postSnippet: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  postCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  separator: {
    height: 8,
    backgroundColor: '#FFF8F0',
  },
});
