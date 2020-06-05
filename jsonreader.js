const fs = require('fs');

let rawdata = fs.readFileSync('udemy_course.json');
let student = JSON.parse(rawdata);
console.log(student);