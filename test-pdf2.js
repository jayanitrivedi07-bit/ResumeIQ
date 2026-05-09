import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

async function test() {
  console.log("Type of pdf:", typeof pdf);
  console.log("Keys of pdf:", Object.keys(pdf));
}
test();
