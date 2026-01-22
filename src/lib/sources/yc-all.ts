// YC All Source - Fetches all YC companies from yc-oss API

import { Startup } from '@/lib/types'

const YC_ALL_API = 'https://yc-oss.github.io/api/companies/all.json'

export async function fetchAllYCCompanies(minYear: number = 2020): Promise<Startup[]> {
    try {
        const response = await fetch(YC_ALL_API)
        if (!response.ok) throw new Error('Failed to fetch YC companies')

        const companies: any[] = await response.json()
        console.log(`[YC All] Raw data: ${companies.length} companies`)

        const startups: Startup[] = []

        for (const company of companies) {
            // Skip companies without GitHub repos
            if (!company.github) {
                continue
            }

            // Skip inactive companies
            if (company.status !== 'Active' && company.status !== 'Public') {
                continue
            }

            // Filter by year
            const year = extractYear(company.batch)
            if (year < minYear) continue

            startups.push({
                id: `yc:${company.slug || company.name?.toLowerCase().replace(/\s+/g, '-')}`,
                name: company.name || '',
                slug: company.slug || '',
                description: company.one_liner || company.long_description || '',
                website: company.website || '',
                github_url: company.github || null,
                batch: company.batch || '',
                tags: company.tags || [],
                stars: 0,
                languages: [],
                source: 'yc_all',
            })
        }

        console.log(`[YC All] Filtered to ${startups.length} companies (${minYear}+)`)
        return startups
    } catch (error) {
        console.error('YC All fetch error:', error)
        return []
    }
}

function extractYear(batch: string): number {
    if (!batch) return 0
    const match = batch.match(/20(\d{2})/)
    if (match) {
        return parseInt(match[0], 10)
    }
    // Handle short format like "W24" or "S25"
    const shortMatch = batch.match(/[WS](\d{2})/i)
    if (shortMatch) {
        const year = parseInt(shortMatch[1], 10)
        return 2000 + year
    }
    return 0
}
