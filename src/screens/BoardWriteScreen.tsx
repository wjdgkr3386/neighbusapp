// src/screens/BoardWriteScreen.tsx
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
  Alert,
} from 'react-native';
import type { RootStackScreenProps } from '../../App';

type Props = RootStackScreenProps<'BoardWrite'>;

const CATEGORIES = ['공지', '자유', '질문', '정보', '후기', '동아리', '기타'];

const FONT_FAMILIES = ['기본서체', '고딕', '명조', '궁서'];
const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32'];

const BoardWriteScreen: React.FC<Props> = ({ navigation }) => {
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
      Alert.alert('알림', '동아리 선택을 해주세요.');
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
              {selectedCategory || '동아리 선택'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* 제목 입력 */}
          <TextInput
            style={styles.titleInput}
            placeholder="제목"
            placeholderTextColor="#B8B8B8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 텍스트 편집 도구바 */}
        <View style={styles.toolbar}>
          {/* 첫 번째 줄: 이미지, 폰트 선택 */}
          <View style={styles.toolRowSpaced}>
            <TouchableOpacity style={styles.toolButtonLarge} disabled>
              <Text style={styles.toolIcon}>🖼️</Text>
              <Text style={styles.toolText}>이미지</Text>
            </TouchableOpacity>
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
          placeholderTextColor="#B8B8B8"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose} activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.submitButtonText}>저장</Text>
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

export default BoardWriteScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flex: 1,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5C4A3A',
  },
  placeholder: {
    color: '#B8B8B8',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#8B7355',
  },
  titleInput: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
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
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  toolSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  toolButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  toolButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  toolButtonActive: {
    backgroundColor: '#F5EDE4',
    borderColor: '#9B7E5C',
  },
  toolIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  toolText: {
    fontSize: 13,
    color: '#5C4A3A',
  },
  toolDropdown: {
    fontSize: 10,
    color: '#8B7355',
    marginLeft: 4,
  },
  toolTextBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5C4A3A',
    marginRight: 4,
  },
  toolTextItalic: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#5C4A3A',
    marginRight: 4,
  },
  toolTextUnderline: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: '#5C4A3A',
    marginRight: 4,
  },
  toolTextStrike: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: '#5C4A3A',
    marginRight: 4,
  },
  toolLabel: {
    fontSize: 11,
    color: '#8B7355',
  },
  toolTextActive: {
    color: '#9B7E5C',
  },
  alignButtonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  alignButton: {
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  alignButtonActive: {
    backgroundColor: '#F5EDE4',
    borderColor: '#9B7E5C',
  },
  alignIcon: {
    fontSize: 16,
    color: '#5C4A3A',
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    color: '#333333',
    minHeight: 400,
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B7355',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#7FA67E',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
