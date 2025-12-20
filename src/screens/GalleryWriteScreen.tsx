// src/screens/GalleryWriteScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';
// In a real app, you would use a library like react-native-image-picker
// import ImagePicker from 'react-native-image-picker';

type Props = RootStackScreenProps<'GalleryWrite'>;

const TITLE_MAX_LENGTH = 50;
const CONTENT_MAX_LENGTH = 1000;
const MAX_IMAGES = 6;

const GalleryWriteScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleClose = () => {
    if (title || content || images.length > 0) {
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
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (images.length === 0) {
      Alert.alert('알림', '최소 1장 이상의 이미지를 선택해주세요.');
      return;
    }

    Alert.alert('알림', '게시글이 등록되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleSelectImage = () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('알림', `이미지는 최대 ${MAX_IMAGES}장까지 추가할 수 있습니다.`);
      return;
    }
    // Placeholder for image selection logic
    // In a real app, you would launch the image picker here.
    // For now, we'll just add placeholder images.
    const newImage = `https://via.placeholder.com/400/A67C52/FFFFFF?text=Image+${images.length + 1}`;
    setImages([...images, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert(
      '이미지 삭제',
      '선택한 이미지를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
          },
        },
      ]
    );
  };

  const handleTitleChange = (text: string) => {
    if (text.length <= TITLE_MAX_LENGTH) {
      setTitle(text);
    }
  };

  const handleContentChange = (text: string) => {
    if (text.length <= CONTENT_MAX_LENGTH) {
      setContent(text);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>갤러리 글쓰기</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 제목 입력 영역 */}
        <View style={styles.sectionCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>제목</Text>
            <Text style={styles.charCount}>
              {title.length}/{TITLE_MAX_LENGTH}
            </Text>
          </View>
          <TextInput
            style={styles.titleInput}
            placeholder="갤러리 게시글 제목을 입력해주세요"
            placeholderTextColor={theme.colors.textLight}
            value={title}
            onChangeText={handleTitleChange}
            maxLength={TITLE_MAX_LENGTH}
          />
        </View>

        {/* 이미지 추가 영역 */}
        <View style={styles.sectionCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>사진</Text>
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCount}>
                {images.length}/{MAX_IMAGES}
              </Text>
            </View>
          </View>

          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.imageDeleteButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
                <View style={styles.imageIndexBadge}>
                  <Text style={styles.imageIndexText}>{index + 1}</Text>
                </View>
              </View>
            ))}

            {images.length < MAX_IMAGES && (
              <TouchableOpacity
                style={styles.imageAddButton}
                onPress={handleSelectImage}
              >
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.imageAddText}>사진 추가</Text>
              </TouchableOpacity>
            )}
          </View>

          {images.length === 0 && (
            <View style={styles.hintBox}>
              <Text style={styles.imageHint}>
                최소 1장 이상의 사진을 추가해주세요
              </Text>
            </View>
          )}
        </View>

        {/* 내용 입력 영역 */}
        <View style={styles.sectionCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>내용</Text>
            <Text style={styles.charCount}>
              {content.length}/{CONTENT_MAX_LENGTH}
            </Text>
          </View>
          <TextInput
            style={styles.contentInput}
            placeholder="이미지에 대한 설명이나 이야기를 자유롭게 작성해주세요 :)"
            placeholderTextColor={theme.colors.textLight}
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
            maxLength={CONTENT_MAX_LENGTH}
          />
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>등록</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GalleryWriteScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  // Section Card Styles
  sectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(166, 124, 82, 0.1)',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },

  // Title Input Styles
  titleInput: {
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },

  // Image Grid Styles
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 아이템 간 간격을 자동으로 조절
  },
  imageContainer: {
    width: '32%', // 3개씩 배치하기 위한 너비
    aspectRatio: 1, // 정사각형 비율 유지
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.colors.bodyBg,
    position: 'relative',
    borderWidth: 2,
    borderColor: theme.colors.borderColor,
    marginBottom: 10, // 아이템 간의 수직 간격
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageDeleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  deleteIcon: {
    fontSize: 14,
    color: theme.colors.danger,
    fontWeight: '700',
  },
  imageIndexBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(166, 124, 82, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  imageIndexText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  imageAddButton: {
    width: '32%', // 3개씩 배치하기 위한 너비
    aspectRatio: 1, // 정사각형 비율 유지
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // 아이템 간의 수직 간격
  },
  cameraIcon: {
    fontSize: 30,
  },
  imageAddText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 8,
  },
  imageCountBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCount: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '700',
  },
  hintBox: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  imageHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },

  // Content Input Styles
  contentInput: {
    backgroundColor: theme.colors.bodyBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: theme.colors.textPrimary,
    minHeight: 120,
    lineHeight: 23,
    fontWeight: '500',
  },

  // Bottom Button Container
  bottomButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.borderColor,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: -0.3,
  },
});