import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, languages, LanguageCode, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
    currentLanguage: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
    t: (key: TranslationKey) => string;
    availableLanguages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'agri_app_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
        if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Save language to localStorage when changed
    const setLanguage = (language: LanguageCode) => {
        setCurrentLanguage(language);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    };

    // Translation function
    const t = (key: TranslationKey): string => {
        return translations[currentLanguage][key] || translations.en[key] || key;
    };

    const value: LanguageContextType = {
        currentLanguage,
        setLanguage,
        t,
        availableLanguages: languages
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Hook for easy translation
export const useTranslation = () => {
    const { t } = useLanguage();
    return { t };
};