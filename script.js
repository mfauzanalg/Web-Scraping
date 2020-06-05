const base = require('./base.js');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
var fs = require('fs');

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword('green');


scrape = async (arrLink) => {
  
  try {
    // open the headless browser
    let browser = await puppeteer.launch({ headless: false });
    
    const arrResult = arrLink.map(async link => {
      // open a new page in the browser
      var page = await browser.newPage();

      // enter url in page
      await page.goto(link);
      
      // wait page to load
      await page.waitForSelector(base.elements.titleSelector, {timeout: 99999999});
      await base.autoScroll(page);
  
      // extract data from page
      var extractor = await page.evaluate((base) => {
          window.scrollBy(0, window.innerHeight);
          var infoArray = [];
          
          // select elements you want to extract
          var titleNodeList = document.querySelectorAll(base.elements.titleSelector);
          var imageNodeList = document.querySelectorAll(base.elements.imageSelector);
          var descNodeList = document.querySelectorAll(base.elements.descSelector);
          var authorNodeList = document.querySelectorAll(base.elements.authorSelector);
          var ratingNodeList = document.querySelectorAll(base.elements.ratingSelector);
          var reviewNodeList = document.querySelectorAll(base.elements.reviewSelector);
          var basePriceNodeList = document.querySelectorAll(base.elements.basePriceSelector);
          var discPriceNodeList = document.querySelectorAll(base.elements.discPriceSelector);
          var durationNodeList = document.querySelectorAll(base.elements.durationSelector);
          var lectureNodeList = document.querySelectorAll(base.elements.lectureSelector);
          var levelNodeList = document.querySelectorAll(base.elements.levelSelector); 
          var urlNodeList = document.querySelectorAll(base.elements.urlSelector);
  
          // create array of extracted data and save it in an array ob object
          for (var i = 0; i < titleNodeList.length; i++) {
            infoArray[i] = {
              no : i,
              title: titleNodeList[i].innerText,
              image: imageNodeList[i].getAttribute('src'),
              desc: descNodeList[i].innerText,
              author: authorNodeList[i].innerText,
              rating: ratingNodeList[i].innerText.replace('Rating: ', '').replace(' out of 5', ''),
              review: reviewNodeList[i].innerText.replace(' reviews', ''),
              basePrice: basePriceNodeList[i].textContent,
              discPrice: discPriceNodeList[i].textContent,
              duration: durationNodeList[i].textContent,
              numOfLecture: lectureNodeList[i].textContent,
              level: levelNodeList[i].textContent,
              url: urlNodeList[i].getAttribute('href')
            };
          }
          return infoArray;
        }, base);
  
      // close browser after extracting data
      await page.close();
      // await browser.close();
      console.log(success('Browser Closed'));

      // return the array of object data
      return extractor;
    });
    
    // wait until all pages are extracted
    const jsonString = await Promise.all(arrResult);
    await browser.close();
    // convert array of object to JSON file
    console.log([].concat.apply([], jsonString));

  }
  
  // Catch and display errors if it happens
  catch (err) {

    console.log(error(err));
    console.log(error('Browser Closed'));
  } 
}


// scrape every page in array link
scrape([`https://www.udemy.com/courses/search/?locale=en_US&p=1&persist_locale=&q=javascript&src=ukw`]);













