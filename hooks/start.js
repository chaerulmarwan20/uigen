const fs = require("fs");

const log = (msg) => {
  fs.appendFileSync(
    "/Users/chaerulmarwan/Desktop/development/anthropic-skilljar/claude-code-in-action/uigen/logs/pre-tool-use.log",
    `${new Date()} - ${msg}\n`,
  );
};

async function main() {
  const input = await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

  const hookData = JSON.parse(input);
  const toolName = hookData.tool_name;
  const toolInput = hookData.tool_input;
  const readPath =
    toolInput?.file_path || toolInput?.path || toolInput?.command || "";
  const readPattern = toolInput?.pattern || "";

  if (readPath.includes(".env")) {
    console.error("You cannot read the .env file");
    process.exit(2); // jika ingin memblokir tool, hanya berlaku untuk PreToolUse
  }

  const sensitivePatterns = ["GMAP_KEY"];
  for (const sensitive of sensitivePatterns) {
    if (readPattern.toUpperCase().includes(sensitive)) {
      console.error(
        `Grep pattern "${readPattern}" looks like it's trying to find sensitive data`,
      );
      process.exit(2); // jika ingin memblokir tool, hanya berlaku untuk PreToolUse
    }
  }

  log(`pre-tool-use ${JSON.stringify(hookData)}`);
  log(`🚀 Tool ${toolName} mulai dipanggil pada file ${readPath}`);

  process.exit(0); // jika ingin melanjutkan untuk memakai tool, berlaku untuk PreToolUse dan PostToolUse
}

main().catch((err) => {
  console.error(`Hook pre-tool-use error: ${err.message}`);
  process.exit(1);
});
