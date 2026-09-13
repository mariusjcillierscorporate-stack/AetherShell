# AetherShell

Persistent overlay terminal for Windows 10 and 11.

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

**Current head:** 1.14.0 (Explorer copy-paste of a file is still broken — drag-and-drop works.)  
**Restore point:** [v1.10.0-stable](https://github.com/mariusjcillierscorporate-stack/AetherShell/releases/tag/v1.10.0-stable) — full portable zip, floor-tested.

## What it is

A tray-resident overlay. Hide does not kill PowerShell. Quit does. Real Windows shells: PowerShell, cmd, WSL, Git Bash.

This is the **empty body**. No Keystone / Drive / Loom lens is mounted yet.

## Run

1. Prefer the [1.10.0-stable zip](https://github.com/mariusjcillierscorporate-stack/AetherShell/releases/download/v1.10.0-stable/AetherShell-1.10.0-stable.zip) for a known-good portable app.
2. Later cuts are a drop-in `app.asar` into `portable\resources\app.asar`.
3. Double-click `AetherShell.exe`. Do not run as Administrator.
4. Toggle: **Ctrl+Shift+A**. Tray click also works.

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

## Status (13 Sep 2026)

Working on the floor: overlay, tray, modes, real shell, tabs, history, find, dimmer, open-folder, **drag-and-drop a file for its path**, start-in-tray, quiet start, pocket balloon.

Open: Explorer **Copy** then paste into the shell (Ctrl+V / right-click Paste) does not type the path. Drop does.
