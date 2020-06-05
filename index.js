const fs = require("fs");
const udemy = require('./udemy');



(async () => {

    const udemy1 = new udemy();
    const udemy2 = new udemy();
    await udemy1.init('search/?kw=javascr&p=3&q=javascript&src=sac&persist_locale=&locale=en_US&previous_locale=es_ES');
    await udemy2.init('search/?kw=javascr&p=10&q=react&src=sac&persist_locale=&locale=en_US&previous_locale=es_ES');
    
    const results = udemy1.getResult(400);
    const results2 = udemy2.getResult(400);

    Promise.all([results, results2]).then((values) => {
        var merged = [].concat.apply([], values);
        console.log(merged);

        fs.writeFile("udemy_course.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
        });
    })

})();