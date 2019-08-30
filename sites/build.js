#!/usr/bin/env node

const fs = require("fs-extra");
const { join } = require("path");
const execa = require("execa");

async function main() {
  // Remove dist dir
  fs.removeSync(join(__dirname, "dist"));

  // List of subfolder names
  const siteDirNames = fs
    .readdirSync(__dirname)
    .filter(fileName => isDir(join(__dirname, fileName)));

  // Create dist dir
  fs.ensureDirSync(join(__dirname, "dist"));

  // for each site
  // install dependencies, build and copy to dist
  const siteBuilds = siteDirNames.map(async siteDirName => {
    console.log(`

    --- building ${siteDirName} ---

    `);
    const cwd = join(__dirname, siteDirName);
    const { stdout, stderr } = process;

    execa.commandSync("yarn", { cwd, stdout, stderr });
    execa.commandSync("yarn build", { cwd, stdout, stderr });

    if (fs.existsSync(join(cwd, "dist"))) {
      await fs.copy(join(cwd, "dist"), join(__dirname, "dist", siteDirName));
    } else if (fs.existsSync(join(cwd, "build"))) {
      await fs.copy(join(cwd, "build"), join(__dirname, "dist", siteDirName));
    } else {
      await fs.copy(join(cwd, "public"), join(__dirname, "dist", siteDirName));
    }
  });

  await Promise.all(siteBuilds);

  // Move all files and folders from ./dist/docs to ./dist
  fs.readdirSync(join(__dirname, "dist/docs")).forEach(fileName =>
    fs.moveSync(
      join(__dirname, "dist/docs", fileName),
      join(__dirname, "dist", fileName)
    )
  );
  fs.removeSync(join(__dirname, "dist/docs"));
}

main().catch(err => {
  console.error(err);
});

// utils

function isDir(source) {
  return fs.lstatSync(source).isDirectory();
}
