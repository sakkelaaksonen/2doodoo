export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/main.css");
    eleventyConfig.addPassthroughCopy("src/*.js");
    eleventyConfig.addPassthroughCopy({"node_modules/mustache/mustache.mjs": "src/mustache.mjs"});
    eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.js": "src/qunit.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.css": "src/qunit.css"});
   
};
