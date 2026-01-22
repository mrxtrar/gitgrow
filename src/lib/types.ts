// Type definitions for GitGrow

export interface Startup {
    id: string
    name: string
    slug: string
    description: string
    website: string
    github_url: string | null
    batch: string
    tags: string[]
    stars: number
    languages: string[]
    source: string
    score?: number
    good_first_issues?: number
    open_issues?: number
    language?: string
    last_activity?: string // ISO date string of last repo activity
}

export interface Filters {
    source: string
    newOnly: boolean
    limit: number
    language?: string
}

export interface Issue {
    id: number
    number: number
    title: string
    url: string
    labels: string[]
    created_at: string
    comments: number
}
