#!/bin/sh
set -e

# Ensure data and media directories exist with proper ownership and permissions
mkdir -p /app/data /app/public/media
chown -R nextjs:nodejs /app/data /app/public/media 2>/dev/null || true
chmod -R 775 /app/data /app/public/media 2>/dev/null || true

# Drop privileges and execute application as nextjs user
exec gosu nextjs "$@"
