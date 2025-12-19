// src/screens/FreeBoardWriteScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'FreeBoardWrite'>;

const CATEGORIES = ['자유', '질문', '정보', '후기'];

const FONT_FAMILIES = ['기본서체', '고딕', '명조', '궁서'];
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32'];

const FreeBoardWriteScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFontFamilyModal, setShowFontFamilyModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [selectedFontFamily, setSelectedFontFamily] = useState('기본서체');
  const [selectedFontSize, setSelectedFontSize] = useState('18');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const handleClose = () => {
    if (title || content) {
      Alert.alert(
        '작성 취소',
        '작성중인 내용이 있습니다. 정말 취소하시겠습니까?',
        [
          { text: '계속 작성', style: 'cancel' },
          {
            text: '취소',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleSave = () => {
    if (!selectedCategory) {
      Alert.alert('알림', '카테고리 선택을 해주세요.');
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

    Alert.alert('알림', '게시글이 등록되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const getTextStyle = () => {
    const style: any = {
      fontSize: parseInt(selectedFontSize),
      textAlign: textAlign,
    };

    if (isBold) {
      style.fontWeight = 'bold';
    }
    if (isItalic) {
      style.fontStyle = 'italic';
    }
    if (isUnderline && isStrikethrough) {
      style.textDecorationLine = 'underline line-through';
    } else if (isUnderline) {
      style.textDecorationLine = 'underline';
    } else if (isStrikethrough) {
      style.textDecorationLine = 'line-through';
    }

    return style;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>자유게시판 글쓰기</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerSubmitText}>등록</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 카테고리 선택 및 제목 */}
        <View style={styles.topSection}>
          {/* 동아리 선택 */}
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryButtonText, !selectedCategory && styles.placeholder]}>
              {selectedCategory || '카테고리 선택'}
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

        {/* 텍스트 편집 도구바 */}
        <View style={styles.toolbar}>
          {/* 첫 번째 줄: 이미지, 폰트 선택 */}
          <View style={styles.toolRowSpaced}>
            <TouchableOpacity
              style={styles.toolButtonLarge}
              onPress={() => setShowFontFamilyModal(true)}
            >
              <Text style={styles.toolText}>{selectedFontFamily}</Text>
              <Text style={styles.toolDropdown}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolButtonLarge}
              onPress={() => setShowFontSizeModal(true)}
            >
              <Text style={styles.toolText}>{selectedFontSize}</Text>
              <Text style={styles.toolDropdown}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolbarDivider} />

          {/* 두 번째 줄: 텍스트 스타일 */}
          <View style={styles.toolRowSpaced}>
            <TouchableOpacity
              style={[styles.toolButtonStyle, isBold && styles.toolButtonActive]}
              onPress={() => setIsBold(!isBold)}
            >
              <Text style={[styles.toolTextBold, isBold && styles.toolTextActive]}>B</Text>
              <Text style={styles.toolLabel}>굵게</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolButtonStyle, isItalic && styles.toolButtonActive]}
              onPress={() => setIsItalic(!isItalic)}
            >
              <Text style={[styles.toolTextItalic, isItalic && styles.toolTextActive]}>I</Text>
              <Text style={styles.toolLabel}>기울임</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolButtonStyle, isUnderline && styles.toolButtonActive]}
              onPress={() => setIsUnderline(!isUnderline)}
            >
              <Text style={[styles.toolTextUnderline, isUnderline && styles.toolTextActive]}>U</Text>
              <Text style={styles.toolLabel}>밑줄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolButtonStyle, isStrikethrough && styles.toolButtonActive]}
              onPress={() => setIsStrikethrough(!isStrikethrough)}
            >
              <Text style={[styles.toolTextStrike, isStrikethrough && styles.toolTextActive]}>S</Text>
              <Text style={styles.toolLabel}>취소선</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolbarDivider} />

          {/* 세 번째 줄: 정렬 */}
          <View style={styles.toolRowAlign}>
            <Text style={styles.toolSectionLabel}>정렬</Text>
            <View style={styles.alignButtonGroup}>
              <TouchableOpacity
                style={[styles.alignButton, textAlign === 'left' && styles.alignButtonActive]}
                onPress={() => setTextAlign('left')}
              >
                <Text style={styles.alignIcon}>☰</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alignButton, textAlign === 'center' && styles.alignButtonActive]}
                onPress={() => setTextAlign('center')}
              >
                <Text style={styles.alignIcon}>≡</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alignButton, textAlign === 'right' && styles.alignButtonActive]}
                onPress={() => setTextAlign('right')}
              >
                <Text style={styles.alignIcon}>☰</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 내용 입력 */}
        <TextInput
          style={[styles.contentInput, getTextStyle()]}
          placeholder="내용을 입력해주세요."
          placeholderTextColor={theme.colors.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

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

      {/* 폰트 패밀리 선택 모달 */}
      <Modal
        visible={showFontFamilyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFontFamilyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFontFamilyModal(false)}
        >
          <View style={styles.categoryModalContainer}>
            <Text style={styles.categoryModalTitle}>서체 선택</Text>
            {FONT_FAMILIES.map((font) => (
              <TouchableOpacity
                key={font}
                style={[
                  styles.categoryOption,
                  selectedFontFamily === font && styles.categoryOptionActive,
                ]}
                onPress={() => {
                  setSelectedFontFamily(font);
                  setShowFontFamilyModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    selectedFontFamily === font && styles.categoryOptionTextActive,
                  ]}
                >
                  {font}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 폰트 사이즈 선택 모달 */}
      <Modal
        visible={showFontSizeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFontSizeModal(false)}
        >
          <View style={styles.categoryModalContainer}>
            <Text style={styles.categoryModalTitle}>글꼴 크기 선택</Text>
            {FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.categoryOption,
                  selectedFontSize === size && styles.categoryOptionActive,
                ]}
                onPress={() => {
                  setSelectedFontSize(size);
                  setShowFontSizeModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    selectedFontSize === size && styles.categoryOptionTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
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