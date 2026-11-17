import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/js/analytics.js", import.meta.url), "utf8");

function run({ navigator = {}, origin = "https://forge-blog.github.io", referrer = "https://example.com/private?q=secret#fragment", settings = {}, window = {} } = {}) {
  const calls = [];
  const context = {
    URL,
    navigator,
    window: {
      location: { origin },
      fetch: (url, options) => { calls.push({ url, options }); return Promise.resolve(); },
      ...window,
    },
    document: {
      currentScript: { dataset: {
        instrumentationKey: "5449b696-c544-491e-ae84-81ae961c78bf",
        ingestionEndpoint: "https://eastus-8.in.applicationinsights.azure.com/",
        siteUrl: "https://forge-blog.github.io/",
        pageUrl: "https://forge-blog.github.io/posts/example/?secret=value#fragment",
        ...settings,
      } },
      title: "Example article",
      referrer,
    },
  };
  const forbidden = () => { throw new Error("Analytics accessed cookies or storage"); };
  Object.defineProperty(context.document, "cookie", { get: forbidden, set: forbidden });
  for (const storage of ["localStorage", "sessionStorage"]) {
    Object.defineProperty(context.window, storage, { get: forbidden });
    Object.defineProperty(context, storage, { get: forbidden });
  }
  vm.runInNewContext(source, context);
  return calls;
}

test("sends one canonical pageview for the homepage and individual articles without credentials or identifiers", () => {
  for (const pageUrl of ["https://forge-blog.github.io/", "https://forge-blog.github.io/posts/example/"]) {
    const calls = run({ settings: { pageUrl: `${pageUrl}?secret=value#fragment` } });
    assert.equal(calls.length, 1);
    const { url, options } = calls[0];
    assert.equal(url, "https://eastus-8.in.applicationinsights.azure.com/v2/track");
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "omit");
    assert.equal(options.referrerPolicy, "no-referrer");
    assert.equal(options.keepalive, true);
    const [event] = JSON.parse(options.body);
    assert.equal(event.data.baseType, "PageviewData");
    assert.equal(event.data.baseData.url, pageUrl);
    assert.equal(event.data.baseData.name, "Example article");
    assert.equal(event.data.baseData.properties.refUri, "https://example.com");
    assert.equal(event.tags["ai.operation.name"], new URL(pageUrl).pathname);
    assert.doesNotMatch(options.body, /secret|fragment|\/private|ai\.user\.|ai\.session\./);
    assert.equal(event.data.baseData.id, undefined);
  }
});

test("does not send for opt-outs, other origins, missing configuration, or unsupported browsers", () => {
  for (const options of [
    { navigator: { doNotTrack: "1" } },
    { navigator: { doNotTrack: "yes" } },
    { navigator: { globalPrivacyControl: true } },
    { navigator: { msDoNotTrack: "1" } },
    { window: { doNotTrack: "1" } },
    { origin: "http://localhost:1313" },
    { origin: "https://preview.example.com" },
    { settings: { instrumentationKey: "" } },
    { settings: { ingestionEndpoint: "" } },
    { window: { fetch: undefined } },
  ]) {
    assert.equal(run(options).length, 0, JSON.stringify(options));
  }
});

test("ignores missing, malformed, and non-web referrers", () => {
  for (const referrer of ["", "not a URL", "file:///private", "data:text/plain,secret"]) {
    const [event] = JSON.parse(run({ referrer })[0].options.body);
    assert.equal(event.data.baseData.properties.refUri, "");
  }
});

test("blocked telemetry is ignored without retries or unhandled rejections", async () => {
  let attempts = 0;
  run({ window: { fetch: () => { attempts++; return Promise.reject(new Error("Blocked")); } } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(attempts, 1);
});
