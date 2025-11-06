import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    
    // First try the selected language
    let current: Record<string, unknown> = translations[context.language];
    let found = true;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k] as Record<string, unknown>;
      } else {
        found = false;
        break;
      }
    }
    
    if (found && typeof current === 'string') {
      return current;
    }
    
    // Fallback to English if key not found in selected language
    if (context.language !== 'en') {
      current = translations.en;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k] as Record<string, unknown>;
        } else {
          return key; // Return key if not found even in English
        }
      }
      return typeof current === 'string' ? current : key;
    }
    
    return key; // Return key if not found anywhere
  };

  return {
    ...context,
    t
  };
};