"use strict";

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function exists(p) {
  try {
    return Boolean(p) && fs.existsSync(p);
  } catch {
    return false;
  }
}

function firstExisting(candidates) {
  for (const c of candidates) {
    if (exists(c)) return c;
  }
  return null;
}

function profileSpec(profile) {
  const root = process.env.SystemRoot || "C:\\Windows";
  const pf = process.env.ProgramFiles || "C:\\Program Files";
  const pf86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
  const local = process.env.LOCALAPPDATA || "";
  const home = os.homedir();

  if (profile === "cmd") {
    const file = firstExisting([
      process.env.ComSpec,
      path.join(root, "System32", "cmd.exe"),
      "C:\\Windows\\System32\\cmd.exe",
    ]) || "cmd.exe";
    return { file, args: ["/Q", "/K", "chcp 65001 >nul"], name: "cmd" };
  }

  if (profile === "wsl") {
    const file = firstExisting([
      path.join(root, "System32", "wsl.exe"),
      "C:\\Windows\\System32\\wsl.exe",
    ]);
    if (!file) return null;
    return { file, args: ["-e", "bash", "-l"], name: "wsl" };
  }

  if (profile === "gitbash") {
    const file = firstExisting([
      path.join(pf, "Git", "bin", "bash.exe"),
      path.join(pf86, "Git", "bin", "bash.exe"),
      path.join(local, "Programs", "Git", "bin", "bash.exe"),
    ]);
    if (!file) return null;
    return { file, args: ["--login", "-i"], name: "gitbash" };
  }

  const pwsh = firstExisting([
    path.join(pf, "PowerShell", "7", "pwsh.exe"),
    path.join(home, "AppData", "Local", "Microsoft", "WindowsApps", "pwsh.exe"),
    path.join(root, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"),
    path.join(root, "SysWOW64", "WindowsPowerShell", "v1.0", "powershell.exe"),
  ]);
  const file = pwsh || "powershell.exe";
  const isPwsh7 = /pwsh\.exe$/i.test(file);
  return {
    file,
    args: isPwsh7
      ? ["-NoLogo", "-NoExit"]
      : ["-NoLogo", "-NoExit"],
    name: isPwsh7 ? "pwsh" : "powershell",
    bootstrap: [
      "$ProgressPreference='SilentlyContinue'",
      "[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false",
      "$OutputEncoding = [Console]::OutputEncoding",
      "[Console]::InputEncoding = [Console]::OutputEncoding",
    ].join("; ") + "\r\n",
  };
}

function spawnSession(profile, onData, onExit) {
  const spec = profileSpec(profile) || profileSpec("pwsh");
  const proc = spawn(spec.file, spec.args, {
    cwd: os.homedir(),
    env: {
      ...process.env,
      TERM: "xterm-256color",
      COLORTERM: "truecolor",
      PYTHONUNBUFFERED: "1",
    },
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  const send = (chunk) => {
    if (chunk) onData(String(chunk));
  };
  proc.stdout.on("data", send);
  proc.stderr.on("data", send);
  proc.on("error", (err) => send(`\r\n[AetherShell] could not start ${spec.file}: ${err.message}\r\n`));
  proc.on("exit", (code) => onExit(code));

  if (spec.bootstrap) {
    setTimeout(() => {
      try {
        proc.stdin.write(spec.bootstrap);
        proc.stdin.write("\r\n");
      } catch {
        /* process already gone */
      }
    }, 80);
  } else {
    setTimeout(() => {
      try {
        proc.stdin.write("\r\n");
      } catch {
        /* process already gone */
      }
    }, 80);
  }

  return {
    spec,
    write(data) {
      if (!proc.killed && proc.stdin.writable) proc.stdin.write(data);
    },
    kill() {
      try {
        proc.kill();
      } catch {
        /* already dead */
      }
    },
  };
}

module.exports = { spawnSession, profileSpec };
