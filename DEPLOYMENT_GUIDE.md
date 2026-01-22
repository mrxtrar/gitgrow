# 🚀 GitGrow - Complete Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Login to Cloudflare
```bash
wrangler login
```

### Step 2: Deploy
```bash
npm run deploy
```

### Step 3: Done!
Your site is live at: **https://gitgrow.pages.dev**

---

## Full Setup Guide

### 1. Prerequisites
- ✅ Node.js 18+ installed
- ✅ Wrangler CLI installed (`npm install -g wrangler`)
- ✅ Logged into Cloudflare (`wrangler login`)

### 2. Test Locally First
```bash
npm run dev
# Open http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to Cloudflare Pages
```bash
npm run deploy
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  USER BROWSER                                       │
│  └─> Visits gitgrow.pages.dev                       │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│  CLOUDFLARE PAGES (Edge)                            │
│  └─> Serves static Next.js app                      │
│  └─> Runs API routes on Workers                     │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│  API ROUTE (/api/startups)                          │
│  ├─> Checks in-memory cache (30 min TTL)            │
│  ├─> If cached: return cached data instantly        │
│  └─> If expired: fetch fresh → cache → return       │
└─────────────────────┬───────────────────────────────┘
                      │ (only on cache miss)
┌─────────────────────▼───────────────────────────────┐
│  EXTERNAL APIS                                      │
│  ├─> YC OSS API (unlimited)                         │
│  ├─> GitHub API (5000/hr with token)                │
│  └─> HackerNews API (unlimited)                     │
└─────────────────────────────────────────────────────┘
```

## Caching Strategy

| What | How | TTL |
|------|-----|-----|
| API responses | In-memory cache | 30 min |
| Static assets | Cloudflare CDN | Auto |
| HTTP Cache | Cache-Control header | 30 min |

### How It Protects Your API Limits:

```
100 users visit → 1st user triggers API call → Cached
                  2nd-100th users → Served from cache (0 API calls!)
                  
After 30 min → Cache expires → Next user triggers fresh API call
```

**Result:** Max ~48 API calls per day per source, not thousands!

---

## Environment Variables

### For GitHub API (Optional but Recommended)
Create `.dev.vars` locally:
```
GITHUB_TOKEN=ghp_your_token_here
```

Add to Cloudflare:
```bash
wrangler secret put GITHUB_TOKEN
# Paste your token when prompted
```

### Get GitHub Token:
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scope: `public_repo`
4. Copy and save securely

---

## Custom Domain (Optional)

### 1. Add Custom Domain in Cloudflare
1. Dashboard → Pages → gitgrow
2. Custom domains → Add
3. Enter: `gitgrow.yourdomain.com`

### 2. Update DNS
Add CNAME record:
```
gitgrow → gitgrow.pages.dev
```

---

## Updating Your Site

### Deploy New Changes:
```bash
git add .
git commit -m "Your update message"
npm run deploy
```

### Or Connect GitHub for Auto-Deploy:
1. Dashboard → Pages → gitgrow → Settings
2. Connect to Git → Select your repo
3. Every `git push` auto-deploys!

---

## Monitoring

### View Logs:
```bash
wrangler pages deployment tail
```

### Check Analytics:
Dashboard → Pages → gitgrow → Analytics

---

## Troubleshooting

### Build Fails:
```bash
npm run build
# Check for TypeScript errors
```

### API Not Working:
- Check if GITHUB_TOKEN is set
- View logs: `wrangler pages deployment tail`

### Cache Not Working:
- Cache only works in production
- Locally, every request fetches fresh data

---

## Costs

| Service | Free Tier | Your Usage |
|---------|-----------|------------|
| Cloudflare Pages | 500 builds/month | ~10 |
| Workers | 100k requests/day | ~1k |
| KV (optional) | 100k reads/day | N/A |

**Total Cost: $0** 🎉

---

## Next Steps After Deploy

1. ✅ Test the live site
2. ✅ Share on Twitter/LinkedIn
3. ✅ Submit to Hacker News (Show HN)
4. ✅ Collect feedback
5. ✅ Iterate based on user needs

---

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run locally |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Cloudflare |
| `wrangler login` | Login to Cloudflare |
| `wrangler pages deployment tail` | View live logs |

---

**Your site:** https://gitgrow.pages.dev

Good luck! 🌱
