chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onInstalled.addListener(executeContentScriptsOnInstall);


async function init() {
    await initializeCurrency();
    await initializeTheme();
    await initializeLanguage();
}

async function executeContentScriptsOnInstall() {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({url: cs.matches})) {
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: cs.js,
          });
        }
      }
}