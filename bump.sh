#!/bin/bash
# 1. Get the current version from package.json
VERSION=$(node -p "require('./package.json').version")

# 2. Update the HTML file using sed (replaces the version text)
sed -i "s/Version [0-9.]*/Version $VERSION/" www/index.html

# 3. Add the updated files to git
git add www/index.html package.json
echo "Version bumped to $VERSION and files staged."