// src/screens/FreeBoardDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../App';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'FreeBoardDetail'>;

const FreeBoardDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { postId } = route.params;

  // In a real app, you'd fetch post data and comments based on postId
  const postData = {
    id: postId,
    category: '후기',
    title: '한강 러닝크루 후기',
    author: '러닝매니아',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    date: '5시간 전',
    content: `지난 주말 한강에서 진행한 러닝 모임 너무 좋았어요! 

날씨도 완벽했고, 처음 나오신 분들도 다들 잘 적응해서 즐겁게 달릴 수 있었습니다. 저희 동아리는 매주 토요일 아침 8시에 모여서 달리니, 관심 있는 분들은 언제든지 채팅 주세요!`,
    views: 89,
    likes: 23,
  };

  const [comments, setComments] = useState([
    { id: 'c1', author: '맛집탐험가', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', text: '오, 저도 다음엔 참여해보고 싶네요!', date: '4시간 전' },
    { id: 'c2', author: '환경지킴이', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', text: '멋진 활동이네요! 응원합니다.', date: '2시간 전' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: `c${Date.now()}`,
          author: '나',
          avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
          text: newComment,
          date: '방금 전',
        },
      ]);
      setNewComment('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>자유게시판</Text>
          <TouchableOpacity>
            <Text style={styles.headerButtonText}>︙</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.contentWrapper}>
            {/* Author Info */}
            <View style={styles.authorInfo}>
              <Image source={{ uri: postData.avatarUrl }} style={styles.authorAvatar} />
              <View>
                <Text style={styles.authorName}>{postData.author}</Text>
                <Text style={styles.postDate}>{postData.date} · 조회 {postData.views}</Text>
              </View>
            </View>

            {/* Title and Content */}
            <Text style={styles.postTitle}>{postData.title}</Text>
            <Text style={styles.postContent}>{postData.content}</Text>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionText}>좋아요 {postData.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>댓글 {comments.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔖</Text>
              <Text style={styles.actionText}>저장</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Image source={{ uri: comment.avatarUrl }} style={styles.commentAvatar} />
                <View style={styles.commentBody}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentDate}>{comment.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            placeholderTextColor={theme.colors.textLight}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
            <Text style={styles.sendButtonText}>등록</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColor,
  },
  headerButtonText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
  },
  contentWrapper: {
    padding: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: theme.colors.borderColor,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  postDate: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 20,
    lineHeight: 32,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.textSecondary,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
    backgroundColor: theme.colors.bodyBg,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  commentsSection: {
    paddingTop: 12,
    backgroundColor: theme.colors.cardBg,
  },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: theme.colors.borderColor,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  commentText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 22,
  },
  commentDate: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 6,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderColor,
    backgroundColor: theme.colors.cardBg,
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.colors.bodyBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sendButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default FreeBoardDetailScreen;