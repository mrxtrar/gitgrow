// YC OSS Source - Fetches YC open source companies with verified GitHub repos

import { Startup } from '@/lib/types'

// Use the JSON API instead of parsing markdown (more reliable)
const YC_OSS_API = 'https://yc-oss.github.io/api/companies/open-source.json'

export async function fetchYCOSSCompanies(): Promise<Startup[]> {
    try {
        const response = await fetch(YC_OSS_API)
        if (!response.ok) throw new Error('Failed to fetch YC OSS list')

        const companies: any[] = await response.json()
        console.log(`[YC OSS] Fetched ${companies.length} companies from API`)

        const startups: Startup[] = companies
            .filter(c => c.github) // Only include those with GitHub
            .map(company => ({
                id: `yc_oss:${company.slug || company.name?.toLowerCase().replace(/\s+/g, '-')}`,
                name: company.name || '',
                slug: company.slug || '',
                description: company.one_liner || company.long_description || '',
                website: company.website || '',
                github_url: company.github || null,
                batch: company.batch || '',
                tags: [...(company.tags || []), 'open-source'],
                stars: 0,
                languages: [],
                source: 'yc_oss',
            }))

        console.log(`[YC OSS] Parsed ${startups.length} companies with GitHub`)
        return startups
    } catch (error) {
        console.error('YC OSS fetch error:', error)
        // Fallback to the readme parsing method
        return fetchFromReadme()
    }
}

// Fallback method using README parsing
async function fetchFromReadme(): Promise<Startup[]> {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yc-oss/open-source-companies/main/README.md')
        if (!response.ok) return []

        const markdown = await response.text()
        const startups: Startup[] = []

        // Parse table rows: | Company | Description | GitHub |
        const tableRegex = /\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]*)\s*\|\s*\[GitHub\]\(([^)]+)\)/g

        let match
        while ((match = tableRegex.exec(markdown)) !== null) {
            const [, name, website, description, github_url] = match

            startups.push({
                id: `yc_oss:${name.toLowerCase().replace(/\s+/g, '-')}`,
                name: name.trim(),
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                description: description.trim(),
                website: website.trim(),
                github_url: github_url.trim(),
                batch: '', // Can't reliably extract from markdown
                tags: ['open-source'],
                stars: 0,
                languages: [],
                source: 'yc_oss',
            })
        }

        console.log(`[YC OSS Fallback] Parsed ${startups.length} companies`)
        return startups
    } catch (error) {
        console.error('YC OSS fallback error:', error)
        return []
    }
}

// Filter to only include companies from specified year onwards
export function filterNewCompanies(startups: Startup[], minYear: number = 2025): Startup[] {
    return startups.filter(s => {
        if (!s.batch) return false

        // Extract 4-digit year (e.g., "Winter 2025" -> 2025)
        const fourDigitMatch = s.batch.match(/20(\d{2})/)
        if (fourDigitMatch) {
            const year = parseInt(fourDigitMatch[0], 10) // Parse full match "2025", not group
            return year >= minYear
        }

        // Extract 2-digit year (e.g., "W25" -> 2025)
        const twoDigitMatch = s.batch.match(/[WFS](\d{2})/i)
        if (twoDigitMatch) {
            const year = 2000 + parseInt(twoDigitMatch[1], 10)
            return year >= minYear
        }

        return false
    })
}
