// app/api/translate/route.js
export async function POST(req) {
    const { text, selectedLanguages } = await req.json();

    if (!text) {
        return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    // All available languages
    const allLanguages = {
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

    // Default languages if none selected
    const defaultLanguages = [
        'Chinese (China)',
        'English (United States)',
        'Spanish (Spain)',
        'French (France)',
        'English (United Kingdom)',
        'German (Germany)'
    ];

    // Use selected languages or default ones
    const languagesToTranslate = selectedLanguages && selectedLanguages.length > 0
        ? selectedLanguages
        : defaultLanguages;

    try {
        const translations = {};
        let usEnglishTranslation = null;

        // First, get US English translation if UK English is requested
        const needsUkEnglish = languagesToTranslate.includes('English (United Kingdom)');
        if (needsUkEnglish) {
            const response = await fetch(
                `https://translate.google.com/translate_a/single?client=gtx&sl=en&tl=en-US&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            usEnglishTranslation = data[0][0][0];
        }

        for (const language of languagesToTranslate) {
            const code = allLanguages[language];

            if (!code) continue;

            // Handle UK English by copying US English response
            if (language === 'English (United Kingdom)') {
                translations[language] = usEnglishTranslation;
                continue;
            }

            const response = await fetch(
                `https://translate.google.com/translate_a/single?client=gtx&sl=en&tl=${code}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();

            translations[language] = data[0][0][0];
        }

        return new Response(JSON.stringify({ translations }), { status: 200 });
    } catch (error) {
        console.error('Error during translation:', error);
        return new Response(JSON.stringify({ error: 'Failed to translate text' }), { status: 500 });
    }
}
