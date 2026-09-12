# AetherShell user guide

AetherShell is a tray-resident overlay terminal for Windows. It stays alive when hidden. Toggle it from any app with a global hotkey.

## First 30 seconds

1. After install, a frameless panel drops from the top of the screen.
2. You are in a PowerShell-style session. Type `help` then Enter.
3. Press **Ctrl+`** — the panel slides away. Press it again — it returns. The session is still there.
4. Right-click the tray icon for Show/Hide, mode, and Quit.

## Hotkeys

| Keys | Action |
|---|---|
| Ctrl+` | Show / hide overlay (global) |
| Ctrl+Shift+P | Command palette |
| Ctrl+T | New tab |
| Ctrl+W | Close tab |
| Ctrl+Shift+F | Float mode |
| Ctrl+Shift+Q | Quake mode |

If Ctrl+` is taken by another app, use the tray icon. The host also tries Ctrl+Q as a fallback at registration time.

## Modes

| Mode | Behaviour |
|---|---|
| **Quake** | Slides from the top edge. Full width, ~half height (adjust in Settings). |
| **Float** | Smaller always-on-top widget. Drag the title bar. |
| **Dock** | Pinned to the edge, no slide. |
| **HUD** | Compact strip with a single line of terminal. |

Cycle modes with the pin / window button in the title bar, the palette, or the tray menu.

## Terminal

The packaged Windows build includes a **resident PTY runtime** with a virtual Windows filesystem (`C:\Users\Marius\...`) so the overlay works the moment you launch it — no extra compilers.

Useful commands:

- `dir` / `ls` / `cd` / `pwd`
- `cat notes.txt`
- `mkdir`, `ni` (new file), `rm`
- `ps`, `date`, `whoami`
- `neofetch`, `aether`, `help`

New tabs: PowerShell 7, Command Prompt, Ubuntu (WSL), Git Bash profiles (same runtime, different prompt).

Hide/show does **not** kill the session.

## Command palette

Ctrl+Shift+P then type to filter:

- New tab per profile
- Switch mode
- Opacity
- Toggle sys rail
- Settings
- Hide overlay

## Settings

Gear icon in the title bar.

- Width / height coverage
- Animation speed
- Opacity
- Font size
- Theme: Aether Dark or Tron Lite
- System rail (CPU / RAM / net)

Settings persist locally.

## Tray menu

- Show / Hide
- Mode
- Start with Windows
- Quit AetherShell

Closing the overlay with the minus button **hides** it. Quit only from the tray.

## Tips

- Multi-monitor: the overlay appears on the screen that has the mouse.
- Always-on-top is on by default so the panel sits above other windows.
- The sys rail on the right is a live sparkline. Turn it off in Settings if you want a wider terminal.

## FAQ

**The hotkey does nothing.**  
Click the tray icon once so Windows allows the app to register shortcuts. Disable any other app bound to Ctrl+`.

**I only see a flash / empty panel.**  
Leave it up one second; the terminal attaches after first paint. If it stays empty, Quit from the tray and start AetherShell again.

**Can it attach to Windows Terminal / other apps?**  
No. AetherShell *is* the overlay window (unlike WTQ, which wraps other programs).

**Does it replace Explorer or the taskbar?**  
No.

**Antivirus flagged Install-AetherShell.ps1 (Avast IDP.HEUR.26).**  
False positive on the **old PowerShell installer**, not malware in the terminal. Avast Behavior Shield watches scripts that copy an exe, clear the download flag, and add a Run-key autostart. Use `portable\AetherShell.exe` or `Install-AetherShell.cmd` from the current package. Do not run any `.ps1`.

**Uninstall**  
See INSTALL.md.
