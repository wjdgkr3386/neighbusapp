// src/screens/GalleryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  PanResponder,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'Gallery'>;

type Post = {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
};

const POSTS: Post[] = [
  {
    id: '1',
    category: '갤러리',
    title: '우리 동네 풍경',
    author: '사진작가',
    date: '1일 전',
    imageUrl: 'https://via.placeholder.com/300/D2B48C/FFFFFF?text=Neighbus',
  },
  {
    id: '2',
    category: '갤러리',
    title: '귀여운 강아지',
    author: '멍멍이주인',
    date: '2일 전',
    imageUrl: 'https://via.placeholder.com/300/8B4513/FFFFFF?text=Neighbus',
  },
  {
    id: '3',
    category: '갤러리',
    title: '오늘의 점심',
    author: '맛잘알',
    date: '3일 전',
    imageUrl: 'https://via.placeholder.com/300/9B7E5C/FFFFFF?text=Neighbus',
  },
    {
    id: '4',
    category: '갤러리',
    title: '노을 사진',
    author: '하늘바라기',
    date: '4일 전',
    imageUrl: 'https://via.placeholder.com/300/5C4A3A/FFFFFF?text=Neighbus',
  },
];

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
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
    navigation.navigate('GalleryWrite');
  };

  const handlePostClick = (post: Post) => {
    navigation.navigate('GalleryDetail', { postId: post.id });
  };

  const filteredPosts = POSTS.filter(post => post.category === '갤러리');

  const renderGalleryItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => handlePostClick(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} />
      <View style={styles.galleryItemFooter}>
        <Text style={styles.galleryItemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.galleryItemAuthor}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper} {...panResponder.panHandlers}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>갤러리</Text>
          <Text style={styles.subtitle}>우리 동네 사진을 공유해요</Text>
        </View>

        {/* 글쓰기 버튼 */}
        <View style={styles.actionRow}>
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
                placeholder="제목, 작성자 검색..."
                placeholderTextColor={theme.colors.textLight}
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

        <FlatList
          data={filteredPosts}
          renderItem={renderGalleryItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.galleryList}
        />
      </View>

      {/* 하단 네비게이션 */}
      <BottomNavBar currentScreen="Gallery" />

      {/* 사이드 메뉴 */}
      <SideMenu
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
  },
  wrapper: {
    flex: 1,
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
    marginBottom: 24,
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
  galleryList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  galleryItem: {
    flex: 1,
    margin: 6,
    backgroundColor: theme.colors.cardBg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  galleryImage: {
    width: '100%',
    height: 150,
  },
  galleryItemFooter: {
    padding: 8,
  },
  galleryItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  galleryItemAuthor: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
});