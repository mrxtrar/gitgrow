# GitGrow - Find Startups, Grow Your GitHub

> Discover new startups with open source repos. Contribute and get noticed by founders.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to Cloudflare
npm run deploy
```

## 🌐 Live Demo

After deploying: **https://gitgrow.pages.dev**

## ✨ Features

- 🔍 **Multiple Sources**: YC companies, Hacker News, GitHub Trending
- 🆕 **New Company Filter**: Focus on 2025+ startups
- 📊 **Real-time Dashboard**: Beautiful dark mode UI
- ⚡ **Edge Deployment**: Runs on Cloudflare's global network
- 💰 **Free**: $0 hosting cost

## 📁 Project Structure

```
gitgrow/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── api/startups/      # API route
│   ├── components/
│   │   ├── StartupCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── StatsBar.tsx
│   └── lib/
│       ├── types.ts           # TypeScript types
│       └── sources/           # Data sources
├── wrangler.toml              # Cloudflare config
└── package.json
```

## 🔧 Configuration

1. Create D1 database:
   ```bash
   wrangler d1 create gitgrow-db
   ```

2. Add to `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "gitgrow-db"
   database_id = "YOUR_ID"
   ```

3. Add secrets:
   ```bash
   wrangler secret put GITHUB_TOKEN
   ```

## 📝 License

MIT
