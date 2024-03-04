document.addEventListener('mouseup', showCurrencyRate);
document.addEventListener('selectionchange', hideCurrencyRate);

let currencyRateDiv = null;

async function showCurrencyRate() {
    const selectedText = window.getSelection().toString();
    const detectedCurrency = detectCurrency(selectedText.replace(/[0-9\s,.]+/g, ''));

    if (detectedCurrency === 'Unknown currency') return;

    try {
        await drawCurrencyRateDiv();

        let stringWithoutCurrency = extractNumber(selectedText);
        if (!stringWithoutCurrency) {
            throw new Error('Cannot extract number from selected text');
        }

        if (Array.isArray(stringWithoutCurrency)) {
            stringWithoutCurrency = stringWithoutCurrency[0];
        }

        let convertTo = await get('currency');
        if (!convertTo) {
            throw new Error('Cannot get the currency to which the conversion is to be done');
        }
        if (convertTo === 'detect-currency') {
            convertTo = getUserCurrencyCode();
        }

        let currencyCode = getCurrencySymbol(convertTo);
        if (!currencyCode) {
            throw new Error('Cannot get the currency symbol');
        }
        if (Array.isArray(currencyCode)) {
            currencyCode = currencyCode[0];
        }

        currencyRateDiv.innerHTML = '...';
        const response = await getCurrencyRate(detectedCurrency.toLowerCase(), convertTo.toLowerCase());
        if (!response) {
            throw new Error('Cannot get the currency rate');
        }

        const result = stringWithoutCurrency * response;
        const formattedResult = result.toFixed(2);
        currencyRateDiv.innerHTML = `${formattedResult} ${currencyCode}`;
    } catch(error) {
        if (currencyRateDiv) {
            const translatedMessage = await getTranslation(error.message);
            if (!translatedMessage) {
                currencyRateDiv.innerHTML = 'Error while translating message';
            } else {
                currencyRateDiv.innerHTML = translatedMessage;
            }
            
        }
    }
}

async function drawCurrencyRateDiv() {
    try {
        const selectionRange = window.getSelection().getRangeAt(0);
        const boundingRect = selectionRange.getBoundingClientRect();
        const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        if (currencyRateDiv) {
            currencyRateDiv.remove();
            currencyRateDiv = null;
        }

        currencyRateDiv = document.createElement("div");
        currencyRateDiv.setAttribute('id', 'currency-rate-div');
        currencyRateDiv.textContent = '';
        currencyRateDiv.style.position = "absolute";
        currencyRateDiv.style.top = boundingRect.bottom + scrollTop + "px"; // Position the div just below the selection
        currencyRateDiv.style.left = boundingRect.left + "px"; // Position the div at the leftmost point of the selection

        if (await isDarkTheme()) {
            currencyRateDiv.style.backgroundColor = '#121212';
            currencyRateDiv.style.color = "white";
        } else {
            currencyRateDiv.style.backgroundColor = '#f4f4f4';
            currencyRateDiv.style.color = "black";
        }

        currencyRateDiv.style.boxShadow = "3px 3px 10px -4px rgba(0, 0, 0, 1)";

        currencyRateDiv.style.padding = "10px";
        currencyRateDiv.style.marginTop = '5px';
        currencyRateDiv.style.borderRadius = "10px";

        document.body.insertAdjacentElement('beforeend', currencyRateDiv);
    } catch (error) {
        if (currencyRateDiv) {
            currencyRateDiv.remove();
            currencyRateDiv = null;
        }
    }
}

async function getTranslation(str) {
    try {
        let language = await get('language');

        if (language === 'browser-language') {
            language = getBrowserLanguageFile();
        }

        const response = await fetch(chrome.runtime.getURL('languages/' + language));
        const translation = await response.json();

        return translation[str];
    } catch (error) {
        return error.message;
    }
}

function hideCurrencyRate() {
    const selection = window.getSelection();
    if (currencyRateDiv && !selection.toString()) {
        currencyRateDiv.remove();
        currencyRateDiv = null;
    }
}

function getCurrencySymbol(countryCode) {

    return currencyCodeToSymbol[countryCode];
}

function extractNumber(str) {
    // Extract digits, dots, and commas
    let cleanedString = str.match(/[0-9., ]+/g);

    if (!cleanedString) return null;

    // Join the matched parts, replace commas with dots only if followed by three or more digits, 
    // or if followed by two digits and the end of the string, then remove spaces
    cleanedString = cleanedString.join('').replace(/,(?=\d{3}([^0-9]|$))/g, '').replace(/,(?=\d{2}$)/, '.').replace(/ /g, '');

    let result = parseFloat(cleanedString);

    return isNaN(result) ? null : result;
}

function detectCurrency(currencySymbol) {
    const currencyCode = currencySymbolToCurrencyCode[currencySymbol];

    if (currencyCode === undefined) return 'Unknown currency';

    if (Array.isArray(currencyCode)) return guessCountryByCurrencyCode(currencyCode);

    return currencyCode;
}

function guessCountryByCurrencyCode(currencyCodes) {
    const pageCountryCode = getPageCountryCode();
    let currencyCode = countryCodeToCurrencyCode[pageCountryCode];

    if (pageCountryCode !== "No country code" && currencyCodes.includes(currencyCode)) {
        return currencyCode;
    }

    if (currencyCodes.includes('USD') && getPageLanguageCode() === 'EN') {
        return 'USD';
    }

    const pageTopLayerDomain = getPageTopLayerDomain();
    currencyCode = countryCodeToCurrencyCode[pageTopLayerDomain];

    if (currencyCodes.includes(currencyCode)) return currencyCode;

    return currencyCodes[0];
}

function getPageCountryCode() {
    const lang = document.documentElement.lang;

    if (lang.includes('-')) {
      const countryCode = lang.split('-')[1].toUpperCase();
      return countryCode;
    } else {
      return "No country code";
    }
}

function getPageLanguageCode() {
    const lang = document.documentElement.lang;

    if (lang.includes('-')) {
        const languageCode = lang.split('-')[0].toUpperCase();
        return languageCode;
    } else {
        return lang.toUpperCase();
    }
}

function getPageTopLayerDomain() {
    return window.location.origin.split('.').pop().toUpperCase();
}

async function getCurrencyRate(from, to) {
    // Using data from the Currency API by Fawaz Ahmed (https://github.com/fawazahmed0/exchange-api)
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/' + from + '.json';
    const fallbackUrl = 'https://currency-api.pages.dev/v1/currencies/' + from + '.json';

    try {
        let response = await fetch(url);
        console.log(response);

        if (!response.ok) {
            response = await fetch(fallbackUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        }

        const data = await response.json();
        return data[from][to];
    } catch (error) {
        throw error;
    }
}

async function isDarkTheme() {
    const themeName = await get('theme');

    if (themeName === 'browser-theme') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
    } else {
        return themeName === 'dark';
    }

    return false;
}