# Ke Xueyi's Homepage

Source for <https://kexueyi.github.io/>. Static HTML/CSS/JS, no build step.
GitHub Pages serves the `main` branch from the repository root, so **pushing to
`main` is the deploy**; a build takes roughly 30–60 seconds to go live.

## Working on another machine

> [!IMPORTANT]
> **2026-08-31 — history was rewritten. A plain `git pull` will fail or create a
> merge mess on any clone made before that date.**

A 21.5 MB PDF (`webpage-discover-hidden-visual-concepts/resources/2501.05205v4.pdf`)
was purged from the entire history with `git filter-repo`, then force-pushed.
Every commit SHA changed (`74f4594` → `f450dae`), so an older clone's `main` has
no commit in common with the remote and Git sees the two as unrelated branches.

If a clone predates that date, **reset it instead of pulling**:

```bash
git fetch origin
git reset --hard origin/main   # discards local commits — see below first
```

Check for local work you would lose before resetting:

```bash
git log origin/main..HEAD --oneline   # commits only on this machine
git status                            # uncommitted changes
```

If anything shows up, copy the files out or `git format-patch` them, reset, then
reapply. Do not merge the old history back in — that would restore the deleted
blob and undo the cleanup.

The same rewrite was applied to the companion repo
[`webpage-discover-hidden-visual-concepts`](https://github.com/Kexueyi/webpage-discover-hidden-visual-concepts)
(`cdd6a34` → `658a32e`), so clones of that repo need the same treatment.

### Why the repo still looks large on GitHub

After a force-push GitHub keeps the unreachable objects until it garbage-collects
on its own schedule, so the size shown on the repo page stays at the old figure
for a while. This affects nobody: a fresh clone is already 57 MB (was 81 MB).
Verify with `git rev-list --objects --all | grep 2501.05205v4.pdf` — it returns
nothing.

## Related repositories

| Repo | Purpose |
| --- | --- |
| `kexueyi.github.io` | This site. |
| `discover-hidden-visual-concepts` | CVPR 2025 code **and** its project page, served from `docs/` at `/discover-hidden-visual-concepts/`. |
| `webpage-discover-hidden-visual-concepts` | Legacy. Holds only a redirect to the URL above, plus the poster PDF at its original path. Its GitHub Pages site **shadows** the same path under this repo, which is why the redirect has to live there and not here. |

New project pages go in the paper's own repo under `docs/`, not here — that
keeps large figures out of this repo's permanent history.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Hard-reload (`Cmd+Shift+R`) after editing CSS
or JS; the browser caches them aggressively and a normal reload will silently
serve the old files.

## Notes

- `images/gallery/` is git-ignored. The homepage prefetches only the first 6
  images (see the comment near the bottom of `index.html`); prefetching all of
  them cost every visitor ~18.6 MB.
- The visitors map is a MapMyVisitors widget. Its colours come from the query
  string on the script `src`, which the script reads at runtime — the served
  `map.js` is byte-identical regardless, so comparing that file tells you
  nothing about whether the colours took effect.
