import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

async function test() {
  try {
    // Create a dummy PDF buffer or read a real one if available
    // Since we don't have a real PDF, we'll try to just check if pdf-parse loads
    console.log("pdf-parse loaded successfully:", typeof pdf);
  } catch (e) {
    console.error("Failed:", e);
  }
}
test();
