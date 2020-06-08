const fs = require("fs");
const internetPage = require('./internetstats');

(async () => {

    const asia = new internetPage();
    const america = new internetPage();
    const africa = new internetPage();

    await asia.init('https://www.internetworldstats.com/stats3.htm#asia');
    const results = asia.parseResult('Asia');

    await america.init('https://www.internetworldstats.com/stats2.htm#americas');
    const results2 = america.parseResult('America');

    await africa.init('https://www.internetworldstats.com/stats1.htm');
    const results3 = africa.parseResult('Africa');
    
    await Promise.all([results, results2, results3]).then((values) => {
        var merged = [].concat.apply([], values);
        console.log(merged);

        fs.writeFile("internet_data.json", JSON.stringify(merged, null, 2), 'utf8' ,function(err) {
            if (err) throw err;
            console.log("Saved!");
        });
    })

})();