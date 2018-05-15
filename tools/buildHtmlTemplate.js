const path = require('path');
const fs = require('fs');
const generateHtmlFile = require("./generateHtmlFile");

generateHtmlFile()
    .then(js => new Promise((resolve, reject) => {
        fs.writeFile(
            path.resolve(__dirname, "../src/template.ts"),
            js,
            err => err ? reject(err) : resolve());
    }))
    .then(() => console.log("Html template complete"))
    .catch(err => console.error(err));