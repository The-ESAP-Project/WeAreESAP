#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

try {
  const gitDate = execSync("git log -1 --format=%cd --date=format:%Y-%m-%d", {
    encoding: "utf-8",
  }).trim();

  const buildInfo = {
    version: packageJson.version,
    lastUpdated: gitDate,
    buildTime: new Date().toISOString().split("T")[0],
  };

  const outputPath = join(__dirname, "..", "data", "build-info.json");
  writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

  console.log("Build info generated:", buildInfo);
} catch (error) {
  console.error("Failed to generate build info, using defaults", error.message);

  const fallbackInfo = {
    version: packageJson.version,
    lastUpdated: new Date().toISOString().split("T")[0],
    buildTime: new Date().toISOString().split("T")[0],
  };

  const outputPath = join(__dirname, "..", "data", "build-info.json");
  writeFileSync(outputPath, JSON.stringify(fallbackInfo, null, 2));
}
