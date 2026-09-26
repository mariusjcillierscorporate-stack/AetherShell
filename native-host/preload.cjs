"use strict";

const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("aetherNative", {
  platform: "electron",
  hide: () => ipcRenderer.invoke("win:hide"),
  show: () => ipcRenderer.invoke("win:show"),
  toggle: () => ipcRenderer.invoke("win:toggle"),
  setMode: (mode) => ipcRenderer.invoke("win:set-mode", mode),
  setCoverage: (payload) => ipcRenderer.invoke("win:set-coverage", payload),
  getBody: () => ipcRenderer.invoke("body:get"),
  setFont: (n) => ipcRenderer.invoke("body:set-font", n),
  setOpacity: (n) => ipcRenderer.invoke("body:set-opacity", n),
  clipRead: () => ipcRenderer.invoke("clip:read"),
  clipDump: () => ipcRenderer.invoke("clip:dump"),
  clipWrite: (text) => ipcRenderer.invoke("clip:write", text),
  openThing: (text) => ipcRenderer.invoke("body:open", text),
  pathForFile: (file) => {
    try {
      if (webUtils && webUtils.getPathForFile) return webUtils.getPathForFile(file);
    } catch {
      /* Electron version */
    }
    return file && file.path ? file.path : "";
  },
  histGet: (profile) => ipcRenderer.invoke("hist:get", profile),
  histPush: (profile, line) => ipcRenderer.invoke("hist:push", { profile, line }),
  lensScan: () => ipcRenderer.invoke("lens:scan"),
  lensOpen: (payload) => ipcRenderer.invoke("lens:open", payload),
  onShown: (cb) => {
    ipcRenderer.on("win:shown", () => cb());
  },
  onEscape: (cb) => {
    ipcRenderer.on("win:escape", () => cb());
  },
  onNextTab: (cb) => {
    ipcRenderer.on("win:next-tab", () => cb());
  },
  onPrevTab: (cb) => {
    ipcRenderer.on("win:prev-tab", () => cb());
  },
  onFind: (cb) => {
    ipcRenderer.on("win:find", () => cb());
  },
  onFontUp: (cb) => {
    ipcRenderer.on("win:font-up", () => cb());
  },
  onFontDown: (cb) => {
    ipcRenderer.on("win:font-down", () => cb());
  },
  onPaste: (cb) => {
    ipcRenderer.on("win:paste", () => cb());
  },
  onDump: (cb) => {
    ipcRenderer.on("win:dump", () => cb());
  },
  onPalette: (cb) => {
    ipcRenderer.on("win:palette", () => cb());
  },
  onMetrics: (cb) => {
    ipcRenderer.on("body:metrics", (_e, payload) => cb(payload));
  },
  ptySpawn: (profile) => ipcRenderer.invoke("pty:spawn", profile),
  ptyWrite: (id, data) => ipcRenderer.invoke("pty:write", { id, data }),
  ptyKill: (id) => ipcRenderer.invoke("pty:kill", id),
  ptyResize: (id, cols, rows) => ipcRenderer.invoke("pty:resize", { id, cols, rows }),
  onPtyData: (cb) => {
    ipcRenderer.on("pty:data", (_e, payload) => cb(payload));
  },
  onPtyExit: (cb) => {
    ipcRenderer.on("pty:exit", (_e, payload) => cb(payload));
  },
});
