# AetherShell — Builder standing orders

**Status:** law as of 2026-09-26  
**Audience:** Builder mode only  
**Bus:** this GitHub repository

You are in Builder mode. You receive instructions from this repo. You do not receive a new product from chat.

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

Repo: https://github.com/mariusjcillierscorporate-stack/AetherShell

---

## Start of every pass

Read in this order. Do not skip.

1. `docs/BUILD-MODE.md` (this file)
2. `docs/BAYONET.md`
3. `docs/briefs/ACTIVE.md`
4. Every path ACTIVE lists under **Read**

If `docs/briefs/ACTIVE.md` is missing or has no cut, **stop**. Write: `ACTIVE brief empty — no build.` Do not invent work.

---

## What you are building from

The floor body is the small Electron host in `native-host/`:

- `main.cjs` — window, tray, hotkeys, clipboard, IPC
- `preload.cjs` — contextBridge
- `pty.cjs` — `child_process.spawn` (not node-pty, unless ACTIVE says otherwise)
- `dist-renderer/shell.html` — chrome + terminal + palette + picture tab

Restore zip on the floor: **v1.10.0-stable**. Do not replace that zip. Later cuts are drop-in `portable\resources\app.asar`.

Ignore parent-folder specs (`GROK_BUILDER_PROMPT_AETHERSHELL.md`, electron-vite / React / node-pty rewrite) unless ACTIVE names that rewrite as the cut.

---

## Hard rules

1. Do not clone Tabby, eDEX-UI, WTQ, Windows Terminal, Seelen-UI, ConEmu, Rainmeter, or WaveTerm.
2. Do not rebuild Electron to make a lens fit.
3. A lens does not own the body. `ownsBody` is false.
4. Do not rename AetherShell. Do not rename Body, Lens, Bayonet, Hot-swap.
5. Do not run the packaged exe as Administrator in instructions.
6. Hide must not kill the shell. Quit may.
7. Phone is voice only. Browser look-alikes are Preview. The body is the Windows tray app.
8. Chat is not the brief. If chat and ACTIVE disagree, ACTIVE wins. If ACTIVE and BAYONET disagree, stop.

---

## What a sealed brief contains

Expert writes `docs/briefs/ACTIVE.md` with exactly these headings:

```
# ACTIVE brief
- Cut:
- Must still work:
- One new behavior:
- Forbidden:
- Read:
- Write:
- Floor proof:
```

Builder executes that shape. Nothing else.

---

## End of every pass

Write back to this repo:

1. Source files named under **Write**
2. One `CHANGELOG.md` entry for the cut
3. `STATUS.md` — head, restore point, what is open
4. Release asset if the ship form is `app.asar` or a zip
5. A short report in the builder chat that lists paths only

Then stop. Do not start the next cut. Expert will replace ACTIVE.

---

## Communication

| Direction | Channel |
|---|---|
| Expert → Builder | `docs/BUILD-MODE.md` + `docs/briefs/ACTIVE.md` on GitHub |
| Builder → Expert | commits, changelog, status, release assets on GitHub |
| Chat | pointer only (“read ACTIVE”) |

Both modes handle communications through this repository.
