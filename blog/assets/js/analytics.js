(() => {
  const settings = document.currentScript.dataset;
  if (
    !settings.instrumentationKey ||
    !settings.ingestionEndpoint ||
    typeof window.fetch !== "function" ||
    navigator.globalPrivacyControl === true ||
    [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some((value) => value === "1" || value === "yes") ||
    window.location.origin !== new URL(settings.siteUrl).origin
  ) return;

  const pageUrl = new URL(settings.pageUrl);
  pageUrl.search = "";
  pageUrl.hash = "";
  let referrerOrigin = "";
  try {
    const referrer = new URL(document.referrer);
    if (referrer.protocol === "https:" || referrer.protocol === "http:") {
      referrerOrigin = referrer.origin;
    }
  } catch {}

  const telemetry = {
    name: `Microsoft.ApplicationInsights.${settings.instrumentationKey.replaceAll("-", "")}.Pageview`,
    time: new Date().toISOString(),
    iKey: settings.instrumentationKey,
    tags: {
      "ai.device.type": "Browser",
      "ai.operation.name": pageUrl.pathname,
    },
    data: {
      baseType: "PageviewData",
      baseData: {
        ver: 2,
        name: document.title,
        url: pageUrl.href,
        properties: {
          refUri: referrerOrigin,
        },
      },
    },
  };

  // Avoid the SDK's storage probes and sendBeacon's credential-inclusive requests.
  window.fetch(new URL("/v2/track", settings.ingestionEndpoint).href, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify([telemetry]),
    credentials: "omit",
    referrerPolicy: "no-referrer",
    keepalive: true,
  }).catch(() => {});
})();
