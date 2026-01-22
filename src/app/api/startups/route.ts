// API Route: GET /api/startups
// Fetches startups from cache or external APIs with automatic caching

import { NextRequest, NextResponse } from 'next/server'
import { fetchYCOSSCompanies, filterNewCompanies } from '@/lib/sources/yc-oss'
import { fetchAllYCCompanies } from '@/lib/sources/yc-all'
import { fetchHackerNewsProjects } from '@/lib/sources/hackernews'
import { fetchGitHubTrending } from '@/lib/sources/trending'
import { getCachedData, setCachedData, formatLastUpdated } from '@/lib/cache'
import { Startup } from '@/lib/types'

export const runtime = 'edge'

// Cache TTL in seconds (10 minutes)
const CACHE_TTL = 10 * 60

const LANGUAGES = [
    'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust',
    'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin'
]

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source') || 'github_trending'
    const newOnly = searchParams.get('newOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const language = searchParams.get('language') || ''

    // Create cache key based on source and language
    const cacheKey = `${source}:${language || 'all'}`

    try {
        // Check cache first
        let cached = getCachedData(cacheKey)
        let startups: Startup[] = []
        let lastUpdated: string = new Date().toISOString()

        if (cached) {
            // Use cached data
            startups = cached.startups
            lastUpdated = cached.lastUpdated
            console.log(`[Cache HIT] ${cacheKey}`)
        } else {
            // Fetch fresh data
            console.log(`[Cache MISS] ${cacheKey} - Fetching fresh data...`)

            switch (source) {
                case 'yc_oss':
                    startups = await fetchYCOSSCompanies()
                    break
                case 'yc_all':
                    const minYear = newOnly ? 2025 : 2020
                    startups = await fetchAllYCCompanies(minYear)
                    break
                case 'hackernews':
                    startups = await fetchHackerNewsProjects(100) // Fetch more for cache
                    break
                case 'github_trending':
                    startups = await fetchGitHubTrending(language, 100)
                    break
                case 'all':
                    const [ycOss, hn, trending] = await Promise.all([
                        fetchYCOSSCompanies(),
                        fetchHackerNewsProjects(30),
                        fetchGitHubTrending(language, 50),
                    ])
                    startups = [...ycOss, ...hn, ...trending]
                    break
                default:
                    startups = await fetchGitHubTrending('', 100)
            }

            // Store in cache
            lastUpdated = new Date().toISOString()
            setCachedData(cacheKey, {
                startups,
                lastUpdated,
                source,
            })
        }

        // Apply filters (on cached or fresh data)
        let filtered = startups

        // Apply new-only filter
        if (newOnly && source !== 'yc_all') {
            filtered = filterNewCompanies(filtered)
        }

        // Apply language filter (for sources that return all languages)
        if (language && source !== 'github_trending') {
            filtered = filtered.filter(s => {
                const langs = s.languages || []
                return langs.some(l => l.toLowerCase() === language.toLowerCase())
            })
        }

        // Apply limit
        filtered = filtered.slice(0, limit)

        return NextResponse.json({
            startups: filtered,
            count: filtered.length,
            totalCached: startups.length,
            source,
            filters: { newOnly, limit, language },
            lastUpdated,
            lastUpdatedFormatted: formatLastUpdated(lastUpdated),
            availableLanguages: LANGUAGES,
            cached: !!cached,
        }, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
            }
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch startups',
                startups: [],
                availableLanguages: LANGUAGES,
                lastUpdated: new Date().toISOString(),
            },
            { status: 500 }
        )
    }
}
