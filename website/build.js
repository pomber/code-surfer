const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
ncp.limit = 1;

const fixturesPath = path.resolve(__dirname, "../fixtures");
const publicPath = path.resolve(__dirname, "./public");
const distPath = path.resolve(__dirname, "./dist");

copyFolder(publicPath, distPath);

const fixtures = fs.readdirSync(fixturesPath);
fixtures.forEach(fixture => {
  copyFolder(
    path.join(fixturesPath, fixture, "dist"),
    path.join(distPath, fixture)
  );
});

// utils

function copyFolder(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  ncp(source, target, function(err) {
    if (err) {
      return console.error(err);
    }
    console.log(`${target} done.`);
  });
}
