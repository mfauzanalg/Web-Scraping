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
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();

        await this.page.goto(UDEMY_URL(udemy));

        await this.page.setViewport({
            width: 2000,
            height: 5000,
          });
      
    }

    async parseResult(){
         // wait page to load
         await this.page.waitForSelector(this.elements.titleSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.imageSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.descSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.authorSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.ratingSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.reviewSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.basePriceSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.discPriceSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.durationSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.lectureSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.levelSelector, {timeout: 30000});
        //  await this.page.waitForSelector(this.elements.urlSelector, {timeout: 30000});
         await this.autoScroll(this.page);
         await this.page.waitFor(3000);

        const elements = this.elements;

        let extractor = await this.page.evaluate((elements) => {
            window.scrollBy(0, window.innerHeight);
            

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
                return doc;
            }

            let infoArray = getDoc().then((res) => {
                for (let i = 0; i < res.titleNodeList.length; i++) {
                    let infoArray = [];
                    infoArray[i] = {
                      no : i,
                      title: res.titleNodeList[i].innerText,
                      image: res.imageNodeList[i].getAttribute('src'),
                      desc: res.descNodeList[i].innerText,
                      author: res.authorNodeList[i].innerText,
                      rating: res.ratingNodeList[i].innerText.replace('Rating: res.', '').replace(' out of 5', ''),
                      review: res.reviewNodeList[i].innerText.replace(' reviews', ''),
                      basePrice: res.basePriceNodeList[i].innerText,
                      discPrice: res.discPriceNodeList[i].textContent,
                      duration: res.durationNodeList[i].textContent,
                      numOfLecture: res.lectureNodeList[i].textContent,
                      level: res.levelNodeList[i].textContent,
                      url: res.urlNodeList[i].getAttribute('href')
                    };
                }
                console.log(infoArray);
                return infoArray;
            })

            infoArray.then((res) => res);
            
        }, elements);

        console.log(extractor);
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
                    console.log('wawa');
                    await this.page.waitForSelector(this.elements.titleSelector, {timeout: 30000});
                    
                } else{
                    console.log('fauzan');
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
            discPriceSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.course-card--discount-price--3TaBk.udlite-heading-md > span:nth-child(2) > span',
            basePriceSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.price-text--original-price--2e-F5.course-card--list-price--2AO6G.udlite-text-sm > div > span:nth-child(2) > s > span',
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