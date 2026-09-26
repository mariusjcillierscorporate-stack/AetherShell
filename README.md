# AetherShell

Persistent overlay terminal for Windows 10 and 11.

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

**Current head on this branch:** 1.14.0 source. Later floor cuts ship as release `app.asar` files through 1.18.0.
**Restore point:** [v1.10.0-stable](https://github.com/mariusjcillierscorporate-stack/AetherShell/releases/tag/v1.10.0-stable) — full portable zip, floor-tested.

## What it is

A tray-resident overlay. Hide does not kill PowerShell. Quit does. Real Windows shells: PowerShell, cmd, WSL, Git Bash.

This is the **empty body**. No Keystone / Drive / Loom lens is mounted yet. 1.18.0 adds one Bayonet picture slot (ATLAS URL in a tab). The shell stays up.

## Run

1. Prefer the [1.10.0-stable zip](https://github.com/mariusjcillierscorporate-stack/AetherShell/releases/download/v1.10.0-stable/AetherShell-1.10.0-stable.zip) for a known-good portable app.
2. Later cuts are a drop-in `app.asar` into `portable\\resources\\app.asar`.
3. Double-click `AetherShell.exe`. Do not run as Administrator.
4. Toggle: **Ctrl+Shift+A**. Tray click also works.

## How we work (26 Sep 2026)

Expert and Builder are split. They do not share a chat until the Grok UI can hold both rooms with a wall between them.

| Chamber | Job |
|---|---|
| **Expert / R&D** | Method and wording. Full R&D. Writes the brief. Does not touch the floor. |
| **Builder** | Separate chat. Receives a sealed brief. Changes the floor. Does not redesign mid-build. |

A brief names only: the cut, what must still work when we are done, the one new behavior, what is forbidden, how the floor proves it.

Accepted cuts are uploaded here: source on `main` when it is current, otherwise the release `app.asar`. Voice-to-text is not source. The posted text is.

## Locked language

| Word | Meaning |
|---|---|
| **AetherShell** | The product. Do not rename. |
| **Body** | This overlay. Must work empty. |
| **Lens** | A product that sits in the body. |
| **Bayonet** | The mount. Twist on, twist off. |

Phone is voice only. Browser preview is not the desktop app.

## Repo layout

```
native-host/     Electron main, preload, pty, shell.html
docs/            How-to, Bayonet, stable snapshot notes
CHANGELOG.md     Version log
```

## Status (26 Sep 2026)

Working on the floor through 1.18.0: overlay, tray, modes, real shell, tabs, history, find, dimmer, open-folder, drag-and-drop path, start-in-tray, quiet start, pocket balloon, Explorer-copy side channel, one ATLAS picture tab.

This branch still holds 1.14.0 source. Releases after that are asar until source is synced.
