#!/bin/bash

# Google Analytics tracking code to insert
GA_CODE='    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-X9D9LXQY9Y"><\/script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('\''js'\'', new Date());
      gtag('\''config'\'', '\''G-X9D9LXQY9Y'\'');
    <\/script>

'

# List of HTML files to update (excluding og-image-generator and redirect)
FILES=(
    "404.html"
    "account.html"
    "airport-transfers.html"
    "attributions.html"
    "esim-country.html"
    "esim-global.html"
    "esim-region.html"
    "esim-success.html"
    "esim.html"
    "faq.html"
    "feature-request.html"
    "premium.html"
    "privacy.html"
    "profile.html"
    "settings.html"
    "terms.html"
    "tp-admin-7x9k2m.html"
    "trip-detail.html"
    "trips.html"
)

# Add GA code to each file if not already present
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if GA code already exists
        if ! grep -q "G-X9D9LXQY9Y" "$file"; then
            echo "Adding GA to: $file"
            # Insert GA code right after <head>
            sed -i '' "/<head>/a\\
$GA_CODE
" "$file"
        else
            echo "GA already exists in: $file"
        fi
    else
        echo "File not found: $file"
    fi
done

echo "Done! GA tracking code added to all pages."
