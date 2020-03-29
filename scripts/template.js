const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = async function ({ srcPath, distPath }) {
  const data = await readFile(path.resolve(srcPath, "index.html"), "utf8");
  await writeFile(path.resolve(distPath, "index.html"), data);
  console.log("Copied templates");
};
