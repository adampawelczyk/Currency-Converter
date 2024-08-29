document.addEventListener('DOMContentLoaded', initPopupTest  , false);

function initPopupTest() {
    document.getElementById('run-popup-tests').addEventListener('click', () => {
        console.clear();
        runPopupTests();
    });
}

async function runPopupTests() {
    testCorrectListInitialization();
    testChangeTheme();
    testCheckValueExists();
    await testUpdateTranslation();
    testRemoveOptionByValue();
}

function testCorrectListInitialization() {
    const lists = [
        'currency-list',
        'language-list'
    ]

    const listSources = [
        countryNameToCurrencyCode,
        languages
    ]

    for (let i = 0; i < lists.length; i++) {
        const listLength = document.getElementById(lists[i]).options.length;
        assertEqual(
            listLength,
            Object.keys(listSources[i]).length + 1,
            'Test if ' + lists[i] + ' is properly initialized'
        );
    }
}

function testChangeTheme() {
    const themeNames = ['light', 'dark'];

    try {
        for (const themeName of themeNames) {
            changeTheme(themeName);

            const body = document.body;
            const topBar = document.getElementById('top-bar');

            if (!body.classList.contains(themeName) || !topBar.classList.contains(themeName)) {
                throw new Error(themeName);
            }

            const selectElements = document.querySelectorAll('select');
            selectElements.forEach(element => {
                if(!element.classList.contains(themeName)) {
                    throw new Error(themeName);
                }
            });

            console.log('✅ Test \'Test for correct classes when changing theme for theme: ' + themeName + '\' passed');
        }
    } catch (error) {
        console.error('❌ Test \'Test for correct classes when changing theme for theme: ' + error.message + '\' failed');
    } 
}

function testCheckValueExists() {
    // Test Case 1: Value exists in the list
    const list1 = document.createElement('select');
    const option1 = document.createElement('option');
    option1.value = 'apple';
    list1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'banana';
    list1.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = 'cherry';
    list1.appendChild(option3);

    const valueToCheck1 = 'banana';

    assertEqual(checkValueExists(list1, valueToCheck1), true, 'Test checkValueExists function if value exists in the list');

    // Test Case 2: Value does not exist in the list
    const list2 = document.createElement('select');
    const option4 = document.createElement('option');
    option4.value = 'orange';
    list2.appendChild(option4);

    const option5 = document.createElement('option');
    option5.value = 'grape';
    list2.appendChild(option5);

    const option6 = document.createElement('option');
    option6.value = 'kiwi';
    list2.appendChild(option6);

    const valueToCheck2 = 'apple';

    assertEqual(checkValueExists(list2, valueToCheck2), false, 'Test checkValueExists function if value does not exist in the list');

    // Test Case 3: Empty list
    const list3 = document.createElement('select');
    const valueToCheck3 = 'pear';

    assertEqual(checkValueExists(list3, valueToCheck3), false, 'Test checkValueExists function if list is empty');
}

async function testUpdateTranslation() {
    const response = await fetch(chrome.runtime.getURL('languages/en.json'));
    const translation = await response.json();

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
        json: async () => ({
            'app-name': 'Currency Converter',
            'currency-list-text': 'Convert to:',
            'detect-currency': 'Detect your currency',
            'language-list-text': 'Language:',
            'browser-language': 'Use Browser Language',
            'en.json': 'English',
            'pl.json': 'Polish - Polski',
            'de.json': 'German - Deutsch',
            'es.json': 'Spanish - Español',
            'it.json': 'Italian - Italiano',
            'theme-list-text': 'Theme:',
            'browser-theme': 'Use Browser Theme',
            'light': 'Light',
            'dark': 'Dark',
            'USD': 'United States Dollar',
            'GBP': 'British Pound Sterling',
        })
    });

    const originalGetElementById = globalThis.document.getElementById;
    globalThis.document.getElementById = (id) => ({
        textContent: '',
        value: id,
        appendChild: (element) => { this.textContent = element.textContent; }
    });

    const ids = ['app-name', 'currency-list-text', 'language-list-text', 'theme-list-text'];

    (async function() {
        await updateTranslation('en.json');

        for (const id of ids) {
            assertEqual(
                document.getElementById(id).textContent,
                translation[id],
                `Test translate element with the '${id}' id`
            );
        }

        const currencyList = document.getElementById('currency-list');
        for (const element of currencyList) {
            assertEqual(
                element.textContent,
                translation[element.value],
                `Test translation of currencyList ${element.value} element value`
            );
        }

        const languageList = document.getElementById('language-list');
        for (const element of languageList) {
            assertEqual(
                element.textContent,
                translation[element.value],
                `Test translation of languageList ${element.value} element value`
            );
        }

        const themeList = document.getElementById('theme-list');
        for (const element of themeList) {
            assertEqual(
                element.textContent,
                translation[element.value],
                `Test translation of themeList ${element.value} element value`
            );
        }
    })();

    

    globalThis.fetch = originalFetch;
    globalThis.document.getElementById = originalGetElementById;
}

function testRemoveOptionByValue() {
    // Test Case 1: Value exists in the list
    const list1 = document.createElement('select');
    const option1 = document.createElement('option');
    option1.value = 'apple';
    list1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = 'banana';
    list1.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = 'cherry';
    list1.appendChild(option3);

    const valueToRemove1 = 'banana';
    removeOptionByValue(list1, valueToRemove1);

    assertEqual(list1.length, 2, 'Test removeOptionByValue function if value exists in the list');

    // Test Case 2: Value does not exist in the list
    const list2 = document.createElement('select');
    const option4 = document.createElement('option');
    option4.value = 'orange';
    list2.appendChild(option4);

    const option5 = document.createElement('option');
    option5.value = 'grape';
    list2.appendChild(option5);

    const option6 = document.createElement('option');
    option6.value = 'kiwi';
    list2.appendChild(option6);

    const valueToRemove2 = 'apple';
    removeOptionByValue(list2, valueToRemove2)

    assertEqual(list2.length, 3, 'Test removeOptionByValue function if value does not exists in the list');

    // Test Case 3: Empty list
    const list3 = document.createElement('select');

    const valueToRemove3 = 'pear';
    checkValueExists(list3, valueToRemove3)

    assertEqual(list3.length, 0, 'Test removeOptionByValue function if list is empty');
}