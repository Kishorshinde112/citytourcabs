# CityTourCabs Security & Booking Reliability Patch (October 2026)

Apply these files **over your original Git repository checkout**. This archive is a patch overlay, NOT a complete website: the uploaded Repomix excluded `public/`, `package-lock.json`, local data and other assets. Do not delete your original assets or database.

## What's fixed

- No hard-coded production Payload secret; the old `PAYLOAD_SECRET` master-key booking access is removed.
- Restricts Payload collection mutations to authenticated roles; operator accounts can work with bookings but cannot edit CMS content.
- Public booking API validates inputs, caps JSON size, and applies best-effort per-IP throttling. Add Cloudflare/Traefik edge rate limiting too.
- Forms only confirm success after the API returns a **persisted** booking ID, and error responses show a retry message.
- The false customer lead created from the business's WhatsApp button has been removed.
- The n8n notifier waits for a bounded response and retries transient failures (up to 3 attempts). It returns a `notificationDelivered` flag; notifications are **not yet guaranteed** without a durable queue.
- The CSV export protects against spreadsheet-formula injection.
- Tour links use `/tours/:slug`; old links redirect, the XML sitemap includes CMS tour slugs and tour metadata uses canonical URLs.
- Homepage hero and Why Choose section now read supported CMS block fields rather than a non-existent `/api/pages/home` endpoint.
- Removes public chatbot webhook fallback from the frontend and suppresses unsupported review counts from LocalBusiness schema.

## Deploy safely

1. Snapshot your current repository, app database and any media volumes. Deploy to **staging** first.
2. Merge the patch into the repository root: `cp -a /path/to/patch/. /path/to/original-repo/` (or selectively copy changed files).
3. Rotate the **previously exposed** `PAYLOAD_SECRET` to a cryptographically generated value. Example: `openssl rand -hex 32`. Set it in a PRIVATE `.env` file on the server. Never add that file to Git. **Important:** rotating Payload's secret may invalidate login sessions and might impact encrypted CMS data, if applicable; take a backup and verify admin login.
4. Set `N8N_INTERNAL_URL` in private `.env` to the actual n8n production webhook, accessible from the app container. `N8N_WEBHOOK_TOKEN` is optional and must match n8n workflow verification if enabled. Protect the n8n webhook at the receiver.
5. Restore/mount the original `public/` images and `package-lock.json` from the full Git repository. The Dockerfile now uses `npm ci --legacy-peer-deps`, so the lockfile must be present and up to date. The image build uses a random build-only Payload secret; production uses the runtime `.env` secret.
6. Run `npm ci --legacy-peer-deps && npm run typecheck && npm run build` in staging with correct production env and database. **These full commands were not runnable from the Repomix export** because npm dependencies, binary assets and the lockfile were omitted.
7. Run the fast unit tests: `node --test tests/bookingValidation.test.mjs`. The older `tests/bookings.test.mjs` targets the live domain by default; set `TEST_BASE_URL` to the staging host and review it before executing.
8. Verify CMS login (admin/operator), public booking success & failure paths, actual DB row ID, n8n notification, old-URL redirects, sitemap, robots and images. Then deploy carefully.
9. Add rate limits at your trusted reverse proxy. The in-process limiter in the patch is **not distributed** and is insufficient alone for multi-replica deployments.

## Follow-up work not finished by this patch

- A durable notification outbox/queue with retry scheduler, dead-letter visibility and idempotency. Current n8n retries are best effort; webhook failure after 3 attempts does **not** auto-retry later.
- Full Lighthouse and browser mobile testing, since the Repomix archive contains no screenshots and no working app deployment.
- End-to-end integration tests, authentic booking-user flows, backup/restore rehearsal, dependency vulnerability scan with the complete lockfile.
- Client-UI review of admin controls and the provider-side n8n credentials.

**Deployment status:** Files patched locally; **no production credentials rotated, no server deployed or tests against production performed**.
