const puppeteer = require('puppeteer');

const UDEMY_URL = (udemy) => `https://www.udemy.com/${udemy}`;


const self = {

    browser: null,
    page: null,


    init: async (udemy, elements) => {
        self.browser = await puppeteer.launch({ headless: false });
        self.page = await self.browser.newPage();

        await self.page.goto(UDEMY_URL(udemy));

        await self.page.setViewport({
            width: 1300,
            height: 2500,
          });
      
    },

    parseResult: async (elements) => {
         // wait page to load
         await self.page.waitForSelector(elements.titleSelector, {timeout: 30000});
        //  await self.autoScroll(self.page);

        var extractor = await self.page.evaluate((elements) => {
            window.scrollBy(0, window.innerHeight);
            var infoArray = [];
            
            // select elements you want to extract
            var titleNodeList = document.querySelectorAll(elements.titleSelector);
    
            // create array of extracted data and save it in an array ob object
            for (var i = 0; i < titleNodeList.length; i++) {
              infoArray[i] = {
                no : i,
                title: titleNodeList[i].innerText
              };
            }
            return infoArray;
        }, elements);

        return extractor;
    },

    getResult: async (elements, nr) => {
        let results = [];

        do {

            let newResult = await self.parseResult(elements);

            results = [...results, ...newResult];
            console.log('guuguk');
            console.log(results.length)
            if (results.length < nr){
                console.log('miaw');
                let nextPageButton = await self.page.$('#udemy > div.main-content-wrapper > div.main-content > div > div > div.course-directory--container--5ZPhr > div.pagination--container--2wc6Z > a.udlite-btn.udlite-btn-small.udlite-btn-secondary.udlite-heading-sm.udlite-btn-icon.udlite-btn-icon-small.udlite-btn-icon-round.pagination--next--5NrLo');
                
                if (nextPageButton) {
                    console.log('hell u');
                    nextPageButton.click();
                    console.log('wawa');
                    await self.page.waitFor(2000)
                } else{
                    break;
                }
            }

        } while(results.length < nr);

        
        return results.slice(0, nr);

    },

    autoScroll : async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 50;
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
    },

}


module.exports = self;