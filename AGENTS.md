# Local development

This checkout is for personal use on localhost. Default to the smallest workflow
that makes the requested change visible locally.

- Reuse the running Vite server and its hot reload. If needed, start it with
  `npx vite --host 127.0.0.1`; do not restart an existing server unnecessarily.
- Check changed UI in the local app when accessible. Use `npx tsc --noEmit` and
  focused checks for changed logic as appropriate. Lint only changed files;
  existing unrelated lint warnings do not require cleanup.
- Skip production builds (`npm run build`, `vite build`), static Storybook builds,
  full regression suites, packaging/Tauri builds, release preparation, publishing,
  and deployment unless explicitly requested or needed to investigate a problem
  specific to that step.
- Skip refreshing GitHub release/download data for ordinary UI edits. `npm run dev`
  runs that refresh first, so prefer invoking Vite directly when the generated
  `src/data/release-data.json` already exists. Generate it only if missing and
  needed to start the app, or when working on release/download information.
- Do not add tests or stories for routine presentation edits by default. For
  nontrivial label logic, prefer a small focused check and update existing coverage
  when its expectations change. Do not build Storybook just to validate a story.
- Do not create commits, push, publish, or deploy unless the user asks.
