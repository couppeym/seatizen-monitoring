#!/bin/sh
set -eu

node <<'NODE'
const fs = require("node:fs");

const config = {
  NEXT_PUBLIC_URL_COG_SERVER: process.env.NEXT_PUBLIC_URL_COG_SERVER || "",
  NEXT_PUBLIC_URL_BACKEND_SERVER: process.env.NEXT_PUBLIC_URL_BACKEND_SERVER || "",
};

fs.writeFileSync(
  "/app/public/runtime-config.js",
  `window.__RUNTIME_CONFIG__ = ${JSON.stringify(config)};\n`,
  "utf8"
);

console.log("Runtime configuration generated:", {
  NEXT_PUBLIC_URL_COG_SERVER: config.NEXT_PUBLIC_URL_COG_SERVER,
  NEXT_PUBLIC_URL_BACKEND_SERVER: config.NEXT_PUBLIC_URL_BACKEND_SERVER,
});
NODE

exec node /app/server.js