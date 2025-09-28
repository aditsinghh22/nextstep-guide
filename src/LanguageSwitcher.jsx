// src/LanguageSwitcher.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'ks', name: 'کٲشُر' }
    ];

    return (
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-full border border-gray-700">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${
                        i18n.resolvedLanguage === lang.code
                            ? 'bg-teal-600 text-white'
                            : 'text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    {lang.name}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;