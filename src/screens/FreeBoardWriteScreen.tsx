import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';
import { useUser } from '../context/UserContext';
import { BASE_URL } from '../config';

type Props = RootStackScreenProps<'FreeBoardWrite'>;

type Club = {
  id: number;
  clubName: string;
};

const FreeBoardWriteScreen: React.FC<Props> = ({ navigation }) => {
  const { token } = useUser();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedClubName, setSelectedClubName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showClubModal, setShowClubModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 내 동아리 목록 가져오기
  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mobile/club/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
           // 데이터 구조에 따라 수정 필요 (예: data.clubList 등)
           // 여기서는 data.data가 Club 리스트라고 가정하거나, data.clubList 확인
           setClubs(data.data);
        } else if (data.clubList) {
            setClubs(data.clubList);
        }
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
      }
    };
    fetchMyClubs();
  }, [token]);

  const handleClose = () => {
    if (title || content) {
      Alert.alert(
        '작성 취소',
        '작성중인 내용이 있습니다. 정말 취소하시겠습니까?',
        [
          { text: '계속 작성', style: 'cancel' },
          { text: '취소', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!selectedClubId) {
      Alert.alert('알림', '동아리를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/mobile/freeboard/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clubId: selectedClubId,
          title: title,
          content: content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('알림', '게시글이 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('등록 실패', data.message || '게시글 등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Write post error:', error);
      Alert.alert('오류', '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 작성</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.headerSubmitText}>등록</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 상단 입력 그룹 */}
        <View style={styles.topSection}>
          {/* 동아리 선택 */}
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowClubModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryButtonText, !selectedClubId && styles.placeholder]}>
              {selectedClubName || '동아리 선택'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* 제목 입력 */}
          <TextInput
            style={styles.titleInput}
            placeholder="제목"
            placeholderTextColor={theme.colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 내용 입력 */}
        <TextInput
          style={styles.contentInput}
          placeholder="내용을 입력해주세요."
          placeholderTextColor={theme.colors.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* 동아리 선택 모달 */}
      <Modal
        visible={showClubModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClubModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClubModal(false)}
        >
          <View style={styles.categoryModalContainer}>
            <Text style={styles.categoryModalTitle}>동아리 선택</Text>
            {clubs.length > 0 ? (
              clubs.map((club) => (
                <TouchableOpacity
                  key={club.id}
                  style={[
                    styles.categoryOption,
                    selectedClubId === club.id && styles.categoryOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedClubId(club.id);
                    setSelectedClubName(club.clubName);
                    setShowClubModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedClubId === club.id && styles.categoryOptionTextActive,
                    ]}
                  >
                    {club.clubName}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textSecondary }}>가입한 동아리가 없습니다.</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default FreeBoardWriteScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
    backgroundColor: theme.colors.bodyBg,
  },
  headerButtonText: {
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  headerSubmitText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 24,
  },
  topSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flex: 1,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  placeholder: {
    color: theme.colors.textLight,
  },
  dropdownIcon: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  titleInput: {
    flex: 2,
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  toolbar: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  toolRowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  toolRowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarDivider: {
    height: 1,
    backgroundColor: theme.colors.borderColor,
    marginVertical: 12,
  },
  toolSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  toolButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  toolButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    justifyContent: 'center',
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  toolButtonActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  toolText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  toolDropdown: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  toolTextBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  toolTextItalic: {
    fontSize: 15,
    fontStyle: 'italic',
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  toolTextUnderline: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  toolTextStrike: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  toolLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  toolTextActive: {
    color: theme.colors.primary,
  },
  alignButtonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  alignButton: {
    padding: 12,
    backgroundColor: theme.colors.bodyBg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    borderWidth: 1,
    borderColor: theme.colors.borderColor,
  },
  alignButtonActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  alignIcon: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  contentInput: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    color: theme.colors.textPrimary,
    minHeight: 400,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalContainer: {
    width: '80%',
    backgroundColor: theme.colors.cardBg,
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
    color: theme.colors.textPrimary,
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
    backgroundColor: theme.colors.bodyBg,
  },
  categoryOptionText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  categoryOptionTextActive: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
});