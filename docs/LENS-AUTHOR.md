# How to author a lens for AetherShell

**Status:** Expert wording, 2026-09-26  
**Proven by:** Door C drop of `volumetric-atlas.lens` onto the AetherShell chrome. Picture tab opened in the frame. Body stayed the body.  
**Do not merge projects.** Atlas is a lens. AetherShell is the body. This file is the mount contract written for other products.

> AetherShell is the body. Products are Bayonet lenses. Hot-swap the lens. Never replace the body.

Law files: `docs/BAYONET.md`, `docs/LENS-INSERT.md`, `docs/briefs/ACTIVE.md`.

---

## What succeeded (Door C only)

Marius dropped `volumetric-atlas.lens` onto the taskbar pane / chrome. No folder rename. No extra install. AetherShell unpacked the pack, opened one **ATLAS** tab beside the shell, and ran the picture. Close tab unloads. PowerShell stays.

Doors A and B were not the test. Do not claim they are proven from this drop.

---

## Why it worked

The file was not an app. It was a **zip that told the truth**.

1. The filename ended in `.lens` (a zip is also accepted).
2. Inside the zip, at the pack root: `lens.json` and `index.html`. Not nested under a surprise folder that hid the card.
3. `lens.json` used the frozen card:

```json
{
  "id": "atlas",
  "title": "ATLAS",
  "entry": "index.html",
  "ownsBody": false
}
```

4. `ownsBody` was false. The picture did not try to quit, rebuild, or replace the host.
5. `entry` was a file that actually existed after unpack.
6. The HTML was self-contained (script and CSS inlined). The webview did not need a second origin or a sibling `app.js` that was not in the pack.
7. The drop landed on **chrome** (tab bar, title, taskbar pane). A drop on the PowerShell text only types a path. That is a different door.
8. The running body was **1.19.0**. Older asars do not have three-door insert.

The body did not have to invent a product name, a folder layout, or a second exe. It read the card and mounted a `kind: "picture"` tab.

---

## The contract (copy this into any product repo)

### Card — `lens.json`

| Field | Rule |
|---|---|
| `id` | `[a-z0-9-]{1,40}` — this becomes `portable\lenses\<id>\` |
| `title` | Short tab name |
| `entry` | `index.html` inside the pack, **or** an `http(s)` URL |
| `ownsBody` | Must be `false` or omitted. `true` is refused. |
| other keys | Ignored |

### Pack — Door C

Zip those two files (plus any assets `index.html` actually needs) so that `lens.json` is at the **root of the zip**, or inside a single top folder.

Name the zip `your-product.lens`.

### Picture — what the tab loads

One HTML document the webview can open offline from `lenses\<id>\`.

Prefer a single inlined `index.html`. External `/assets/app.js` paths break once the pack is unpacked to a file path.

A lens is never `.exe` `.cmd` `.bat` `.msi` `.com` `.scr` `.ps1`.

### Drop — where the user aims

| Surface | What the body does |
|---|---|
| Tab bar, title, empty frame, taskbar pane | Insert / hot-swap the picture |
| Terminal / prompt | Type the file path into the shell |

If the user says “it only typed a path,” they dropped on PowerShell. That is correct body behavior, not a failed lens.

---

## Three doors (same mount)

| Door | Author ships | User does |
|---|---|---|
| **A** sidecar | Folder `lenses\<id>\lens.json` + `index.html` beside the exe | Palette **Mount <title>** |
| **B** light | `https://` URL, `.url` file, or a lone `.html` | Prompt, paste, or drop on chrome |
| **C** pack | `*.lens` or `*.zip` with the card inside | Drop on chrome. Body unpacks to Door A, then mounts. |

Atlas proved **C**. After the first drop the pack also becomes Door A at `portable\lenses\atlas\`.

One picture slot. A second successful insert **hot-swaps**. It does not open a second picture tab.

---

## Checklist before you hand a pack to anyone

- [ ] `lens.json` validates against the table above
- [ ] `ownsBody` is not true
- [ ] `entry` exists in the zip
- [ ] Picture runs from a file URL with no missing relative assets
- [ ] File is not an executable
- [ ] Product name is the lens `title`, not a rename of AetherShell
- [ ] README says: drop on the tab bar, not on the prompt
- [ ] Body on the floor is 1.19.0 or newer drop-in `app.asar`
- [ ] You did not ask the user to run as Administrator
- [ ] You did not replace the `v1.10.0-stable` zip

---

## What other projects must not do

- Rebuild Electron so the lens fits
- Ship a second exe and call it a lens
- Set `ownsBody: true`
- Hide `lens.json` three folders deep
- Point `entry` at a file that is not in the pack
- Expect many picture tabs
- Treat the Grok browser preview as the tray app
- Merge the product repo into AetherShell, or AetherShell into the product repo

---

## Minimal pack example

```
your-lens.lens          (zip)
  lens.json
  index.html
```

```json
{
  "id": "your-id",
  "title": "YOUR TITLE",
  "entry": "index.html",
  "ownsBody": false
}
```

Build the HTML however you want. Ship only the card and the picture. The body already knows the doorway.
