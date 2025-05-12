'use client';

// Country codes with their respective formats
const countryCodes = [
  // North America
  { code: '+1', country: 'USA (United States of America)', format: '(XXX) XXX-XXXX', placeholder: '(123) 456-7890', maxLength: 14 },
  { code: '+1', country: 'Canada', format: '(XXX) XXX-XXXX', placeholder: '(123) 456-7890', maxLength: 14 },
  { code: '+52', country: 'Mexico', format: '(XX) XXXX XXXX', placeholder: '(55) 1234 5678', maxLength: 15 },

  // Europe
  { code: '+44', country: 'UK (United Kingdom)', format: 'XXXX XXXXXX', placeholder: '7911 123456', maxLength: 13 },
  { code: '+49', country: 'Germany (Deutschland)', format: 'XXX XXXXXXX', placeholder: '170 1234567', maxLength: 14 },
  { code: '+33', country: 'France', format: 'X XX XX XX XX', placeholder: '6 12 34 56 78', maxLength: 14 },
  { code: '+39', country: 'Italy (Italia)', format: 'XXX XXX XXXX', placeholder: '312 345 6789', maxLength: 13 },
  { code: '+34', country: 'Spain (España)', format: 'XXX XXX XXX', placeholder: '612 345 678', maxLength: 12 },
  { code: '+31', country: 'Netherlands (Nederland)', format: 'X XX XX XX XX', placeholder: '6 12 34 56 78', maxLength: 14 },
  { code: '+41', country: 'Switzerland (Schweiz/Suisse)', format: 'XX XXX XX XX', placeholder: '78 123 45 67', maxLength: 13 },
  { code: '+46', country: 'Sweden (Sverige)', format: 'XX XXX XX XX', placeholder: '70 123 45 67', maxLength: 13 },
  { code: '+47', country: 'Norway (Norge)', format: 'XXX XX XXX', placeholder: '406 12 345', maxLength: 11 },
  { code: '+45', country: 'Denmark (Danmark)', format: 'XX XX XX XX', placeholder: '20 12 34 56', maxLength: 11 },
  { code: '+358', country: 'Finland (Suomi)', format: 'XX XXX XXXX', placeholder: '40 123 4567', maxLength: 13 },
  { code: '+48', country: 'Poland (Polska)', format: 'XXX XXX XXX', placeholder: '512 345 678', maxLength: 12 },
  { code: '+43', country: 'Austria (Österreich)', format: 'XXX XXXXXX', placeholder: '664 123456', maxLength: 13 },
  { code: '+32', country: 'Belgium (België/Belgique)', format: 'XXX XX XX XX', placeholder: '470 12 34 56', maxLength: 13 },
  { code: '+351', country: 'Portugal', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 13 },
  { code: '+353', country: 'Ireland (Éire)', format: 'XX XXX XXXX', placeholder: '85 123 4567', maxLength: 13 },
  { code: '+30', country: 'Greece (Ελλάδα)', format: 'XXX XXX XXXX', placeholder: '697 123 4567', maxLength: 14 },
  { code: '+420', country: 'Czech Republic (Česká republika)', format: 'XXX XXX XXX', placeholder: '601 123 456', maxLength: 13 },
  { code: '+36', country: 'Hungary (Magyarország)', format: 'XX XXX XXXX', placeholder: '20 123 4567', maxLength: 13 },

  // Asia
  { code: '+91', country: 'India (भारत)', format: 'XXXXX XXXXX', placeholder: '98765 43210', maxLength: 12 },
  { code: '+92', country: 'Pakistan (پاکستان)', format: 'XXX XXXXXXX', placeholder: '300 1234567', maxLength: 13 },
  { code: '+86', country: 'China (中国)', format: 'XXX XXXX XXXX', placeholder: '139 1234 5678', maxLength: 14 },
  { code: '+81', country: 'Japan (日本)', format: 'XX XXXX XXXX', placeholder: '90 1234 5678', maxLength: 13 },
  { code: '+82', country: 'South Korea (대한민국)', format: 'XX XXXX XXXX', placeholder: '10 1234 5678', maxLength: 13 },
  { code: '+65', country: 'Singapore (新加坡)', format: 'XXXX XXXX', placeholder: '9123 4567', maxLength: 10 },
  { code: '+66', country: 'Thailand (ประเทศไทย)', format: 'X XXXX XXXX', placeholder: '8 1234 5678', maxLength: 12 },
  { code: '+60', country: 'Malaysia (مليسيا)', format: 'XX XXXX XXXX', placeholder: '12 3456 7890', maxLength: 13 },
  { code: '+84', country: 'Vietnam (Việt Nam)', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 12 },
  { code: '+62', country: 'Indonesia', format: 'XXX XXX XXXX', placeholder: '812 345 6789', maxLength: 14 },
  { code: '+63', country: 'Philippines (Pilipinas)', format: 'XXX XXX XXXX', placeholder: '917 123 4567', maxLength: 14 },
  { code: '+880', country: 'Bangladesh (বাংলাদেশ)', format: 'XXXX XXXXXX', placeholder: '1711 123456', maxLength: 14 },
  { code: '+94', country: 'Sri Lanka (ශ්‍රී ලංකාව)', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },
  { code: '+95', country: 'Myanmar (မြန်မာ)', format: 'X XXX XXXX', placeholder: '9 123 4567', maxLength: 11 },
  { code: '+977', country: 'Nepal (नेपाल)', format: 'XXX XXXXXXX', placeholder: '984 1234567', maxLength: 14 },
  { code: '+93', country: 'Afghanistan (افغانستان)', format: 'XX XXX XXXX', placeholder: '70 123 4567', maxLength: 13 },

  // Middle East
  { code: '+971', country: 'UAE (United Arab Emirates / الإمارات)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 12 },
  { code: '+966', country: 'Saudi Arabia (المملكة العربية السعودية)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 13 },
  { code: '+974', country: 'Qatar (قطر)', format: 'XXXX XXXX', placeholder: '3312 3456', maxLength: 10 },
  { code: '+973', country: 'Bahrain (البحرين)', format: 'XXXX XXXX', placeholder: '3312 3456', maxLength: 10 },
  { code: '+965', country: 'Kuwait (الكويت)', format: 'XXXX XXXX', placeholder: '5123 4567', maxLength: 10 },
  { code: '+968', country: 'Oman (عمان)', format: 'XXXX XXXX', placeholder: '9123 4567', maxLength: 10 },
  { code: '+962', country: 'Jordan (الأردن)', format: 'X XXXX XXXX', placeholder: '7 9012 3456', maxLength: 12 },
  { code: '+961', country: 'Lebanon (لبنان)', format: 'XX XXX XXX', placeholder: '71 123 456', maxLength: 11 },
  { code: '+972', country: 'Israel (ישראל)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 13 },
  { code: '+964', country: 'Iraq (العراق)', format: 'XXX XXX XXXX', placeholder: '750 123 4567', maxLength: 14 },

  // Oceania
  { code: '+61', country: 'Australia', format: 'XXX XXX XXX', placeholder: '412 345 678', maxLength: 12 },
  { code: '+64', country: 'New Zealand (Aotearoa)', format: 'XX XXX XXXX', placeholder: '21 123 4567', maxLength: 12 },
  { code: '+675', country: 'Papua New Guinea', format: 'XXX XXXX', placeholder: '684 5678', maxLength: 9 },
  { code: '+679', country: 'Fiji', format: 'XXX XXXX', placeholder: '701 2345', maxLength: 9 },

  // Africa
  { code: '+27', country: 'South Africa', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },
  { code: '+20', country: 'Egypt (مصر)', format: 'XX XXXX XXXX', placeholder: '10 1234 5678', maxLength: 14 },
  { code: '+234', country: 'Nigeria', format: 'XX XXXX XXXX', placeholder: '80 1234 5678', maxLength: 14 },
  { code: '+254', country: 'Kenya', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+212', country: 'Morocco (المغرب)', format: 'XX XXX XXXX', placeholder: '61 234 5678', maxLength: 13 },
  { code: '+216', country: 'Tunisia (تونس)', format: 'XX XXX XXX', placeholder: '20 123 456', maxLength: 11 },
  { code: '+233', country: 'Ghana', format: 'XX XXX XXXX', placeholder: '24 123 4567', maxLength: 13 },
  { code: '+251', country: 'Ethiopia (ኢትዮጵያ)', format: 'XX XXX XXXX', placeholder: '91 123 4567', maxLength: 13 },
  { code: '+255', country: 'Tanzania', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+256', country: 'Uganda', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+260', country: 'Zambia', format: 'XX XXX XXXX', placeholder: '95 123 4567', maxLength: 13 },
  { code: '+263', country: 'Zimbabwe', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },

  // South America
  { code: '+55', country: 'Brazil (Brasil)', format: 'XX XXXXX XXXX', placeholder: '11 98765 4321', maxLength: 15 },
  { code: '+54', country: 'Argentina', format: 'XX XXXX XXXX', placeholder: '11 1234 5678', maxLength: 14 },
  { code: '+56', country: 'Chile', format: 'X XXXX XXXX', placeholder: '9 1234 5678', maxLength: 12 },
  { code: '+57', country: 'Colombia', format: 'XXX XXX XXXX', placeholder: '300 123 4567', maxLength: 14 },
  { code: '+51', country: 'Peru (Perú)', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 12 },
  { code: '+58', country: 'Venezuela', format: 'XXX XXX XXXX', placeholder: '412 123 4567', maxLength: 14 },
  { code: '+593', country: 'Ecuador', format: 'XX XXX XXXX', placeholder: '99 123 4567', maxLength: 13 },
  { code: '+591', country: 'Bolivia', format: 'X XXX XXXX', placeholder: '7 123 4567', maxLength: 11 },
  { code: '+595', country: 'Paraguay', format: 'XXX XXX XXX', placeholder: '981 123 456', maxLength: 13 },
  { code: '+598', country: 'Uruguay', format: 'X XXX XXXX', placeholder: '9 123 4567', maxLength: 11 },
];

// Default format for unknown country codes
const defaultFormat = {
  format: 'XXX XXX XXXX',
  placeholder: '123 456 7890',
  maxLength: 15
};

/**
 * Detects if a column name is likely to be a phone number
 * @param {string} headerName - The column header name
 * @returns {boolean} - True if the column is likely a phone number
 */
export function isPhoneNumberColumn(headerName) {
  if (!headerName) return false;

  const lowerHeader = headerName.toLowerCase();
  const phoneKeywords = [
    'phone', 'mobile', 'cell', 'contact', 'tel', 'telephone',
    'whatsapp', 'number', 'cellphone', 'mob', 'fon', 'call',
    'ph', 'phone no', 'mobile no', 'contact no', 'ph no', 'ph number'
  ];

  return phoneKeywords.some(keyword => lowerHeader.includes(keyword));
}

/**
 * Checks if a phone number is already correctly formatted
 * @param {string} phoneNumber - The phone number to check
 * @returns {boolean} - True if the number is already correctly formatted
 */
function isAlreadyFormatted(phoneNumber) {
  // If it starts with a plus sign and has proper spacing, it might be already formatted
  if (phoneNumber.trim().startsWith('+') && phoneNumber.includes(' ')) {
    // Check if it matches a known country code pattern
    const plusAndDigits = phoneNumber.replace(/[^\d+]/g, '');

    // Check against known country codes
    for (const countryInfo of countryCodes) {
      const code = countryInfo.code.substring(1); // Remove the '+' from the code
      if (plusAndDigits.startsWith('+' + code)) {
        // It matches a known country code pattern
        return true;
      }
    }
  }

  return false;
}

/**
 * Detects the country code from a phone number
 * @param {string} phoneNumber - The phone number to analyze
 * @returns {string} - The detected country code or null
 */
export function detectCountryCode(phoneNumber) {
  if (!phoneNumber) return null;

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // If the number starts with a plus sign, it's likely in international format
  if (phoneNumber.trim().startsWith('+')) {
    // Get all country codes without the '+' sign
    const codes = countryCodes.map(country => country.code.substring(1))
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .sort((a, b) => b.length - a.length); // Sort from longest to shortest

    for (const code of codes) {
      if (digitsOnly.startsWith(code)) {
        return code;
      }
    }
  } else {
    // Check if the number starts with a country code without the plus sign
    const codes = countryCodes.map(country => country.code.substring(1))
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .sort((a, b) => b.length - a.length); // Sort from longest to shortest

    for (const code of codes) {
      if (digitsOnly.startsWith(code)) {
        return code;
      }
    }
  }

  // Check for numbers with specific patterns

  // UAE: 05x-xxx-xxxx (0501234567 -> +971 50 123 4567)
  if (digitsOnly.startsWith('05') && (digitsOnly.length >= 9 && digitsOnly.length <= 10)) {
    return '971';
  }

  // Pakistan: 03xx-xxxxxxx (03001234567 -> +92 300 123 4567)
  if (digitsOnly.startsWith('03') && (digitsOnly.length >= 10 && digitsOnly.length <= 11)) {
    return '92';
  }

  // UK: 07xxx-xxxxxx (07911123456 -> +44 7911 123 456)
  if (digitsOnly.startsWith('07') && (digitsOnly.length >= 10 && digitsOnly.length <= 11)) {
    return '44';
  }

  // India: 9/8/7/6xxxxxxxx (9876543210 -> +91 98765 12345)
  if ((digitsOnly.startsWith('9') || digitsOnly.startsWith('8') ||
       digitsOnly.startsWith('7') || digitsOnly.startsWith('6')) &&
      digitsOnly.length === 10) {
    return '91';
  }

  // US/Canada: xxx-xxx-xxxx (5551234567 -> +1 (555) 123-4567)
  if (digitsOnly.length === 10 && !digitsOnly.startsWith('0')) {
    return '1';
  }

  // Check for numbers that might be without country code but with area code
  // For example: 51 234 5678 (UAE without 971 or 0)
  for (const countryInfo of countryCodes) {
    const code = countryInfo.code.substring(1); // Remove the '+' from the code
    const formatLength = countryInfo.format.replace(/[^X]/g, '').length; // Count X's in format

    // If the number length matches the expected format length for this country
    if (digitsOnly.length === formatLength) {
      // For UAE: 51xxxxxxx (without 971 or 0)
      if (code === '971' && digitsOnly.startsWith('5') && digitsOnly.length === 9) {
        return '971';
      }
      // For Pakistan: 3xxxxxxxxx (without 92 or 0)
      else if (code === '92' && digitsOnly.startsWith('3') && digitsOnly.length === 10) {
        return '92';
      }
      // For UK: 7xxxxxxxxx (without 44 or 0)
      else if (code === '44' && digitsOnly.startsWith('7') && digitsOnly.length === 10) {
        return '44';
      }
    }
  }

  return null;
}

/**
 * Generates a preview of how a phone number will be formatted
 * @param {string} phoneNumber - The phone number to preview formatting for
 * @returns {object} - Object containing the formatted number and formatting details
 */
export function previewPhoneNumberFormat(phoneNumber) {
  if (!phoneNumber) return {
    formatted: phoneNumber,
    isValid: false,
    countryCode: null,
    countryName: null,
    originalFormat: phoneNumber,
    formatPattern: null
  };

  // If the number is already correctly formatted, return it with details
  if (isAlreadyFormatted(phoneNumber)) {
    // Extract the country code from the formatted number
    const match = phoneNumber.match(/^\+(\d+)/);
    const extractedCode = match ? match[1] : null;

    if (extractedCode) {
      const countryInfo = countryCodes.find(country => country.code === '+' + extractedCode);
      if (countryInfo) {
        return {
          formatted: phoneNumber,
          isValid: true,
          countryCode: extractedCode,
          countryName: countryInfo.country,
          originalFormat: phoneNumber,
          formatPattern: countryInfo.format
        };
      }
    }

    return {
      formatted: phoneNumber,
      isValid: true,
      countryCode: extractedCode,
      countryName: "Unknown",
      originalFormat: phoneNumber,
      formatPattern: null
    };
  }

  // Get the formatted number
  const formatted = formatPhoneNumber(phoneNumber);

  // If formatting didn't change anything, it's likely invalid
  if (formatted === phoneNumber) {
    return {
      formatted: phoneNumber,
      isValid: false,
      countryCode: null,
      countryName: null,
      originalFormat: phoneNumber,
      formatPattern: null
    };
  }

  // Extract the country code from the formatted number
  const match = formatted.match(/^\+(\d+)/);
  const extractedCode = match ? match[1] : null;

  if (extractedCode) {
    const countryInfo = countryCodes.find(country => country.code === '+' + extractedCode);
    if (countryInfo) {
      return {
        formatted: formatted,
        isValid: true,
        countryCode: extractedCode,
        countryName: countryInfo.country,
        originalFormat: phoneNumber,
        formatPattern: countryInfo.format
      };
    }
  }

  return {
    formatted: formatted,
    isValid: true,
    countryCode: extractedCode,
    countryName: "Unknown",
    originalFormat: phoneNumber,
    formatPattern: null
  };
}

/**
 * Formats a phone number based on its country code
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - The formatted phone number
 */
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return phoneNumber;

  // If the number is already correctly formatted, leave it as is
  if (isAlreadyFormatted(phoneNumber)) {
    return phoneNumber;
  }

  // Remove all non-digit characters
  const cleanedNumber = phoneNumber.trim();
  const digitsOnly = cleanedNumber.replace(/\D/g, '');

  // First, try to detect the country code
  let countryCode = detectCountryCode(phoneNumber);
  let localNumber = digitsOnly;

  if (countryCode) {
    // Handle different variations of the same number

    // Case 1: Number with country code (with or without +)
    // Examples: +971512345678, 971512345678
    if (digitsOnly.startsWith(countryCode)) {
      localNumber = digitsOnly.substring(countryCode.length);

      // Handle double country code (e.g., +9710512345678)
      if (countryCode === '971' && localNumber.startsWith('0')) {
        localNumber = localNumber.substring(1);
      }
      else if (countryCode === '92' && localNumber.startsWith('0')) {
        localNumber = localNumber.substring(1);
      }
      else if (countryCode === '44' && localNumber.startsWith('0')) {
        localNumber = localNumber.substring(1);
      }
      // Handle other countries with similar patterns
      else if (localNumber.startsWith('0')) {
        localNumber = localNumber.substring(1);
      }
    }
    // Case 2: Number with leading 0 (local format)
    // Examples: 0512345678 (UAE), 03001234567 (Pakistan)
    else if (digitsOnly.startsWith('0')) {
      // UAE: 05x -> 5x
      if (countryCode === '971' && digitsOnly.startsWith('05')) {
        localNumber = digitsOnly.substring(1); // Remove the leading 0
      }
      // Pakistan: 03xx -> 3xx
      else if (countryCode === '92' && digitsOnly.startsWith('03')) {
        localNumber = digitsOnly.substring(1); // Remove the leading 0
      }
      // UK: 07xxx -> 7xxx
      else if (countryCode === '44' && digitsOnly.startsWith('07')) {
        localNumber = digitsOnly.substring(1); // Remove the leading 0
      }
      // Generic case for other countries
      else {
        localNumber = digitsOnly.substring(1); // Remove the leading 0
      }
    }
    // Case 3: Number without country code or leading 0
    // Examples: 512345678 (UAE), 3001234567 (Pakistan)
    else {
      // For UAE: 51xxxxxxx (without 971 or 0)
      if (countryCode === '971' && digitsOnly.startsWith('5')) {
        localNumber = digitsOnly;
      }
      // For Pakistan: 3xxxxxxxxx (without 92 or 0)
      else if (countryCode === '92' && digitsOnly.startsWith('3')) {
        localNumber = digitsOnly;
      }
      // For UK: 7xxxxxxxxx (without 44 or 0)
      else if (countryCode === '44' && digitsOnly.startsWith('7')) {
        localNumber = digitsOnly;
      }
      // For other countries, use as is
      else {
        localNumber = digitsOnly;
      }
    }

    // Find the country format
    const countryInfo = countryCodes.find(country => country.code === '+' + countryCode);

    if (countryInfo) {
      // Apply the format pattern
      let formattedNumber = '+' + countryCode + ' ';
      let formatPattern = countryInfo.format;
      let currentIndex = 0;

      for (let i = 0; i < formatPattern.length; i++) {
        if (formatPattern[i] === 'X') {
          // Count consecutive X's to determine group size
          let groupSize = 1;
          while (i + groupSize < formatPattern.length && formatPattern[i + groupSize] === 'X') {
            groupSize++;
          }

          // Extract the group from the local number
          if (currentIndex < localNumber.length) {
            const group = localNumber.substring(
              currentIndex,
              Math.min(currentIndex + groupSize, localNumber.length)
            );
            formattedNumber += group;
            currentIndex += groupSize;
          }

          // Skip the rest of the X's in this group
          i += groupSize - 1;
        } else {
          // Add the separator character
          formattedNumber += formatPattern[i];
        }
      }

      // Add any remaining digits
      if (currentIndex < localNumber.length) {
        formattedNumber += ' ' + localNumber.substring(currentIndex);
      }

      return formattedNumber;
    }
  }

  // If we couldn't format the number, return it as is
  return phoneNumber;
}

/**
 * Gets a list of all supported country codes for display in UI
 * @returns {Array} - Array of country code objects with display information
 */
export function getSupportedCountryCodes() {
  return countryCodes.map(country => ({
    code: country.code,
    country: country.country,
    format: country.format,
    placeholder: country.placeholder,
    example: country.code + ' ' + country.placeholder
  }));
}

/**
 * Gets a formatted example for a specific country code
 * @param {string} countryCode - The country code (with or without +)
 * @returns {string} - A formatted example phone number
 */
export function getFormattedExample(countryCode) {
  // Ensure the country code is in the correct format
  const normalizedCode = countryCode.startsWith('+') ? countryCode : '+' + countryCode;

  const countryInfo = countryCodes.find(country => country.code === normalizedCode);
  if (!countryInfo) return null;

  return normalizedCode + ' ' + countryInfo.placeholder;
}
