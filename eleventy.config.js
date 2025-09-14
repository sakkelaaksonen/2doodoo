export default function (eleventyConfig) {
  //Just copy css. Keep import paths trivial
  eleventyConfig.addPassthroughCopy("src/css");

  //   eleventyConfig.addPassthroughCopy({ "node_modules/qunit/qunit.js": "js/qunit.js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/qunit/qunit/qunit.css": "css/qunit.css",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
}
