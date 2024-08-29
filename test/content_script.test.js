document.addEventListener('DOMContentLoaded', initContentScriptTest, false);

async function initContentScriptTest() {
    console.clear();
    document.getElementById('run-content_script-tests').addEventListener('click', async () => {
        console.clear();
        await runContentScriptTests();
    });
}

async function runContentScriptTests() {
    await testDrawCurrencyRateDiv();
    await testRemoveCurrencyRateDiv();
    await testCorrectCurrencyRateDivBackgroundColor();
    await testShowCurrencyRates();
    testGuessCountryByCurrencyCode();
    testExtractNumber();
    testDetectCurrency();
    testGetPageCountryCode();
    testIsDarkTheme();
}

async function drawCurrencyRateDivMock() {
    // Select text and simulate mouseup event
    const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    const targetElement = document.getElementById('text-to-select');
    const startOffset = 0
    const endOffset = 5;

    mockTextSelection(targetElement, startOffset, endOffset);
    targetElement.dispatchEvent(mouseUpEvent);

    return await new Promise((resolve, reject) => {
        observeCurrencyRateDiv(resolve, reject);
    });
}

async function simulateSelectionChangeEvent() {
    if (window.getSelection) {
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            // await new Promise((resolve) => {
                setTimeout(() => {
                    selection.removeAllRanges();  
                    // resolve();
                }, 100);
            // });
        }
    }
}

async function testDrawCurrencyRateDiv() {
    try {
        await drawCurrencyRateDivMock();
        console.log('✅ Dynamic div has been drawn');
        // Simulate selection change event to remove the currency rate div
        await simulateSelectionChangeEvent();
    } catch(error) {
        console.log('❌ Currency rate div hasn\'t been drawn');
    }
}

async function testRemoveCurrencyRateDiv() {
    try {
        await drawCurrencyRateDivMock();
        await simulateSelectionChangeEvent();

        await new Promise((resolve) => {
            setTimeout(() => {
                const currencyRateDiv = document.getElementById('currency-rate-div');
    
                if (currencyRateDiv) {
                    console.error('❌ Currency rate div wasn\'t removed');
                } else {
                    console.log('✅ Currency rate div was removed');
                }
                resolve();
            }, 500)
        });
        
    } catch(error) {
        console.error('❌ Currency rate div hasn\'t been drawn');
    }
}

async function testCorrectCurrencyRateDivBackgroundColor() {
    const isDarkThemeOriginal = isDarkTheme;
    const isDarkThemeMocks = [
        async () => { return true; },
        async () => { return false; }
    ];

    for (const isDarkThemeMock of isDarkThemeMocks) {
        isDarkTheme = isDarkThemeMock;
        try {
            await drawCurrencyRateDivMock();
            
            const currencyRateDiv = document.getElementById('currency-rate-div');

            if (!await isDarkTheme() && currencyRateDiv.style.backgroundColor === 'rgb(244, 244, 244)') {
                console.log('✅ Correct currency rate div background color for light theme');
            } else if (await isDarkTheme() && currencyRateDiv.style.backgroundColor === 'rgb(244, 244, 244)') {
                console.error('❌ Not correct currency rate div background color for light theme');
            } else if (await isDarkTheme() && currencyRateDiv.style.backgroundColor === 'rgb(18, 18, 18)') {
                console.log('✅ Correct currency rate div background color for dark theme');
            } else if (!await isDarkTheme() && currencyRateDiv.style.backgroundColor === 'rgb(18, 18, 18)') {
                console.error('❌ Not correct currency rate div background color for dark theme');
            }

            // Simulate selection change event to hide the currency rate div
            await simulateSelectionChangeEvent();
        } catch(error) {
            console.log('❌ Currency rate div hasn\'t been drawn');
        } finally {
            isDarkTheme = isDarkThemeOriginal;
        }
    }
}

