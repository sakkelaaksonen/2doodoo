
export default function(eleventyConfig) {

  //Just copy css. Keep import paths trivial
  eleventyConfig.addPassthroughCopy("src/css",);
  
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };

  
};

