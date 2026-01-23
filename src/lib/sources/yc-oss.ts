// YC Source - Fetches active YC companies

import { Startup } from '@/lib/types'

// YC Companies API
const YC_ALL_API = 'https://yc-oss.github.io/api/companies/all.json'

export async function fetchYCOSSCompanies(): Promise<Startup[]> {
    try {
        const response = await fetch(YC_ALL_API, {
            headers: {
                'Accept': 'application/json',
            },
        })
        if (!response.ok) {
            console.error(`[YC] API returned ${response.status}`)
            return []
        }

        const companies: any[] = await response.json()
        console.log(`[YC] Fetched ${companies.length} total companies`)

        // Filter for active companies only
        const startups: Startup[] = companies
            .filter(c => c.status === 'Active' || c.status === 'Public')
            .slice(0, 500) // Limit to 500 for performance
            .map(company => ({
                id: `yc:${company.slug || company.name?.toLowerCase().replace(/\s+/g, '-')}`,
                name: company.name || '',
                slug: company.slug || '',
                description: company.one_liner || company.long_description || '',
                website: company.website || company.url || '',
                github_url: null, // YC API doesn't provide GitHub links
                batch: company.batch || '',
                tags: company.tags || [],
                stars: 0,
                languages: [],
                source: 'yc_oss',
            }))

        console.log(`[YC] Found ${startups.length} active companies`)
        return startups
    } catch (error) {
        console.error('YC fetch error:', error)
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

