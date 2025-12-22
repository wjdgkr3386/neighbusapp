// src/screens/GalleryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  PanResponder,
  ImageBackground,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Note: The original code assumed expo-linear-gradient, which is not a listed dependency.
// I will use a simple View with an RGBA background as a fallback for the gradient effect.
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import BottomNavBar from '../components/BottomNavBar';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'Gallery'>;

type Post = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  height: number; // For Masonry layout
};

const POSTS: Post[] = [
  { id: '1', title: '우리 동네 풍경', author: '사진작가', imageUrl: 'https://images.unsplash.com/photo-1528493366314-e264e78b4BFd?q=80&w=800', height: 250 },
  { id: '2', title: '귀여운 강아지', author: '멍멍이주인', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800', height: 300 },
  { id: '3', title: '오늘의 점심', author: '맛잘알', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', height: 300 },
  { id: '4', title: '노을 사진', author: '하늘바라기', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800', height: 250 },
  { id: '5', title: '골목길 고양이', author: '집사', imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800', height: 250 },
  { id: '6', title: '새로 생긴 카페', author: '커피러버', imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800', height: 300 },
];

const GalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('최신순');
  const [showSideMenu, setShowSideMenu] = useState(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 30) setShowSideMenu(true);
      },
    })
  ).current;

  const handleWritePost = () => navigation.navigate('GalleryWrite');
  const handlePostClick = (post: Post) => navigation.navigate('GalleryDetail', { postId: post.id });
  const handleSortPress = () => {
    // In a real app, this would open a dropdown/modal to change the sort order
    console.log('Sort button pressed. Current order:', sortOrder);
  };

  const renderGalleryItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={[styles.galleryItem, { height: item.height }]}
      onPress={() => handlePostClick(item)}
      activeOpacity={0.9}
    >
      <ImageBackground source={{ uri: item.imageUrl }} style={styles.imageBackground}>
        <View style={styles.textOverlay}>
          <Text style={styles.galleryItemTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.galleryItemAuthor}>{item.author}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>갤러리</Text>
      </View>

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
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
        <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
          <Text style={styles.sortButtonText}>{sortOrder}</Text>
          <Text style={styles.sortButtonIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={POSTS}
        renderItem={renderGalleryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.galleryList}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavBar currentScreen="Gallery" />

<SideMenu visible={showSideMenu} onClose={() => setShowSideMenu(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
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
  galleryList: {
    padding: 8,
    paddingBottom: 100,
  },
  galleryItem: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
      android: { elevation: 5 },
    }),
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  galleryItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  galleryItemAuthor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
});