import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const LABEL = "com.resunexx.nexx-core-local-replication";
const INTERVAL_SECONDS = 6 * 60 * 60;

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

async function main() {
  if (process.env.NEXX_CORE_LOCAL_REPLICATION_TARGET !== "development") {
    throw new Error("Set NEXX_CORE_LOCAL_REPLICATION_TARGET=development to install the local replication schedule.");
  }
  if (process.platform !== "darwin" || typeof process.getuid !== "function") {
    throw new Error("The founder-owned local replication scheduler currently requires macOS.");
  }

  const home = homedir();
  const launchAgentsDirectory = join(home, "Library", "LaunchAgents");
  const logDirectory = join(home, ".resunexx", "nexx-core", "logs");
  const plistPath = join(launchAgentsDirectory, `${LABEL}.plist`);
  const runnerPath = join(process.cwd(), "scripts", "nexx-core-local-replication-runner.zsh");
  await mkdir(launchAgentsDirectory, { recursive: true, mode: 0o700 });
  await mkdir(logDirectory, { recursive: true, mode: 0o700 });

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key><array>
    <string>/bin/zsh</string>
    <string>${runnerPath}</string>
    <string>replicate</string>
  </array>
  <key>WorkingDirectory</key><string>${process.cwd()}</string>
  <key>EnvironmentVariables</key><dict>
    <key>NEXX_CORE_LOCAL_REPLICATION_TARGET</key><string>development</string>
  </dict>
  <key>StartInterval</key><integer>${INTERVAL_SECONDS}</integer>
  <key>StandardOutPath</key><string>${join(logDirectory, "replication.out.log")}</string>
  <key>StandardErrorPath</key><string>${join(logDirectory, "replication.error.log")}</string>
  <key>RunAtLoad</key><true/>
</dict></plist>`;
  await writeFile(plistPath, plist, { mode: 0o600 });

  const domain = `gui/${process.getuid()}`;
  await run("/bin/launchctl", ["bootout", domain, plistPath]).catch(() => undefined);
  await run("/bin/launchctl", ["bootstrap", domain, plistPath]);
  console.info(`[nexx-core] local replication schedule installed: every ${INTERVAL_SECONDS / 3600} hours.`);
}

main().catch((error: unknown) => {
  console.error("[nexx-core] schedule installation failed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
