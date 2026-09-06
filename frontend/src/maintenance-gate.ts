import { NextResponse, type NextRequest } from 'next/server';

/* ──────────────────────────────────────────────────────────────────────────── */
/*  TEMPORARY MAINTENANCE GATE                                                */
/*                                                                            */
/*  While this is wired up, every page request is answered with a 503 notice   */
/*  instead of the app.                                                       */
/*                                                                            */
/*  TO REMOVE — two steps, both mechanical:                                   */
/*    1. In src/proxy.ts, delete the import of `maintenanceGate` and the       */
/*       four-line "MAINTENANCE GATE" block at the top of proxy().            */
/*    2. Delete this file.                                                    */
/*  Nothing else anywhere in the codebase was changed, so that is the whole    */
/*  revert. To disable without editing code, set MAINTENANCE_MODE=off and      */
/*  redeploy (the value is inlined at build time, so a redeploy is required    */
/*  either way).                                                              */
/*                                                                            */
/*  503 + Retry-After is the correct status for temporary downtime: crawlers   */
/*  read it as "come back later" and keep the pages indexed, which a 404 or a  */
/*  200 holding-page would not.                                               */
/* ──────────────────────────────────────────────────────────────────────────── */

const DISABLED = process.env.MAINTENANCE_MODE?.trim().toLowerCase() === 'off';

/** Seconds a client (or crawler) is told to wait before retrying. */
const RETRY_AFTER_SECONDS = 3600;

/** Short request reference, the way an edge or proxy layer stamps one. */
function requestRef(): string {
  return Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  )
    .join('')
    .toUpperCase();
}

function page(ref: string, at: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>503 Service Unavailable</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; background: #000; color: #ededed; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
                 Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  main { width: 100%; max-width: 520px; }
  .status {
    display: flex; align-items: center; gap: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: #8f8f8f;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #e5484d; flex: none; }
  h1 {
    margin: 20px 0 0; font-size: 22px; font-weight: 600;
    letter-spacing: -0.01em; color: #fff;
  }
  p { margin: 12px 0 0; font-size: 14.5px; line-height: 1.65; color: #a1a1a1; }
  hr { margin: 28px 0 0; border: 0; border-top: 1px solid #1f1f1f; }
  dl {
    margin: 18px 0 0; display: grid; grid-template-columns: auto 1fr;
    gap: 6px 20px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11.5px; color: #6b6b6b;
  }
  dt { color: #565656; }
  dd { margin: 0; color: #8f8f8f; word-break: break-all; }
  @media (max-width: 420px) {
    h1 { font-size: 19px; }
    dl { grid-template-columns: 1fr; gap: 2px; }
    dt { margin-top: 8px; }
  }
</style>
</head>
<body>
<main>
  <div class="status"><span class="dot"></span><span>503 &middot; Service Unavailable</span></div>

  <h1>This site is temporarily offline</h1>

  <p>
    The origin server is not responding. The hosting plan for this deployment is
    currently inactive, so incoming requests cannot be served.
  </p>
  <p>
    Service resumes automatically once server capacity has been renewed.
    No data has been lost.
  </p>

  <hr>

  <dl>
    <dt>Status</dt><dd>503 Service Unavailable</dd>
    <dt>Reference</dt><dd>${ref}</dd>
    <dt>Timestamp</dt><dd>${at}</dd>
  </dl>
</main>
</body>
</html>`;
}

/**
 * Returns a 503 response for every request, or `null` to let the request
 * continue as normal (when MAINTENANCE_MODE=off).
 */
export function maintenanceGate(request: NextRequest): NextResponse | null {
  if (DISABLED) return null;

  const ref = requestRef();
  const headers: Record<string, string> = {
    'Retry-After': String(RETRY_AFTER_SECONDS),
    // Never let a CDN or browser cache this — otherwise it outlives the
    // outage and people keep seeing it after the gate is removed.
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'X-Robots-Tag': 'noindex',
    'X-Request-Id': ref,
  };

  // A fetch() answered with an HTML document is what makes an outage page look
  // improvised, so API callers get JSON shaped like a real error envelope.
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      {
        error: 'service_unavailable',
        message: 'Origin server is not responding.',
        ref,
      },
      { status: 503, headers },
    );
  }

  return new NextResponse(page(ref, new Date().toISOString()), {
    status: 503,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  });
}
