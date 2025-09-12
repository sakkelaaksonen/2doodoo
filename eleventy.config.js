export default function(eleventyConfig) {

  //Just copy css and js files. Keep import paths trivial
  eleventyConfig.addPassthroughCopy("src/css",);
  eleventyConfig.addPassthroughCopy("src/js");
  
  //QUnit assets
  eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.js": "/js/qunit.js"});
  eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.css": "/css/qunit.css"});
  
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };

    // eleventyConfig.addPassthroughCopy("src/main.css");
    // eleventyConfig.addPassthroughCopy("src/css");
    // eleventyConfig.addPassthroughCopy("src/*.js");
    eleventyConfig.addPassthroughCopy({"node_modules/mustache/mustache.mjs": "src/mustache.mjs"});
    
    // eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.css": "src/qunit.css"});
    
};

