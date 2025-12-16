// src/screens/ChatScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import { useUser } from '../context/UserContext';
import BottomNavBar from '../components/BottomNavBar';

type Props = RootStackScreenProps<'Chat'>;

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
};

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: '환경 동아리',
    message: '다음주 한강 청소 활동 참여 가능하신 분?',
    time: '10:30',
    isMe: false,
  },
  {
    id: '2',
    sender: '나',
    message: '저 참여할게요!',
    time: '10:32',
    isMe: true,
  },
  {
    id: '3',
    sender: '환경 동아리',
    message: '좋아요! 오후 2시에 한강공원 입구에서 만나요',
    time: '10:33',
    isMe: false,
  },
  {
    id: '4',
    sender: '달밤 동아리',
    message: '이번주 금요일 야간 산책 어떠세요?',
    time: '어제',
    isMe: false,
  },
];

type ChatRoom = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
};

const CHAT_ROOMS: ChatRoom[] = [
  {
    id: '1',
    name: '환경 동아리',
    lastMessage: '좋아요! 오후 2시에 한강공원 입구에서 만나요',
    time: '10:33',
    unread: 0,
  },
  {
    id: '2',
    name: '달밤 동아리',
    lastMessage: '이번주 금요일 야간 산책 어떠세요?',
    time: '어제',
    unread: 2,
  },
  {
    id: '3',
    name: '러닝크루',
    lastMessage: '내일 한강 10km 달리기 준비됐나요?',
    time: '2일 전',
    unread: 0,
  },
];

type Friend = {
  id: string;
  uuid: string;
  name: string;
  location: string;
  status: string;
};

type FriendRequest = {
  id: string;
  uuid: string;
  name: string;
  location: string;
  status: string;
};

const FRIENDS: Friend[] = [
  {
    id: 'f1',
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    name: '김민수',
    location: '서울시 마포구',
    status: '안녕하세요!',
  },
  {
    id: 'f2',
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    name: '이지은',
    location: '서울시 강남구',
    status: '오늘도 화이팅!',
  },
  {
    id: 'f3',
    uuid: '550e8400-e29b-41d4-a716-446655440003',
    name: '박준호',
    location: '서울시 송파구',
    status: '러닝 좋아요',
  },
  {
    id: 'f4',
    uuid: '550e8400-e29b-41d4-a716-446655440004',
    name: '최서연',
    location: '서울시 마포구',
    status: '환경보호 실천중',
  },
  {
    id: 'f5',
    uuid: '550e8400-e29b-41d4-a716-446655440005',
    name: '정대현',
    location: '서울시 용산구',
    status: '동네 친구 환영합니다',
  },
];

const FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'r1',
    uuid: '550e8400-e29b-41d4-a716-446655440006',
    name: '한소희',
    location: '서울시 성동구',
    status: '같이 운동해요!',
  },
  {
    id: 'r2',
    uuid: '550e8400-e29b-41d4-a716-446655440007',
    name: '오상민',
    location: '서울시 마포구',
    status: '이웃 친구 환영',
  },
];

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
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
    }),
  ).current;

  const [activeTab, setActiveTab] = useState<'friends' | 'chats'>('friends');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [friendUuid, setFriendUuid] = useState('');

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // 메시지 전송 로직
      console.log('메시지 전송:', messageInput);
      setMessageInput('');
    }
  };

  const handleFriendClick = (friend: Friend) => {
    // 친구 클릭 시 해당 친구와의 채팅방으로 이동
    // 채팅방이 없으면 새로 생성하는 것처럼 보이게
    setActiveTab('chats');
    setSelectedChat('friend_' + friend.id);
  };

  const handleAddFriend = () => {
    if (!friendUuid.trim()) {
      Alert.alert('알림', 'UUID를 입력해주세요.');
      return;
    }

    // UUID 형식 검증 (간단한 검증)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(friendUuid)) {
      Alert.alert('오류', '올바른 UUID 형식이 아닙니다.');
      return;
    }

    // 친구 추가 로직
    Alert.alert('친구 요청', '친구 요청을 보냈습니다!');
    setFriendUuid('');
    setShowAddFriendModal(false);
  };

  const handleAcceptRequest = (request: FriendRequest) => {
    Alert.alert('알림', `${request.name}님의 친구 요청을 수락했습니다.`);
    // 실제로는 친구 목록에 추가하는 로직 필요
  };

  const handleRejectRequest = (request: FriendRequest) => {
    Alert.alert('알림', `${request.name}님의 친구 요청을 거절했습니다.`);
    // 실제로는 요청 목록에서 제거하는 로직 필요
  };

  const handleCopyMyUuid = () => {
    if (user?.uuid) {
      Clipboard.setString(user.uuid);
      Alert.alert('복사 완료', '내 아이디가 클립보드에 복사되었습니다.');
    } else {
      Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.');
    }
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleFriendClick(item)}
      activeOpacity={0.7}
    >
      <View style={styles.friendAvatar}>
        <Text style={styles.friendAvatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <View style={styles.friendLocation}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.friendLocationText}>{item.location}</Text>
        </View>
        <Text style={styles.friendStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.chatRoomItem}
      onPress={() => setSelectedChat(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.chatRoomAvatar}>
        <Text style={styles.chatRoomAvatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.chatRoomInfo}>
        <View style={styles.chatRoomHeader}>
          <Text style={styles.chatRoomName}>{item.name}</Text>
          <Text style={styles.chatRoomTime}>{item.time}</Text>
        </View>
        <View style={styles.chatRoomFooter}>
          <Text style={styles.chatRoomLastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.isMe ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!item.isMe && <Text style={styles.senderName}>{item.sender}</Text>}
      <View
        style={[
          styles.messageBubble,
          item.isMe ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isMe ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.message}
        </Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  if (selectedChat) {
    // 채팅방 또는 친구 채팅 찾기
    let chatName = '';
    if (selectedChat.startsWith('friend_')) {
      const friendId = selectedChat.replace('friend_', '');
      const friend = FRIENDS.find((f) => f.id === friendId);
      chatName = friend?.name || '채팅';
    } else {
      const chatRoom = CHAT_ROOMS.find((room) => room.id === selectedChat);
      chatName = chatRoom?.name || '채팅';
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper} {...panResponder.panHandlers}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            {/* 채팅방 헤더 */}
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={handleBackToList} style={styles.backButton}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.chatHeaderTitle}>{chatName}</Text>
              <View style={styles.headerRight} />
            </View>

            {/* 메시지 목록 */}
            <FlatList
              data={DUMMY_MESSAGES}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />

            {/* 메시지 입력 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="메시지를 입력하세요..."
                placeholderTextColor="#B8B8B8"
                value={messageInput}
                onChangeText={setMessageInput}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>전송</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          {/* 하단 네비게이션 */}
          <BottomNavBar currentScreen="Chat" />

          {/* 사이드 메뉴 */}
          <SideMenu
            visible={showSideMenu}
            onClose={() => setShowSideMenu(false)}
            navigation={navigation}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper} {...panResponder.panHandlers}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>채팅</Text>
        </View>

        {/* 탭 네비게이션 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
            onPress={() => setActiveTab('friends')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
              친구 목록
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
            onPress={() => setActiveTab('chats')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
              채팅 리스트
            </Text>
          </TouchableOpacity>
        </View>

        {/* 친구 목록 또는 채팅방 목록 */}
        {activeTab === 'friends' ? (
          <>
            {/* 친구 추가 및 요청 버튼 */}
            <View style={styles.friendButtonContainer}>
              <TouchableOpacity
                style={styles.friendActionButton}
                onPress={() => setShowAddFriendModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.friendActionIcon}>➕</Text>
                <Text style={styles.friendActionText}>친구 추가</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.friendActionButton}
                onPress={() => setShowRequestsModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.friendActionIcon}>📬</Text>
                <Text style={styles.friendActionText}>받은 요청 ({FRIEND_REQUESTS.length})</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={FRIENDS}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.friendList}
            />
          </>
        ) : (
          <FlatList
            data={CHAT_ROOMS}
            renderItem={renderChatRoom}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatRoomList}
          />
        )}

        {/* 하단 네비게이션 */}
        <BottomNavBar currentScreen="Chat" />

        {/* 친구 추가 모달 */}
        <Modal
          visible={showAddFriendModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddFriendModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>친구 추가</Text>
              <Text style={styles.modalSubtitle}>친구의 UUID를 입력하세요</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="예: 550e8400-e29b-41d4-a716-446655440000"
                placeholderTextColor="#B8B8B8"
                value={friendUuid}
                onChangeText={setFriendUuid}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.copyMyIdButton}
                onPress={handleCopyMyUuid}
                activeOpacity={0.7}
              >
                <Text style={styles.copyMyIdIcon}>📋</Text>
                <Text style={styles.copyMyIdText}>내 아이디 복사하기</Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setFriendUuid('');
                    setShowAddFriendModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalConfirmButton]}
                  onPress={handleAddFriend}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalConfirmText}>추가</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 친구 요청 모달 */}
        <Modal
          visible={showRequestsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRequestsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.requestsModalContainer}>
              <View style={styles.requestsHeader}>
                <Text style={styles.modalTitle}>받은 친구 요청</Text>
                <TouchableOpacity onPress={() => setShowRequestsModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={FRIEND_REQUESTS}
                renderItem={({ item }) => (
                  <View style={styles.requestItem}>
                    <View style={styles.requestAvatar}>
                      <Text style={styles.requestAvatarText}>{item.name[0]}</Text>
                    </View>
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{item.name}</Text>
                      <View style={styles.requestLocation}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.requestLocationText}>{item.location}</Text>
                      </View>
                      <Text style={styles.requestStatus}>{item.status}</Text>
                    </View>
                    <View style={styles.requestButtons}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAcceptRequest(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.acceptButtonText}>수락</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleRejectRequest(item)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.rejectButtonText}>거절</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.requestsList}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>받은 친구 요청이 없습니다.</Text>
                }
              />
            </View>
          </View>
        </Modal>

        {/* 사이드 메뉴 */}
        <SideMenu
          visible={showSideMenu}
          onClose={() => setShowSideMenu(false)}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5EDE4',
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#9B7E5C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7355',
  },
  activeTabText: {
    fontWeight: '700',
    color: '#5C4A3A',
  },
  friendButtonContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F5EDE4',
    gap: 12,
  },
  friendActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#9B7E5C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  friendActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  friendActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B7E5C',
  },
  friendList: {
    backgroundColor: '#FFFFFF',
  },
  friendItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9B7E5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 4,
  },
  friendLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  friendLocationText: {
    fontSize: 12,
    color: '#8B7355',
  },
  friendStatus: {
    fontSize: 13,
    color: '#B8B8B8',
    fontStyle: 'italic',
  },
  chatRoomList: {
    backgroundColor: '#FFFFFF',
  },
  chatRoomItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  chatRoomAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9B7E5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatRoomAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatRoomInfo: {
    flex: 1,
  },
  chatRoomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatRoomName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C4A3A',
  },
  chatRoomTime: {
    fontSize: 12,
    color: '#B8B8B8',
  },
  chatRoomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatRoomLastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#8B7355',
  },
  unreadBadge: {
    backgroundColor: '#9B7E5C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    color: '#5C4A3A',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  messagesList: {
    padding: 16,
    backgroundColor: '#F5EDE4',
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '75%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: '#9B7E5C',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#5C4A3A',
  },
  messageTime: {
    fontSize: 11,
    color: '#B8B8B8',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D8D0C8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#9B7E5C',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#8B7355',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#D8D0C8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#333333',
    marginBottom: 12,
  },
  copyMyIdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5EDE4',
    borderWidth: 1.5,
    borderColor: '#9B7E5C',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  copyMyIdIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  copyMyIdText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9B7E5C',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F0F0F0',
  },
  modalConfirmButton: {
    backgroundColor: '#9B7E5C',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7355',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requestsModalContainer: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    fontSize: 24,
    color: '#8B7355',
    padding: 4,
  },
  requestsList: {
    paddingBottom: 10,
  },
  requestItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9B7E5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 2,
  },
  requestLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  requestLocationText: {
    fontSize: 11,
    color: '#8B7355',
  },
  requestStatus: {
    fontSize: 12,
    color: '#B8B8B8',
    fontStyle: 'italic',
  },
  requestButtons: {
    flexDirection: 'column',
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#9B7E5C',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#B8B8B8',
    paddingVertical: 40,
  },
});
