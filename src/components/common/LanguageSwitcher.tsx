import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'සිංහල' },
    { code: 'ta', name: 'தமிழ்' }
  ];
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-1 text-sm"
        onClick={toggleDropdown}
      >
        <span>{selectedLanguage}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-md rounded-md py-1 z-50 min-w-32 text-primary">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedLanguage === language.name ? 'font-medium text-accent' : ''}`}
              onClick={() => selectLanguage(language.name)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;