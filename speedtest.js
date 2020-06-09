const puppeteer = require('puppeteer');

class speedPage {
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

    async parseResult(type){
         // wait page to load
        await this.autoScroll(this.page);
        const elements = this.elements;

        let extractor = await this.page.evaluate((elements, type) => {
            let nameNode;
            let speedNode;
            let infoArray = [];
            if (type == 'broadband'){
                nameNode = document.querySelectorAll(elements.nameBroadband);
                speedNode = document.querySelectorAll(elements.broadband);
            }
            else {
                nameNode = document.querySelectorAll(elements.nameMobile);
                speedNode = document.querySelectorAll(elements.mobile);
            }


            for (let i = 0; i < nameNode.length; i++){
                let country = null;
                country = {
                    name: nameNode[i].innerText.trim(),
                    broadband_speed: speedNode[i].innerText,
                    url: nameNode[i].href
                }
                infoArray.push(country);
            }

            return infoArray;
        }, elements, type);

        return extractor;
    }

    getSelector(){
        const elements = {
            nameBroadband: `#column-fixed a`,
            broadband: `#column-fixed .results .speed`,
            nameMobile: `#column-mobile a`,
            mobile: `#column-mobile .results .speed`
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

module.exports = speedPage;