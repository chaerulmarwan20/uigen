const fs = require("fs");

const log = (msg) => {
  fs.appendFileSync(
    "/Users/chaerulmarwan/Desktop/development/anthropic-skilljar/claude-code-in-action/uigen/logs/post-tool-use.log",
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
    toolInput?.file_path ||
    toolInput?.path ||
    toolInput?.command ||
    toolInput?.pattern ||
    "";

  log(`post-tool-use ${JSON.stringify(hookData)}`);
  log(`🎉 Tool ${toolName} selesai dipanggil pada file ${readPath}`);

  process.exit(0); // jika ingin melanjutkan untuk memakai tool, berlaku untuk PreToolUse dan PostToolUse
}

main().catch((err) => {
  console.error(`Hook post-tool-use error: ${err.message}`);
  process.exit(1);
});
