document.addEventListener('DOMContentLoaded', initSharedTest  , false);

async function initSharedTest() {
    document.getElementById('run-shared-tests').addEventListener('click', async () => {
        console.clear();
        await runSharedTests();
    });
}

// Mock data for testing
chromeMock = {
    storage: {
        sync: {
            data: {},
            set: function (dataToSave, callback) {
                Object.keys(dataToSave).forEach((key) => {
                    this.data[key] = dataToSave[key];
                });
                callback();
            },
            get: function (keys, callback) {
                const result = {};
                keys.forEach((key) => {
                    result[key] = this.data[key];
                });
                callback(result);
            },
            remove: function (keyToRemove) {
                delete this.data[keyToRemove];
            },
            clear: function () {
                this.data = {};
            }
        }
    },
    runtime: {
        lastError: null,
    },
    i18n: {
        getUILanguage: function() {
            return returnUndefinedLanguage ? undefined : 'en-US';
        },
    }
};

let originalChrome;

let returnUndefinedLanguage = false;

const tests = [
    testInitializeCurrencyFromStorage,
    testInitializeCurrencyWhenStorageNotAvailable,
    testInitializeCurrencyWhenStorageAndTimezoneNotAvailable,
    testInitializeCurrencyWhenCheckValueExistsFnReturnsFalse,
    testInitializeThemeFromStorage,
    testInitializeThemeWhenStorageNotAvailable,
    testInitializeThemeWhenCheckValueExistsFnReturnsFalse,
    testSaveFunction,
    testGetFunction,
    testGetFunctionErrorHandling,
    testGetUserCountryCodeFunction,
    testGetUserCurrencyCodeFunction,
    testGetBrowserLanguageFileFunction,
    testInitializeLanguageFromStorage,
    testInitializeLanguageWhenStorageNotAvailable,
    testInitializeLanguageWhenStorageAndBrowserLanguageNotAvailable,
    testInitializeLanguageWhenCheckValueExistsFnReturnsFalse
];

async function runSharedTests() {
    for (const testFunction of tests) {
        beforeTest();
        await testFunction();
        await afterTest();
    }
}

function beforeTest() {
    originalChrome = chrome;
    chrome = chromeMock;
}

async function afterTest() {
    await chrome.storage.sync.clear();
    chrome.runtime.lastError = null;
    chrome = originalChrome;
}

async function testInitializeCurrencyFromStorage() {
    save('currency', 'CAD');
    await initializeCurrency();
    const result = await get('currency');

    assertEqual(
        result,
        'CAD',
        'Test initializeCurrency function, when currency from storage is available'
    );
}

async function testInitializeCurrencyWhenStorageNotAvailable() {
    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: 'America/New_York' }) });

    await initializeCurrency();
    const result = await get('currency');

    assertEqual(
        result,
        'detect-currency',
        'Test initializeCurrency function when currency from storage is not available'
    );
}

async function testInitializeCurrencyWhenStorageAndTimezoneNotAvailable() {
    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: undefined }) });

    await initializeCurrency();
    const result = await get('currency');

    assertEqual(
        result,
        'USD',
        'Test initializeCurrency function when currency from storage and timezone are not available'
    );
}

async function testInitializeCurrencyWhenCheckValueExistsFnReturnsFalse() {
    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: 'America/New_York' }) });

    await initializeCurrency(() => {return false});
    const result = await get('currency');
    
    assertEqual(
        result,
        'detect-currency',
        'Test initializeCurrency function when checkValueExistsFn returns false'
    );
}

async function testInitializeThemeFromStorage() {
    save('theme', 'light');
    await initializeTheme();
    const result = await get('theme');

    assertEqual(
        result,
        'light',
        'Test initializeTheme function, when theme from storage is available'
    );
}

async function testInitializeThemeWhenStorageNotAvailable() {
    await initializeTheme();
    const result = await get('theme');

    assertEqual(
        result,
        'browser-theme',
        'Test initializeTheme function when currency from storage is not available'
    );
}

async function testInitializeThemeWhenCheckValueExistsFnReturnsFalse() {
    await initializeTheme(() => {return false});
    const result = await get('theme');
    
    assertEqual(
        result,
        'browser-theme',
        'Test initializeTheme function when checkValueExistsFn returns false'
    );
}

async function testInitializeLanguageFromStorage() {
    save('language', 'es.json');
    await initializeLanguage();
    const result = await get('language');

    assertEqual(
        result,
        'es.json',
        'Test initializeLanguage function, when language from storage is available'
    );
}

async function testInitializeLanguageWhenStorageNotAvailable() {
    await initializeLanguage();
    const result = await get('language');

    assertEqual(
        result,
        'browser-language',
        'Test initializeLanguage function when language from storage is not available'
    );
}

async function testInitializeLanguageWhenStorageAndBrowserLanguageNotAvailable() {
    returnUndefinedLanguage = true;
    await initializeLanguage();
    const result = await get('language');

    assertEqual(
        result,
        'en.json',
        'Test initializeLanguage function when storage and browser language are not available'
    );

    returnUndefinedLanguage = false;
}

async function testInitializeLanguageWhenCheckValueExistsFnReturnsFalse() {
    await initializeLanguage(() => {return false});
    const result = await get('language');
    
    assertEqual(
        result,
        'browser-language',
        'Test initializeLanguage function when checkValueExistsFn returns false'
    );
}

async function testSaveFunction() {
    await save('testKey', 'testValue');
    const result = await chrome.storage.sync.data['testKey'];
    assertEqual(result, 'testValue', 'Test save function');
}

async function testGetFunction() {
    chrome.storage.sync.data['testKey2'] = 'testValue2';
    const result = await get('testKey2');
    assertEqual(result, 'testValue2', 'Test get function');
}

async function testGetFunctionErrorHandling() {
    chrome.runtime.lastError = 'Some error occurred';
    const result = await get('nonExistingKey').catch(error => {
        return error;
    })
    assertEqual(result, 'Some error occurred', 'Test if get function properly handles non existing keys');
}

function testGetBrowserLanguageFileFunction() {
    const languageFile = getBrowserLanguageFile();

    assertEqual(
        languageFile,
        'en.json',
        'Test if getBrowserLanguageFile function returns the correct language file based on the browser language'
    );
}

function testGetUserCountryCodeFunction() {
    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: undefined }) });

    assertEqual(
        getUserCountryCode(),
        undefined,
        'Test if getUserCountryCode function returns undefined when timezone is undefined'
    );

    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: 'America/New_York' }) });
    
    assertEqual(
        getUserCountryCode(),
        'US',
        'Test if getUserCountryCode function returns correct country code for America/New_York timezone'
    );
}

function testGetUserCurrencyCodeFunction() {
    const getUserCountryCodeOriginal = getUserCountryCode;
    getUserCountryCode = () => undefined;

    assertEqual(
        getUserCurrencyCode(),
        undefined,
        'Test getUserCurrencyCode function returns undefined when getUserCountryCode returns undefined'
    );

    getUserCountryCode = () => 'US';

    assertEqual(
        getUserCurrencyCode(),
        'USD',
        'Test getUserCurrencyCode function returns correct currency code for US country code'
    );

    getUserCountryCode = getUserCountryCodeOriginal;
}