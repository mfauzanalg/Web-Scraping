const puppeteer = require('puppeteer');

const UDEMY_URL = (udemy) => `https://www.udemy.com/courses/${udemy}`;


class udemyPage {

    constructor(){
        this.browser = null;
        this.page = null;
    }
    
    

    async init(udemy, elements) {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();

        await this.page.goto(UDEMY_URL(udemy));

        await this.page.setViewport({
            width: 1300,
            height: 2500,
          });
      
    }

    async parseResult(elements){
         // wait page to load
         await this.page.waitForSelector(elements.titleSelector, {timeout: 30000});
        //  await this.autoScroll(this.page);

        var extractor = await this.page.evaluate((elements) => {
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
    }

    async getResult(elements, nr){
        let results = [];

        do {

            let newResult = await this.parseResult(elements);

            results = [...results, ...newResult];
            console.log('guuguk');
            console.log(results.length)
            if (results.length < nr){
                console.log('miaw');
                let nextPageButton = await this.page.$('#udemy > div.main-content-wrapper > div.main-content > div > div > div.course-directory--container--5ZPhr > div.pagination--container--2wc6Z > a.udlite-btn.udlite-btn-small.udlite-btn-secondary.udlite-heading-sm.udlite-btn-icon.udlite-btn-icon-small.udlite-btn-icon-round.pagination--next--5NrLo');
                
                if (nextPageButton) {
                    console.log('hell u');
                    nextPageButton.click();
                    console.log('wawa');
                    await this.page.waitForResponse(response => response.ok())
                    await this.page.waitFor(3000)
                } else{
                    await this.browser.close();
                    break;
                    
                }
            }

        } while(results.length < nr);

        
        return results.slice(0, nr);

    }    

}


module.exports = udemyPage;