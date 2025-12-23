// src/screens/FreeBoardScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';
import theme from '../styles/theme';
import { useUser } from '../context/UserContext';
import { BASE_URL } from '../config';

type Props = RootStackScreenProps<'FreeBoard'>;

type Post = {
  id: string;
  category: string;
  title: string;
  content: string; // API에서 내용을 주지 않으므로 제목으로 대체하거나 비워둠
  author: string;
  date: string;
  views: number;
  comments: number; // API 미제공
  likes: number;    // API 미제공
};

const FreeBoardScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useUser();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const keywordParam = searchQuery.trim() ? `?keyword=${encodeURIComponent(searchQuery.trim())}` : '';
      const url = `${BASE_URL}/api/mobile/freeboard/list${keywordParam}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.posts)) {
        const mappedPosts: Post[] = data.posts.map((item: any) => ({
          id: item.id.toString(),
          category: item.clubName || '자유',
          title: item.title,
          content: '', // 목록 API에서 내용 미제공
          author: item.writerNickname || '익명',
          date: item.createdAt ? item.createdAt.split('T')[0] : '', // YYYY-MM-DD
          views: item.viewCount || 0,
          comments: 0,
          likes: 0,
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Failed to fetch freeboard posts:', error);
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
              onSubmitEditing={fetchPosts}
              returnKeyType="search"
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textSecondary }}>게시글이 없습니다.</Text>
              </View>
            }
          />
        )}
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
