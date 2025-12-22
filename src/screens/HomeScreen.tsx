import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import { BASE_URL } from '../config';
import BottomNavBar from '../components/BottomNavBar';
import SideMenu from '../components/SideMenu';
import { useUser } from '../context/UserContext';

type Props = RootStackScreenProps<'Home'>;

type Club = {
  id: string;
  clubName: string;
  provinceName: string;
  clubImg: string;
  clubDescription: string;
  memberCount: number;
  maxMembers: number;
};

const CLUBS: Club[] = [
  { id: '1', clubName: '우리 동네 사진 동아리', provinceName: '서울 마포구', clubImg: 'https://images.unsplash.com/photo-1528493366314-e264e78b4BFd?q=80&w=800', clubDescription: '매주 주말, 동네의 아름다운 순간을 사진으로 담습니다. 초보자도 환영해요!', memberCount: 12, maxMembers: 20 },
  { id: '2', clubName: '한강 야간 러닝크루', provinceName: '서울 영등포구', clubImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800', clubDescription: '퇴근 후 함께 한강을 달리며 스트레스를 풀어요. 함께 건강해져요.', memberCount: 25, maxMembers: 50 },
  { id: '3', clubName: '주말 카페 탐방', provinceName: '서울 서대문구', clubImg: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800', clubDescription: '이 동네, 저 동네의 숨겨진 예쁜 카페를 찾아다니는 모임입니다.', memberCount: 8, maxMembers: 15 },
  { id: '4', clubName: '함께 책 읽기', provinceName: '서울 종로구', clubImg: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800', clubDescription: '한 달에 한 권, 좋은 책을 읽고 생각을 나누는 시간을 갖습니다.', memberCount: 18, maxMembers: 25 },
];

const ClubListScreen: React.FC<Props> = ({ navigation }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const { token } = useUser();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 30) {
          setShowSideMenu(true);
        }
      },
    })
  ).current;

  const fetchClubs = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/mobile/club/getClubs?category=0&keyword=`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClubs(CLUBS);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const renderItem = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.clubImg || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800' }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.clubName}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.clubDescription}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataIcon}>📍</Text>
            <Text style={styles.metadataText}>{item.provinceName}</Text>
          </View>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataIcon}>👥</Text>
            <Text style={styles.metadataText}>{item.memberCount}/{item.maxMembers}명</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>동아리</Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="관심있는 동아리를 검색해보세요..."
              placeholderTextColor="#8D6E63"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={fetchClubs}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#A67C52" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={clubs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>표시할 동아리가 없습니다.</Text>
              </View>
            }
          />
        )}
      </View>
      
      <BottomNavBar currentScreen="Home" />

      <SideMenu 
        visible={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5D4037',
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D7C3',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8D7C3',
  },
  searchIcon: {
    fontSize: 18,
    color: '#A1887F',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    color: '#5D4037',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  clubCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  cardImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#8D6E63',
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 10,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metadataIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  metadataText: {
    fontSize: 12,
    color: '#A1887F',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#A1887F',
  },
});

export default ClubListScreen;