# ACTIVE brief

**State:** sealed — partial floor SUCCESS recorded
**Owner:** Expert / R&D chamber
**Updated:** 2026-09-26
**Cut name:** 1.19.0 three-door lens insert

- **Cut:** 1.19.0 — three doors into one picture slot (sidecar folder, URL/html drop, `.lens`/`.zip` pack).
- **Must still work:** Portable `AetherShell.exe` empty (no `lenses\` folder). Real pwsh/cmd/WSL/Git Bash. Hide does not kill sessions. Drop a normal file on the *terminal* still types the path. One picture tab max. `ownsBody` false. `v1.10.0-stable` zip untouched. Later ship form is drop-in `portable\resources\app.asar`.
- **One new behavior:** The body mounts a picture tab from any of three doors, then hot-swaps if a picture is already open. Close tab unloads. Shell stays. Doors are defined in `docs/LENS-INSERT.md`.
- **Forbidden:** Treat `.exe` (or `.cmd` `.bat` `.msi` `.ps1`) as a lens. Second picture tab. Plugin host. Lens child process. Electron rebuild. node-pty rewrite. Rename AetherShell / Body / Lens / Bayonet. Invent many-slot UI.
- **Read:**
  - `docs/BUILD-MODE.md`
  - `docs/BAYONET.md`
  - `docs/LENS-INSERT.md`
  - `native-host/main.cjs`
  - `native-host/preload.cjs`
  - `native-host/dist-renderer/shell.html`
- **Write:**
  - `native-host/` source that implements the three doors
  - `CHANGELOG.md` — mark 1.19.0 floor result (working / not)
  - `STATUS.md`
  - drop-in `app.asar` release when the cut runs on Windows
  - after full floor proof, do not clear ACTIVE; Expert will move it to `docs/briefs/DONE/`
- **Floor proof:**
  1. Empty portable exe still opens a real shell with no `lenses\` folder. — open
  2. Door B: palette Mount ATLAS picture + `https://` URL still opens one picture tab. — open
  3. Door B: drop a `.html` or a URL onto chrome → picture tab. Drop a text file onto the terminal → path typed. — open
  4. Door A: folder `lenses\demo\lens.json` + `index.html` appears in the palette and mounts. — open
  5. Door C: drop a `.lens` pack onto chrome → unpacks and mounts. — **SUCCESS 26 Sep 2026 (Bold/bulk, `volumetric-atlas.lens`)**. Picture tab opened in the AetherShell frame. Drag-and-drop worked. Ran as planned.
  6. Second insert hot-swaps. Close picture tab. PowerShell tab still alive. — open
  7. Drop `something.exe` onto chrome → refuse footer, no new process. — open

**Expert note:** Item 5 Atlas/VAM picture path is SUCCESS. Cut stays sealed. Brief is not moved to DONE until the remaining items are reported or cancelled.
