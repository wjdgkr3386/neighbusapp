// src/context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type User = {
  id: string;
  name: string;
  password: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// 앱 전체를 감싸는 Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 편하게 쓰기 위한 커스텀 훅
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser는 UserProvider 안에서만 사용해야 합니다.');
  }
  return ctx;
};
