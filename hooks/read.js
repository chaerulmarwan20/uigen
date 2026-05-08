// function main() {
//   process.stdin.setEncoding("utf8");
//   let input = "";
//   process.stdin.on("data", (d) => (input += d));
//   process.stdin.on("end", () => {
//     const toolArgs = JSON.parse(input);
//     const readPath = toolArgs.tool_input?.file_path || "";
//     const grepPath = toolArgs.tool_input?.path || "";
//     const command = toolArgs.tool_input?.command || "";
//     const pattern = toolArgs.tool_input?.pattern || "";
//     if (
//       readPath.includes(".env") ||
//       command.includes(".env") ||
//       pattern.includes(".env") ||
//       grepPath.includes(".env")
//     ) {
//       console.error("You cannot read the .env file");
//       process.exit(2);
//     }
//     process.exit(0);
//   });
// }

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
    toolArgs.tool_input?.pattern ||
    "";

  // TODO: ensure Claude isn't trying to read the .env file
  if (readPath.includes(".env")) {
    console.error("You cannot read the .env file");
    process.exit(2);
  }
  process.exit(0);
}

main();
