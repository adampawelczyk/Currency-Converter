document.addEventListener('DOMContentLoaded', init  , false);

async function init() {
    initializeCurrencyList();
    initializeThemeList();
    initializeLanguageList();
}

async function initializeCurrencyList() {
    const currencyList = document.getElementById('currency-list');
    currencyList.addEventListener('change', currencyListChanged);

    populateSelectList(currencyList, countryNameToCurrencyCode, 'detect-currency');
    initializeCurrency(checkValueExists.bind(null, currencyList));

    const currency = await get('currency');
    currencyList.value = currency;
}

function currencyListChanged(event) {
    save('currency', event.target.value);
}

async function initializeThemeList() {
    const themeList = document.getElementById('theme-list');
    themeList.addEventListener('change', themeChanged);

    initializeTheme(checkValueExists.bind(null, themeList));

    const theme = await get('theme');
    themeList.value = theme;
    changeTheme(theme);
}

function themeChanged(event) {
    changeTheme(event.target.value);
    save('theme', event.target.value);
}

function changeTheme(themeName) {
    let isDark = false;

    if (themeName === 'browser-theme') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            isDark = true;
        }
    } else {
        isDark = themeName === 'dark';
    }

    const body = document.body;
    const topBar = document.getElementById('top-bar');

    body.classList.remove(isDark ? 'light' : 'dark');
    topBar.classList.remove(isDark ? 'light' : 'dark');
    body.classList.add(isDark ? 'dark' : 'light');
    topBar.classList.add(isDark ? 'dark' : 'light');

    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(element => {
        element.classList.remove(isDark ? 'light' : 'dark');
        element.classList.add(isDark ? 'dark' : 'light');
    });
}

async function initializeLanguageList() {
    const languageList = document.getElementById('language-list');
    languageList.addEventListener('change', languageListChanged);

    populateSelectList(languageList, languages, 'browser-language');
    initializeLanguage(checkValueExists.bind(null, languageList));

    const language = await get('language');
    languageList.value = language;
    updateTranslation(language);
}

function languageListChanged(event) {
    updateTranslation(event.target.value);
    save('language', event.target.value);
}

async function updateTranslation(language) {
    if (language === 'browser-language') {
        language = getBrowserLanguageFile();
    }

    const response = await fetch(chrome.runtime.getURL('languages/' + language));
    const translation = await response.json();

    const appName = document.getElementById('app-name');
    appName.textContent = translation['app-name'];

    const currencyListText = document.getElementById('currency-list-text');
    currencyListText.textContent = translation['currency-list-text'];
    const currencyList = document.getElementById('currency-list');

    for (const element of currencyList) {
        element.textContent = translation[element.value];
    }

    const languageListText = document.getElementById('language-list-text');
    languageListText.textContent = translation['language-list-text'];
    const languageList = document.getElementById('language-list');

    for (const element of languageList) {
        element.textContent = translation[element.value];
    }

    const themeListText = document.getElementById('theme-list-text');
    themeListText.textContent = translation['theme-list-text'];
    const themeList = document.getElementById('theme-list');

    for (const element of themeList) {
        element.textContent = translation[element.value];
    }
}

function populateSelectList(selectElement, dataList, defaultOption) {
    for (const key in dataList) {
        const option = document.createElement('option');
        option.value = dataList[key];
        option.text = key;
        selectElement.appendChild(option);
    }

    if (defaultOption && !checkValueExists(selectElement, defaultOption)) {
        removeOptionByValue(selectElement, defaultOption);
    }
}

function checkValueExists(list, value) {
    const options = list.options;
  
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        return true;
      }
    }
    return false;
}

function removeOptionByValue(list, value) {
    const options = list.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            list.remove(i);
            break;
        }
    }
}