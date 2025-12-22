// src/screens/ChatScreen.tsx
import React, { useState, useRef } from 'react';
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import type { RootStackScreenProps } from '../../App';
import SideMenu from '../components/SideMenu';
import { useUser } from '../context/UserContext';
import BottomNavBar from '../components/BottomNavBar';
import theme from '../styles/theme';

type Props = RootStackScreenProps<'Chat'>;

// ... (Data structures remain the same) ...
type ChatMessage = { id: string; sender: string; message: string; time: string; isMe: boolean; };
type ChatRoom = { id: string; name: string; lastMessage: string; time: string; unread: number; };
type Friend = { id: string; uuid: string; name: string; location: string; status: string; };
type FriendRequest = { id: string; uuid: string; name: string; location: string; status: string; };

const DUMMY_MESSAGES: ChatMessage[] = [
    { id: '1', sender: '환경 동아리', message: '다음주 한강 청소 활동 참여 가능하신 분?', time: '10:30', isMe: false },
    { id: '2', sender: '나', message: '저 참여할게요! 🙌', time: '10:32', isMe: true },
    { id: '3', sender: '환경 동아리', message: '좋아요! 오후 2시에 한강공원 입구에서 만나요', time: '10:33', isMe: false },
    { id: '4', sender: '달밤 동아리', message: '이번주 금요일 야간 산책 어떠세요?', time: '어제', isMe: false },
];
const CHAT_ROOMS: ChatRoom[] = [
    { id: '1', name: '환경 동아리', lastMessage: '좋아요! 오후 2시에 한강공원 입구에서 만나요', time: '10:33', unread: 2 },
    { id: '2', name: '달밤 동아리', lastMessage: '이번주 금요일 야간 산책 어떠세요?', time: '어제', unread: 0 },
    { id: '3', name: '러닝크루', lastMessage: '내일 한강 10km 달리기 준비됐나요?', time: '2일 전', unread: 0 },
];
const FRIENDS: Friend[] = [
    { id: 'f1', uuid: '550e8400-e29b-41d4-a716-446655440001', name: '김민수', location: '서울시 마포구', status: '안녕하세요!' },
    { id: 'f2', uuid: '550e8400-e29b-41d4-a716-446655440002', name: '이지은', location: '서울시 강남구', status: '오늘도 화이팅!' },
];
const FRIEND_REQUESTS: FriendRequest[] = [
    { id: 'r1', uuid: '550e8400-e29b-41d4-a716-446655440006', name: '한소희', location: '서울시 성동구', status: '같이 운동해요!' },
];

