let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    const file =
      (input.tool_input && input.tool_input.file_path) ||
      (input.tool_response && input.tool_response.filePath);
    if (!file) return;
    require("fs").copyFileSync(file, `${file}.bak`);
  } catch (e) {
    // best-effort backup; never block the tool call
  }
});
