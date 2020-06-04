module.exports =  {
    // function to scroll at page you want to extract
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

    // elements selector from page you want to extract
    elements : {
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
    }
}
