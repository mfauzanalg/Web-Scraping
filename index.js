const fs = require("fs");
const udemy = require('./udemy');



(async () => {

    const udemy1 = new udemy();
    const udemy2 = new udemy();
    const udemy3 = new udemy();
    const udemy4 = new udemy();

    await udemy1.init('search/?kw=javascr&p=1&q=vue&src=sac&persist_locale=&locale=en_US&previous_locale=es_ES');
    const results =  udemy1.getResult(420);

    await udemy2.init('search/?locale=en_US&p=1&persist_locale=&previous_locale=de_DE&q=javascript');
    const results2 = udemy2.getResult(420);

    await udemy3.init('search/?locale=en_US&p=1&persist_locale=&previous_locale=de_DE&q=react+js');
    const results3 =  udemy3.getResult(420);

    // await udemy4.init('search/?locale=en_US&p=1&persist_locale=&previous_locale=de_DE&q=angular+js');
    // const results4 = udemy4.getResult(400);
    

    Promise.all([results, results2, results3]).then((values) => {
        var merged = [].concat.apply([], values);
        console.log(merged);

        fs.writeFile("udemy_course.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
        });
    })

})();