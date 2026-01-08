'use client'
import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

export default function Translator() {
  const [input, setInput] = useState('');
  const [translations, setTranslations] = useState({});
  const [translationObject, setTranslationObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  // Available languages
  const availableLanguages = [
    'Chinese (China)',
    'English (United States)',
    'Spanish (Spain)',
    'French (France)',
    'English (United Kingdom)',
    'German (Germany)',
    'Chinese-traditional',
    'Swedish',
    'Portuguese (Brazil)'
  ];

  // Default selected languages
  const defaultSelectedLanguages = [
    'Chinese (China)',
    'English (United States)',
    'Spanish (Spain)',
    'French (France)',
    'English (United Kingdom)',
    'German (Germany)'
  ];

  const [selectedLanguages, setSelectedLanguages] = useState(defaultSelectedLanguages);

  const translateWord = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          selectedLanguages: selectedLanguages
        }),
      });

      const data = await res.json();
      setTranslations(data.translations);
      setTranslationObject(
        Object.entries(data.translations).reduce((acc, [lang, trans]) => {
          const codeMap = {
            'Chinese (China)': 'zh-CN',
            'English (United States)': 'en-US',
            'Spanish (Spain)': 'es-ES',
            'French (France)': 'fr-FR',
            'English (United Kingdom)': 'en-GB',
            'German (Germany)': 'de-DE',
            'Chinese-traditional': 'zh-TW',
            'Swedish': 'sv-SE',
            'Portuguese (Brazil)': 'pt-BR',
          };
          const code = codeMap[lang];
          if (code) {
            acc[code] = trans;
          }
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Error translating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(lang => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') translateWord();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-6">Translator App</h1>
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            placeholder="Enter English word"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />

          {/* Language Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Languages:</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableLanguages.map((language) => (
                <label key={language} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={() => handleLanguageChange(language)}
                    className="rounded"
                  />
                  <span className="text-sm">{language}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={translateWord}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading || selectedLanguages.length === 0}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>

          {Object.entries(translations).map(([language, translation]) => (
            <div
              key={language}
              className="mt-4 flex items-center justify-between border-b pb-2"
            >
              <div>
                <strong>{language}:</strong> {translation}
              </div>
              <button
                onClick={() => copyToClipboard(translation, language)}
                className="text-blue-500 hover:text-blue-700"
              >
                {copied === language ? 'Copied' : <FiCopy size={20} />}
              </button>
            </div>
          ))}

          {translationObject && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Translation Object:</h2>
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-sm flex justify-between">
                <pre className="overflow-x-auto">
                  {JSON.stringify(translationObject, null, 2)}
                </pre>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(translationObject, null, 2), 'object')}
                  className="text-blue-500 hover:text-blue-700 ml-4"
                >
                  {copied === 'object' ? 'Copied' : <FiCopy size={20} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-6 text-center text-gray-500">
        <p>
          build with ❤️ by <a href="https://www.linkedin.com/in/khushi-patel-7854151b6/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">Khushi Patel</a>
        </p>
      </footer>
    </>
  );
}
