import fs from "fs";
import { execSync } from "child_process";

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/signaltest", { recursive: true });
fs.mkdirSync("dist/reactivity", { recursive: true });

// Copy files (simplest)
execSync("cp -r src/signaltest/* dist/signaltest/");
execSync("cp -r src/reactivity/* dist/reactivity/");
execSync("cp server.mjs dist/server.mjs");

console.log("Microrx build complete");