async function testShowCurrencyRates() {
    // Test case1 if all mocked functions return correct values
    await testShowCurrencyRate(
        async (propertyToGet) => { return 'PLN'; },
        () => { return 'PLN'; },
        (currency) => { return 'zł'; },
        async (from, to) => { return 1; },
        (str) => { return '20.0'; },
        (str) => { return str },
        '20.00 zł',
        'Test if currency rate div contains the correct text if all mocked functions return correct value'
    );

    // // Test case2 if get returns undefined
    await testShowCurrencyRate(
        async (propertyToGet) => { return undefined; },
        () => { return 'PLN'; },
        (currency) => { return 'zł'; },
        async (from, to) => { return 1; },
        (str) => { return '20.0'; },
        (str) => { return str; },
        'Cannot get the currency to which the conversion is to be done',
        'Test if currency rate div contains the correct text if the get function returns undefined'
    );

    // Test case3 if getCurrencySymbol returns undefined
    await testShowCurrencyRate(
        async (propertyToGet) => { return 'PLN'; },
        () => { return 'PLN'; },
        (currency) => { return undefined; },
        async (from, to) => { return 1; },
        (str) => { return '20.0'; },
        (str) => { return str; },
        'Cannot get the currency symbol',
        'Test if currency rate div contains the correct text if the getCurrencySymbol function returns undefined'
    );

    // Test case4 if getCurrencyRate returns undefined
    await testShowCurrencyRate(
        async (propertyToGet) => { return 'PLN'; },
        () => { return 'PLN'; },
        (currency) => { return 'zł'; },
        async (from, to) => { return undefined; },
        (str) => { return '20.0'; },
        (str) => { return str; },
        'Cannot get the currency rate',
        'Test if currency rate div contains the correct text if the getCurrencyRate function returns undefined'
    );

    // Test case5 if extractNumber returns undefined
    await testShowCurrencyRate(
        async (propertyToGet) => { return 'PLN'; },
        () => { return 'PLN'; },
        (currency) => { return 'zł'; },
        async (from, to) => { return 1; },
        (str) => { return undefined; },
        (str) => { return str; },
        'Cannot extract number from selected text',
        'Test if currency rate div contains the correct text if the extractNumber function returns undefined'
    );

    // Test case6 if getTranslation function returns undefined
    await testShowCurrencyRate(
        async (propertyToGet) => { return 'PLN'; },
        () => { return 'PLN'; },
        (currency) => { return 'zł'; },
        async (from, to) => { return 1; },
        (str) => { return undefined; },
        (str) => { return undefined; },
        'Cannot extract number from selected text',
        'Test if currency rate div contains the correct text if the getTranslation function returns undefined'
    );
}

async function testShowCurrencyRate(getMock,
                                    getUserCurrencyCodeMock,
                                    getCurrencySymbolMock,
                                    getCurrencyRateMock,
                                    extractNumberMock,
                                    getTranslationMock,
                                    expectedResult,
                                    testName) {
    const originalGet = get;
    const originalGetUserCurrencyCode = getUserCurrencyCode;
    const originalGetCurrencySymbol = getCurrencySymbol;
    const originalGetCurrencyRate = getCurrencyRate;
    const originalExtractNumber = extractNumber;
    const originalGetTranslation = getTranslation;

    get = getMock;
    getUserCurrencyCode = getUserCurrencyCodeMock;
    getCurrencySymbol = getCurrencySymbolMock;
    getCurrencyRate = getCurrencyRateMock;
    extractNumber = extractNumberMock;
    getTranslation = getTranslationMock;

    try {
        await drawCurrencyRateDivMock();
        const currencyRateDiv = document.getElementById('currency-rate-div');

        // Adding timeout, to avoid '...' when all mocked functions return correct values
        await new Promise((resolve) => {
            setTimeout(() => {
                // console.log(currencyRateDiv.innerHTML);
                assertEqual(currencyRateDiv.innerHTML, expectedResult, testName);
                resolve();
            }, 100);
        });

        // Simulate selection change event to hide the currency rate div
        await simulateSelectionChangeEvent();
    } catch(error) {
        console.log('❌ Currency rate div hasn\'t been drawn');
    } finally {
        get = originalGet;
        getUserCurrencyCode = originalGetUserCurrencyCode;
        getCurrencySymbol = originalGetCurrencySymbol;
        getCurrencyRate = originalGetCurrencyRate;
        extractNumber = originalExtractNumber;
        getTranslation = originalGetTranslation;
    }
}

