/**
 * Login Modal Context
 * Provides global access to login modal functionality
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoginContextType {
  showLogin: (returnPath?: string) => void;
  hideLogin: () => void;
  isLoginOpen: boolean;
  returnPath?: string;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [returnPath, setReturnPath] = useState<string | undefined>();

  const showLogin = useCallback((path?: string) => {
    setReturnPath(path);
    setIsLoginOpen(true);
  }, []);

  const hideLogin = useCallback(() => {
    setIsLoginOpen(false);
    setReturnPath(undefined);
  }, []);

  const value = {
    showLogin,
    hideLogin,
    isLoginOpen,
    returnPath
  };

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};