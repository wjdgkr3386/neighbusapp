
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type BottomNavBarProps = {
  currentScreen: 'Home' | 'Board' | 'Chat' | 'MyPage';
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const navItems = [
    { name: 'Home', icon: '🏠', text: '홈' },
    { name: 'Board', icon: '📋', text: '게시판' },
    { name: 'Chat', icon: '💬', text: '채팅' },
    { name: 'MyPage', icon: '👤', text: '마이' },
  ];

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[styles.navItem, currentScreen === item.name && styles.navItemActive]}
          onPress={() => navigation.navigate(item.name)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[styles.navLabel, currentScreen === item.name && styles.navLabelActive]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navItemActive: {
    // 활성 상태 스타일 (예: 아이콘/라벨 색상 변경)
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: '#8B7355',
  },
  navLabelActive: {
    color: '#5C4A3A',
    fontWeight: '600',
  },
});

export default BottomNavBar;
