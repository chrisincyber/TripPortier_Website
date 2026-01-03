/**
 * GeminiService - Direct Gemini AI integration for TripPortier Web
 * Matches the iOS app implementation
 */

class GeminiService {
  constructor() {
    this.apiKey = 'AIzaSyDJkJI81S4ZJaP1sEpk9IBy94BfIROba3U';
    this.model = 'gemini-2.5-flash-lite';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1/models';
  }

  /**
   * Get the user's preferred language for AI responses
   */
  getUserLanguage() {
    // Check stored preference first
    const stored = localStorage.getItem('pp_appLanguage') || localStorage.getItem('selectedLanguage');
    if (stored) return stored;

    // Fall back to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langMap = {
      'en': 'English', 'de': 'German', 'es': 'Spanish', 'fr': 'French',
      'it': 'Italian', 'pt': 'Portuguese', 'nl': 'Dutch', 'ja': 'Japanese',
      'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'ru': 'Russian',
      'sv': 'Swedish', 'da': 'Danish', 'no': 'Norwegian', 'fi': 'Finnish',
      'th': 'Thai', 'tr': 'Turkish'
    };

    const shortLang = browserLang.split('-')[0];
    return langMap[shortLang] || 'English';
  }

  /**
   * Make a request to Gemini API
   */
  async makeRequest(prompt, options = {}) {
    const { maxTokens = 2048, temperature = 0.7 } = options;

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: temperature,
        topP: 0.9,
        maxOutputTokens: maxTokens
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract the text response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No response from Gemini');
      }

      return text;
    } catch (error) {
      console.error('Error calling Gemini:', error);
      throw error;
    }
  }

  /**
   * Parse JSON from Gemini response (handles markdown code blocks)
   */
  parseJsonResponse(text) {
    // Remove markdown code blocks if present
    let cleanText = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Failed to parse Gemini JSON response:', error);
      console.log('Raw response:', text);
      throw new Error('Invalid JSON response from Gemini');
    }
  }

  /**
   * Fetch comprehensive travel essentials data for a destination
   * Matches the iOS app's fetchEssentialsData implementation
   */
  async fetchEssentialsData(destination, countryCode, userHomeCountry = 'Switzerland', userNationalities = []) {
    const language = this.getUserLanguage();
    const nationalitiesText = userNationalities.length > 0
      ? userNationalities.join(', ')
      : userHomeCountry;

    const prompt = `You are a travel information assistant. Provide comprehensive travel essentials for someone visiting ${destination} (country code: ${countryCode}).

The traveler is from ${userHomeCountry} and holds passport(s) from: ${nationalitiesText}.

Respond ONLY with a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "emergency": {
    "police": "emergency number",
    "ambulance": "emergency number",
    "fire": "emergency number",
    "phrases": [
      {"english": "Help!", "local": "local translation", "pronunciation": "phonetic pronunciation"},
      {"english": "I need a doctor", "local": "local translation", "pronunciation": "phonetic pronunciation"},
      {"english": "Call the police", "local": "local translation", "pronunciation": "phonetic pronunciation"}
    ]
  },
  "visa": {
    "description": "Brief visa requirements summary for ${nationalitiesText} citizens visiting ${destination}",
    "officialURL": "official government immigration website URL",
    "entryRequirements": [
      {
        "name": "requirement name (e.g., ESTA, e-Visa, Arrival Card)",
        "description": "what it is and who needs it",
        "timing": "when to complete (e.g., 'Before departure', '72 hours before arrival')",
        "url": "official application URL if applicable"
      }
    ]
  },
  "plug": {
    "plugTypes": "plug type letters (e.g., 'Type A, Type B')",
    "voltage": "voltage (e.g., '120V')",
    "frequency": "frequency (e.g., '60Hz')",
    "adapterNeeded": true or false based on ${userHomeCountry} compatibility
  },
  "culture": {
    "primaryLanguage": "main language spoken",
    "englishLevel": "description of English proficiency (e.g., 'Widely spoken in tourist areas')",
    "funFact": "one interesting cultural fact about ${destination}",
    "holidays": ["list of major holidays to be aware of"],
    "usefulPhrases": [
      {"english": "Hello", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "Thank you", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "Please", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "Goodbye", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "Yes", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "No", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "Excuse me", "local": "local translation", "pronunciation": "phonetic"},
      {"english": "How much?", "local": "local translation", "pronunciation": "phonetic"}
    ]
  },
  "waterFood": {
    "tapWaterSafe": true or false,
    "waterNotes": "details about water safety",
    "iceSafe": true or false,
    "streetFoodSafe": true or false,
    "foodNotes": "tips for eating safely",
    "tips": ["list of 3-5 food and water safety tips"]
  },
  "timezone": {
    "name": "timezone name (e.g., 'Japan Standard Time')",
    "offset": "UTC offset (e.g., 'UTC+9')",
    "difference": "time difference from ${userHomeCountry}"
  },
  "driving": {
    "side": "left or right",
    "speedLimits": {
      "urban": "speed limit in km/h",
      "rural": "speed limit in km/h",
      "highway": "speed limit in km/h"
    },
    "requiredDocuments": ["list of required documents"],
    "tollInfo": "information about tolls"
  },
  "transport": {
    "overview": "brief overview of public transport",
    "apps": ["recommended transport/taxi apps"],
    "typicalCosts": "typical transport costs"
  },
  "legalWarnings": {
    "alcohol": {
      "legalAge": number,
      "restrictions": "any restrictions on alcohol",
      "salesHours": "when alcohol can be purchased"
    },
    "drugPenalties": "warning about drug penalties",
    "dressCode": {
      "general": "general dress expectations",
      "religiousSites": "dress code for religious sites",
      "government": "dress code for government buildings"
    },
    "photoRestrictions": "any photography restrictions",
    "importRestrictions": ["items restricted from import"],
    "otherWarnings": ["any other important legal warnings"]
  }
}

IMPORTANT:
- Respond ONLY with the JSON object, no additional text
- All text should be in ${language} except for local language phrases
- Be accurate and specific to ${destination}
- For visa info, be specific to ${nationalitiesText} passport holders
- Include specific entry requirements like Thailand TDAC, USA ESTA, Canada eTA, India e-Visa, UK ETA, Australia ETA, etc. if applicable`;

    console.log('Fetching essentials from Gemini for:', destination);

    try {
      const response = await this.makeRequest(prompt, { maxTokens: 4096, temperature: 0.3 });
      const essentialsData = this.parseJsonResponse(response);

      console.log('Successfully fetched essentials data:', essentialsData);
      return essentialsData;
    } catch (error) {
      console.error('Error fetching essentials:', error);
      throw error;
    }
  }
}

// Create singleton instance
window.geminiService = new GeminiService();
