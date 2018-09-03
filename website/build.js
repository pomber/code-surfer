const fs = require("fs");
const path = require("path");

const fixturesPath = path.resolve(__dirname, "../fixtures");
const publicPath = path.resolve(__dirname, "./public");
const distPath = path.resolve(__dirname, "./dist");

copyFolderRecursiveSync(publicPath, distPath);

const fixtures = fs.readdirSync(fixturesPath);
fixtures.forEach(fixture => {
  copyFolderRecursiveSync(
    path.join(fixturesPath, fixture, "dist"),
    path.join(distPath, fixture)
  );
});

// utils

function copyFileSync(source, target) {
  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = target;
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function(file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
