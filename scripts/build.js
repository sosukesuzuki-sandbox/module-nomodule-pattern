const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const template = require("./template");
const bundles = require("./bundles");

const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

async function isExistFile(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
  }
}

async function prepare(distPath) {
  if (!(await isExistFile(distPath))) {
    await mkdir(distPath);
  }
}

async function build() {
  const distPath = path.resolve(__dirname, "..", "dist");
  await prepare(distPath);
  const srcPath = path.resolve(__dirname, "..", "src");
  await Promise.all([
    template({ srcPath, distPath }),
    bundles({ srcPath, distPath }),
  ]);
}

build();
