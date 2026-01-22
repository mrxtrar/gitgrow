// YC OSS Source - Fetches YC open source companies with verified GitHub repos

import { Startup } from '@/lib/types'

// Use the all.json API and filter for companies with GitHub
const YC_ALL_API = 'https://yc-oss.github.io/api/companies/all.json'

export async function fetchYCOSSCompanies(): Promise<Startup[]> {
    try {
        const response = await fetch(YC_ALL_API, {
            headers: {
                'Accept': 'application/json',
            },
        })
        if (!response.ok) {
            console.error(`[YC OSS] API returned ${response.status}`)
            return []
        }

        const companies: any[] = await response.json()
        console.log(`[YC OSS] Fetched ${companies.length} total companies`)

        // Filter for active companies with GitHub repos
        const startups: Startup[] = companies
            .filter(c => c.github && (c.status === 'Active' || c.status === 'Public'))
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

        console.log(`[YC OSS] Found ${startups.length} companies with GitHub repos`)
        return startups
    } catch (error) {
        console.error('YC OSS fetch error:', error)
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

