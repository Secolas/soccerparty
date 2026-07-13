# src/ — the editable game source

`../index.html` is **generated** from this directory by `../tools/build-game.mjs`.
Edit here, then rebuild — never edit `index.html` by hand.

```
node tools/build-game.mjs          # rebuild index.html
node tools/build-game.mjs --check  # verify index.html matches src/ (CI runs this)
```

## How index.html is put together

`index.html` is a self-extracting bundle so the deployed game stays a single
page that works offline-ish and on file://:

1. `shell.html` — the outer page. Contains the unpacker script plus two data
   blocks: a `__bundler/manifest` (base64 fonts + the gzipped "DC" runtime that
   loads React) and a `__bundler/template` (the actual game page as one
   JSON-encoded string). The `__TEMPLATE_JSON__` placeholder line marks where
   the build injects the encoded template.
2. `template.html` — the decoded game page: HTML layout, CSS, and a
   `<script type="text/x-dc">` tag whose body is the game code. The
   `__GAME_SCRIPT__` placeholder line marks where the build injects it.
3. `game/*.js` — the game code, concatenated in filename order. It is one big
   `class Component extends DCLogic` with everything inside
   `componentDidMount()`, so every file shares one scope: any file can use
   functions/variables defined in any other file, and load order only matters
   for the top-level statements that run during mount (keep new boot code in
   `17-boot.js`).

The JSON encoding escapes `</` so the template string can't terminate its own
`<script>` tag. The build is deterministic: same `src/` always produces the
same `index.html` byte-for-byte, which is what `--check` relies on.

## Ground rules

- Keep the numbered-file concatenation order in mind — files are joined with a
  single newline between them, exactly as if it were still one file.
- Commit `src/` and the regenerated `index.html` together in the same commit.
- Fonts/runtime in the manifest (`shell.html`) are opaque payloads — don't
  reformat that file.
