export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets/main.css");
    eleventyConfig.addPassthroughCopy("assets/!(*.test).js");
    eleventyConfig.addPassthroughCopy({"node_modules/mustache/mustache.mjs": "assets/mustache.mjs"});
    eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.js": "assets/qunit.js"});
    eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.css": "assets/qunit.css"});
   
};
