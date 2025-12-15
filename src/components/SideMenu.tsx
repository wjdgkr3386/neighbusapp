// src/components/SideMenu.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useUser } from '../context/UserContext';

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
  navigation: any;
};

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose, navigation }) => {
  const { user, setUser } = useUser();
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNotice = () => {
    onClose();
    Alert.alert('공지사항', '새로운 공지사항이 없습니다.');
  };

  const handleInquiry = () => {
    onClose();
    Alert.alert('문의하기', '문의사항을 이메일로 보내주세요.\ncontact@neighbus.com');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            onClose();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>메뉴</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 사용자 정보 */}
              <View style={styles.userSection}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>{user?.name || '사용자'} 님</Text>
                <Text style={styles.userGreeting}>안녕하세요!</Text>
              </View>

              {/* 구분선 */}
              <View style={styles.divider} />

              {/* 메뉴 항목들 */}
              <View style={styles.menuList}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleNotice}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>📢</Text>
                  <Text style={styles.menuText}>공지사항</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleInquiry}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>💬</Text>
                  <Text style={styles.menuText}>문의하기</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>🚪</Text>
                  <Text style={styles.menuTextLogout}>로그아웃</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              </View>

              {/* 앱 정보 */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>NEIGHBUS v1.0</Text>
                <Text style={styles.footerSubtext}>함께하는 이웃</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
    backgroundColor: '#F5EDE4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#5C4A3A',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F5EDE4',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D8D0C8',
  },
  userAvatarText: {
    fontSize: 36,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 4,
  },
  userGreeting: {
    fontSize: 14,
    color: '#8B7355',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  menuList: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#5C4A3A',
  },
  menuTextLogout: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#D9534F',
  },
  menuArrow: {
    fontSize: 24,
    color: '#B8B8B8',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
    marginHorizontal: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#B8B8B8',
  },
});