function testGuessCountryByCurrencyCode() {
    const originalGetPageCountryCode = getPageCountryCode;
    const originalGetPageTopLayerDomain = getPageTopLayerDomain;

    // Test case 1: getPageCountryCode returns 'CA'
    getPageCountryCode = () => { return 'CA'; }
    assertEqual(
        guessCountryByCurrencyCode(['USD', 'AUD', 'CAD']),
        'CAD',
        'Test if guessCountryByCurrencyCode function returns correct country code if the page contain country code'
    );

    // Test case 2: getPageCountryCode returns 'No country code'
    getPageCountryCode = () => { return 'No country code'; }
    getPageTopLayerDomain = () => {return 'com'; }
    assertEqual(
        guessCountryByCurrencyCode(['USD', 'AUD', 'CAD']),
        'USD',
        'Test if guessCountryByCurrencyCode function returns correct country code if the page doesn\'t contain country code'
    );

    getPageCountryCode = originalGetPageCountryCode;
    getPageTopLayerDomain = originalGetPageTopLayerDomain;
}

function testExtractNumber() {
    // Test case 1:
    assertEqual(
        extractNumber('The price is $1,234'),
        1234,
        'Test case 1: Test if extractNumber function returns correct number from text'
    );

    // Test case 2:
    assertEqual(
        extractNumber('The price is $1 234'),
        1234,
        'Test case 2: Test if extractNumber function returns correct number from text'
    );

    // Test case 3:
    assertEqual(
        extractNumber('The price is $1,234.99'),
        1234.99,
        'Test case 3: Test if extractNumber function returns correct number from text'
    );

    // Test case 4:
    assertEqual(
        extractNumber('The price is $1,23'),
        1.23,
        'Test case 4: Test if extractNumber function returns correct number from text'
    );

    // Test case 5:
    assertEqual(
        extractNumber('The price is $1.23'),
        1.23,
        'Test case 5: Test if extractNumber function returns correct number from text'
    );
}

function testDetectCurrency() {
    assertEqual(
        detectCurrency('$'),
        'USD',
        'Test if detectCurrency function returns correct currency code for \'$\''
    );

    assertEqual(
        detectCurrency('L'),
        'Unknown currency',
        'Test if detectCurrency function returns unknown currency for \'L\''
    );
}

function testGetPageCountryCode() {
    assertEqual(
        getPageCountryCode(),
        'No country code',
        'Test if getPageCountry function returns \'No country code\'');
}

async function testIsDarkTheme() {
    const originalGet = get;
    const getMocks = [
        (property) => { return 'dark'; },
        (property) => { return 'light'; },
        (property) => { return 'browser-theme'; }
    ];

    const expectedReturns = [true, false, true];

    for (let i = 0; i < getMocks.length; i++) {
        get = getMocks[i];
        assertEqual(
            await isDarkTheme(),
            expectedReturns[i],
            'Test if isDarkTheme function returns correct value for ' + await get() + ' theme');
    }

    get = originalGet;
}

function mockTextSelection(element, start, end) {
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(element);
      const text = element.textContent;
      range.setStart(element.firstChild, start);
      range.setEnd(element.firstChild, end);
  
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  
      return text.substring(start, end);
    }

    return null;
}

async function observeCurrencyRateDiv(resolve, reject) {
    let isResolved = false;

    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (!isResolved && mutation.type === 'childList') {
          const currencyRateDiv = document.getElementById('currency-rate-div');
          if (currencyRateDiv) {
            observer.disconnect();
            isResolved = true;
            resolve('Found dynamic div');
          }
        }
      });
    });
  
    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // await new Promise((resolve) => {
        // setTimeout(() => {
        //     if (!isResolved) {
        //     observer.disconnect();
        //     reject('Currency rate div not found within the timeout');
        //     }
        // }, 1000);
    // });
    await new Promise((timeoutResolve, timeoutReject) => {
        setTimeout(() => {
          if (!isResolved) {
            observer.disconnect();
            timeoutReject('Currency rate div not found within the timeout');
          } else {
            timeoutResolve();
          }
        }, 1000);
    });
}