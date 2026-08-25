# frommexico.com

Landing page for FromMexico — organic produce and pantry ingredients shipped from Mexico to Europe.

## Tech stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Resend (transactional + outreach mail)

## Development

```bash
npm install
npm run dev
```

Copy [`.env.example`](.env.example) to `.env.local` and fill the values you have.

## Build

```bash
npm run build
```

## Deploy

This site is deployed to Vercel. Connect the GitHub repo to a Vercel project and add the custom domain `frommexico.com` in project settings.

---

## Sales desk (phone-first outreach)

The password-protected desk is at `https://frommexico.com/outreach`. You add wholesale contacts you already have a right to email. The site sends a three-step sequence (Polish or English) with the FromMexico logo footer, then weekday follow-ups. Replies go to Gmail on your phone. This desk does **not** scrape the web for inboxes.

Daily cap: **25** sends. That protects the domain.

### One-time setup (browser or phone)

These are dashboard clicks, not code.

1. **Resend — send from the domain, not Gmail**  
   In [Resend](https://resend.com): add and verify `frommexico.com` (SPF, DKIM, DMARC).  
   Create a from-address such as `hello@frommexico.com`.  
   Put that address in `CONTACT_EMAIL_FROM`.  
   Put your Gmail in `CONTACT_EMAIL_TO` (this is **reply-to**, so answers notify your phone).

2. **Upstash — remember the queue on Vercel**  
   Vercel’s disk is empty on the next run, so follow-ups need Redis.  
   In [Upstash](https://upstash.com): create a Redis database → REST API → copy  
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.  
   Local `npm run dev` without those vars still writes `data/leads.json`.

3. **Vercel environment variables**

   | Variable | Purpose |
   | --- | --- |
   | `RESEND_API_KEY` | Send mail |
   | `CONTACT_EMAIL_FROM` | `hello@frommexico.com` (or `Jan Korczyński <hello@frommexico.com>`) |
   | `CONTACT_EMAIL_TO` | `korczynskijanek24@gmail.com` — replies and phone alerts |
   | `OUTREACH_SECRET` | Desk password |
   | `CRON_SECRET` | Protects weekday follow-up job (Vercel sends it as `Authorization: Bearer`) |
   | `UPSTASH_REDIS_REST_URL` | Lead store |
   | `UPSTASH_REDIS_REST_TOKEN` | Lead store |
   | `NEXT_PUBLIC_SITE_URL` | `https://frommexico.com` |

   Redeploy after saving.

4. **Weekday follow-ups**  
   [`vercel.json`](vercel.json) calls `/api/outreach/process` at 08:00 UTC, Monday–Friday.  
   Set `CRON_SECRET` in Vercel (same value Vercel Cron uses).  
   If Cron is not available on your plan, open the desk on the phone and tap **Send due follow-ups**.

5. **Phone app icon**  
   Open `https://frommexico.com/outreach`.  
   iPhone: Share → Add to Home Screen.  
   Android: browser menu → Add to Home screen.  
   Turn on **Gmail notifications**.

### Daily use

1. Add company + work email. Leave **Send email 1 now** checked.  
2. Wait. Email 2 goes about 4 days later, email 3 about 6 days after that.  
3. When Gmail pings, answer from Gmail, then tap **Mark replied — stop follow-ups**.

CSV import (columns: company, email, contact, city, website, products, language, notes) is for lists you already have a right to use — trade-fair contacts, published purchasing emails, people who wrote to you.

Until the domain is authenticated in Resend, even a strong letter will keep dying in spam.
