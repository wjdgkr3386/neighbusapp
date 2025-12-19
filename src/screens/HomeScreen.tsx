import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BASE_URL } from '../config';
import BottomNavBar from '../components/BottomNavBar';
import { useUser } from '../context/UserContext';

const ClubListScreen = ({ navigation }: any) => {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('0');
  const [keyword, setKeyword] = useState('');
  const { token } = useUser();

  const fetchClubs = () => {
    setLoading(true);
    fetch(`${BASE_URL}/api/mobile/club/getClubs?category=${category}&keyword=${keyword}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.clubs && data.clubs.length > 0) {
          setClubs(data.clubs);
        } else {
          setClubs([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClubs();
  }, [category]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
    >
    <View style={styles.imageWrapper}>
      <Image
        source={{
          uri:
            item.clubImg ||
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
        }}
        style={styles.cardImage}
      />
    </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.clubName}
        </Text>

        <View style={styles.infoRow}>
          <Icon name="map-marker" size={14} color="#A67C52" />
          <Text style={styles.infoText}>{item.provinceName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-range" size={14} color="#A67C52" />
          <Text style={styles.infoText}>
            {item.createdAt?.substring(0, 10)}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerLabel}>참여하기</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>동아리</Text>
          <Text style={styles.pageSubtitle}>
            관심사로 함께하는 우리 동네 모임
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('ClubCreate')}
        >
          <Icon name="pencil-box-outline" size={20} color="#FFF" />
          <Text style={styles.createBtnText}>동아리 생성</Text>
        </TouchableOpacity>

        <View style={styles.filterBox}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <Icon name="magnify" size={20} color="#A1887F" />
              <TextInput
                style={styles.searchInput}
                placeholder="동아리명, 활동 내용 검색..."
                value={keyword}
                onChangeText={setKeyword}
                onSubmitEditing={fetchClubs}
              />
            </View>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={fetchClubs}
            >
              <Text style={styles.searchBtnText}>검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#A67C52"
            style={{ flex: 1 }}
          />
        ) : (
          <FlatList
            data={clubs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyView}>
                <Icon
                  name="folder-open-outline"
                  size={50}
                  color="#CCC"
                />
                <Text style={styles.emptyText}>
                  표시할 동아리가 없습니다.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <BottomNavBar currentScreen="Home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1, paddingHorizontal: 15 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 15 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: '#5D4037' },
  pageSubtitle: { fontSize: 14, color: '#8D6E63', fontWeight: '500' },

  createBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#A67C52',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  createBtnText: { color: '#FFF', fontWeight: '600', marginLeft: 5 },

  filterBox: {
    backgroundColor: '#FFFBF7',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8D7C3',
    marginBottom: 15,
  },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8D7C3',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 14, marginLeft: 5 },
  searchBtn: {
    backgroundColor: '#A67C52',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  searchBtnText: { color: '#FFF', fontWeight: '700' },

  listContent: { paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  clubCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  imageWrapper: { height: 120 },
  cardImage: { width: '100%', height: '100%' },
  
  cardBody: { padding: 10 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  infoText: { fontSize: 11, color: '#8D6E63' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#EEE',
  },
  footerLabel: { fontSize: 12, color: '#A1887F' },

  emptyView: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#A1887F' },
});

export default ClubListScreen;
