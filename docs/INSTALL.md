# AetherShell — install on Windows 10 / 11

Works on **Windows 10 (21H2+)** and **Windows 11**, 64-bit. No admin account is required.

## Safest start

Open `portable\` and double-click **AetherShell.exe**. Do not move the exe out of that folder.

That skips every installer script. Use this if antivirus is sensitive.

## What you received

| Path | What it is |
|---|---|
| `portable\` | Full app. Run `AetherShell.exe` from here |
| `Install-AetherShell.cmd` | Copies the app to `%LOCALAPPDATA%\AetherShell` and adds a Start Menu shortcut |
| `Uninstall-AetherShell.cmd` | Removes the per-user copy |
| `USER-GUIDE.md` | How to use the overlay |

There is **no PowerShell installer**. Do not run any `.ps1` from older zips.

## Optional copy-to-profile install

1. Unzip `AetherShell-Windows.zip`.
2. If File Explorer shows **This file came from another computer**, Properties → **Unblock** → Apply.
3. Double-click `Install-AetherShell.cmd`.

It copies files and creates a Start Menu shortcut. It does **not** add AetherShell to Windows startup. Autostart is an opt-in in the tray menu later.

## SmartScreen / “Windows protected your PC”

The exe is **unsigned**. On first launch:

1. **More info**
2. **Run anyway**

Expected. The app does not need the network to run.

## Avast IDP.HEUR.26 on older zips

If Avast quarantined `Install-AetherShell.ps1` with **IDP.HEUR.26**:

- That was **Behavior Shield**, not a virus signature on the program.
- The old script copied files, stripped the download mark (`Unblock-File`), wrote `HKCU\...\Run` (start with Windows), then launched the exe. Avast treats that pattern as generic persistence.
- `powershell.exe` in the alert is Windows’ own shell. Avast names the process that ran the script.
- **AetherShell.exe itself was not the detection.** Restore the folder if Avast ate files, then use `portable\AetherShell.exe` or this newer zip.

Do not turn Avast off. Skip the old `.ps1`. Use this package.

## Uninstall

Run `Uninstall-AetherShell.cmd`, or delete `%LOCALAPPDATA%\AetherShell` and the Start Menu shortcut.

## After install

Look for AetherShell in the **notification area** (tray). Press **Ctrl+`** (Control + backtick, under Escape) to hide and summon the overlay.
