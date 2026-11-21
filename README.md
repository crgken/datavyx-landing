# Datavyx website

This is a dependency-free static website for Datavyx. It is separate from the product application and can be deployed independently.

Datavyx is a knowledge management MCP service used through an authorized AI assistant connection. The production MCP endpoint is <https://kb.datavyx.com/mcp>. The former Flutter web application has been retired; its root URL is a migration notice, not a sign-in or product launch screen.

The website preserves the Datavyx brand and English visual identity. It covers source-backed recording and retrieval, exact statistics, corrections with history, recoverable deletion/restoration, personal workspaces, and connection guidance. The hero conversation is explicitly illustrative and never calls the knowledge API.

## Published claims and access status

- Production ChatGPT use is verified in the backend repository's `docs/50-运行记录/MCP正式发布报告-2026-11-12.md`.
- OAuth DCR self-service admission is installed in an isolated candidate, not released in production. Auth0 setup and discovery have been checked, but real Claude/Gemini login and two-user acceptance are still pending; see the backend repository's `docs/50-运行记录/MCP客户端自助接入后端开发报告-2026-11-13.md`.
- The page must not advertise generally available self-service signup, show candidate URLs, distribute shared OAuth credentials, or describe the old draft approval flow.
- Personal spaces use the trusted login identity; different identities remain separate. Authorized existing memberships are still checked by the service.
- Permanent erasure is not offered. Client-side tool permission prompts are separate from Datavyx's direct transaction execution.

Update access wording only after actual acceptance and production rollout. After initializing the OpenAI Ads Pixel, the homepage queues one `page_viewed` event per full page load, with `datavyx_home` as the page identifier. Pixel debug logging is enabled on local loopback addresses. There is no signup form, knowledge API call, or backend dependency on this page.

## Browser interactions

The connection address stays readable/selectable without JavaScript. With JavaScript enabled, Copy URL reports success through a live status region; blocked clipboard access selects the address and explains manual copying. FAQ uses native `details` elements. Mobile navigation supports keyboard Escape and remains visible if JavaScript is unavailable.

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

The older Cloudflare Pages instructions were a recommendation, not the actual production setup. GitHub hosts the source; Vercel serves the website.

## Before public outreach

- Use `https://datavyx.com/` as the public website address.
- Keep the public brand wording as **Datavyx**.
- Add a real business mailing address before sending commercial email in the US; this page does not invent one.
- If a custom domain is purchased, configure SPF/DKIM/DMARC for the sending mailbox separately.
