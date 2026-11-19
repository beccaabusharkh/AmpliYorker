# Statsig demo walkthrough (post-audit)

1. **Anonymous home** — open `https://beccaabusharkh.github.io/AmpliYorker/#/`; exposure inspector (footer) empty or control variants.
2. **Force treatment** — append `?force_statsig=subscription_message_copy:urgency`, open premium article `retention-myths`; paywall shows urgency copy; inspector shows forced exposure.
3. **Paywall scroll gate** — `?force_statsig=premium_paywall_after_scroll:true` on premium article; scroll past threshold → `Paywall Presented`.
4. **Subscribe offer** — log in (demo persona), `?force_statsig=subscription_offer_framing:intro_badge`, visit `#/subscribe`; intro badge variant on plan card.
5. **Login identity** — register/login persona; inspector persists stable assignment until logout.
6. **Logout** — Account → Sign out; exposures cleared; anonymous `userID` restored on next navigation.
7. **Statsig down** — block `api.statsig.com` in devtools → site renders defaults from `PAGE_DEFAULTS` (no crash).

Amplitude journeys unchanged; Session Replay remains Amplitude-only.