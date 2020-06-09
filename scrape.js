const puppeteer = require('puppeteer');
const fs = require("fs");
const internetPage = require('./internetstats');
const speedPage = require('./speedtest')

// FUnctions
const getInternetResult = async (page, region, link) => {
    await page.init(link);
    return page.parseResult(region);
};

const getSpeedResult = async (page, type, link) => {
    await page.init(link);
    return page.parseResult(type);
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true});

    // Internet Usage WebPage
    const asia = new internetPage(browser);
    const america = new internetPage(browser);
    const africa = new internetPage(browser);
    const europe = new internetPage(browser);
    const eunion = new internetPage(browser);
    const mideast = new internetPage(browser);
    const oceania = new internetPage(browser);

    const asiaResult = getInternetResult(asia, 'Asia', 'https://www.internetworldstats.com/stats3.htm#asia');
    const americaResult = getInternetResult(america, 'America', 'https://www.internetworldstats.com/stats2.htm#americas');
    const africaResult = getInternetResult(africa, 'Africa', 'https://www.internetworldstats.com/stats1.htm');
    const europeResult = getInternetResult(europe, 'Europe', 'https://www.internetworldstats.com/stats4.htm#europe');
    const eunionResult = getInternetResult(eunion, 'European Union', 'https://www.internetworldstats.com/stats9.htm');
    const mideastResult = getInternetResult(mideast, 'Middle East', 'https://www.internetworldstats.com/stats5.htm#me');
    const oceaniaResult = getInternetResult(oceania, 'Oceania', 'https://www.internetworldstats.com/stats6.htm');
    
    let internetData = [];
    await Promise.all([asiaResult, americaResult, africaResult, europeResult, eunionResult, mideastResult, oceaniaResult]).then((values) => {
        internetData = [].concat.apply([], values);
    })


    // Speedtest WebPage
    const broadband = new speedPage(browser);
    const mobile = new speedPage(browser);

    const broadbandRes = getSpeedResult(broadband, 'broadband', 'https://www.speedtest.net/global-index');
    const mobileRes = getSpeedResult(mobile, 'mobile', 'https://www.speedtest.net/global-index');

    await Promise.all([broadbandRes, mobileRes]).then((values) => {
        let speedData = values[0].map((el) => {
            const idx = values[1].map(el2 => el2.name).indexOf(el.name);
            if (idx != -1) {
                el.mobile_speed = values[1][idx].broadband_speed;
            } else{
                el.mobile_speed = null;
            }
            return el;
        })

        let finalData = internetData.map((el3) => {
            const idx2 = speedData.map(el4 => el4.name).indexOf(el3.name);
            if (idx2 != -1){
                delete speedData[idx2].name;
                el3.speed_data = speedData[idx2];
            }
            else{
                el3.speed_data = null;
            }
            return el3;
        });


        fs.writeFile("data.json", JSON.stringify(finalData, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
            browser.close();
        });
    })
    
})();


