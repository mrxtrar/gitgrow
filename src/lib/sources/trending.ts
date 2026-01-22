// GitHub Trending Source - Fetches trending repositories

import { Startup } from '@/lib/types'

const GITHUB_TRENDING_API = 'https://api.github.com/search/repositories'

export async function fetchGitHubTrending(
    language: string = '',
    limit: number = 30
): Promise<Startup[]> {
    try {
        // Search for recently created, popular repos
        const date = new Date()
        date.setDate(date.getDate() - 30) // Last 30 days
        const since = date.toISOString().split('T')[0]

        let query = `created:>${since} stars:>50`
        if (language) {
            query += ` language:${language}`
        }

        const params = new URLSearchParams({
            q: query,
            sort: 'stars',
            order: 'desc',
            per_page: String(limit),
        })

        const response = await fetch(`${GITHUB_TRENDING_API}?${params}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitGrow',
            },
        })

        if (!response.ok) {
            console.error('GitHub API error:', response.status)
            return []
        }

        const data = await response.json()
        const repos = data.items || []

        const startups: Startup[] = repos.map((repo: any) => ({
            id: `trending:${repo.full_name.replace('/', '-')}`,
            name: repo.name,
            slug: repo.full_name.replace('/', '-'),
            description: repo.description || '',
            website: repo.homepage || repo.html_url,
            github_url: repo.html_url,
            batch: repo.created_at?.split('T')[0] || '',
            tags: repo.topics || [],
            stars: repo.stargazers_count || 0,
            languages: [repo.language].filter(Boolean),
            source: 'github_trending',
        }))

        console.log(`[GitHub Trending] Found ${startups.length} repos`)
        return startups
    } catch (error) {
        console.error('GitHub Trending fetch error:', error)
        return []
    }
}
