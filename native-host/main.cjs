"use strict";

const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain, nativeImage, clipboard, shell } = require("electron");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const { spawnSession } = require("./pty.cjs");
const lens = require("./lens.cjs");

/** @type {BrowserWindow | null} */
let win = null;
/** @type {Tray | null} */
let tray = null;
let visible = false;
let mode = "float";
let coverage = { w: 100, h: 48 };
let fontSize = 14;
let opacity = 1;
let startHidden = false;
const sessions = new Map();
/** @type {import('node:child_process').ChildProcess | null} */
let clipWatch = null;
let lastClipFiles = [];
let lastClipAt = "";
let lastCpu = process.cpuUsage();
let lastCpuAt = Date.now();
let hiddenNoted = false;
let seenOpen = false;

function rendererUrl() {
  return path.join(__dirname, "dist-renderer", "shell.html");
}

function iconImage() {
  return nativeImage.createFromPath(path.join(__dirname, "resources", "icon.png"));
}

function histPath() {
  return path.join(app.getPath("userData"), "history.json");
}

function loadHist() {
  try {
    return JSON.parse(fs.readFileSync(histPath(), "utf8"));
  } catch {
    return {};
  }
}

function saveHist(h) {
  try {
    fs.writeFileSync(histPath(), JSON.stringify(h, null, 2));
  } catch {
    /* ignore */
  }
}

function bodyPath() {
  return path.join(app.getPath("userData"), "body.json");
}

function loadBody() {
  try {
    const j = JSON.parse(fs.readFileSync(bodyPath(), "utf8"));
    if (j.mode) mode = j.mode;
    if (j.coverage) coverage = j.coverage;
    if (j.fontSize) fontSize = Number(j.fontSize);
    if (j.opacity) opacity = Number(j.opacity);
    if (typeof j.startHidden === "boolean") startHidden = j.startHidden;
  } catch {
    /* first run */
  }
}

function saveBody() {
  try {
    fs.writeFileSync(bodyPath(), JSON.stringify({ mode, coverage, fontSize, opacity, startHidden }, null, 2));
  } catch {
    /* ignore */
  }
}

function clearPocket() {
  hiddenNoted = false;
  if (tray) tray.setToolTip("AetherShell");
}

function notePocket() {
  if (visible || hiddenNoted || !tray || !seenOpen) return;
  hiddenNoted = true;
  tray.setToolTip("AetherShell · output waiting");
  try {
    tray.displayBalloon({
      icon: iconImage(),
      title: "AetherShell",
      content: "The hidden shell printed something. Ctrl+Shift+A to show.",
    });
  } catch {
    /* balloon optional */
  }
}

function sampleMetrics() {
  const now = process.cpuUsage();
  const t = Date.now();
  const elapsedUs = Math.max(1, (t - lastCpuAt) * 1000);
  const used = now.user - lastCpu.user + (now.system - lastCpu.system);
  lastCpu = now;
  lastCpuAt = t;
  const cpu = Math.min(100, Math.round((used / elapsedUs) * 100));
  const mem = Math.round((1 - os.freemem() / os.totalmem()) * 100);
  return { cpu, mem };
}

function targetDisplay() {
  try {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  } catch {
    return screen.getPrimaryDisplay();
  }
}

function visibleBounds() {
  const wa = targetDisplay().workArea;
  if (mode === "float") {
    const width = Math.min(980, Math.max(720, wa.width - 80));
    const height = Math.min(560, Math.max(380, Math.round(wa.height * 0.58)));
    return {
      x: Math.round(wa.x + (wa.width - width) / 2),
      y: Math.round(wa.y + 40),
      width,
      height,
    };
  }
  if (mode === "hud") {
    const width = Math.round(Math.min(wa.width * 0.72, wa.width - 24));
    return { x: Math.round(wa.x + (wa.width - width) / 2), y: wa.y + 8, width, height: 140 };
  }
  const width = Math.round(wa.width * (coverage.w / 100));
  const height = Math.round(wa.height * (coverage.h / 100));
  const x = Math.round(wa.x + (wa.width - width) / 2);
  return { x, y: wa.y, width, height };
}