const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useUser();
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'chats'>('friends');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [friendUuid, setFriendUuid] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 10,
    onPanResponderRelease: (evt, gestureState) => { if (gestureState.dx > 30) setShowSideMenu(true); },
  })).current;

  const handleBackToList = () => setSelectedChat(null);
  const handleSendMessage = () => { if (messageInput.trim()) { console.log('메시지 전송:', messageInput); setMessageInput(''); } };
  const handleAddFriend = () => { if (!friendUuid.trim()) { Alert.alert('알림', 'UUID를 입력해주세요.'); return; } const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i; if (!uuidRegex.test(friendUuid)) { Alert.alert('오류', '올바른 UUID 형식이 아닙니다.'); return; } Alert.alert('친구 요청', '친구 요청을 보냈습니다!'); setFriendUuid(''); setShowAddFriendModal(false); };
  const handleAcceptRequest = (request: FriendRequest) => Alert.alert('알림', `${request.name}님의 친구 요청을 수락했습니다.`);
  const handleRejectRequest = (request: FriendRequest) => Alert.alert('알림', `${request.name}님의 친구 요청을 거절했습니다.`);
  const handleCopyMyUuid = () => { if (user?.uuid) { Clipboard.setString(user.uuid); Alert.alert('복사 완료', '내 아이디가 클립보드에 복사되었습니다.'); } else { Alert.alert('오류', '사용자 정보를 찾을 수 없습니다.'); } };
  
  const handleOpenChat = (friend: Friend) => {
    setSelectedFriend(null);
    setActiveTab('chats');
    setSelectedChat('friend_' + friend.id);
  };

  const handleDeleteFriend = (friend: Friend) => {
    Alert.alert('친구 삭제', `${friend.name}님을 정말로 친구 목록에서 삭제하시겠습니까?`,
      [{ text: '취소', style: 'cancel' }, { text: '삭제', style: 'destructive', onPress: () => { console.log(`${friend.name}님을 삭제했습니다.`); setSelectedFriend(null); } }]
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => setSelectedFriend(item)} activeOpacity={0.7}>
      <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.uuid}` }} style={styles.avatar} />
      <View style={styles.friendInfo}><Text style={styles.friendName}>{item.name}</Text><Text style={styles.friendStatus} numberOfLines={1}>{item.status}</Text></View>
    </TouchableOpacity>
  );

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity style={styles.chatRoomItem} onPress={() => setSelectedChat(item.id)} activeOpacity={0.7}>
      <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.avatar} />
      <View style={styles.chatRoomInfo}>
        <View style={styles.chatRoomHeader}><Text style={styles.chatRoomName}>{item.name}</Text><Text style={styles.chatRoomTime}>{item.time}</Text></View>
        <Text style={styles.chatRoomLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      {item.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unread}</Text></View>}
    </TouchableOpacity>
  );

  const renderMessage = ({ item, index }: { item: ChatMessage, index: number }) => {
    const showTimestamp = index === 0 || DUMMY_MESSAGES[index - 1].time !== item.time;
    return (
      <>
        {showTimestamp && <Text style={styles.timestamp}>--- {item.time} ---</Text>}
        <View style={[styles.messageRow, item.isMe ? styles.myMessageRow : styles.otherMessageRow]}>
          {!item.isMe && <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.sender}`}} style={styles.messageAvatar} />}
          <View style={[styles.messageBubble, item.isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
            <Text style={item.isMe ? styles.myMessageText : styles.otherMessageText}>{item.message}</Text>
          </View>
        </View>
      </>
    );
  };

  const renderChatDetail = () => {
    let chatName = '';
    if (selectedChat?.startsWith('friend_')) {
      const friendId = selectedChat.replace('friend_', '');
      const friend = FRIENDS.find((f) => f.id === friendId);
      chatName = friend?.name || '채팅';
    } else {
      const chatRoom = CHAT_ROOMS.find((room) => room.id === selectedChat);
      chatName = chatRoom?.name || '채팅';
    }

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flexOne}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={handleBackToList} style={styles.backButton}><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
          <Text style={styles.chatHeaderTitle}>{chatName}</Text>
          <View style={styles.headerRight} />
        </View>
        <FlatList data={DUMMY_MESSAGES} renderItem={renderMessage} keyExtractor={(item) => item.id} contentContainerStyle={styles.messagesList} />
        <View style={styles.inputContainer}>
          <TextInput style={styles.messageInput} placeholder="메시지를 입력하세요..." placeholderTextColor="#B8A99A" value={messageInput} onChangeText={setMessageInput} multiline />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} activeOpacity={0.7}><Text style={styles.sendButtonText}>➤</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  const renderChatList = () => (
    <View style={styles.flexOne} {...panResponder.panHandlers}>
      <View style={styles.header}><Text style={styles.headerTitle}>채팅</Text></View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'friends' && styles.activeTab]} onPress={() => setActiveTab('friends')} activeOpacity={0.7}>
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>친구</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'chats' && styles.activeTab]} onPress={() => setActiveTab('chats')} activeOpacity={0.7}>
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>대화</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'friends' ? (
        <>
          <View style={styles.friendButtonContainer}>
            <TouchableOpacity style={styles.friendActionButton} onPress={() => setShowAddFriendModal(true)} activeOpacity={0.7}><Text style={styles.friendActionIcon}>➕</Text><Text style={styles.friendActionText}>친구 추가</Text></TouchableOpacity>
            <TouchableOpacity style={styles.friendActionButton} onPress={() => setShowRequestsModal(true)} activeOpacity={0.7}><Text style={styles.friendActionIcon}>📬</Text><Text style={styles.friendActionText}>받은 요청 ({FRIEND_REQUESTS.length})</Text></TouchableOpacity>
          </View>
          <FlatList data={FRIENDS} renderItem={renderFriend} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <View style={styles.separator} />} contentContainerStyle={styles.listContent} />
        </>
      ) : (
        <FlatList data={CHAT_ROOMS} renderItem={renderChatRoom} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <View style={styles.separator} />} contentContainerStyle={styles.listContent} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedChat ? renderChatDetail() : renderChatList()}
      {!selectedChat && <BottomNavBar currentScreen="Chat" />}
      {selectedFriend && (
        <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setSelectedFriend(null)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedFriend(null)}>
            <TouchableOpacity activeOpacity={1} style={styles.profileModalContainer}>
              <Image source={{ uri: `https://i.pravatar.cc/150?u=${selectedFriend.uuid}` }} style={styles.profileAvatar} />
              <Text style={styles.profileName}>{selectedFriend.name}</Text>
              <Text style={styles.profileStatus}>{selectedFriend.status}</Text>
              <View style={styles.profileActions}>
                <TouchableOpacity style={styles.profileButton} onPress={() => handleOpenChat(selectedFriend)}><Text style={styles.profileButtonText}>1:1 대화</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.profileButton, styles.deleteButton]} onPress={() => handleDeleteFriend(selectedFriend)}><Text style={[styles.profileButtonText, styles.deleteButtonText]}>친구 삭제</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
      <Modal visible={showAddFriendModal} transparent={true} animationType="fade" onRequestClose={() => setShowAddFriendModal(false)}>
        <View style={styles.modalOverlay}><View style={styles.modalContainer}><Text style={styles.modalTitle}>친구 추가</Text><Text style={styles.modalSubtitle}>친구의 UUID를 입력하세요</Text><TextInput style={styles.modalInput} placeholder="예: 550e8400-e29b-41d4-a716-446655440000" placeholderTextColor="#B8B8B8" value={friendUuid} onChangeText={setFriendUuid} autoCapitalize="none" /><TouchableOpacity style={styles.copyMyIdButton} onPress={handleCopyMyUuid} activeOpacity={0.7}><Text style={styles.copyMyIdIcon}>📋</Text><Text style={styles.copyMyIdText}>내 아이디 복사하기</Text></TouchableOpacity><View style={styles.modalButtons}><TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => { setFriendUuid(''); setShowAddFriendModal(false); }} activeOpacity={0.7}><Text style={styles.modalCancelText}>취소</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, styles.modalConfirmButton]} onPress={handleAddFriend} activeOpacity={0.7}><Text style={styles.modalConfirmText}>추가</Text></TouchableOpacity></View></View></View>
      </Modal>
      <Modal visible={showRequestsModal} transparent={true} animationType="slide" onRequestClose={() => setShowRequestsModal(false)}>
        <View style={styles.modalOverlay}><View style={styles.requestsModalContainer}><View style={styles.requestsHeader}><Text style={styles.modalTitle}>받은 친구 요청</Text><TouchableOpacity onPress={() => setShowRequestsModal(false)}><Text style={styles.closeButton}>✕</Text></TouchableOpacity></View><FlatList data={FRIEND_REQUESTS} renderItem={({ item }) => (<View style={styles.requestItem}><View style={styles.requestAvatar}><Text style={styles.requestAvatarText}>{item.name[0]}</Text></View><View style={styles.requestInfo}><Text style={styles.requestName}>{item.name}</Text><View style={styles.requestLocation}><Text style={styles.locationIcon}>📍</Text><Text style={styles.requestLocationText}>{item.location}</Text></View><Text style={styles.requestStatus}>{item.status}</Text></View><View style={styles.requestButtons}><TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptRequest(item)} activeOpacity={0.7}><Text style={styles.acceptButtonText}>수락</Text></TouchableOpacity><TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectRequest(item)} activeOpacity={0.7}><Text style={styles.rejectButtonText}>거절</Text></TouchableOpacity></View></View>)} keyExtractor={(item) => item.id} contentContainerStyle={styles.requestsList} ListEmptyComponent={<Text style={styles.emptyText}>받은 친구 요청이 없습니다.</Text>} /></View></View>
      </Modal>
      <SideMenu visible={showSideMenu} onClose={() => setShowSideMenu(false)} navigation={navigation} />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  flexOne: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF8F0', borderBottomWidth: 1, borderBottomColor: theme.colors.borderColor },
  headerTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF8F0', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.borderColor },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 16, fontWeight: '500', color: theme.colors.textSecondary },
  activeTabText: { fontWeight: '700', color: theme.colors.textPrimary },
  friendButtonContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF8F0', gap: 12 },
  friendActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8F0', borderWidth: 1.5, borderColor: theme.colors.primary, borderRadius: 10, paddingVertical: 12 },
  friendActionIcon: { fontSize: 16, marginRight: 6, color: theme.colors.primary },
  friendActionText: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
  listContent: { paddingBottom: 100, backgroundColor: '#FFF8F0' },
  separator: { height: 1, backgroundColor: theme.colors.borderColor },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.borderColor },
  friendItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  friendInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  friendName: { fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 },
  friendStatus: { fontSize: 14, color: theme.colors.textSecondary },
  chatRoomItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  chatRoomInfo: { flex: 1, marginLeft: 16 },
  chatRoomHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatRoomName: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  chatRoomTime: { fontSize: 12, color: theme.colors.textLight },
  chatRoomLastMessage: { fontSize: 14, color: theme.colors.textSecondary },
  unreadBadge: { backgroundColor: theme.colors.primary, borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginLeft: 10 },
  unreadText: { fontSize: 12, fontWeight: '700', color: theme.colors.white },
  chatHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 12, backgroundColor: '#FFF8F0', borderBottomWidth: 1, borderBottomColor: theme.colors.borderColor },
  backButton: { padding: 8 },
  backIcon: { fontSize: 28, color: theme.colors.textPrimary, fontWeight: '300' },
  chatHeaderTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1, textAlign: 'center', marginRight: 36 },
  headerRight: { width: 28 },
  messagesList: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#FFF8F0' },
  timestamp: { alignSelf: 'center', color: theme.colors.textLight, fontSize: 12, marginVertical: 16, },
  messageRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  myMessageRow: { justifyContent: 'flex-end' },
  otherMessageRow: { justifyContent: 'flex-start' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, maxWidth: '100%' },
  myMessageBubble: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.colors.primary, borderBottomRightRadius: 4 },
  otherMessageBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  myMessageText: { fontSize: 15, color: theme.colors.primary },
  otherMessageText: { fontSize: 15, color: theme.colors.textPrimary },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF8F0', borderTopWidth: 1, borderTopColor: theme.colors.borderColor, alignItems: 'center' },
  messageInput: { flex: 1, backgroundColor: theme.colors.white, borderRadius: 22, paddingHorizontal: 18, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 15, color: theme.colors.textPrimary, marginRight: 8 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { fontSize: 20, color: theme.colors.white, transform: [{ translateX: -1 }] },
  // Friend Profile Modal
  profileModalContainer: { width: '100%', backgroundColor: theme.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.borderColor, marginBottom: 12 },
  profileName: { fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
  profileStatus: { fontSize: 15, color: theme.colors.textSecondary, marginBottom: 24 },
  profileActions: { flexDirection: 'row', gap: 12, width: '100%' },
  profileButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: theme.colors.primary },
  profileButtonText: { fontSize: 16, fontWeight: '700', color: theme.colors.white },
  deleteButton: { backgroundColor: theme.colors.bodyBg, borderWidth: 1, borderColor: theme.colors.borderColor },
  deleteButtonText: { color: theme.colors.danger },
  // Other Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContainer: { width: '85%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5, alignSelf: 'center', marginBottom: 'auto', marginTop: 'auto' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#5C4A3A', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#8B7355', marginBottom: 16 },
  modalInput: { backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#D8D0C8', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: '#333333', marginBottom: 12 },
  copyMyIdButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5EDE4', borderWidth: 1.5, borderColor: '#9B7E5C', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 20 },
  copyMyIdIcon: { fontSize: 16, marginRight: 6 },
  copyMyIdText: { fontSize: 13, fontWeight: '600', color: '#9B7E5C' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  modalCancelButton: { backgroundColor: '#F0F0F0' },
  modalConfirmButton: { backgroundColor: '#9B7E5C' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: '#8B7355' },
  modalConfirmText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  requestsModalContainer: { width: '100%', maxHeight: '80%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  requestsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  closeButton: { fontSize: 24, color: '#8B7355', padding: 4 },
  requestsList: { paddingBottom: 10 },
  requestItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  requestAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#9B7E5C', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  requestAvatarText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 15, fontWeight: '600', color: '#5C4A3A', marginBottom: 2 },
  requestLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  requestLocationText: { fontSize: 11, color: '#8B7355' },
  requestStatus: { fontSize: 12, color: '#B8B8B8', fontStyle: 'italic' },
  requestButtons: { flexDirection: 'column', gap: 6 },
  acceptButton: { backgroundColor: '#9B7E5C', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  acceptButtonText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  rejectButton: { backgroundColor: '#E5E5E5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  rejectButtonText: { fontSize: 12, fontWeight: '600', color: '#8B7355' },
  emptyText: { textAlign: 'center', fontSize: 14, color: '#B8B8B8', paddingVertical: 40 },
});
