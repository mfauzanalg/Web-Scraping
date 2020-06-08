const puppeteer = require('puppeteer');
const fs = require("fs");
const internetPage = require('./internetstats');


const getResult = async (region, link) => {

};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true});

    const asia = new internetPage(browser);
    const america = new internetPage(browser);
    const africa = new internetPage(browser);
    const europe = new internetPage(browser);
    const eunion = new internetPage(browser);
    const mideast = new internetPage(browser);
    const oceania = new internetPage(browser);

    await asia.init('https://www.internetworldstats.com/stats3.htm#asia');
    const results = asia.parseResult('Asia');

    await america.init('https://www.internetworldstats.com/stats2.htm#americas');
    const results2 = america.parseResult('America');

    await africa.init('https://www.internetworldstats.com/stats1.htm');
    const results3 = africa.parseResult('Africa');

    await europe.init('https://www.internetworldstats.com/stats4.htm#europe');
    const results4 = europe.parseResult('Europe');

    await eunion.init('https://www.internetworldstats.com/stats9.htm');
    const results5 = eunion.parseResult('European Union');

    await mideast.init('https://www.internetworldstats.com/stats5.htm#me');
    const results6 = mideast.parseResult('Middle East');

    await oceania.init('https://www.internetworldstats.com/stats6.htm');
    const results7 = oceania.parseResult('Oceania');
    
    await Promise.all([results, results2, results3, results4, results5, results6, results7]).then((values) => {
        var merged = [].concat.apply([], values);
        console.log(merged);

        fs.writeFile("internet_data.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
        });
    })

    browser.close();

})();