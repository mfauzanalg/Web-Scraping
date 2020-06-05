const udemy = require('./udemy');

const elements = {
    titleSelector: '.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--course-title--2f7tE',
    imageSelector: '.course-card--large--1BVxY .course-card--image-wrapper--Sxd90 > .course-card--course-image--2sjYP',
    descSelector: '.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--course-headline--yIrRk',
    authorSelector: '.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--instructor-list--lIA4f',
    ratingSelector: '.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--star-rating-wrapper--wwCqc > .star-rating--star-wrapper--2eczq > .udlite-sr-only',
    reviewSelector: '.course-card--large--1BVxY > .course-card--main-content--3xEIw > .course-card--star-rating-wrapper--wwCqc > .udlite-sr-only',
    basePriceSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.price-text--original-price--2e-F5.course-card--list-price--2AO6G.udlite-text-sm > div > span:nth-child(2) > s > span',
    discPriceSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.price-text--container--Ws-fP.course-card--price-text-container--2sb8G > div.price-text--price-part--Tu6MH.course-card--discount-price--3TaBk.udlite-heading-md > span:nth-child(2) > span',
    durationSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(1)',
    lectureSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(2)',
    levelSelector: '.course-card--large--1BVxY > div.course-card--main-content--3xEIw > div.udlite-text-xs.course-card--course-meta-info--1hHb3 > span:nth-child(3)',
    urlSelector: '.course-list--container--3zXPS > div > .popover--popover--t3rNO > a',
};

(async () => {

    const objects = [];

    const udemy1 = new udemy();
    const udemy2 = new udemy();

    const initial = await udemy1.init('topic/nodejs/', elements);
    const initial2 = await udemy2.init('topic/nodejs/', elements);
    
    const results = udemy1.getResult(elements, 40);
    const results2 = udemy2.getResult(elements, 20);

    // results.then((res) => {objects.push(res); });
    // results2.then((res) => {objects.push(res); console.log(objects)});

    Promise.all([results, results2]).then((values) => {
        objects.push(values);
        console.log(objects[1][1]);
    })

})();