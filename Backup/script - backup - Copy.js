const puppeteer = require('puppeteer');
const chalk = require('chalk');
var fs = require('fs');

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword('green');

let result = [];

scrape = async (url) => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: false });

    // open a new page
    var page = await browser.newPage();


    // enter url in page
    await page.goto(url);
    

    await page.waitFor(2000)
    await autoScroll(page);
    await page.waitForSelector('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--course-title--2f7tE');

    var extractor = await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);

        var infoArray = [];
        
        // Title
        var titleNodeList = document.querySelectorAll('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--course-title--2f7tE');

        // Image
        var imageNodeList = document.querySelectorAll('.course-card--large--1BVxY .course-card--image-wrapper--Sxd90 > .course-card--course-image--2sjYP');

        // Desc
        var descNodeList = document.querySelectorAll('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--course-headline--yIrRk');
        
        // Author
        var authorNodeList = document.querySelectorAll('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--instructor-list--lIA4f');

        // Rating
        var ratingNodeList = document.querySelectorAll('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--star-rating-wrapper--wwCqc > .star-rating--star-wrapper--2eczq > .udlite-sr-only');

        // Number of Reviews
        var reviewNodeList = document.querySelectorAll('.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--star-rating-wrapper--wwCqc > .udlite-sr-only');

        // Base Price
        var basePriceNodeList = document.querySelectorAll('.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.price-text--original-price--2e-F5.course-card--list-price--2AO6G.udlite-text-sm > div > span:nth-child(2) > s > span');
        
        // Discount Price
        var discPriceNodeList = document.querySelectorAll('.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.course-card--discount-price--3TaBk.udlite-heading-md > span:nth-child(2) > span');

        // Total Hours of Course
        var hourNodeList = document.querySelectorAll('.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(1)');

        // Number of Lectures
        var lectureNodeList = document.querySelectorAll('.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(2)');

        // Course Level
        var levelNodeList = document.querySelectorAll('.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(3)');

        // Course URL
        var urlNodeList = document.querySelectorAll('.course-list--container--3zXPS > div > .popover--popover--t3rNO > a');

        for (var i = 0; i < urlNodeList.length; i++) {
          infoArray[i] = {
            // no : i,
            title: titleNodeList[i].innerText,
            // image: imageNodeList[i].getAttribute('src'),
            // desc: descNodeList[i].innerText,
            // author: authorNodeList[i].innerText,
            // rating: ratingNodeList[i].innerText.replace('Rating: ', '').replace(' out of 5', ''),
            // review: reviewNodeList[i].innerText.replace(' reviews', ''),
            // basePrice: basePriceNodeList[i].textContent,
            // discPrice: discPriceNodeList[i].textContent,
            // duration: hourNodeList[i].textContent,
            // numOfLecture: lectureNodeList[i].textContent,
            // level: levelNodeList[i].textContent,
            // url: urlNodeList[i].getAttribute('href')
          };
        }
        return infoArray;
      });


    await browser.close();
    
    // Console Output
    
    console.log(success('Browser Closed'));
    return extractor;


  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error('Browser Closed'));
  }
}

async function autoScroll(page){
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
}


for (let i = 1; i < 3; i++){
  scrape(`https://www.udemy.com/courses/search/?locale=en_US&p=${i}&persist_locale=&q=javascript&src=ukw`).then(result => console.log(result));

}










