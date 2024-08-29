async function initializeCurrency(checkValueExistsFn = null) {
    try {
        const currency = await get('currency');

        if (currency === undefined || (typeof checkValueExistsFn === 'function' && !checkValueExistsFn(currency))) {
            throw new Error('No currency value found');
        }
    } catch (error) {
        // Handle the scenario where the currency is not available or undefined
        const userCurrencyCode = getUserCurrencyCode();

        if (userCurrencyCode !== undefined) {
            save('currency', 'detect-currency');
        } else {
            save('currency', 'USD'); // If cannot detect user currency code, set USD as default
        }
    }
}

async function initializeTheme(checkValueExistsFn = null) {
    try {
        const theme = await get('theme');

        if (theme === undefined || (typeof checkValueExistsFn === 'function' && !checkValueExistsFn(theme))) {
            throw new Error('No theme value found');
        }
    } catch (error) {
        // Handle the scenario where the theme is not available or undefined
        // If there is no 'theme' value saved, set 'browser-theme' as default
        save('theme', 'browser-theme');
    }
}

async function initializeLanguage(checkValueExistsFn = null) {
    try {
        const language = await get('language');

        if (language === undefined  || (typeof checkValueExistsFn === 'function' && !checkValueExistsFn(language))) {
            throw new Error('No language value found');
        }
    } catch (error) {
        // Handle the scenario where the language is not available or undefined
        const browserLanguage = getBrowserLanguageFile();
        const defaultLanguage = 'en.json';

        if (browserLanguage !== undefined && Object.values(languages).includes(browserLanguage)) {
            save('language', 'browser-language');
        } else {
            save('language', defaultLanguage);
        }
    }
}

function getUserCurrencyCode() {
    const userCountryCode = getUserCountryCode();

    if (userCountryCode === undefined) return undefined;

    return countryCodeToCurrencyCode[userCountryCode];
}

function getUserCountryCode() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	if (timezone === '' || !timezone) {
		return undefined;
	}

	const countryCode = timezones[timezone].c[0];
    return countryCode;
}

async function save(name, value) {
    try {        
        const dataToSave = {};
        dataToSave[name] = value;

        chrome.storage.sync.set(dataToSave, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function get(name) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([name], function(result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[name]);
            }
        });
    });
}

function getBrowserLanguageFile() {
    if (chrome.i18n.getUILanguage() !== undefined) {
        return chrome.i18n.getUILanguage().substring(0, 2) + '.json'; 
    }
    return undefined;
}