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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';
// In a real app, you would use a library like react-native-image-picker
// import ImagePicker from 'react-native-image-picker';

type Props = RootStackScreenProps<'GalleryWrite'>;

const GalleryWriteScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleClose = () => {
    if (title || content || imageUri) {
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
    if (!imageUri) {
      Alert.alert('알림', '이미지를 선택해주세요.');
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
    // Placeholder for image selection logic
    // In a real app, you would launch the image picker here.
    // For now, we'll just set a placeholder image.
    setImageUri('https://via.placeholder.com/400/A67C52/FFFFFF?text=Selected+Image');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.headerButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>갤러리 글쓰기</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerSubmitText}>등록</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          placeholderTextColor={theme.colors.textLight}
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>+ 이미지 추가</Text>
          )}
        </TouchableOpacity>

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
  },
  titleInput: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  contentInput: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: 1.5,
    borderColor: theme.colors.borderColor,
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    color: theme.colors.textPrimary,
    minHeight: 200,
  },
});