function placeVisible() {
  if (!win || win.isDestroyed()) return;
  win.setBounds(visibleBounds());
  win.setOpacity(opacity);
  win.setAlwaysOnTop(true, "floating");
  win.show();
  win.moveTop();
  win.focus();
  visible = true;
  seenOpen = true;
  clearPocket();
  emit("win:shown");
}

function hideWindow() {
  if (!win || win.isDestroyed()) return;
  win.hide();
  visible = false;
  hiddenNoted = false;
}

function showWindow() {
  if (!win || win.isDestroyed()) {
    createWindow();
    return;
  }
  placeVisible();
}

function toggleWindow() {
  if (visible && win && win.isVisible()) hideWindow();
  else showWindow();
}

function applyMode(next) {
  mode = next || mode;
  saveBody();
  showWindow();
}

function emit(channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function createSession(profile) {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const session = spawnSession(profile || "pwsh", (data) => {
    emit("pty:data", { id, data });
    notePocket();
  }, (code) => {
    emit("pty:exit", { id, code });
    sessions.delete(id);
  });
  sessions.set(id, session);
  return { id, name: session.spec.name, file: session.spec.file };
}

function killAll() {
  for (const s of sessions.values()) s.kill();
  sessions.clear();
  if (clipWatch && !clipWatch.killed) {
    try { clipWatch.kill(); } catch { /* */ }
    clipWatch = null;
  }
}

function startClipWatch() {
  if (clipWatch && !clipWatch.killed) return;
  const script = [
    "Add-Type -AssemblyName System.Windows.Forms | Out-Null",
    "$last = ''",
    "while ($true) {",
    "  Start-Sleep -Milliseconds 400",
    "  try {",
    "    $list = [System.Windows.Forms.Clipboard]::GetFileDropList()",
    "    if ($list -and $list.Count -gt 0) {",
    "      $s = ($list | ForEach-Object { $_.ToString() }) -join '|'",
    "      if ($s -ne $last) { $last = $s; Write-Output $s }",
    "    }",
    "  } catch { }",
    "}",
  ].join("; ");
  try {
    clipWatch = spawn("powershell.exe", ["-NoProfile", "-STA", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", script], {
      windowsHide: true,
    });
    clipWatch.stdout.on("data", (buf) => {
      const line = String(buf || "").trim();
      const files = line.split("|").map((s) => s.trim()).filter((s) => /^[A-Za-z]:\\/.test(s) || s.startsWith("\\\\"));
      if (files.length) {
        lastClipFiles = files;
        lastClipAt = new Date().toISOString();
      }
    });
    clipWatch.stderr.on("data", () => {});
    clipWatch.on("exit", () => { clipWatch = null; });
  } catch {
    clipWatch = null;
  }
}

function createWindow() {
  if (win && !win.isDestroyed()) return;
  const b = visibleBounds();
  win = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    show: false,
    frame: false,
    transparent: false,
    backgroundColor: "#0a0c10",
    opacity: opacity,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    resizable: true,
    autoHideMenuBar: true,
    icon: iconImage(),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
      webviewTag: true,
      backgroundThrottling: false,
    },
  });
  win.setAlwaysOnTop(true, "floating");
  win.once("ready-to-show", () => {
    if (startHidden) {
      win.hide();
      visible = false;
    } else placeVisible();
  });
  win.loadFile(rendererUrl());
  win.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") return;
    if (input.key === "Escape" || input.code === "Escape") {
      event.preventDefault();
      emit("win:escape");
      return;
    }
    if (input.control && (input.key === "Tab" || input.code === "Tab")) {
      event.preventDefault();
      emit(input.shift ? "win:prev-tab" : "win:next-tab");
      return;
    }
    const k = String(input.key || "");
    if (input.control && !input.alt && (k === "f" || k === "F")) {
      event.preventDefault();
      emit("win:find");
      return;
    }
    if (input.control && !input.alt && (k === "=" || k === "+" || k === "Add")) {
      event.preventDefault();
      emit("win:font-up");
      return;
    }
    if (input.control && !input.alt && (k === "-" || k === "_" || k === "Subtract")) {
      event.preventDefault();
      emit("win:font-down");
      return;
    }
    if (input.control && !input.alt && !input.shift && (k === "v" || k === "V")) {
      event.preventDefault();
      emit("win:paste");
    }
  });
  win.on("closed", () => {
    win = null;
    visible = false;
  });
  setTimeout(() => {
    if (startHidden) return;
    if (win && !win.isDestroyed() && !win.isVisible()) placeVisible();
  }, 1200);
}

