 export default function(eleventyConfig) {
    
    // Copy static assets
    eleventyConfig.addPassthroughCopy("assets/main.css");
    eleventyConfig.addPassthroughCopy("assets/*.js");

};