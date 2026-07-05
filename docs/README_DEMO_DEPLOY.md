# Greexora Public Demo Deployment

This package adds a static, compliance-friendly product demo page to the existing GitHub Pages website.

## Files

- `website/demo.html` — public product demo page using simulated data.
- `assets/` — Greexora logo assets.
- `apply_demo_page_update.sh` — optional helper script to copy and push the demo page to the existing gh-pages repo.

## Safety notes

- The demo uses simulated data only.
- It does not use TradingView branding.
- It does not claim TradingView affiliation.
- It does not place live orders.
- It presents paper mode and manual confirmation as default safety controls.

## Local deployment path expected

The helper script expects your local GitHub Pages repo at:

`~/Downloads/greexora_deploy_github_pages/work_greexora_pages/repo`

If your repo is elsewhere, edit `REPO_DIR` inside the script before running.
