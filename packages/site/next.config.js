const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = {
  ...withNextra(),
  // cannot get standalone to work: broken links in .next/standalone/node_modules
  // output: "standalone",
};
