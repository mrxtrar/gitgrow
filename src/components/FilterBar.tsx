// FilterBar Component - Glassmorphism sticky toolbar with language filter

'use client'

import { Search, X, ChevronDown } from 'lucide-react'
import { Filters } from '@/lib/types'

interface Props {
    filters: Filters
    searchQuery: string
    onSearchChange: (value: string) => void
    onFiltersChange: (filters: Filters) => void
}

const LANGUAGES = [
    { value: '', label: 'All Languages' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Go', label: 'Go' },
    { value: 'Rust', label: 'Rust' },
    { value: 'Java', label: 'Java' },
    { value: 'Ruby', label: 'Ruby' },
    { value: 'PHP', label: 'PHP' },
]

export function FilterBar({ filters, searchQuery, onSearchChange, onFiltersChange }: Props) {
    return (
        <div className="glass border-y border-slate-800/50 sticky top-16 z-40 py-4 -mx-4 px-4 mb-8">
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search startups..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Source Filter - GitHub Trending Only */}
                <div className="relative">
                    <select
                        value={filters.source}
                        onChange={(e) => onFiltersChange({ ...filters, source: e.target.value })}
                        className="appearance-none bg-slate-900/50 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        <option value="github_trending">📈 Trending Repos</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {/* Language Filter */}
                <div className="relative">
                    <select
                        value={filters.language || ''}
                        onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
                        className="appearance-none bg-slate-900/50 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {/* Limit */}
                <div className="relative">
                    <select
                        value={filters.limit}
                        onChange={(e) => onFiltersChange({ ...filters, limit: parseInt(e.target.value) })}
                        className="appearance-none bg-slate-900/50 border border-slate-800 rounded-lg pl-3 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
