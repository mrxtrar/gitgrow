// HackerNews Source - Fetches Show HN posts with GitHub links

import { Startup } from '@/lib/types'

const HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/showstories.json'
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item'

export async function fetchHackerNewsProjects(limit: number = 30): Promise<Startup[]> {
    try {
        // Get Show HN story IDs
        const response = await fetch(HN_TOP_STORIES)
        if (!response.ok) throw new Error('Failed to fetch HN stories')

        const storyIds: number[] = await response.json()
        const startups: Startup[] = []

        // Fetch first N stories
        const idsToFetch = storyIds.slice(0, Math.min(limit * 2, 100))

        for (const id of idsToFetch) {
            if (startups.length >= limit) break

            try {
                const itemRes = await fetch(`${HN_ITEM_URL}/${id}.json`)
                const item = await itemRes.json()

                if (!item || !item.url) continue

                // Only include GitHub links
                if (!item.url.includes('github.com')) continue

                const github_url = extractGitHubUrl(item.url)
                if (!github_url) continue

                startups.push({
                    id: `hn:${id}`,
                    name: cleanTitle(item.title),
                    slug: `hn-${id}`,
                    description: item.title,
                    website: item.url,
                    github_url: github_url,
                    batch: new Date(item.time * 1000).toISOString().split('T')[0],
                    tags: ['hackernews', 'show-hn'],
                    stars: item.score || 0,
                    languages: [],
                    source: 'hackernews',
                })
            } catch (e) {
                // Skip failed items
            }
        }

        console.log(`[HackerNews] Found ${startups.length} projects with GitHub`)
        return startups
    } catch (error) {
        console.error('HN fetch error:', error)
        return []
    }
}

function extractGitHubUrl(url: string): string | null {
    const match = url.match(/https?:\/\/github\.com\/[^/]+\/[^/]+/)
    return match ? match[0] : null
}

function cleanTitle(title: string): string {
    // Remove "Show HN:" prefix and clean up
    return title
        .replace(/^Show HN:\s*/i, '')
        .replace(/\s*[-–—]\s*.*$/, '')
        .trim()
}
