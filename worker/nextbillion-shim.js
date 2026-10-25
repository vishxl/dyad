/* ---------------------------------------------------------------------------
 * Hosted-preview URL shim (must run before the iframe early-return below and
 * before the app bundle): the preview page lives under /preview/<port>/, but
 * app code that fetches root-absolute URLs — fetch("/api/...") — ignores the
 * prefix and lands on the NextBillion UI host, which answers with its SPA fallback
 * HTML at 200 (silently breaking the feature). Patch fetch/XHR to re-add the
 * prefix for same-origin root-absolute URLs.
 * The prefix token below is substituted by the proxy worker at injection
 * time ("/preview/<port>" in hosted mode, literal null on desktop/dev).
 * ponytail: string URLs only — fetch(Request) and URL-object callers are not
 * rewritten; add if a generated app actually needs it.
 * ------------------------------------------------------------------------- */
(function () {
  const publicPrefixPath = __NEXTBILLION_PUBLIC_PREFIX_PATH__;
  if (!publicPrefixPath || typeof window.fetch !== "function") return;

  function publicize(url) {
    if (typeof url !== "string") return url;
    if (url === publicPrefixPath || url.startsWith(publicPrefixPath + "/")) {
      return url;
    }
    if (url.startsWith("/") && !url.startsWith("//")) {
      return publicPrefixPath + url;
    }
    // Absolute same-origin URLs (window.location.origin-prefixed paths, as
    // maplibre transformRequest and app code build them) escape the preview
    // prefix and land on the UI host's SPA fallback — fold them back in.
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
      try {
        const u = new URL(url);
        if (
          u.origin === window.location.origin &&
          !u.pathname.startsWith(publicPrefixPath)
        ) {
          return publicPrefixPath + u.pathname + u.search + u.hash;
        }
      } catch {
        // not a parseable URL — leave it alone
      }
    }
    return url;
  }

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string") {
      return originalFetch.call(this, publicize(input), init);
    }
    return originalFetch.apply(this, arguments);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    if (typeof arguments[1] === "string") {
      arguments[1] = publicize(arguments[1]);
    }
    return originalOpen.apply(this, arguments);
  };
})();

