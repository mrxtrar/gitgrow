// StatsBar Component - Display actual metrics

'use client'

import { Rocket, Star, Code } from 'lucide-react'
import { Startup } from '@/lib/types'

interface Props {
    startups: Startup[]
    loading: boolean
}

export function StatsBar({ startups, loading }: Props) {
    const totalStars = startups.reduce((sum, s) => sum + (s.stars || 0), 0)
    const languages = [...new Set(startups.flatMap(s => s.languages || []))].length

    const stats = [
        {
            label: 'Active Startups',
            value: startups.length,
            icon: Rocket,
            color: 'text-blue-400',
        },
        {
            label: 'Total Stars',
            value: formatNumber(totalStars),
            icon: Star,
            color: 'text-yellow-400',
        },
        {
            label: 'Languages',
            value: languages,
            icon: Code,
            color: 'text-emerald-400',
        },
    ]

    return (
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 md:p-5 hover:border-slate-700/50 transition-all"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs text-slate-500 uppercase tracking-wider hidden sm:inline">{stat.label}</span>
                    </div>
                    <div className={`text-2xl md:text-3xl font-mono font-bold ${stat.color}`}>
                        {loading ? (
                            <div className="h-8 w-16 bg-slate-800 rounded animate-pulse"></div>
                        ) : (
                            <span>{stat.value}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toLocaleString()
}
