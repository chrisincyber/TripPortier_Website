#!/usr/bin/env python3
"""
Remove Google Analytics code and add cookie consent banner to all HTML pages.
This ensures GDPR/CCPA compliance by only loading GA after user consent.
"""

import os
import glob
import re

# Google Analytics code to remove
GA_CODE_PATTERN = r'\s*<!-- Google tag \(gtag\.js\) -->.*?</script>\s*\n\s*\n'

# Cookie consent files to add
COOKIE_CONSENT_LINKS = '''    <link rel="stylesheet" href="css/cookie-consent.css">
    <script src="js/cookie-consent.js" defer></script>
'''

def update_html_file(filepath):
    """Update a single HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove Google Analytics code (multiline pattern)
        content = re.sub(
            r'\s*<!-- Google tag \(gtag\.js\) -->\s*\n\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-X9D9LXQY9Y"></script>\s*\n\s*<script>\s*\n\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*\n\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*\n\s*gtag\(\'js\', new Date\(\)\);\s*\n\s*gtag\(\'config\', \'G-X9D9LXQY9Y\'\);\s*\n\s*</script>\s*\n\s*\n',
            '',
            content,
            flags=re.MULTILINE
        )

        # Check if cookie consent links already exist
        if 'cookie-consent.css' not in content:
            # Add cookie consent links after <head> tag
            content = content.replace('<head>', '<head>\n' + COOKIE_CONSENT_LINKS, 1)

        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False

def main():
    """Process all HTML files."""
    # Get all HTML files
    html_files = glob.glob('*.html')

    if not html_files:
        print("❌ No HTML files found in current directory")
        return

    print(f"Found {len(html_files)} HTML files")
    print("Removing Google Analytics code and adding cookie consent banner...\n")

    updated_count = 0

    for filepath in sorted(html_files):
        if update_html_file(filepath):
            print(f"✅ Updated: {filepath}")
            updated_count += 1
        else:
            print(f"⏭️  Skipped: {filepath} (no changes needed)")

    print(f"\n✅ Done! Updated {updated_count} files.")
    print("\n📋 Summary:")
    print("   - Removed Google Analytics immediate loading")
    print("   - Added cookie consent banner (CSS + JS)")
    print("   - GA will now only load after user consent")

if __name__ == '__main__':
    main()
