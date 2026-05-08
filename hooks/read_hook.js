async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // readPath is the path to the file that Claude is trying to read
  const readPath =
    toolArgs.tool_input?.file_path ||
    toolArgs.tool_input?.path ||
    toolArgs.tool_input?.command ||
    "";
  const readPattern = toolArgs.tool_input?.pattern || "";

  // ensure Claude isn't trying to read the .env file
  if (readPath.includes(".env")) {
    console.error("You cannot read the .env file");
    process.exit(2);
  }

  const sensitivePatterns = ["GMAP_KEY"];
  for (const sensitive of sensitivePatterns) {
    if (readPattern.toUpperCase().includes(sensitive)) {
      console.error(
        `Grep pattern "${readPattern}" looks like it's trying to find sensitive data`,
      );
      process.exit(2);
    }
  }

  process.exit(0);
}

main();
