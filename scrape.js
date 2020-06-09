const puppeteer = require('puppeteer');
const fs = require("fs");
const internetPage = require('./internetstats');
const speedPage = require('./speedtest')


const getResult = async (page, region, link) => {
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

    // const asia = new internetPage(browser);
    // const america = new internetPage(browser);
    // const africa = new internetPage(browser);
    // const europe = new internetPage(browser);
    // const eunion = new internetPage(browser);
    // const mideast = new internetPage(browser);
    // const oceania = new internetPage(browser);

    // const asiaResult = getResult(asia, 'Asia', 'https://www.internetworldstats.com/stats3.htm#asia');
    // const americaResult = getResult(america, 'America', 'https://www.internetworldstats.com/stats2.htm#americas');
    // const africaResult = getResult(africa, 'Africa', 'https://www.internetworldstats.com/stats1.htm');
    // const europeResult = getResult(europe, 'Europe', 'https://www.internetworldstats.com/stats4.htm#europe');
    // const eunionResult = getResult(eunion, 'European Union', 'https://www.internetworldstats.com/stats9.htm');
    // const mideastResult = getResult(mideast, 'Middle East', 'https://www.internetworldstats.com/stats5.htm#me');
    // const oceaniaResult = getResult(oceania, 'Oceania', 'https://www.internetworldstats.com/stats6.htm');
    
    // await Promise.all([asiaResult, americaResult, africaResult, europeResult, eunionResult, mideastResult, oceaniaResult]).then((values) => {
    //     var merged = [].concat.apply([], values);
    //     console.log(merged);

    //     fs.writeFile("internet_data.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
    //         if (err) throw err;
    //         console.log("Saved!");
    //         browser.close();
    //     });
    // })

    const broadband = new speedPage(browser);
    const broadbandRes = getSpeedResult(broadband, 'broadband', 'https://www.speedtest.net/global-index');

    const mobile = new speedPage(browser);
    const mobileRes = getSpeedResult(mobile, 'mobile', 'https://www.speedtest.net/global-index');

    await Promise.all([broadbandRes, mobileRes]).then((values) => {
        const merged = values[0].map((el) => {
            values[1].forEach((el2) => {
                if (el.name == el2.name){
                    el.mobile_speed = el2.broadbandSpeed;
                    console.log('sama');
                }
                else{
                    el.mobile_speed = 'hehe';
                }
            }) 
            return el;
        })

        fs.writeFile("internet_data.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
            browser.close();
        });
    })
    

})();