function refreshTray() {
  if (!tray) return;
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Show panel", click: () => showWindow() },
      { label: "Hide panel", click: () => hideWindow() },
      { type: "separator" },
      { label: "Mode: Quake", click: () => applyMode("quake") },
      { label: "Mode: Float", click: () => applyMode("float") },
      { label: "Mode: Dock", click: () => applyMode("dock") },
      { label: "Mode: HUD", click: () => applyMode("hud") },
      { type: "separator" },
      {
        label: "Start with Windows",
        type: "checkbox",
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) => app.setLoginItemSettings({ openAtLogin: item.checked }),
      },
      {
        label: "Start in tray (no panel)",
        type: "checkbox",
        checked: startHidden,
        click: (item) => {
          startHidden = !!item.checked;
          saveBody();
        },
      },
      { type: "separator" },
      { label: "Dev dump (this session)", click: () => { showWindow(); emit("win:dump"); } },
      { type: "separator" },
      { label: "Quit AetherShell", click: () => app.quit() },
    ]),
  );
}

function createTray() {
  tray = new Tray(iconImage());
  tray.setToolTip("AetherShell");
  refreshTray();
  tray.on("click", () => toggleWindow());
}

function registerHotkeys() {
  globalShortcut.unregisterAll();
  const keys = ["CommandOrControl+`", "Alt+`", "CommandOrControl+Shift+A", "CommandOrControl+Alt+A"];
  let any = false;
  for (const k of keys) {
    try {
      if (globalShortcut.register(k, () => toggleWindow())) any = true;
    } catch {
      /* layout may not have the key */
    }
  }
  if (!any) globalShortcut.register("CommandOrControl+Shift+Space", () => toggleWindow());
  globalShortcut.register("CommandOrControl+Shift+P", () => {
    showWindow();
    emit("win:palette");
  });
  globalShortcut.register("CommandOrControl+Shift+D", () => {
    showWindow();
    emit("win:dump");
  });
}

app.setName("AetherShell");
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => showWindow());
  app.whenReady().then(() => {
    loadBody();
    createWindow();
    createTray();
    registerHotkeys();
    startClipWatch();
    setInterval(() => emit("body:metrics", sampleMetrics()), 2000);
  });
}

app.on("window-all-closed", (e) => {
  e.preventDefault();
});

app.on("before-quit", () => killAll());
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  killAll();
});

ipcMain.handle("win:hide", () => hideWindow());
ipcMain.handle("win:show", () => showWindow());
ipcMain.handle("win:toggle", () => toggleWindow());
ipcMain.handle("win:set-mode", (_e, next) => applyMode(String(next)));
ipcMain.handle("win:set-coverage", (_e, payload) => {
  if (payload?.w) coverage.w = Number(payload.w);
  if (payload?.h) coverage.h = Number(payload.h);
  saveBody();
  if (visible) showWindow();
});
ipcMain.handle("body:get", () => ({ mode, coverage, fontSize, opacity }));
ipcMain.handle("body:set-font", (_e, n) => {
  fontSize = Math.min(22, Math.max(11, Number(n) || 14));
  saveBody();
  return fontSize;
});
ipcMain.handle("body:set-opacity", (_e, n) => {
  opacity = Math.min(1, Math.max(0.7, Number(n) || 1));
  saveBody();
  if (win && !win.isDestroyed()) win.setOpacity(opacity);
  return opacity;
});
function quotePath(s) {
  const t = String(s || "").replace(/\0/g, " ").trim().split(/\s{2,}/)[0].trim();
  if (!t) return "";
  const m = t.match(/[A-Za-z]:\\[^\s*?"<>|]+/) || t.match(/\\\\[^\s*?"<>|]+/);
  const pathText = m ? m[0] : t;
  return /\s/.test(pathText) ? `"${pathText}"` : pathText;
}

