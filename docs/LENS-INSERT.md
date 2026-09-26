# Lens insert — three doors, one mount

**Status:** sealed 2026-09-26  
**Cut:** 1.19.0  
**Owner:** Expert. Builder executes `docs/briefs/ACTIVE.md`.

Long-run QoL is not A *or* B *or* C. It is A and B and C as three ways to twist the same bayonet.

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

The portable exe stays the only exe. A lens is never an exe.

---

## One mount

One picture slot. Unlimited shell tabs.

Mount means: open a `kind: "picture"` tab in a `webview`. `ownsBody` is false. Close the tab: twist off. The shell stays.

If a picture is already mounted, a new successful insert **hot-swaps**: unload the current picture tab, mount the new one. Do not spawn a second picture tab.

---

## Door A — sidecar folder

Beside the exe (portable root = folder that contains `AetherShell.exe`):

```
portable\
  AetherShell.exe
  lenses\
    atlas\
      lens.json
      index.html
```

On show (and after a successful Door C unpack), scan `lenses\*\lens.json`. Palette lists each valid pack: **Mount <title>**.

Missing `lenses\` is normal. Empty body still runs.

---

## Door B — URL and light drop

Keep **Mount ATLAS picture**. Also accept:

- `http://` or `https://` URL (prompt, paste, or drop onto chrome)
- a `.url` file dropped onto chrome
- a single `.html` file dropped onto chrome (local picture, title = file stem)

Terminal drop is unchanged: a normal file still types its path.

---

## Door C — zip pack (the friendly drop)

A zip whose name ends in `.lens` or `.zip`, containing `lens.json` at the root of the zip (or in a single top folder).

Drop that file onto **chrome** (tab bar / title / empty frame — not the prompt).

Body unpacks into `lenses\<id>\` and mounts Door A. If that id already exists, overwrite the folder, then hot-swap.

This is the user-facing default. A and B exist so a pack is not required.

---

## lens.json

```json
{
  "id": "atlas",
  "title": "ATLAS",
  "entry": "index.html",
  "ownsBody": false
}
```

Rules:

- `id` = `[a-z0-9-]{1,40}`
- `title` = short tab name
- `entry` = `index.html` (relative, inside the pack) **or** an `http(s)` URL
- `ownsBody` must be false or absent. If `true`, refuse the pack.
- Unknown keys ignored.

---

## Refuse

Drop or pack is not a lens when:

- it is `.exe` `.cmd` `.bat` `.msi` `.com` `.scr` `.ps1`
- `lens.json` is missing or invalid
- `ownsBody` is true
- `entry` is a relative path that does not exist after unpack

Footer: `not a lens · the body is the only exe`  
or `picture needs lens.json or http(s)`

---

## Two drop surfaces

| Surface | Verb |
|---|---|
| Terminal / prompt | Path into the shell (1.13.2) |
| Chrome (tab bar, title, empty frame) | Insert a picture (A/B/C) |

If the drop target cannot be told apart, prefer: lens pack / html / url → picture; everything else → path.

---

## Not this cut

- Many picture tabs
- Plugin host, lens process, second exe
- Electron rebuild
- Replacing `v1.10.0-stable`
- ConPTY / node-pty rewrite
