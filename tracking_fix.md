# Tracking Fix Summary

This file summarizes the GTM/tracking work completed in the previous session.

## Goal

Fix the ClawBrand funnel tracking setup so GTM receives consistent events across the landing pages, checkout clicks, and thank-you pages.

## Main Changes

### 1. Added a shared tracking layer

Created/updated [`js/clawbrand-tracking.js`](C:\AI\clawbrabdsai.com\corex-landing\js\clawbrand-tracking.js) as the central tracking script.

It now provides:

- Consent mode defaults before GTM loads
- `cbGrantConsent()` and `cbGrantAll()` helpers
- Unique `event_id` generation for deduplication
- Shared helpers for:
  - `cbTrackLead()`
  - `cbTrackSignUp()`
  - `cbTrackBeginCheckout()`
  - `cbTrackPurchase()`
  - `cbTrackViewContent()`
- Automatic `page_view` push on load
- Funnel product mapping via `window.CB_PRODUCTS`
- Automatic `begin_checkout` firing when JVZoo buy links are clicked

### 2. Fixed script order on tracked pages

Tracked pages were updated so `clawbrand-tracking.js` loads before the GTM snippet, which is required for:

- consent defaults to be available before GTM initializes
- `dataLayer` to exist before GTM starts reading events
- helper functions to be callable immediately on the page

### 3. Wired thank-you and lead-confirmation events

Specific event calls were added on confirmation pages:

- [`thankyou/index.html`](C:\AI\clawbrabdsai.com\corex-landing\thankyou\index.html)
  - fires `cbTrackPurchase(...)`
  - currently uses `CB_PRODUCTS.FE`
  - uses placeholder transaction id `ORDER_FROM_JVZOO`

- [`invite/thankyou/index.html`](C:\AI\clawbrabdsai.com\corex-landing\invite\thankyou\index.html)
  - fires `cbTrackLead(...)`
  - lead type: `webinar_registration`
  - page type: `webinar_confirmation`

### 4. Applied the shared tracking include across funnel pages

Pages updated to use the shared tracking/GTM pattern:

- [`index.html`](C:\AI\clawbrabdsai.com\corex-landing\index.html)
- [`special/index.html`](C:\AI\clawbrabdsai.com\corex-landing\special\index.html)
- [`professional/index.html`](C:\AI\clawbrabdsai.com\corex-landing\professional\index.html)
- [`club/index.html`](C:\AI\clawbrabdsai.com\corex-landing\club\index.html)
- [`agency/index.html`](C:\AI\clawbrabdsai.com\corex-landing\agency\index.html)
- [`reseller/index.html`](C:\AI\clawbrabdsai.com\corex-landing\reseller\index.html)
- [`bundle/index.html`](C:\AI\clawbrabdsai.com\corex-landing\bundle\index.html)
- [`fastpass/index.html`](C:\AI\clawbrabdsai.com\corex-landing\fastpass\index.html)
- [`invite/index.html`](C:\AI\clawbrabdsai.com\corex-landing\invite\index.html)
- [`partners/index.html`](C:\AI\clawbrabdsai.com\corex-landing\partners\index.html)
- Preview pages under [`preview/`](C:\AI\clawbrabdsai.com\corex-landing\preview)
- [`thankyou/index.html`](C:\AI\clawbrabdsai.com\corex-landing\thankyou\index.html)
- [`invite/thankyou/index.html`](C:\AI\clawbrabdsai.com\corex-landing\invite\thankyou\index.html)

## Event Flow After Fix

### Page load

Every tracked page now pushes:

- `page_view`

### Landing / sales pages

When a user clicks a JVZoo checkout link, the page pushes:

- `begin_checkout`

The product metadata is inferred from the pathname:

- `/special` -> FE
- `/professional` -> OTO1
- `/club` -> OTO2
- `/agency` -> OTO3
- `/reseller` -> OTO4
- `/bundle` -> Bundle
- `/fastpass` -> FastPass

### Webinar flow

When a user reaches the webinar confirmation page:

- `lead`

### Purchase flow

When a user reaches the purchase thank-you page:

- `purchase`

## Commit Reference

Previous tracking work appears to correspond to:

- Commit: `6a2de1d`
- Message: `Fix GTM tracking and consent setup`

## Notes / Remaining Caveats

- `thankyou/index.html` still uses a placeholder transaction id: `ORDER_FROM_JVZOO`. If real deduplicated purchase tracking is required, this should be replaced with the actual JVZoo order id.
- Consent mode is currently defaulted to granted for launch mode.
- Auto `begin_checkout` only attaches to links matching `jvzoo.com/b/`.

