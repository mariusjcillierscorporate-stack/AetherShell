# AetherShell — install on Windows 10 / 11

Works on **Windows 10 (21H2+)** and **Windows 11**, 64-bit. No admin account is required for the default current-user install.

## What you received

| Path | What it is |
|---|---|
| `Install-AetherShell.ps1` | Copies the app to `%LOCALAPPDATA%\AetherShell`, Start Menu + desktop shortcuts, starts with Windows |
| `Uninstall-AetherShell.ps1` | Removes the per-user install |
| `portable\` | Full app folder with `AetherShell.exe` (run without installing) |
| `USER-GUIDE.md` | How to use the overlay |

## Install (recommended)

1. Unzip `AetherShell-Windows.zip` to a folder you control, e.g. `Downloads\AetherShell-Windows`.
2. If File Explorer shows **Security: This file came from another computer**, open Properties on the zip **or** the extracted folder, tick **Unblock**, Apply.
3. Right-click `Install-AetherShell.ps1` → **Run with PowerShell**.

If PowerShell refuses to run scripts:

```powershell
cd path\to\AetherShell-Windows
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\Install-AetherShell.ps1
```

The installer:

- Copies files to `%LOCALAPPDATA%\AetherShell`
- Creates a Start Menu shortcut and a desktop shortcut
- Registers **Start with Windows** for the current user
- Launches AetherShell

## SmartScreen / “Windows protected your PC”

The exe is **unsigned** (no paid code-signing certificate). On first launch:

1. Click **More info**
2. Click **Run anyway**

That is expected. The app does not require the network to run.

## Portable mode

Double-click `portable\AetherShell.exe`. Do not move the exe out of that folder.

To skip autostart when using the script:

```powershell
.\Install-AetherShell.ps1 -NoStart
```

## Uninstall

```powershell
.\Uninstall-AetherShell.ps1
```

Or delete `%LOCALAPPDATA%\AetherShell` and the AetherShell shortcuts, then remove the value `AetherShell` from:

`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`

## Requirements

- 64-bit Windows 10 or 11
- ~250 MB disk
- No Visual Studio, Node, or Git required to **run** the packaged app

## After install

Look for the AetherShell mark in the **notification area** (tray). Press **Ctrl+`** (Control + backtick, the key under Escape) to hide and summon the overlay.
