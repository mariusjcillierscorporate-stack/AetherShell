# AetherShell — Methodology Workshop

**Chamber opened:** 2026-09-26  
**Mode:** expert · R&D · articulate · never build here  
**Repo on disk:** `/home/workdir/artifacts/AetherShell`  
**GitHub:** https://github.com/mariusjcillierscorporate-stack/AetherShell

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

This file is the working index for wording, not a build brief.

---

## Two chambers (do not merge)

| Chamber | Lives here | Job | Forbidden |
|---|---|---|---|
| **Expert / R&D** | This chat | Method, meaning, brevity. Decide *what* and *why*. Write paste-ready briefs. | Code, asar swaps, Electron rebuilds, mid-build patches |
| **Builder** | A separate chat | Execute a sealed brief. Change the floor body. | Redesign, rename, invent scope |

Rule: never switch modes mid-build. If the brief is wrong, stop the builder chat and come back here. Fix the words on GitHub. Then open a new builder pass.

**The bus is the GitHub repo.** Expert and Builder do not brief each other inside a chat. They read and write:

https://github.com/mariusjcillierscorporate-stack/AetherShell

Voice is a leaky pipe. Before a voice transcript is posted into this chamber, read it once as text. If a sentence is not what was spoken, rewrite it. The first message of this thread was a mistranslation; the intended sentence is the table above.

---

## GitHub is the bus

| Role | Writes to the repo | Reads from the repo |
|---|---|---|
| **Expert / R&D** | Standing orders, locked language, the active brief | Floor source, changelog, status, last builder report |
| **Builder** | Source for the cut, changelog line, status, drop-in notes | `docs/BUILD-MODE.md` then `docs/briefs/ACTIVE.md` then the listed source files |

Chat may *point* at a path. Chat may not *replace* a path.

### Paths that carry law

| Path | Owner | Meaning |
|---|---|---|
| `docs/BAYONET.md` | Expert | Frozen glossary. Do not drift. |
| `docs/BUILD-MODE.md` | Expert | Standing orders for every builder pass. |
| `docs/briefs/ACTIVE.md` | Expert | The one sealed cut. Builder executes only this. |
| `docs/briefs/DONE/` | Builder + Expert | Finished briefs, moved off ACTIVE. |
| `native-host/` | Builder | Floor source for the current archive. |
| `CHANGELOG.md` / `STATUS.md` | Builder updates; Expert may correct wording | What the floor did. |
| Releases (`app.asar`, zips) | Builder | What Marius actually runs. |

One active brief at a time. If ACTIVE is empty, Builder does nothing.

---

## Builder instruction set

Paste this into a Builder chat as the first message, or tell Builder: *read the AetherShell GitHub repo, start at `docs/BUILD-MODE.md`.*

1. Open `https://github.com/mariusjcillierscorporate-stack/AetherShell`.
2. Read, in this order: `docs/BUILD-MODE.md` → `docs/BAYONET.md` → `docs/briefs/ACTIVE.md` → every file ACTIVE names.
3. Ignore chat memory, old builder prompts, and the electron-vite / node-pty spec unless ACTIVE names them.
4. Do only the cut in ACTIVE. Do not redesign. Do not rename the product. Do not grow scope.
5. When the cut is done: write source to the repo, add one changelog entry, update `STATUS.md`, attach the drop-in `app.asar` if that is the ship form.
6. Move nothing out of ACTIVE yourself unless ACTIVE says to. Report the paths you wrote. Stop.
7. If ACTIVE is missing, empty, or contradicts `docs/BAYONET.md`, stop and write that fact. Do not invent a brief.

Full standing orders live in `docs/BUILD-MODE.md`. Keep that file and this section in the same voice.

---

## Two maps that must not be fused

| Map | What it is | Treat as |
|---|---|---|
| **Floor body** | What actually runs on Marius's Windows PC | Source of truth |
| **S-tier builder spec** | `GROK_BUILDER_PROMPT_AETHERSHELL.md` + early roadmap in the parent artifacts folder | Aspiration / later rewrite, not current code |

The floor body is a small Electron host:

```
native-host/
  main.cjs          window, tray, hotkeys, clipboard, IPC
  preload.cjs       contextBridge
  pty.cjs           child_process.spawn — not node-pty
  dist-renderer/shell.html   chrome + xterm + palette + picture tab
```

The builder spec wants electron-vite, React, TypeScript, node-pty, JSONC config, acrylic ghost window. That stack is **not** what 1.10–1.18 ship. Do not brief a builder as if the spec already lives on the floor.

---

## Version truth (as of 2026-09-26)

