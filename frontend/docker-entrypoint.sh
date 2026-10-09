#!/bin/sh
set -eu

node <<'NODE'
const fs = require("node:fs");

const envFile = "/app/.env";
const fileEnv = {};

if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    // Ignore empty line and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    let value = match[2].trim();

    // Remove quotes from value
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      // Remove comments for this line
      value = value.replace(/\s+#.*$/, "").trim();
    }

    fileEnv[match[1]] = value;
  }
}

function getConfigValue(name) {
  // Use environment variable.
  // If it's empty, use the .env, otherwise "".
  return process.env[name] || fileEnv[name] || "";
}

const config = {
  NEXT_PUBLIC_URL_COG_SERVER: getConfigValue("NEXT_PUBLIC_URL_COG_SERVER"),
  NEXT_PUBLIC_URL_BACKEND_SERVER: getConfigValue("NEXT_PUBLIC_URL_BACKEND_SERVER"),
};

fs.writeFileSync(
  "/app/public/runtime-config.js",
  `window.__RUNTIME_CONFIG__ = ${JSON.stringify(config)};\n`,
  "utf8"
);

console.log("Runtime configuration generated.");
NODE

exec node /app/server.js