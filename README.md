# Datavyx website

This is a dependency-free static website for Datavyx. It is separate from the product application and can be deployed independently.

Datavyx is a knowledge management MCP service used through an authorized AI assistant connection. The production MCP endpoint is <https://kb.datavyx.com/mcp>. The former Flutter web application has been retired; its root URL is a migration notice, not a sign-in or product launch screen.

The website preserves the Datavyx brand and English visual identity. It covers source-backed recording and retrieval, exact statistics, corrections with history, recoverable deletion/restoration, personal workspaces, and connection guidance. The hero conversation is explicitly illustrative and never calls the knowledge API.

## Published claims and access status

- Production MCP connection, saving, and recall in a new chat have passed acceptance. The public guide covers ChatGPT on the web and explains plan and workspace requirements before users copy the URL.
- The formal `/mcp` endpoint accepts eligible OAuth clients using automatic registration. The guide describes this option when the client offers it. See `docs/50-运行记录/MCP正式自助接入发布记录-2026-11-24.md` in the backend repository for rollout details.
- Personal spaces use the trusted login identity; different identities remain separate. Authorized existing memberships are still checked by the service.
- Permanent erasure is not offered. Client-side tool permission prompts are separate from Datavyx's direct transaction execution.

Update access wording only after actual acceptance and production rollout. After initializing the OpenAI Ads Pixel, the homepage queues one `page_viewed` event per full page load, with `datavyx_home` as the page identifier. Pixel debug logging is enabled on local loopback addresses. There is no signup form, knowledge API call, or backend dependency on this page.

## Browser interactions

The hero uses the user-supplied save/retrieve animation, adapted in `hero-animation.js` with scoped styles and English copy. It loops every 11 seconds, can be paused/resumed, and links to the connection guide. Reduced-motion preferences and disabled JavaScript show a static result. It is explicitly illustrative and does not access knowledge records.

Privacy information is available from the secondary footer **Privacy** link at `privacy.html`. The page preserves the four approved knowledge/privacy statements and website analytics disclosures. It uses the shared consent controls for Clarity; the OpenAI Ads Pixel remains on the homepage only. The old `#personal-space` and `#privacy-notice` homepage anchors now lead to the footer entry. The privacy page and its home links remain readable without JavaScript.

Microsoft Clarity project `zhvsyh2koe` is integrated through `analytics.js`. The tag loads only after the visitor selects **Allow analytics**; a stored decline prevents loading. **Analytics preferences** in the footer reopens the choice. Withdrawing permission clears Clarity's first-party cookies and reloads the page to unload the recorder. If browser storage is blocked, the choice applies only to that page. The preference controls Clarity only; the existing OpenAI Ads Pixel remains separate and is disclosed on the privacy page. Clarity receives `analytics_Storage: granted` and `ad_Storage: denied` via Consent V2. No custom identity is sent. The explicit click events are `connection_guide_clicked`, `copy_mcp_clicked` (a click, not a successful clipboard write), and `connection_help_clicked`. Data starts after deployment and consent; it does not reconstruct past visits. A blocked tag does not interrupt the site.

The connection address stays readable and selectable without JavaScript. Copy URL reports success through a live status region. If clipboard access is blocked, the URL is selected for manual copying. FAQ uses native `details` elements. Mobile navigation supports keyboard Escape and remains visible if JavaScript is unavailable.

Verified locally on 2026-11-13: 1440px desktop, 390px mobile, and 320px narrow layouts have no horizontal page overflow; internal anchors resolve; clipboard success and denied-access fallback work; mobile menu closes after navigation; FAQ expands; the navigation and page remain readable with script execution disabled. Browser console reported no errors. JavaScript syntax check passed. Production publication must be verified separately against the custom domain after deployment.

## Local preview

From this directory, run any static file server, for example:

```powershell
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Static site deployment

Hosting verified on 2026-11-13: the live website <https://www.datavyx.com/> is served by Vercel, and the apex domain redirects there. DNS points `www` to `cname.vercel-dns.com`. Before this update, the live HTML exactly matched `main` in <https://github.com/crgken/datavyx-landing> at `a3c5ff22a67cee6587d831a226baf012434d5e70`.

1. Use the existing `crgken/datavyx-landing` repository. Its root contains `index.html`, `styles.css`, `script.js`, this README and the retained logo asset. In the backend checkout, the corresponding source lives in `website/`.
2. Review the static changes on a development branch, then fast-forward the production `main` branch and push it. No dependency installation or frontend build is needed.
3. Existing Vercel GitHub integration publishes commits on `main`. GitHub currently records two connected production environments: `datavyx-landing` and `datavyx-landing-6gkx`.
4. Wait for deployment statuses for the exact new commit, then compare the custom domain's HTML, CSS and JavaScript with that commit. A successful Git push alone is not proof of publication.
5. Preserve the original DNS, domain, audience, and unrelated files. Do not create a replacement hosting project or run the retired Flutter/backend deployment scripts.

### Canonical domain release check

The apex currently redirects to `https://www.datavyx.com/` with 307 and preserves the request path and query string. In the existing Vercel project that serves the apex, open **Settings → Domains → datavyx.com → Edit**. Keep `www.datavyx.com` as the redirect target and set the status to **308 Permanent Redirect**. This is a Vercel domain setting and is applied independently of the Git deployment.

Verify both the homepage and a path with campaign parameters using a request that does not follow redirects:

```powershell
curl.exe -sSI 'https://datavyx.com/'
curl.exe -sSI 'https://datavyx.com/robots.txt?utm_source=release-check'
```

Expect 308 responses with `Location` pointing to `www.datavyx.com` and retaining the path and query string. Check the HTTP variants end on the HTTPS canonical host. Verify `https://www.datavyx.com/robots.txt` and `https://www.datavyx.com/sitemap.xml` both return 200 after deployment. In Google Search Console, inspect the `www` homepage before requesting indexing.

## Before public outreach

- Use `https://www.datavyx.com/` as the public website address.
- Keep the public brand wording as **Datavyx**.
- Add a real business mailing address before sending commercial email in the US; this page does not invent one.
- If a custom domain is purchased, configure SPF/DKIM/DMARC for the sending mailbox separately.
