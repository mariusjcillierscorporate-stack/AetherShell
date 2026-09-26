"use strict";

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { pathToFileURL } = require("node:url");

const REFUSE_EXE = "not a lens · the body is the only exe";
const REFUSE_PACK = "picture needs lens.json or http(s)";
const BLOCKED = /\.(exe|cmd|bat|msi|com|scr|ps1)$/i;

function lensesDir(root) {
  return path.join(root, "lenses");
}

function validId(id) {
  return typeof id === "string" && /^[a-z0-9-]{1,40}$/.test(id);
}

function readPack(dir) {
  const file = path.join(dir, "lens.json");
  if (!fs.existsSync(file)) return { ok: false, error: REFUSE_PACK };
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { ok: false, error: REFUSE_PACK };
  }
  if (!json || typeof json !== "object") return { ok: false, error: REFUSE_PACK };
  if (json.ownsBody === true) return { ok: false, error: REFUSE_EXE };
  if (!validId(json.id)) return { ok: false, error: REFUSE_PACK };
  const title = String(json.title || json.id).trim().slice(0, 24);
  if (!title) return { ok: false, error: REFUSE_PACK };
  const entry = String(json.entry || "").trim();
  if (/^https?:\/\//i.test(entry)) return { ok: true, id: json.id, title, src: entry };
  if (!entry || entry.includes("..") || path.isAbsolute(entry)) return { ok: false, error: REFUSE_PACK };
  const abs = path.join(dir, entry);
  const rel = path.relative(dir, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel) || !fs.existsSync(abs)) return { ok: false, error: REFUSE_PACK };
  return { ok: true, id: json.id, title, src: pathToFileURL(abs).href };
}

function scanLenses(root) {
  const dir = lensesDir(root);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  let names = [];
  try {
    names = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const ent of names) {
    if (!ent.isDirectory()) continue;
    const pack = readPack(path.join(dir, ent.name));
    if (pack.ok) out.push({ id: pack.id, title: pack.title, src: pack.src });
  }
  return out;
}

function findEoCD(buf) {
  const min = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  return -1;
}

function unzipTo(zipPath, destDir) {
  const buf = fs.readFileSync(zipPath);
  const eocd = findEoCD(buf);
  if (eocd < 0) throw new Error("not a zip");
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  fs.mkdirSync(destDir, { recursive: true });
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error("bad zip");
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.slice(off + 46, off + 46 + nameLen).toString("utf8").replace(/\\/g, "/");
    off += 46 + nameLen + extraLen + commentLen;
    if (!name || name.endsWith("/")) continue;
    if (name.includes("..") || name.startsWith("/") || name.includes(":")) throw new Error("bad path");
    if (buf.readUInt32LE(localOff) !== 0x04034b50) throw new Error("bad local");
    const nlen = buf.readUInt16LE(localOff + 26);
    const elen = buf.readUInt16LE(localOff + 28);
    const start = localOff + 30 + nlen + elen;
    const comp = buf.slice(start, start + compSize);
    const data = method === 0 ? comp : method === 8 ? zlib.inflateRawSync(comp) : null;
    if (!data) throw new Error("zip method");
    const out = path.resolve(destDir, name);
    const rel = path.relative(destDir, out);
    if (rel.startsWith("..") || path.isAbsolute(rel)) throw new Error("slip");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, data);
  }
}

function locatePackDir(extracted) {
  if (fs.existsSync(path.join(extracted, "lens.json"))) return extracted;
  const kids = fs.readdirSync(extracted, { withFileTypes: true }).filter((d) => d.isDirectory());
  if (kids.length === 1 && fs.existsSync(path.join(extracted, kids[0].name, "lens.json"))) {
    return path.join(extracted, kids[0].name);
  }
  return null;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) copyDir(from, to);
    else if (ent.isFile()) fs.copyFileSync(from, to);
  }
}

function installPack(root, zipPath) {
  if (BLOCKED.test(zipPath)) return { ok: false, error: REFUSE_EXE };
  if (!/\.(lens|zip)$/i.test(zipPath)) return { ok: false, error: REFUSE_PACK };
  const tmp = path.join(root, "lenses", ".unpack-" + Date.now());
  try {
    unzipTo(zipPath, tmp);
    const packDir = locatePackDir(tmp);
    if (!packDir) return { ok: false, error: REFUSE_PACK };
    const pack = readPack(packDir);
    if (!pack.ok) return pack;
    const dest = path.join(lensesDir(root), pack.id);
    fs.rmSync(dest, { recursive: true, force: true });
    copyDir(packDir, dest);
    const mounted = readPack(dest);
    return mounted.ok ? mounted : { ok: false, error: REFUSE_PACK };
  } catch {
    return { ok: false, error: REFUSE_PACK };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function openHtml(filePath) {
  if (BLOCKED.test(filePath)) return { ok: false, error: REFUSE_EXE };
  if (!/\.html?$/i.test(filePath) || !fs.existsSync(filePath)) return { ok: false, error: REFUSE_PACK };
  const title = path.basename(filePath, path.extname(filePath)).slice(0, 24) || "PICTURE";
  return { ok: true, id: "html", title, src: pathToFileURL(filePath).href };
}

function openUrlFile(filePath) {
  if (BLOCKED.test(filePath)) return { ok: false, error: REFUSE_EXE };
  let text = "";
  try {
    text = fs.readFileSync(filePath, "utf8");
  } catch {
    return { ok: false, error: REFUSE_PACK };
  }
  const m = text.match(/^URL=(.+)$/im);
  const url = m ? m[1].trim() : "";
  if (!/^https?:\/\//i.test(url)) return { ok: false, error: REFUSE_PACK };
  return { ok: true, id: "url", title: "ATLAS", src: url };
}

function openUrl(url) {
  const clean = String(url || "").trim();
  if (!/^https?:\/\//i.test(clean)) return { ok: false, error: REFUSE_PACK };
  return { ok: true, id: "url", title: "ATLAS", src: clean };
}

function openById(root, id) {
  if (!validId(id)) return { ok: false, error: REFUSE_PACK };
  const list = scanLenses(root);
  const hit = list.find((row) => row.id === id);
  return hit ? { ok: true, ...hit } : { ok: false, error: REFUSE_PACK };
}

module.exports = {
  REFUSE_EXE,
  REFUSE_PACK,
  BLOCKED,
  scanLenses,
  installPack,
  openHtml,
  openUrlFile,
  openUrl,
  openById,
  readPack,
};