function firstUtf16z(buf) {
  const s = Buffer.from(buf).toString("utf16le");
  const z = s.indexOf("\0");
  return (z >= 0 ? s.slice(0, z) : s).trim();
}

function appVersion() {
  try {
    return require("./package.json").version;
  } catch {
    return "?";
  }
}

function parseHdrop(buf) {
  if (!buf || buf.length < 20) return [];
  try {
    const pFiles = buf.readUInt32LE(0);
    const fWide = buf.readInt32LE(16) !== 0;
    let offset = pFiles > 0 && pFiles < buf.length ? pFiles : 20;
    const paths = [];
    if (fWide) {
      while (offset + 2 <= buf.length) {
        if (buf.readUInt16LE(offset) === 0) break;
        let end = offset;
        while (end + 2 <= buf.length && buf.readUInt16LE(end) !== 0) end += 2;
        paths.push(buf.toString("utf16le", offset, end));
        offset = end + 2;
      }
    } else {
      while (offset < buf.length) {
        if (buf[offset] === 0) break;
        let end = offset;
        while (end < buf.length && buf[end] !== 0) end += 1;
        paths.push(buf.toString("latin1", offset, end));
        offset = end + 1;
      }
    }
    return paths.map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function probePsClipboard() {
  const script = [
    "[Console]::OutputEncoding = [Text.UTF8Encoding]::new()",
    "try { $list = Get-Clipboard -Format FileDropList -ErrorAction SilentlyContinue; if ($list) { $list | ForEach-Object { $_.ToString() } } else { Write-Output 'NO-FileDropList' } } catch { Write-Output ('ERR-FileDropList ' + $_.Exception.Message) }",
    "Write-Output '---TEXT---'",
    "try { Get-Clipboard -Format Text } catch { }",
  ].join("; ");
  try {
    const r = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-STA", "-NonInteractive", "-Command", script],
      { encoding: "utf8", windowsHide: true, timeout: 6000 },
    );
    return {
      status: r.status,
      error: r.error ? String(r.error.message || r.error) : "",
      stdout: String(r.stdout || "").slice(0, 4000),
      stderr: String(r.stderr || "").slice(0, 2000),
    };
  } catch (e) {
    return { status: -1, error: String(e.message || e), stdout: "", stderr: "" };
  }
}

function inspectClipboard() {
  const lines = [];
  lines.push("AetherShell DEV DUMP  v" + appVersion());
  lines.push("time  " + new Date().toISOString());
  lines.push("platform  " + process.platform + "  pid " + process.pid);
  let text = "";
  let formats = [];
  try {
    formats = clipboard.availableFormats();
  } catch (e) {
    lines.push("availableFormats ERR  " + e.message);
  }
  lines.push("formats  " + JSON.stringify(formats));

  for (const f of formats) {
    try {
      const buf = clipboard.readBuffer(f);
      lines.push("buffer[" + f + "]  len=" + buf.length + "  hex=" + buf.slice(0, 80).toString("hex"));
      const asUtf16 = buf.toString("utf16le").replace(/\0/g, " ").trim().slice(0, 240);
      if (asUtf16) lines.push("  utf16  " + asUtf16);
      if (/hdrop/i.test(f) || f === "Files") {
        const paths = parseHdrop(buf);
        lines.push("  hdrop  " + JSON.stringify(paths));
        if (paths.length && !text) text = paths.map(quotePath).filter(Boolean).join(" ");
      }
    } catch (e) {
      lines.push("buffer[" + f + "]  ERR  " + e.message);
    }
    try {
      const s = clipboard.read(f);
      if (s) lines.push("read[" + f + "]  " + JSON.stringify(String(s).slice(0, 240)));
    } catch {
      /* skip */
    }
  }

  try {
    if (formats.includes("FileNameW")) {
      const s = quotePath(firstUtf16z(clipboard.readBuffer("FileNameW")));
      lines.push("FileNameW parsed  " + s);
      if (s && !text) text = s;
    }
  } catch (e) {
    lines.push("FileNameW ERR  " + e.message);
  }

  try {
    const uri = clipboard.read("text/uri-list") || "";
    lines.push("uri-list  " + JSON.stringify(uri.slice(0, 240)));
  } catch (e) {
    lines.push("uri-list ERR  " + e.message);
  }

  const plain = clipboard.readText() || "";
  lines.push("readText  " + JSON.stringify(plain.slice(0, 240)));
  if (!text && /^[A-Za-z]:\\/.test(plain.trim())) text = quotePath(plain.trim());

  const ps = probePsClipboard();
  lines.push("powershell  status=" + ps.status + "  error=" + ps.error);
  lines.push("ps stdout:");
  lines.push(ps.stdout || "(empty)");
  lines.push("ps stderr:");
  lines.push(ps.stderr || "(empty)");
  const psFiles = String(ps.stdout || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z]:\\/.test(s) || s.startsWith("\\\\"));
  if (psFiles.length && !text) text = psFiles.map(quotePath).join(" ");
  if (!text && lastClipFiles.length) text = lastClipFiles.map(quotePath).join(" ");
  lines.push("cachedFiles  " + JSON.stringify(lastClipFiles));
  lines.push("cachedAt  " + (lastClipAt || "(never)"));
  lines.push("clipWatch  " + (clipWatch && !clipWatch.killed ? "running" : "dead"));
  lines.push("chosen  " + JSON.stringify(text || "(none)"));
  lines.push("--- copy this tab back to Grok ---");
  return { text, dump: lines.join("\n") };
}
function portableRoot() {
  return path.dirname(process.execPath);
}

