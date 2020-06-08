const puppeteer = require('puppeteer');

class internetPage {
    constructor(){
        this.elements = null;
        this.browser = null;
        this.page = null;
    }
    
    async init(url) {
        this.elements = await this.getSelector();
        this.browser = await puppeteer.launch({  
            headless: false,
            ignoreHTTPSErrors: true});

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
                if (region == 'Asia') {
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAsiaSelector));
                    idx.to = rowArrList.length - 3;
                }
                else if (region == 'America'){
                    idx.from = 3;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAmericaSelector));
                    idx.to = rowArrList.length - 2;
                }
                else if (region == 'Africa') {
                    idx.from = 2;
                    rowArrList =  Array.from(document.querySelectorAll(elements.rowAfricaSelector));
                    idx.to = rowArrList.length - 4;
                }
            }
            else if (region == 'Europe' || region == 'European Union'){
                idx.internetUsers = 2;
                idx.penetration = 3;
                idx.usersInRegion = 4;
                idx.facebookSubs = 5;
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
            rowAsiaSelector: `td td tr`,
            rowAmericaSelector: `p+ table tr`,
            rowAfricaSelector: `p+ table table tr`,
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