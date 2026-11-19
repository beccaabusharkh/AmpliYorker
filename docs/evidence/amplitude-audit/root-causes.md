# Amplitude audit — root causes

## RC-01 — Autocapture fully disabled (`autocapture: false`)

**Symptom:** No `[Amplitude] Page Viewed` or `[Amplitude] Element Clicked` in project 905300 taxonomy; dead zones for navigation-only journeys.  
**Cause:** Phase 3 init used `autocapture: false` / `defaultTracking: false` to avoid overlapping custom events.  
**Fix:** Object-mode autocapture — page views + sessions + selective `elementInteractions` with `shouldTrackEventResolver` skipping precision DOM.

## RC-02 — Hash routes invisible to Web Analytics

**Symptom:** GitHub Pages SPA never emitted page views on `#/article/...` transitions.  
**Cause:** Same as RC-01; no manual `track` on `hashchange`.  
**Fix:** `pageViews: { trackHistoryChanges: "all" }` under unified analytics options.

## RC-03 — Read Article duplicate / retry risk

**Symptom:** High volume (184) vs expected milestone cardinality; retries could double-count without `insert_id`.  
**Cause:** Each `trackDemoEvent` generated fresh `event_id` in common properties only; no Amplitude dedupe key. Rapid `measure()` timer could race before `sessionStorage` commit (low).  
**Fix:** Stable `insert_id` `read-article:{article_id}:{milestone}:{demo_run_id}` aligned to dictionary retry rule.

## RC-04 — Anonymous sessions kept stale `userId`

**Symptom:** Identity drift after logout / anonymous browsing (risk of attributed events to prior reader).  
**Cause:** `ensureAmplitudeIdentity` set `userId` when logged in but never cleared when anonymous; device id not tied to `ampli-daily-anonymous-id`.  
**Fix:** `setUserId(undefined)` + `setDeviceId(anonId)` on every identity sync.

## RC-05 — Guides & Surveys boot without configuration

**Symptom:** `[Guides-Surveys] Engagement Booted` (vol 226) with empty `engagement: {}`.  
**Cause:** `initAll` always loads engagement plugin.  
**Fix:** `engagement: { skip: true }` unless `VITE_AMPLITUDE_ENGAGEMENT_ENABLED=true`.

## RC-06 — Agent Analytics missing for scripted chat

**Symptom:** Only product `Chat Request Submitted` / `Chat Response Delivered`; no `[Agent]` taxonomy for AI ops dashboards.  
**Cause:** No Agent Analytics instrumentation (and `@amplitude/ai` excluded per Builder single-package rule).  
**Fix:** Manual `[Agent]` events via unified `track()` with metadata-only context (no message text).

## RC-07 — Production Pages keys / live gap

**Symptom:** Live site may not ingest when GitHub Actions secrets missing; audit fixes not on live until deploy.  
**Cause:** Static build bakes `import.meta.env`; local smoke needs team secret (see `preview-smoke.json`).  
**Mitigation:** Document; verify on preview with key; do not commit `.env.local`.

## RC-08 — Blocked: G&S content + Web Experiment deployment key

**G&S:** No approved survey/guide content in console for AmpliYorker → targeting checks **BLOCKED** (A35–A36).  
**Web Experiment:** `VITE_AMPLITUDE_WEB_EXPERIMENT_DEPLOYMENT_KEY` not in repo → plugin omitted (A37 partial). Statsig remains sole UI experiment surface (A39 PASS).