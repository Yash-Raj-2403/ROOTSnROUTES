import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImmersiveModeContextType {
  isImmersiveMode: boolean;
  setImmersiveMode: (isActive: boolean) => void;
  immersiveModeType: 'vr' | 'ar' | null;
  setImmersiveModeType: (type: 'vr' | 'ar' | null) => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextType | undefined>(undefined);

export const useImmersiveMode = () => {
  const context = useContext(ImmersiveModeContext);
  if (!context) {
    throw new Error('useImmersiveMode must be used within an ImmersiveModeProvider');
  }
  return context;
};

interface ImmersiveModeProviderProps {
  children: ReactNode;
}

export const ImmersiveModeProvider: React.FC<ImmersiveModeProviderProps> = ({ children }) => {
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [immersiveModeType, setImmersiveModeTypeState] = useState<'vr' | 'ar' | null>(null);

  const setImmersiveMode = (isActive: boolean) => {
    setIsImmersiveMode(isActive);
    console.log(`🎮 Immersive mode ${isActive ? 'activated' : 'deactivated'}`);
    
    // Reset type when deactivating
    if (!isActive) {
      setImmersiveModeTypeState(null);
    }
  };

  const setImmersiveModeType = (type: 'vr' | 'ar' | null) => {
    setImmersiveModeTypeState(type);
    if (type) {
      setIsImmersiveMode(true);
      console.log(`🎮 Immersive mode type set to: ${type.toUpperCase()}`);
    }
  };

  const value = {
    isImmersiveMode,
    setImmersiveMode,
    immersiveModeType,
    setImmersiveModeType,
  };

  return (
    <ImmersiveModeContext.Provider value={value}>
      {children}
    </ImmersiveModeContext.Provider>
  );
};