const fs = require("fs");

const log = (msg) => {
  fs.appendFileSync(
    "/Users/chaerulmarwan/Desktop/development/anthropic-skilljar/claude-code-101/uigen/logs/notification.log",
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

  log(`notification ${JSON.stringify(hookData)}`);
  log("🔔 Notification dipanggil");

  process.exit(0);
}

main().catch((err) => {
  console.error(`Hook notification error: ${err.message}`);
  process.exit(1);
});
