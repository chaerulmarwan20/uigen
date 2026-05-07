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

  log(`post-tool-use ${JSON.stringify(hookData)}`);
  log(
    `🎉 Tool ${toolName} selesai dipanggil pada file ${toolInput?.file_path ?? "N/A"}`,
  );

  process.exit(0); // jika ingin melanjutkan memakai tool, berlaku untuk PreToolUse dan PostToolUse
  // process.exit(2); // jika ingin memblokir tool, hanya berlaku untuk PreToolUse
}

main().catch((err) => {
  console.error(`Hook error: ${err.message}`);
  process.exit(1);
});
