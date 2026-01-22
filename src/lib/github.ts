// GitHub Issues Fetcher - Get good first issues from repos

const GITHUB_API = 'https://api.github.com'

interface GitHubIssue {
    id: number
    number: number
    title: string
    html_url: string
    labels: { name: string }[]
    created_at: string
    comments: number
}

// Good first issue labels to search for
const GOOD_FIRST_ISSUE_LABELS = [
    'good first issue',
    'good-first-issue',
    'beginner',
    'beginner-friendly',
    'easy',
    'starter',
    'help wanted',
    'first-timers-only',
]

export async function fetchGoodFirstIssues(
    repoUrl: string,
    limit: number = 5
): Promise<GitHubIssue[]> {
    try {
        const repoPath = extractRepoPath(repoUrl)
        if (!repoPath) return []

        // Try each label until we find issues
        for (const label of GOOD_FIRST_ISSUE_LABELS.slice(0, 3)) {
            const url = `${GITHUB_API}/repos/${repoPath}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=${limit}`

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitGrow',
                },
            })

            if (response.ok) {
                const issues: GitHubIssue[] = await response.json()
                if (issues.length > 0) {
                    return issues
                }
            }
        }

        return []
    } catch (error) {
        console.error('Failed to fetch issues:', error)
        return []
    }
}

export async function fetchRepoDetails(repoUrl: string): Promise<{
    open_issues: number
    good_first_issues: number
    language: string
    languages: string[]
} | null> {
    try {
        const repoPath = extractRepoPath(repoUrl)
        if (!repoPath) return null

        // Fetch repo info
        const repoResponse = await fetch(`${GITHUB_API}/repos/${repoPath}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitGrow',
            },
        })

        if (!repoResponse.ok) return null

        const repo = await repoResponse.json()

        // Try to get good first issue count
        const issueResponse = await fetch(
            `${GITHUB_API}/search/issues?q=repo:${repoPath}+is:issue+is:open+label:"good first issue"&per_page=1`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitGrow',
                },
            }
        )

        let goodFirstIssues = 0
        if (issueResponse.ok) {
            const issueData = await issueResponse.json()
            goodFirstIssues = issueData.total_count || 0
        }

        return {
            open_issues: repo.open_issues_count || 0,
            good_first_issues: goodFirstIssues,
            language: repo.language || '',
            languages: repo.language ? [repo.language] : [],
        }
    } catch (error) {
        console.error('Failed to fetch repo details:', error)
        return null
    }
}

function extractRepoPath(url: string): string | null {
    if (!url) return null
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/)
    return match ? match[1].replace(/\.git$/, '') : null
}
