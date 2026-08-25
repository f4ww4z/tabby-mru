# tabby-mru

Browser-style **Most Recently Used (MRU)** tab switching for the [Tabby terminal](https://tabby.sh).

Tabby ships a built-in `toggle-last-tab` action, but it only swaps between the
current tab and the *one* previously active tab. This plugin keeps a full MRU
stack: holding a hotkey and pressing it repeatedly cycles further back through
your tab history — just like `Ctrl+Tab` in a browser — then commits the pick
to the front of the stack once you stop pressing it.

## What it adds

Two new hotkey actions, unbound by default, under **Settings > Hotkeys**:

- Switch to next tab in MRU order (`mru-next`)
- Switch to previous tab in MRU order (`mru-previous`)

Bind them to whatever you like — `Ctrl-Tab` / `Ctrl-Shift-Tab` is the most
browser-like choice.

## Project layout

```
tabby-mru/
├── package.json
├── tsconfig.json
├── webpack.config.js
└── src/
    ├── index.ts        # NgModule entry point
    ├── mru.service.ts  # MRU stack tracking + cycling logic
    ├── hotkeys.ts       # HotkeyProvider — declares the 2 actions
    └── config.ts        # ConfigProvider — default (empty) keybindings
```

## 1. Local setup

```bash
npm install
```

`tabby-core` only needs to be present at compile time — Tabby supplies it at
runtime — which is why it's under `peerDependencies` and listed in
`externals` in `webpack.config.js`.

## 2. Build

```bash
npm run build
```

This produces `dist/index.js` + `dist/index.d.ts` + a source map. That
`dist/` folder plus `package.json` is the actual plugin Tabby loads.

## 3. Test locally before publishing

Tabby loads plugins from a `plugins/node_modules/<name>` folder inside its
config directory:

- Linux: `~/.config/tabby/plugins/node_modules/`
- macOS: `~/Library/Application Support/tabby/plugins/node_modules/`
- Windows: `%APPDATA%\tabby\plugins\node_modules\`

Steps:

1. `mkdir -p ~/.config/tabby/plugins/node_modules/tabby-mru`
2. `cp -r package.json dist ~/.config/tabby/plugins/node_modules/tabby-mru/`
3. Fully quit and relaunch Tabby (not just close the window — plugins load at startup).
4. Open **Settings > Plugins** and confirm `tabby-mru` shows as installed.
5. Open **Settings > Hotkeys**, search "MRU", bind keys to both actions.
6. Open several tabs, switch between non-adjacent ones normally, then test
   your hotkey — it should walk backward through your actual usage order,
   not tab-bar position.

While developing, run `npm run watch` and relaunch Tabby after each change —
plugin code isn't hot-reloaded.

## 4. Publish to npm (so it's installable from Tabby's Plugin manager)

Tabby's Settings > Plugins tab discovers community plugins by searching npm
for the `tabby-plugin` keyword, which is already set in `package.json`.

1. `npm adduser` (skip if you already have an npm account)
2. Confirm in `package.json`: unique `name`, correct `version`,
   `keywords: ["tabby-plugin"]`, real `author`/`license`, and `files: ["dist"]`
   so only the build output ships.
3. Sanity check exactly what will be published: `npm publish --dry-run`
4. Publish: `npm publish`
5. In Tabby, go to **Settings > Plugins**, search `mru`, and install it like
   any other community plugin to confirm the listing works end to end.

## Notes and limitations

- A cycle "commits" 600ms after your last keypress, mirroring how a browser
  finalizes once you release the modifier key. Tune the `setTimeout` delay
  in `mru.service.ts` if you want it snappier or more forgiving.
- The stack is filtered against `app.tabs` on every cycle, so closed or
  reordered tabs never produce a stale jump target.
- This only changes keyboard-driven selection order — your tab bar layout
  and tab positions are untouched.
