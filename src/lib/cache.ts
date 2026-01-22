// Cache Service - Manages static data cache
// Data is refreshed by a cron job and served from cache

import { Startup } from '@/lib/types'

interface CacheData {
    startups: Startup[]
    lastUpdated: string
    source: string
}

interface CacheStore {
    [key: string]: CacheData
}

// In-memory cache (persists during worker lifetime)
let memoryCache: CacheStore = {}
let cacheTimestamps: { [key: string]: number } = {}

// Cache expires after 10 minutes (uses <1% of GitHub API limit)
const CACHE_TTL_MS = 10 * 60 * 1000

export function getCachedData(key: string): CacheData | null {
    const cached = memoryCache[key]
    const timestamp = cacheTimestamps[key]

    if (cached && timestamp) {
        const age = Date.now() - timestamp
        if (age < CACHE_TTL_MS) {
            return cached
        }
    }

    return null
}

export function setCachedData(key: string, data: CacheData): void {
    memoryCache[key] = data
    cacheTimestamps[key] = Date.now()
}

export function getLastUpdated(key: string): string | null {
    const cached = memoryCache[key]
    return cached?.lastUpdated || null
}

export function clearCache(): void {
    memoryCache = {}
    cacheTimestamps = {}
}

// Format relative time for display
export function formatLastUpdated(isoDate: string): string {
    const date = new Date(isoDate)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

    return date.toLocaleDateString()
}
