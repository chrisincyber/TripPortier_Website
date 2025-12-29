#!/usr/bin/env python3
"""
Script to replace all footers in HTML files with the unified footer.
"""

import re
import os
from pathlib import Path

# Read the unified footer
with open('footer.html', 'r', encoding='utf-8') as f:
    unified_footer = f.read()

# List of HTML files to update (excluding footer.html itself and special pages)
html_files = [
    '404.html',
    'account.html',
    'airport-transfers.html',
    'attributions.html',
    'esim-country.html',
    'esim-global.html',
    'esim-region.html',
    'esim-success.html',
    'esim.html',
    'faq.html',
    'feature-request.html',
    'index.html',
    'premium.html',
    'privacy.html',
    'profile.html',
    'settings.html',
    'terms.html',
    'trip-detail.html',
    'trips.html'
]

updated_count = 0

for filename in html_files:
    if not os.path.exists(filename):
        print(f"⚠️  Skipping {filename} - file not found")
        continue

    print(f"Processing {filename}...")

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file has a footer
    if '<footer' not in content:
        print(f"  ⏭  No footer found in {filename}")
        continue

    # Replace footer section using regex
    # Pattern matches from <footer to </footer> (inclusive)
    pattern = r'<footer[^>]*>.*?</footer>'

    # Count matches
    matches = re.findall(pattern, content, re.DOTALL)
    if not matches:
        print(f"  ⏭  No footer tag found in {filename}")
        continue

    # Replace the footer
    new_content = re.sub(pattern, unified_footer.strip(), content, flags=re.DOTALL)

    # Write updated content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

    updated_count += 1
    print(f"  ✅ Updated footer in {filename}")

print(f"\n🎉 Successfully updated {updated_count} files!")
