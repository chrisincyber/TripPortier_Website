#!/usr/bin/env python3
"""Add Google Analytics tracking code to all HTML pages."""

import os
import re

# Google Analytics tracking code
GA_CODE = """    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-X9D9LXQY9Y"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-X9D9LXQY9Y');
    </script>

"""

# List of HTML files to update
FILES = [
    "404.html",
    "account.html",
    "airport-transfers.html",
    "attributions.html",
    "esim-country.html",
    "esim-global.html",
    "esim-region.html",
    "esim-success.html",
    "esim.html",
    "faq.html",
    "feature-request.html",
    "premium.html",
    "privacy.html",
    "profile.html",
    "settings.html",
    "terms.html",
    "tp-admin-7x9k2m.html",
    "trip-detail.html",
    "trips.html"
]

def add_ga_to_file(filename):
    """Add GA tracking code to HTML file if not already present."""
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return False

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if GA code already exists
    if 'G-X9D9LXQY9Y' in content:
        print(f"GA already exists in: {filename}")
        return False

    # Insert GA code right after <head>
    new_content = re.sub(
        r'(<head>)',
        r'\1\n' + GA_CODE,
        content,
        count=1
    )

    # Write updated content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Added GA to: {filename}")
    return True

def main():
    """Process all HTML files."""
    success_count = 0

    for filename in FILES:
        if add_ga_to_file(filename):
            success_count += 1

    print(f"\n✅ Done! GA tracking code added to {success_count} pages.")

if __name__ == "__main__":
    main()
