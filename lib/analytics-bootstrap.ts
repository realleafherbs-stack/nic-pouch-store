export function createAnalyticsBootstrap(measurementId: string): string {
  return `
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    try {
      if (localStorage.getItem('nic-pouch-cookie-choice') === 'all') {
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
      }
    } catch (error) {}

    var currentUrl = new URL(window.location.href);
    var safePageUrl = new URL(currentUrl.origin + currentUrl.pathname);
    var campaignParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
    campaignParams.forEach(function(key) {
      currentUrl.searchParams.getAll(key).forEach(function(value) {
        safePageUrl.searchParams.append(key, value);
      });
    });
    var safeReferrer = '';
    try {
      if (document.referrer) {
        var referrerUrl = new URL(document.referrer);
        safeReferrer = referrerUrl.origin + referrerUrl.pathname;
      }
    } catch (error) {}

    window.gtag('js', new Date());
    window.gtag('config', ${JSON.stringify(measurementId)}, {
      anonymize_ip: true,
      allow_google_signals: false,
      page_location: safePageUrl.href,
      page_referrer: safeReferrer
    });
  `;
}
