// StartupCard Component - Card with glow effect and git stats

'use client'

import { Star, GitBranch, ExternalLink, Globe, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Startup } from '@/lib/types'

interface Props {
    startup: Startup
}

// Format relative time
function formatRelativeTime(dateString: string): string {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}

export function StartupCard({ startup }: Props) {
    // Determine the primary link (GitHub or website)
    const primaryLink = startup.github_url || startup.website || null

    const handleCardClick = () => {
        if (primaryLink) {
            window.open(primaryLink, '_blank', 'noopener,noreferrer')
        }
    }

    const lastActivityText = formatRelativeTime(startup.last_activity || '')

    return (
        <div
            className={`card-glow bg-slate-900/50 rounded-xl border border-slate-800/50 p-5 flex flex-col h-full transition-all ${primaryLink ? 'cursor-pointer hover:border-emerald-500/30' : ''}`}
            onClick={handleCardClick}
        >
            {/* Header: Company Name + YC Batch */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-lg text-white truncate flex-1">
                    {startup.name}
                </h3>
                {startup.batch && (
                    <Badge variant="yc">{startup.batch}</Badge>
                )}
            </div>

            {/* Body: Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
                {startup.description || 'Building something amazing...'}
            </p>

            {/* Tech Stack Tags */}
            {startup.tags && startup.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {startup.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="tech">{tag}</Badge>
                    ))}
                    {startup.tags.length > 3 && (
                        <span className="text-xs text-slate-500 self-center">+{startup.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Footer: Git Stats Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center gap-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-mono">
                            {startup.stars >= 1000
                                ? `${(startup.stars / 1000).toFixed(1)}k`
                                : startup.stars || 0}
                        </span>
                    </div>

                    {/* Languages */}
                    {startup.languages && startup.languages[0] && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span className="text-sm">{startup.languages[0]}</span>
                        </div>
                    )}

                    {/* Last Activity */}
                    {lastActivityText && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs">{lastActivityText}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {startup.github_url && (
                        <a
                            href={startup.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                        >
                            <GitBranch className="w-4 h-4" />
                            Contribute
                        </a>
                    )}
                    {!startup.github_url && startup.website && (
                        <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                        >
                            <Globe className="w-4 h-4" />
                            Visit
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

