# Decision log

## 2026-11-11 — Phase 0 merge approval (PR #1)

- **Channel:** #bas-cursor (Slack)
- **Slack timestamp:** `1794432290.929269`
- **Approver:** Becca Abu Sharkh (`U045L8FS5BN`)
- **PR:** https://github.com/beccaabusharkh/AmpliYorker/pull/1
- **Reviewed commit (pre-merge head):** `b0ca49a8e76fe4e6f1ad10f1f4e2671380ba81a3`
- **Merge commit on `main`:** `db8cc8bc3434d679b8ed3cbaf1ffaf3758ff084a`
- **Action:** Approve and squash-merge PR #1; trigger GitHub Pages deploy on `main`
- **Assignment:** Phase 0 publish (consumes pending merge authorization after P0-PUBLISH-001)
- **Approval state:** CONSUMED
- **Deployment evidence:** Actions run https://github.com/beccaabusharkh/AmpliYorker/actions/runs/43102935560 (success); live signed-out check `https://beccaabusharkh.github.io/AmpliYorker/` HTTP 200 with “Amplitude Daily”, seeded headline, and article id in bundle

## 2026-11-11 — Phase 0 UX spec waiver

- **Decision:** Proceed with Phase 0 scaffold using PROJECT_PLAN defaults when `docs/0/SPEC.md` is absent
- **Recorded by:** Builder assignment P0-BUILD-002 (referenced in PHASE_LOG)

## 2026-11-11 — Phase 1 UX spec waiver (interim)

- **Decision:** Dispatch Phase 1 BUILD assignment **P1-BUILD-001** using PROJECT_PLAN Phase 1 deliverables and acceptance copy until `docs/1/SPEC.md` is READY from UX; Builder must not invent competing copy for labeled simulations or sponsored content—use explicit simulation labels from the plan (“Simulated”, “Sponsored story” variants as listed in handoff)
- **Rationale:** Unblock discovery/engagement build while UX audit can land in parallel
