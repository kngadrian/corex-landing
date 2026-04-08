/**
 * ClawBrand AI — Universal Tracking Script
 * Drop this in <head> BEFORE the GTM snippet on every page.
 * Then call the helper functions from your app when events happen.
 *
 * Usage:
 *   <script src="/clawbrand-tracking.js"></script>
 *   <script>(GTM snippet here)</script>
 */

// =====================================================
// 1. CONSENT MODE DEFAULTS (must fire before GTM loads)
// Launch mode: consent is granted by default so GTM/GA/Ads fire.
// =====================================================
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  ad_storage:          'granted',
  analytics_storage:   'granted',
  ad_user_data:        'granted',
  ad_personalization:  'granted'
});

// Call this from a cookie banner / CMP if you later add one.
window.cbGrantConsent = function(opts) {
  opts = opts || {};
  gtag('consent', 'update', {
    ad_storage:          opts.ads !== false ? 'granted' : 'denied',
    analytics_storage:   opts.analytics !== false ? 'granted' : 'denied',
    ad_user_data:        opts.ads !== false ? 'granted' : 'denied',
    ad_personalization:  opts.ads !== false ? 'granted' : 'denied'
  });
};

// Shortcut: grant everything (user clicks "Accept All")
window.cbGrantAll = function() {
  cbGrantConsent({ ads: true, analytics: true });
};

// =====================================================
// 2. UTILITY — unique event ID generator (for dedup)
// =====================================================
function _cbEventId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

// =====================================================
// 3. EVENT HELPERS — call these from your app/pages
// =====================================================

/**
 * Lead event — opt-in, webinar reg, early-bird signup
 * @param {Object} opts
 * @param {string} opts.leadType  - e.g. 'webinar_registration', 'early_bird', 'opt_in'
 * @param {string} [opts.pageType] - e.g. 'landing_page', 'squeeze_page'
 */
window.cbTrackLead = function(opts) {
  opts = opts || {};
  dataLayer.push({
    event:      'lead',
    event_id:   _cbEventId('lead'),
    lead_type:  opts.leadType  || 'general',
    page_type:  opts.pageType  || document.title
  });
};

/**
 * Sign-up event — account created
 * @param {Object} opts
 * @param {string} [opts.method] - 'email', 'google', etc.
 */
window.cbTrackSignUp = function(opts) {
  opts = opts || {};
  dataLayer.push({
    event:    'sign_up',
    event_id: _cbEventId('signup'),
    method:   opts.method || 'email'
  });
};

/**
 * Begin checkout — order form / checkout page opened
 * @param {Object} opts
 * @param {number}  opts.value      - price in USD
 * @param {string}  opts.itemId     - e.g. 'clawbrand-fe'
 * @param {string}  opts.itemName   - e.g. 'ClawBrand AI Frontend'
 */
window.cbTrackBeginCheckout = function(opts) {
  opts = opts || {};
  dataLayer.push({
    event:    'begin_checkout',
    event_id: _cbEventId('checkout'),
    value:    opts.value || 0,
    currency: 'USD',
    items: [{
      item_id:   opts.itemId   || 'clawbrand-unknown',
      item_name: opts.itemName || 'ClawBrand AI',
      price:     opts.value    || 0,
      quantity:  1
    }]
  });
};

/**
 * Purchase — successful payment / thank-you page ONLY
 * @param {Object} opts
 * @param {string}  opts.transactionId - order ID from JVZoo or your backend
 * @param {number}  opts.value         - total paid
 * @param {string}  opts.itemId        - e.g. 'clawbrand-fe', 'clawbrand-oto1'
 * @param {string}  opts.itemName      - human-readable product name
 */
window.cbTrackPurchase = function(opts) {
  opts = opts || {};
  if (!opts.transactionId) {
    console.warn('[CB Tracking] purchase called without transactionId');
  }
  dataLayer.push({
    event:          'purchase',
    event_id:       _cbEventId('purchase'),
    transaction_id: opts.transactionId || 'unknown',
    value:          opts.value         || 0,
    currency:       'USD',
    items: [{
      item_id:   opts.itemId   || 'clawbrand-unknown',
      item_name: opts.itemName || 'ClawBrand AI',
      price:     opts.value    || 0,
      quantity:  1
    }]
  });
};

/**
 * View Content — optional, for retargeting audiences
 * @param {Object} opts
 * @param {string} opts.contentType - e.g. 'sales_page', 'oto_page', 'jv_page'
 * @param {string} [opts.contentId]
 */
window.cbTrackViewContent = function(opts) {
  opts = opts || {};
  dataLayer.push({
    event:        'view_content',
    event_id:     _cbEventId('vc'),
    content_type: opts.contentType || 'page',
    content_id:   opts.contentId   || window.location.pathname
  });
};

// =====================================================
// 4. FUNNEL PRODUCT MAP (for quick reference in calls)
// =====================================================
window.CB_PRODUCTS = {
  FE:      { itemId: 'clawbrand-fe',      itemName: 'ClawBrand AI',                 price: 47 },
  OTO1:    { itemId: 'clawbrand-oto1',    itemName: 'ClawBrand AI PRO',             price: 97 },
  OTO2:    { itemId: 'clawbrand-oto2',    itemName: 'ClawBrand AI Template Club',   price: 67 },
  OTO3:    { itemId: 'clawbrand-oto3',    itemName: 'ClawBrand AI Agency Mode',     price: 197 },
  OTO4:    { itemId: 'clawbrand-oto4',    itemName: 'ClawBrand AI Reseller Rights', price: 297 },
  FASTPASS:{ itemId: 'clawbrand-fastpass',itemName: 'ClawBrand AI FastPass',        price: 247 },
  BUNDLE:  { itemId: 'clawbrand-bundle',  itemName: 'ClawBrand AI Bundle',          price: 297 }
};

function _cbProductForPath(pathname) {
  if (!pathname) return null;

  if (pathname === '/special' || pathname === '/special/') return window.CB_PRODUCTS.FE;
  if (pathname === '/professional' || pathname === '/professional/') return window.CB_PRODUCTS.OTO1;
  if (pathname === '/club' || pathname === '/club/') return window.CB_PRODUCTS.OTO2;
  if (pathname === '/agency' || pathname === '/agency/') return window.CB_PRODUCTS.OTO3;
  if (pathname === '/reseller' || pathname === '/reseller/') return window.CB_PRODUCTS.OTO4;
  if (pathname === '/bundle' || pathname === '/bundle/') return window.CB_PRODUCTS.BUNDLE;
  if (pathname === '/fastpass' || pathname === '/fastpass/') return window.CB_PRODUCTS.FASTPASS;

  return null;
}

document.addEventListener('DOMContentLoaded', function() {
  var pageProduct = _cbProductForPath(window.location.pathname);

  document.querySelectorAll('a[href*="jvzoo.com/b/"]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (!pageProduct) return;
      window.cbTrackBeginCheckout(pageProduct);
    });
  });
});

// =====================================================
// 5. AUTO PAGE_VIEW (fires automatically on load)
// =====================================================
dataLayer.push({
  event:     'page_view',
  event_id:  _cbEventId('pv'),
  page_path: window.location.pathname,
  page_title: document.title
});

console.log('[CB Tracking] initialized — consent defaults set, page_view fired');
