export default function(eleventyConfig) {


  
  eleventyConfig.addPassthroughCopy("src/css",);
    // Using eleventyTemplates to bundle css and js for this project instead of build tools.

  eleventyConfig.addPassthroughCopy("src/js");
  
  //qunit:: TODO maybe bundle this from nodemodules with eleventy templates?
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
    // eleventyConfig.addPassthroughCopy({"node_modules/mustache/mustache.mjs": "src/mustache.mjs"});
    // eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.js": "src/qunit.js"});
    // eleventyConfig.addPassthroughCopy({"node_modules/qunit/qunit/qunit.css": "src/qunit.css"});
    
};

