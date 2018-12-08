browser.runtime.onInstalled.addListener(details => {
    if (details.reason === 'update') {
        onUpdate();
    } else if (details.reason === 'install') {
        onInstall();
    }
});

function onUpdate() {
    browser.tabs.create({
        url: 'update_page/update_page.html'
    });
}

function onInstall() {
    storage.set({
        dictionaryUrl: 'https://www.dictionary.com/browse/%phrase%?s=t&addon=true'
    });
}

browser.webRequest.onHeadersReceived.addListener(
    changeHeaders,
    {
        urls: ['https://*/*addon=true*'],
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);

function changeHeaders(details) {
    for (let header of details.responseHeaders) {
        if (header.name.toLowerCase() === "x-frame-options") {
            header.value = "ALLOW";
        }
    }

    return {responseHeaders: details.responseHeaders};
}

browser.webRequest.onBeforeRequest.addListener(
    blockRequest,
    {
        urls: [
            "*://js-sec.indexww.com/*",
            "*://*.amazon-adsystem.com/*",
            "*://cdn.heapanalytics.com/*",
            "*://*.google.com/*",
            "*://*.google.pl/*",
            "*://*.googletagservices.com/*",
            "*://*.google-analytics.com/*",
            "*://*.googletagmanager.com/*",
            "*://*.googlesyndication.com/*",
            "*://*.facebook.com/*",
            "*://*.facebook.net/*",
            "*://*.quantserve.com/*",
            "*://*.pubmatic.com/*",
            "*://*.bounceexchange.com/*"
        ]
    },
    ['blocking']
);

function blockRequest(details) {
    let dictionaryPattern = new RegExp(/.*addon=true.*/);
    if (details.originUrl.match(dictionaryPattern)) {
        return {cancel: true};
    }
}
