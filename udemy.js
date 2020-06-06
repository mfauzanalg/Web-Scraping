const puppeteer = require('puppeteer');

const UDEMY_URL = (udemy) => `https://www.udemy.com/courses/${udemy}`;


class udemyPage {

    constructor(){
        this.elements = null;
        this.browser = null;
        this.page = null;
    }
    
    async init(udemy) {
        this.elements = await this.getSelector();
        this.browser = await puppeteer.launch({  
            headless: false, // The browser is visible
            ignoreHTTPSErrors: true});

        this.page = await this.browser.newPage();

        await this.page.goto(UDEMY_URL(udemy));

        await this.page.setViewport({
            width: 1300,
            height: 9000,
          });
      
    }

    async parseResult(){
         // wait page to load
        await this.page.waitForSelector(this.elements.titleSelector, {timeout: 90000});

        await this.page.waitFor(2000);
        await this.autoScroll(this.page);

        const elements = this.elements;

        await this.page.waitFor(2000);

        let extractor = await this.page.evaluate((elements) => {
            // window.scrollBy(0, window.innerHeight);
           

            // select elements you want to extract
            async function getDoc() {
                doc = {
                    titleNodeList : await document.querySelectorAll(elements.titleSelector),
                    imageNodeList : await document.querySelectorAll(elements.imageSelector),
                    descNodeList : await document.querySelectorAll(elements.descSelector),
                    authorNodeList : await document.querySelectorAll(elements.authorSelector),
                    ratingNodeList : await document.querySelectorAll(elements.ratingSelector),
                    reviewNodeList : await document.querySelectorAll(elements.reviewSelector),
                    basePriceNodeList : await document.querySelectorAll(elements.basePriceSelector),
                    discPriceNodeList : await document.querySelectorAll(elements.discPriceSelector),
                    durationNodeList : await document.querySelectorAll(elements.durationSelector),
                    lectureNodeList : await document.querySelectorAll(elements.lectureSelector),
                    levelNodeList : await document.querySelectorAll(elements.levelSelector), 
                    urlNodeList : await document.querySelectorAll(elements.urlSelector),
                }
                console.log('udah semua');
                return doc;
            }

            let fauzan = getDoc().then((res) => {
                let infoArray = [];
                for (let i = 0; i < res.titleNodeList.length; i++) {
                    infoArray[i] = {
                      no : i,
                      title: res.titleNodeList[i].innerText,
                      image: res.imageNodeList[i] ? res.imageNodeList[i].getAttribute('src') : " ",
                      desc: res.descNodeList[i] ? res.descNodeList[i].innerText : 'undefined',
                      author: res.authorNodeList[i] ? res.authorNodeList[i].innerText : 'undefined',
                      rating: res.ratingNodeList[i] ? res.ratingNodeList[i].innerText : 'undefined',
                      review: res.reviewNodeList[i] ? res.reviewNodeList[i].innerText : 'undefined',
                      basePrice: res.basePriceNodeList[i] ? res.basePriceNodeList[i].innerText : 'undefined base price',
                      discPrice: res.discPriceNodeList[i] ? res.discPriceNodeList[i].textContent : 'undefined disc price',
                      duration: res.discPriceNodeList[i] ? res.durationNodeList[i].innerText : 'undefined duration',
                      numOfLecture: res.lectureNodeList[i] ? res.lectureNodeList[i].innerText : 'undefined',
                      level: res.levelNodeList[i] ? res.levelNodeList[i].textContent : 'All level',
                      url: res.urlNodeList[i] ? res.urlNodeList[i].getAttribute('href') : ' '
                    };
                }
                return infoArray;
            })

            return fauzan;
            
        }, elements);
        
        // console.log(extractor);
        return extractor;
    }

    async getResult(nr){
        let results = [];

        do {

            let newResult = await this.parseResult();

            results = [...results, ...newResult];
            console.log('guuguk');
            console.log(results.length)
            if (results.length < nr){
                console.log('miaw');
                let nextPageButton = await this.page.$('.udlite-btn-icon-small.udlite-btn-icon-round.pagination--next--5NrLo');
                
                if (nextPageButton) {
                    nextPageButton.click();
                    await this.page.waitForSelector(this.elements.titleSelector, {timeout: 30000});
                    
                } else{
                    break;
                }
            }
        } while(results.length < nr);

        await this.browser.close();
        return results.slice(0, nr);

    }    

    getSelector(){
        const mainContainer = `.course-card--large--1BVxY > div.course-card--main-content--3xEIw`
        const extraInfoSelector = `div.udlite-text-xs.course-card--course-meta-info--1hHb3`
        const priceSelector = `div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G`

        const elements = {
            titleSelector: `${mainContainer} > .course-card--course-title--2f7tE`,
            descSelector: `${mainContainer} > .course-card--course-headline--yIrRk`,
            authorSelector: `${mainContainer} > .course-card--instructor-list--lIA4f`,
            levelSelector: `${mainContainer} > ${extraInfoSelector} > span:nth-child(3)`,
            lectureSelector: `${mainContainer} > ${extraInfoSelector} > span:nth-child(2)`,
            durationSelector: `${mainContainer} > ${extraInfoSelector} > span:nth-child(1)`,
            urlSelector: `.course-list--container--3zXPS > div > .popover--popover--t3rNO > a`,
            reviewSelector: `${mainContainer} > .course-card--star-rating-wrapper--wwCqc > .udlite-sr-only`,
            imageSelector: `.course-card--large--1BVxY .course-card--image-wrapper--Sxd90 > .course-card--course-image--2sjYP`,
            ratingSelector: `${mainContainer} > .course-card--star-rating-wrapper--wwCqc > .star-rating--star-wrapper--2eczq > .udlite-sr-only`,
            discPriceSelector: 'div.course-card--main-content--3xEIw.course-card--has-price-text--1Ikr0 > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.course-card--discount-price--3TaBk.udlite-heading-md > span:nth-child(2) > span',
            basePriceSelector: 'div.course-card--main-content--3xEIw.course-card--has-price-text--1Ikr0 > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.price-text--original-price--2e-F5.course-card--list-price--2AO6G.udlite-text-sm > div > span:nth-child(2) > s > span',
        };
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

module.exports = udemyPage;