const puppeteer = require('puppeteer');

class internetPage {
    constructor(browser){
        this.elements = null;
        this.browser = browser;
        this.page = null;
    }
    
    async init(url) {
        this.elements = await this.getSelector();
        this.page = await this.browser.newPage();

        await this.page.goto(url, {
            waitUntil: 'networkidle2',
          });

        await this.page.setViewport({
            width: 1300,
            height: 5000,
          });
      
    }

    async parseResult(region){
         // wait page to load
        await this.autoScroll(this.page);
        const elements = this.elements;
        console.log(`Scraping ${region}`)

        let extractor = await this.page.evaluate((elements, region) => {
            window.scrollBy(0, window.innerHeight);
            let infoArray = [];
            let rowArrList = null; 

            const idx = {};
            if (region == 'Asia' || region == 'America' || region == 'Africa' || region == 'Middle East' || region == 'Oceania'){
                idx.internetUsers = 3;
                idx.penetration = 4;
                idx.usersInRegion = 5;
                idx.facebookSubs = 6;
                if (region == 'Asia' || region == 'Middle East') {
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAsiaMidEastSelector));
                    idx.to = rowArrList.length - 3;
                    if (region == 'Middle East') idx.to = rowArrList.length - 4;
                }
                else if (region == 'America'){
                    idx.from = 3;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAmericaEuropeSelector));
                    idx.to = rowArrList.length - 2;
                }
                else if (region == 'Africa') {
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAfricaSelector));
                    idx.to = rowArrList.length - 4;
                }
                else if (region == 'Oceania'){
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowOceaniaSelector));
                    idx.to = rowArrList.length - 2;
                }
            }
            else if (region == 'Europe' || region == 'European Union'){
                idx.internetUsers = 2;
                idx.penetration = 3;
                idx.usersInRegion = 4;
                idx.facebookSubs = 5;

                if (region == 'Europe') {
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAmericaEuropeSelector));
                    idx.to = rowArrList.length - 2;
                }
                else if (region == 'European Union'){
                    idx.from = 6;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowEUSelector));
                    idx.to = rowArrList.length - 3;
                }
            }

            for (let i = idx.from; i < idx.to; i++){
                let country = null;
                country = {
                    name: rowArrList[i].cells[0].innerText,
                    region: region,
                    population: rowArrList[i].cells[1].innerText,
                    internetUsers: rowArrList[i].cells[idx.internetUsers].innerText,
                    penetration: rowArrList[i].cells[idx.penetration].innerText,
                    usersInRegion: rowArrList[i].cells[idx.usersInRegion].innerText,
                    facebookSubs: rowArrList[i].cells[idx.facebookSubs].innerText,
                }
                infoArray.push(country);
            }

            return infoArray;
        }, elements, region);
        
        return extractor;
    }

    getSelector(){
        const elements = {
            rowAsiaMidEastSelector: `td td tr`,
            rowAmericaEuropeSelector: `p+ table tr`,
            rowAfricaSelector: `p+ table table tr`,
            rowEUSelector: `table:nth-child(2) tr`,
            rowOceaniaSelector: `center center tr`,
        }
        return elements;
    }


    async autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 50);
            });
        });
    }

}

module.exports = internetPage;