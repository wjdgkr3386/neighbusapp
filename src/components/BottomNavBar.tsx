import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type BottomNavBarProps = {
  currentScreen: 'Home' | 'Gallery' | 'Freeboard' | 'Chat' | 'MyPage';
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const navItems = [
    { key: 'Home', route: 'Home', icon: '👥', text: '동아리' },
    { key: 'Gallery', route: 'Gallery', icon: '🖼️', text: '갤러리' },
    { key: 'Freeboard', route: 'FreeBoard', icon: '📋', text: '게시판' },
    { key: 'Chat', route: 'Chat', icon: '💬', text: '채팅' },
    { key: 'MyPage', route: 'MyPage', icon: '👤', text: '마이' },
  ];

  return (
    <View
      style={[
        styles.bottomNav,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 },
      ]}
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        );
      })}
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
