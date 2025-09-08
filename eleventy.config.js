 export default function(eleventyConfig) {
    
    // Copy static assets
    eleventyConfig.addPassthroughCopy("main.css");


    eleventyConfig.addPassthroughCopy("main.js");

};