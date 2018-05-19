const merge = require("webpack-merge");
const base = require("./base.config");

module.exports = merge(base, {
    entry: {
        "./dist/analogue-time-picker.min": "./index.ts"
    }
});