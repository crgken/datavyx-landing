# AtlasAI website

This is a dependency-free static landing page for AtlasAI. It is intentionally separate from the existing application prototypes so it can be deployed independently.

## Local preview

From this directory, run any static file server, for example:

```powershell
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Low-cost deployment

Recommended first deployment: Cloudflare Pages with the existing `datavyx.com` domain.

1. Create a GitHub repository containing the `website` directory, or upload this directory directly in Cloudflare Pages.
2. For a direct upload, choose **Workers & Pages → Create application → Pages → Upload assets**.
3. Use `website` as the asset directory if deploying from the repository. No build command is needed; the output directory is `website`.
4. In the Pages project, open **Custom domains** and add `datavyx.com` and `www.datavyx.com`.
5. If Cloudflare asks to manage the zone, copy its two nameservers into Namecheap under **Domain List → Manage → Nameservers → Custom DNS**. Keep Namecheap as the registrar; only DNS management moves to Cloudflare.
6. Cloudflare Pages hosting remains free. The public URL will be `https://datavyx.com/` after DNS propagation.

GitHub Pages is a suitable alternative, but the custom-domain setup is more manual. Both options can host these static files without a server or database.

## Before public outreach

- Use `https://datavyx.com/` in the email signature after DNS is active.
- Keep the public brand wording as **AtlasAI by Datavyx** so the service name and domain are clear to prospects.
- Add a real business mailing address before sending commercial email in the US; this page does not invent one.
- If a custom domain is purchased, configure SPF/DKIM/DMARC for the sending mailbox separately.
