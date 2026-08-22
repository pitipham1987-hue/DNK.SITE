const fs = require("fs");
const path = require("path");

const MAX_FIELD_LEN = 500;

function truncate(val) {
  const s = typeof val === "string" ? val : JSON.stringify(val);
  return s.length > MAX_FIELD_LEN
    ? `${s.slice(0, MAX_FIELD_LEN)}…[truncated]`
    : s;
}

function truncateFields(obj) {
  if (!obj || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, truncate(v)]),
  );
}

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    const event = process.argv[2] || "Unknown";
    const sessionId = input.session_id || "unknown-session";

    const logDir = path.join(".claude", "logs");
    fs.mkdirSync(logDir, { recursive: true });
    const logFile = path.join(logDir, `${sessionId}.jsonl`);

    const entry = {
      timestamp: new Date().toISOString(),
      event,
      tool_name: input.tool_name,
      tool_input: truncateFields(input.tool_input),
    };

    if (event === "PostToolUse" && input.tool_response !== undefined) {
      entry.tool_response = truncateFields(input.tool_response);
    }

    fs.appendFileSync(logFile, `${JSON.stringify(entry)}\n`);
  } catch (e) {
    // best-effort audit logging; never block the tool call
  }
});
