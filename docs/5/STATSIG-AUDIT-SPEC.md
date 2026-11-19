# Phase 5 — Statsig audit, fix, verify (P5-STATSIG-AUDIT-001)

**Live:** https://beccaabusharkh.github.io/AmpliYorker/#/  
**Project:** AmpliYorker [BAS] `1Nj9BkrZHElrDQV9CIWiyf`  
**SDK:** `@statsig/js-client` only — **no Statsig Session Replay** (Amplitude owns replay).

## Exclusions
- Statsig Session Replay / Web Experiment (Amplitude Web Experiment remains separate)
- Launching experiments or changing live allocations in console
- Duplicating Amplitude autocapture in Statsig

## Acceptance themes (S01–S40)
- **S01–S08** init, ordering, single client, env tier, timeout/fallback, no server secrets
- **S09–S16** identity + Amplitude bridge; login/logout/refresh; forced overrides
- **S17–S22** param stores/layers; disableExposureLog on store reads
- **S23–S28** gates/experiments inventory; exposure inspector; manual exposure dedupe
- **S29–S32** paywall/subscribe/home/retention treatments
- **S33–S35** outcomes via Amplitude custom events (Statsig event map doc)
- **S36–S38** Web Analytics boundary (hash SPA = Amplitude; Statsig page analytics off)
- **S39–S40** verification journeys + live bundle checks

## Evidence
`docs/evidence/statsig-audit/coverage-matrix.md`, `root-causes.md`, `identity-mapping.md`, `event-map.md`, `preview-smoke.json`, `WALKTHROUGH.md`