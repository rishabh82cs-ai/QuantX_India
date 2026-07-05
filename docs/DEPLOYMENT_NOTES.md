# Greexora Website Deployment Notes

## What this package contains

- `assets/greexora-logo.svg` — light background full logo.
- `assets/greexora-logo-dark.svg` — dark background full logo.
- `assets/greexora-mark.svg` — square icon/mark.
- `assets/favicon.svg` — browser favicon.
- `website/index.html` — TradingView-safe homepage.
- `website/compliance.html` — compliance and TradingView-safe positioning page.
- `website/terms-risk-disclosure.html` — starter risk disclosure page.
- `website/privacy.html` — starter privacy notice page.
- `website/styles.css` — shared website styling.
- `docs/TRADINGVIEW_COMPLIANCE_CHECKLIST.md` — publish checklist.
- `docs/THIRD_PARTY_LICENSE_REGISTER.md` — license register template.

## Suggested git workflow

Do not paste Git credentials or API keys into chat, source code, or deployment notes.

```bash
# From your website repository root
mkdir -p public/assets compliance-docs
cp -R /path/to/greexora_website_compliance_update/assets/* public/assets/
cp -R /path/to/greexora_website_compliance_update/docs/* compliance-docs/

# For a static website, copy the website files into your pages/public folder as appropriate
cp /path/to/greexora_website_compliance_update/website/index.html ./index.html
cp /path/to/greexora_website_compliance_update/website/compliance.html ./compliance.html
cp /path/to/greexora_website_compliance_update/website/terms-risk-disclosure.html ./terms-risk-disclosure.html
cp /path/to/greexora_website_compliance_update/website/privacy.html ./privacy.html
cp /path/to/greexora_website_compliance_update/website/styles.css ./styles.css

git checkout -b greexora-compliance-website-update
git add .
git commit -m "Add Greexora compliant website copy and assets"
git push origin greexora-compliance-website-update
```

## Notes for React / Next.js sites

- Convert `website/index.html` body content into your homepage component.
- Place assets in `public/assets/`.
- Move CSS variables and classes into your global stylesheet.
- Keep the footer disclaimer on all pages.
- Add a compliance route such as `/compliance`.

## Before publishing

- Review copy for no guaranteed-profit wording.
- Review all TradingView references.
- Verify market-data source permissions.
- Verify broker API permissions.
- Keep paper mode and manual live confirmation stated clearly.
- Have compliance/legal review before public launch.
