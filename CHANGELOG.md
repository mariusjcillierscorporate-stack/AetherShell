# Changelog

Floor-tested on Marius's Windows PC unless noted.

## 1.14.0 — Explorer file paste (open)

Attempt: copy a file in Explorer, paste in the shell, get the path.  
**Floor: not working.** Drag-and-drop from 1.13.2 still works. Come back to this.

## 1.13.2 — drop a file (fixed)

Drag a file from Explorer onto the panel. Full path is typed. Working.

## 1.13.1

Electron path helper (`webUtils.getPathForFile`). Intermediate.

## 1.13.0

First drop attempt. Copy cursor, no path.

## 1.12.0 — open folder

Right-click a `C:\` path or empty space → File Explorer. Working.

## 1.11.0 — dimmer

Palette Dimmer / Clearer. Remembers after Quit. Working.

## 1.10.0 — quiet start  ★ STABLE ZIP

Start-in-tray no longer false-balloons. Pocket signal only after you have shown, then hidden. Working.  
**Frozen zip:** `v1.10.0-stable`.

## 1.9.0 — start in tray

Tray checkbox. Next launch stays in the tray. Working.

## 1.8.0 — memory

Up-arrow commands survive Quit. Working.

## 1.7.0 — find and zoom

Ctrl+F, Ctrl+Plus/Minus. Working.

## 1.6.0 — pocket signal

Hidden shell prints → one tray balloon. Working.

## 1.5.0 — tab cycle + revive

Ctrl+Tab. `exit` opens a new shell of the same type. Working.

## 1.4.1 — Escape hide

Escape closes find/palette, then hides. Working.

## 1.4.0 — muscle memory

Up/Down history, select copies. Working.

## 1.3.0 — daily driver chrome

Mode chip, font, coverage, right-click. Working.

## 1.2.0 / 1.1.0

Real PowerShell via `child_process.spawn`. Line-mode. Working.

## 1.0.x

First portable Windows overlay. Avast / installer issues; portable exe is the path.
