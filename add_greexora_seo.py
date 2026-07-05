from pathlib import Path
import re
from datetime import date

SITE = "https://quantx-india.com"

pages = {
    "index.html": {
        "title": "Greexora | Professional Indian Options & Futures Trading Platform",
        "description": "Greexora is a professional Indian options and futures trading platform for NIFTY and BANKNIFTY analysis, market intelligence, risk tools, and compliant trading workflows.",
        "h1": "Greexora",
        "url": f"{SITE}/index.html"
    },
    "demo.html": {
        "title": "Greexora Demo | Indian Options Trading Platform Preview",
        "description": "Explore the Greexora demo for professional NIFTY and BANKNIFTY options analytics, charting workflows, market intelligence, and trading platform features.",
        "h1": "Greexora Demo",
        "url": f"{SITE}/demo.html"
    },
    "early-access.html": {
        "title": "Greexora Early Access | Join the Indian Trading Platform Waitlist",
        "description": "Join Greexora early access for a professional Indian options and futures trading platform built for NIFTY and BANKNIFTY traders.",
        "h1": "Greexora Early Access",
        "url": f"{SITE}/early-access.html"
    },
    "compliance.html": {
        "title": "Greexora Compliance | Trading Platform Risk & Data Disclosures",
        "description": "Read Greexora compliance information, risk disclosures, data-source notes, and responsible trading platform usage guidelines.",
        "h1": "Greexora Compliance",
        "url": f"{SITE}/compliance.html"
    },
    "terms-risk-disclosure.html": {
        "title": "Greexora Terms & Risk Disclosure",
        "description": "Greexora terms, risk disclosure, market-data limitations, and responsible use information for the trading platform.",
        "h1": "Greexora Terms & Risk Disclosure",
        "url": f"{SITE}/terms-risk-disclosure.html"
    },
    "privacy.html": {
        "title": "Greexora Privacy Policy",
        "description": "Greexora privacy policy explaining how information is handled for the professional trading platform website.",
        "h1": "Greexora Privacy Policy",
        "url": f"{SITE}/privacy.html"
    },
    "third-party-licenses.html": {
        "title": "Greexora Third-Party Licenses",
        "description": "Third-party licenses and attribution information for Greexora, the professional Indian trading platform.",
        "h1": "Greexora Third-Party Licenses",
        "url": f"{SITE}/third-party-licenses.html"
    },
}

def remove_existing_seo(html):
    html = re.sub(r"<title>.*?</title>", "", html, flags=re.I | re.S)
    html = re.sub(r'<meta\s+name=["\']description["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<link\s+rel=["\']canonical["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<meta\s+property=["\']og:[^"\']+["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<meta\s+name=["\']twitter:[^"\']+["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<script type="application/ld\+json" id="greexora-schema">.*?</script>\s*', "", html, flags=re.I | re.S)
    return html

def build_seo_block(info, filename):
    canonical = SITE + "/" if filename == "index.html" else info["url"]
    return f"""
  <title>{info["title"]}</title>
  <meta name="description" content="{info["description"]}">
  <link rel="canonical" href="{canonical}">
  <meta property="og:site_name" content="Greexora">
  <meta property="og:title" content="{info["title"]}">
  <meta property="og:description" content="{info["description"]}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{info["title"]}">
  <meta name="twitter:description" content="{info["description"]}">
  <script type="application/ld+json" id="greexora-schema">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Organization",
        "@id": "{SITE}/#organization",
        "name": "Greexora",
        "alternateName": ["QuantX India", "QuantX"],
        "url": "{SITE}/",
        "description": "Greexora is a professional Indian options and futures trading platform."
      }},
      {{
        "@type": "WebSite",
        "@id": "{SITE}/#website",
        "name": "Greexora",
        "alternateName": "QuantX India",
        "url": "{SITE}/",
        "publisher": {{
          "@id": "{SITE}/#organization"
        }}
      }},
      {{
        "@type": "SoftwareApplication",
        "@id": "{SITE}/#software",
        "name": "Greexora",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "url": "{SITE}/",
        "description": "Greexora is a professional Indian options and futures trading platform for NIFTY and BANKNIFTY analysis, market intelligence, risk tools, and compliant trading workflows.",
        "publisher": {{
          "@id": "{SITE}/#organization"
        }}
      }}
    ]
  }}
  </script>
"""

for filename, info in pages.items():
    path = Path(filename)
    if not path.exists():
        print(f"SKIP: {filename} not found")
        continue

    html = path.read_text(encoding="utf-8")
    html = remove_existing_seo(html)

    seo_block = build_seo_block(info, filename)

    if re.search(r"<head[^>]*>", html, flags=re.I):
        html = re.sub(r"(<head[^>]*>)", r"\1" + seo_block, html, count=1, flags=re.I)
    else:
        print(f"WARNING: {filename} has no <head> tag")
        continue

    # Ensure first H1 contains Greexora brand.
    if re.search(r"<h1[^>]*>.*?</h1>", html, flags=re.I | re.S):
        html = re.sub(r"<h1([^>]*)>.*?</h1>", f"<h1\\1>{info['h1']}</h1>", html, count=1, flags=re.I | re.S)
    else:
        html = re.sub(r"(<body[^>]*>)", r"\1\n<h1>" + info["h1"] + "</h1>", html, count=1, flags=re.I)

    path.write_text(html, encoding="utf-8")
    print(f"UPDATED: {filename}")

print("Done.")