| Layer | Version | Note |
|---|---|---|
| GitHub `main` source | **1.14.0** | last source commit on native-host |
| Floor restore zip | **v1.10.0-stable** | Keep. Do not overwrite that zip. |
| Latest drop-in `app.asar` | **v1.18.0** | Bayonet picture tab. Source not fully on `main`. |

Releases after source freeze: 1.15 STA paste → 1.16 DEV dump → 1.17 remember Explorer copies → 1.18 picture tab.

**Wording problem to solve later:** GitHub README still says head is 1.14.0. Releases already speak 1.18.0. The body is ahead of the archive.

---

## Locked language (do not drift)

| Word | Meaning |
|---|---|
| **AetherShell** | The product. Do not rename. |
| **Body** | The overlay. Must work empty. |
| **Lens** | One product that sits in the body. |
| **Bayonet** | The mount. Same doorway every time. |
| **Hot-swap** | Unload one lens, load another. Body stays up. |
| **Empty body** | No lens mounted. Still a real shell. |
| **Picture** | A lens rendered *inside* a tab. Not a new window. |
| **ownsBody false** | A lens must not quit, rebuild, or own the host. |

Phone is voice only. Browser look-alike is Preview. Body is the Windows tray app.

Voice-to-text is not source. Spoken intent becomes law only after a text pass.

---

## What the floor body already does

Working, in the language of the changelog:

- Tray-resident single instance
- Toggle: `Ctrl+Shift+A` (reliable), `Ctrl+\`` (English layout)
- Modes: Quake / Float / Dock / HUD
- Real shells via `child_process.spawn`: pwsh / powershell / cmd / WSL / Git Bash
- Hide does not kill sessions. Quit does. Up-arrow history survives Quit.
- Tabs, revive after `exit`, find, zoom, dimmer, open-folder
- Drag-and-drop file → path
- Quiet start / start-in-tray / pocket balloon
- 1.15–1.17: Explorer copy remembered and pasted as a path (Chromium cannot see `CF_HDROP`; the body must watch Explorer itself)
- 1.18: one Bayonet slot. Palette **Mount ATLAS picture**. Prompt for an `http(s)` URL. Tab named **ATLAS**, `kind: "picture"`. Close tab unloads the picture. Shell stays.

What 1.18 picture is, in one sentence:

> A `webview` tab beside PowerShell, one slot, URL in, close to unload, `ownsBody false`.

What 1.18 picture is not:

- Not a second Electron app
- Not an Electron rebuild
- Not Keystone / Drive / Loom as named products yet
- Not a full Bayonet API — it is the first twist of the mount

---

## Hard rules for any later build chat

1. Do not clone Tabby, eDEX-UI, WTQ, Windows Terminal, Seelen-UI, ConEmu, Rainmeter, WaveTerm.
2. Do not rebuild Electron to make a lens fit.
3. Do not let a lens quit the body.
4. Do not replace the 1.10.0-stable zip.
5. Later cuts are drop-in `portable\resources\app.asar`.
6. Do not run the exe as Administrator.
7. Config on the floor is `body.json` + `history.json` in userData — not the JSONC schema from the old spec.
8. Terminal I/O is line-oriented `spawn` pipes. Calling it a PTY in user-facing copy is allowed; calling it `node-pty` in a brief is a lie until that rewrite is chosen.

---

## Open wording work (this chamber)

Use this list as the agenda. Pick one thread per turn.

1. **Source lag.** How should README / STATUS / CHANGELOG speak when asar is 1.18 and git is 1.14?
2. **Bayonet contract.** Minimum fields for a lens: `id`, `title`, `url` or `entry`, `ownsBody: false`, one-slot vs many, persist URL or not.
3. **ATLAS.** Is ATLAS the first named lens, or only the first picture URL? Keep the word stable.
4. **Paste doctrine.** Drop works. Explorer copy needs a side-channel. What is the user-facing sentence when paste fails?
5. **Spec vs floor.** When (if ever) the electron-vite / node-pty rewrite is allowed to start. Not in this chamber.
6. **Edge of the shell.** Overlay covering chats, sound, or Grok itself — what the body should do at the screen edge so the conversation underneath remains reachable.

---

## Files to read before writing new words

- `docs/BAYONET.md` — frozen glossary
- `docs/BUILD-MODE.md` — builder standing orders (the GitHub bus)
- `docs/briefs/ACTIVE.md` — the one sealed cut, or empty
- `docs/STABLE-1.10.0.txt` — restore ritual
- `CHANGELOG.md` — floor-tested log through 1.14
- `native-host/main.cjs` — 1.14 host
- Parent artifacts `AETHERSHELL_METHODOLOGY_AND_ROADMAP.md` — idea theft only, not code