ipcMain.handle("lens:scan", () => lens.scanLenses(portableRoot()));
ipcMain.handle("lens:open", (_e, payload) => {
  const door = payload && payload.door;
  const root = portableRoot();
  const file = String((payload && payload.path) || "");
  if (door === "url") return lens.openUrl(payload && payload.url);
  if (door === "html") return lens.openHtml(file);
  if (door === "urlfile") return lens.openUrlFile(file);
  if (door === "pack") return lens.installPack(root, file);
  if (door === "id") return lens.openById(root, payload && payload.id);
  return { ok: false, error: lens.REFUSE_PACK };
});

ipcMain.handle("clip:read", () => inspectClipboard());
ipcMain.handle("clip:dump", () => inspectClipboard());
ipcMain.handle("clip:write", (_e, text) => {
  clipboard.writeText(String(text || ""));
});
ipcMain.handle("body:open", async (_e, raw) => {
  const text = String(raw || "").trim();
  if (/^https?:\/\//i.test(text)) {
    await shell.openExternal(text);
    return "url";
  }
  const target = text || os.homedir();
  const err = await shell.openPath(target);
  return err || "ok";
});
ipcMain.handle("hist:get", (_e, profile) => {
  const h = loadHist();
  const key = String(profile || "pwsh");
  return Array.isArray(h[key]) ? h[key] : [];
});
ipcMain.handle("hist:push", (_e, payload) => {
  const key = String(payload?.profile || "pwsh");
  const line = String(payload?.line || "").trim();
  if (!line) return;
  const h = loadHist();
  if (!Array.isArray(h[key])) h[key] = [];
  if (h[key][h[key].length - 1] === line) return;
  h[key].push(line);
  if (h[key].length > 80) h[key] = h[key].slice(-80);
  saveHist(h);
});
ipcMain.handle("pty:spawn", (_e, profile) => createSession(String(profile || "pwsh")));
ipcMain.handle("pty:write", (_e, { id, data }) => {
  const s = sessions.get(id);
  if (s) s.write(data);
});
ipcMain.handle("pty:kill", (_e, id) => {
  const s = sessions.get(id);
  if (s) {
    s.kill();
    sessions.delete(id);
  }
});
ipcMain.handle("pty:resize", () => {});
