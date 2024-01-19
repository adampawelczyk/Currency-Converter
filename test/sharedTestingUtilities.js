function assertEqual(actual, expected, testName) {
    if (actual === expected) {
      console.log(`✅ Test '${testName}' passed`);
    } else {
      console.error(`❌ Test '${testName}' failed: Expected ${expected}, but got ${actual}`);
    }
}

// Mocked global variables
const timezones = {
    'America/New_York': { c: ['US'] }
};

const countryCodeToCurrencyCode = {
    'US': 'USD',
    'CA': 'CAD'
};

const countryNameToCurrencyCode = {
    'United States Dollar': 'USD',
    'British Pound Sterling': 'GBP'
};

const currencySymbolToCurrencyCode = {
    '$': ['USD', 'AUD', 'CAD'],
};

const languages = {
    English: 'en.json',
    Polish: 'pl.json',
    German: 'de.json',
};