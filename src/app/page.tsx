'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { StatsBar } from '@/components/StatsBar'
import { FilterBar } from '@/components/FilterBar'
import { StartupCard } from '@/components/StartupCard'
import { Startup, Filters } from '@/lib/types'

export default function Home() {
    const [startups, setStartups] = useState<Startup[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [lastUpdated, setLastUpdated] = useState('')
    const [isCached, setIsCached] = useState(false)
    const [filters, setFilters] = useState<Filters>({
        source: 'github_trending',
        newOnly: false,
        limit: 50,
        language: '',
    })

    useEffect(() => {
        fetchStartups()
    }, [filters])

    async function fetchStartups() {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                source: filters.source,
                newOnly: String(filters.newOnly),
                limit: String(filters.limit),
                language: filters.language || '',
            })
            const res = await fetch(`/api/startups?${params}`)
            const data = await res.json()
            setStartups(data.startups || [])
            setLastUpdated(data.lastUpdatedFormatted || '')
            setIsCached(data.cached || false)
        } catch (error) {
            console.error('Failed to fetch startups:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredStartups = useMemo(() => {
        if (!searchQuery.trim()) return startups
        const query = searchQuery.toLowerCase()
        return startups.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query) ||
            s.tags?.some(t => t.toLowerCase().includes(query))
        )
    }, [startups, searchQuery])

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="container mx-auto px-4 max-w-7xl">
                {/* Hero Section */}
                <motion.section
                    className="text-center py-12 md:py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                        Find your next{' '}
                        <span className="gradient-text">open source</span>
                        {' '}contribution
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        Discover trending GitHub repos.
                        Contribute to growing projects and get noticed.
                    </p>
                </motion.section>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <StatsBar startups={filteredStartups} loading={loading} />
                </motion.div>

                {/* Filter Bar */}
                <FilterBar
                    filters={filters}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                />

                {/* Last Updated Indicator */}
                {lastUpdated && !loading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Data updated {lastUpdated}</span>
                        {isCached && (
                            <span className="px-1.5 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded">
                                cached
                            </span>
                        )}
                    </div>
                )}

                {/* Startup Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-slate-800 rounded-full"></div>
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                        <p className="text-slate-500 mt-4 font-mono text-sm">Loading startups...</p>
                    </div>
                ) : filteredStartups.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-xl text-slate-400 mb-2">No startups found</p>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredStartups.map((startup, index) => (
                                <motion.div
                                    key={startup.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: Math.min(index * 0.03, 0.3),
                                        layout: { duration: 0.3 }
                                    }}
                                >
                                    <StartupCard startup={startup} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Footer */}
                <footer className="py-8 border-t border-slate-800/50 text-center">
                    <p className="text-slate-500 text-sm">
                        GitGrow Beta · Powered by GitHub
                    </p>
                    <p className="text-slate-600 text-xs mt-1">
                        Data refreshes automatically every 15 minutes
                    </p>
                </footer>
            </main>
        </div>
    )
}