(function () {
  console.debug("nextbillion-shim.js loaded via proxy v0.8.0");
  const isInsideIframe = window.parent !== window;
  if (!isInsideIframe) return;

  let previousUrl = window.location.href;
  const PARENT_TARGET_ORIGIN = "*";

  /**
   * What this load did to the browser's history, so the parent's model can do
   * the same: "push" added an entry, "replace" reused the current one, and
   * "traverse" moved to an entry that was already there.
   *
   * A plain link or a `<form>` submit pushes, and the parent's history has to
   * grow with it or its Back button — and the `page.goBack()` a recording
   * replays with — skips the page the user came from. Deliberately NOT keyed on
   * `redirectCount`: a link whose request is answered with a 3xx still ends in
   * a brand-new entry, so counting redirects as replacements loses exactly the
   * entry this exists to keep.
   *
   * A same-document `location.replace()` by the app is indistinguishable from a
   * link here and reads as a push; the parent's equality check still covers the
   * one case that matters, NextBillion's own `location.replace` navigation.
   */
  function loadHistoryEffect() {
    try {
      const [navigation] = performance.getEntriesByType("navigation");
      if (!navigation) return "replace";
      if (navigation.type === "reload") return "replace";
      if (navigation.type === "back_forward") return "traverse";
      return "push";
    } catch {
      return "replace";
    }
  }

  // A whole-document navigation — a plain link, a `<form>` submit, a server
  // redirect — never passes through the history overrides below, so without
  // this the parent keeps showing whatever route it last selected itself. That
  // stale route is what the recorder would pin a session's opening `goto` to,
  // skipping the very navigation the test is about. Sent on every load; the
  // parent ignores the one matching the route it just asked for.
  window.parent.postMessage(
    {
      type: "nextbillion-document-loaded",
      payload: {
        newUrl: window.location.href,
        historyEffect: loadHistoryEffect(),
      },
    },
    PARENT_TARGET_ORIGIN,
  );

  // --- History API Overrides ---
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const handleStateChangeAndNotify = (originalMethod, state, title, url) => {
    const oldUrlForMessage = previousUrl;
    let newUrl;
    try {
      newUrl = url
        ? new URL(url, window.location.href).href
        : window.location.href;
    } catch (e) {
      console.error("Could not parse URL", e);
      newUrl = window.location.href;
    }

    const navigationType =
      originalMethod === originalPushState ? "pushState" : "replaceState";

    try {
      // Pass the original state directly
      originalMethod.call(history, state, title, url);
      previousUrl = window.location.href;
      window.parent.postMessage(
        {
          type: navigationType,
          payload: { oldUrl: oldUrlForMessage, newUrl: newUrl },
        },
        PARENT_TARGET_ORIGIN,
      );
    } catch (e) {
      console.error(
        `[vite-dev-plugin] Error calling original ${navigationType}: `,
        e,
      );
      window.parent.postMessage(
        {
          type: "navigation-error",
          payload: {
            operation: navigationType,
            message: e.message,
            error: e.toString(),
            stateAttempted: state,
            urlAttempted: url,
          },
        },
        PARENT_TARGET_ORIGIN,
      );
    }
  };

  history.pushState = function (state, title, url) {
    handleStateChangeAndNotify(originalPushState, state, title, url);
  };

  history.replaceState = function (state, title, url) {
    handleStateChangeAndNotify(originalReplaceState, state, title, url);
  };

  // --- Listener for Back/Forward Navigation (popstate event) ---
  window.addEventListener("popstate", () => {
    const oldUrl = previousUrl;
    const currentUrl = window.location.href;
    previousUrl = currentUrl;
    // Notify parent about the navigation change (for back/forward button support)
    window.parent.postMessage(
      {
        type: "replaceState",
        payload: { oldUrl: oldUrl, newUrl: currentUrl },
      },
      PARENT_TARGET_ORIGIN,
    );
  });

  // --- Listener for Commands from Parent ---
  window.addEventListener("message", (event) => {
    if (
      event.source !== window.parent ||
      !event.data ||
      typeof event.data !== "object"
    )
      return;
    if (event.data.type === "navigate") {
      const { direction, url } = event.data.payload || {};
      // If a URL is provided, use location.replace for navigation
      // (browser history.back()/forward() doesn't work reliably in Electron iframes)
      if (url && typeof url === "string") {
        try {
          // Validate URL and ensure it's same-origin to prevent javascript:/data: injection
          const parsedUrl = new URL(url, window.location.href);
          if (
            parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
          ) {
            // Use location.replace to avoid adding to history
            window.location.replace(parsedUrl.href);
          } else {
            console.warn(
              "[nextbillion-shim] Blocked navigation to unsafe URL protocol:",
              parsedUrl.protocol,
            );
          }
        } catch (e) {
          console.error("[nextbillion-shim] Invalid navigation URL:", e);
        }
      } else if (url) {
        console.warn("[nextbillion-shim] Invalid URL type:", typeof url);
      } else {
        // Fallback to history API if no URL provided
        if (direction === "forward") {
          window.history.go(1);
        } else if (direction === "backward") {
          window.history.go(-1);
        }
      }
    }
  });

  // --- Sourcemapped Error Handling ---
  function sendSourcemappedErrorToParent(error, sourceType) {
    if (typeof window.StackTrace === "undefined") {
      console.error("[vite-dev-plugin] StackTrace object not found.");
      // Send simplified raw data if StackTrace isn't available
      window.parent.postMessage(
        {
          type: sourceType,
          payload: {
            message: error?.message || String(error),
            stack:
              error?.stack || "<no stack available - StackTrace.js missing>",
          },
        },
        PARENT_TARGET_ORIGIN,
      );
      return;
    }

    window.StackTrace.fromError(error)
      .then((stackFrames) => {
        const sourcemappedStack = stackFrames
          .map((sf) => sf.toString())
          .join("\n");

        const payload = {
          message: error?.message || String(error),
          stack: sourcemappedStack,
        };

        window.parent.postMessage(
          {
            type: "iframe-sourcemapped-error",
            payload: { ...payload, originalSourceType: sourceType },
          },
          PARENT_TARGET_ORIGIN,
        );
      })
      .catch((mappingError) => {
        console.error(
          "[vite-dev-plugin] Error during stacktrace sourcemapping:",
          mappingError,
        );

        const payload = {
          message: error?.message || String(error),
          // Provide the raw stack or an indication of mapping failure
          stack: error?.stack
            ? `Sourcemapping failed: ${mappingError.message}\n--- Raw Stack ---\n${error.stack}`
            : `Sourcemapping failed: ${mappingError.message}\n<no raw stack available>`,
        };

        window.parent.postMessage(
          {
            type: "iframe-sourcemapped-error",
            payload: { ...payload, originalSourceType: sourceType },
          },
          PARENT_TARGET_ORIGIN,
        );
      });
  }

  window.addEventListener("error", (event) => {
    let error = event.error;
    if (!(error instanceof Error)) {
      window.parent.postMessage(
        {
          type: "window-error",
          payload: {
            message: error.toString(),
            stack: "<no stack available - an improper error was thrown>",
          },
        },
        PARENT_TARGET_ORIGIN,
      );
      return;
    }
    sendSourcemappedErrorToParent(error, "window-error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    let error = event.reason;
    if (!(error instanceof Error)) {
      window.parent.postMessage(
        {
          type: "unhandled-rejection",
          payload: {
            message: event.reason.toString(),
            stack:
              "<no stack available - an improper error was thrown (promise)>",
          },
        },
        PARENT_TARGET_ORIGIN,
      );
      return;
    }
    sendSourcemappedErrorToParent(error, "unhandled-rejection");
  });

  (function watchForViteErrorOverlay() {
    // --- Configuration for the observer ---
    // We only care about direct children being added or removed.
    const config = {
      childList: true, // Observe additions/removals of child nodes
      subtree: false, // IMPORTANT: Do *not* observe descendants, only direct children
    };

    // --- Callback function executed when mutations are observed ---
    const observerCallback = function (mutationsList) {
      // Iterate through all mutations that just occurred
      for (const mutation of mutationsList) {
        // We are only interested in nodes that were added
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check each added node
          for (const node of mutation.addedNodes) {
            // Check if it's an ELEMENT_NODE (type 1) and has the correct ID
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.tagName === "vite-error-overlay".toUpperCase()
            ) {
              reportViteErrorOverlay(node);
            }
          }
        }
      }
    };

    function reportViteErrorOverlay(node) {
      console.log(`Detected vite error overlay: ${node}`);
      try {
        window.parent.postMessage(
          {
            type: "build-error-report",
            payload: {
              message: node.shadowRoot.querySelector(".message").textContent,
              file: node.shadowRoot.querySelector(".file").textContent,
              frame: node.shadowRoot.querySelector(".frame").textContent,
            },
          },
          PARENT_TARGET_ORIGIN,
        );
      } catch (error) {
        console.error("Could not report vite error overlay", error);
      }
    }

    // --- Wait for DOM ready logic ---
    if (document.readyState === "loading") {
      // The document is still loading, wait for DOMContentLoaded
      document.addEventListener("DOMContentLoaded", () => {
        if (!document.body) {
          console.error(
            "document.body does not exist - something very weird happened",
          );
          return;
        }

        const node = document.body.querySelector("vite-error-overlay");
        if (node) {
          reportViteErrorOverlay(node);
        }
        const observer = new MutationObserver(observerCallback);
        observer.observe(document.body, config);
      });
      console.log(
        "Document loading, waiting for DOMContentLoaded to set up observer.",
      );
    } else {
      if (!document.body) {
        console.error(
          "document.body does not exist - something very weird happened",
        );
        return;
      }
      // The DOM is already interactive or complete
      console.log("DOM already ready, setting up observer immediately.");
      const observer = new MutationObserver(observerCallback);
      observer.observe(document.body, config);
    }
  })();
})();

/* Apps generated before the rebrand tag JSX elements with the original
 * attribute names. Mirror them onto the current names so the component selector
 * and visual editor keep working on those apps. */
(() => {
  const LEGACY = [
    ["data-dyad-id", "data-nextbillion-id"],
    ["data-dyad-name", "data-nextbillion-name"],
  ];
  let queued = false;
  const bridge = () => {
    queued = false;
    for (const [from, to] of LEGACY) {
      for (const el of document.querySelectorAll(`[${from}]:not([${to}])`)) {
        el.setAttribute(to, el.getAttribute(from));
      }
    }
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(bridge);
  };
  const start = () => {
    schedule();
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
