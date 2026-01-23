// StartupCard Component - Card with glow effect and git stats

'use client'

import { Star, GitBranch, Globe, BadgeCheck, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Startup } from '@/lib/types'

interface Props {
    startup: Startup
}

export function StartupCard({ startup }: Props) {
    // Determine the primary link (GitHub or website)
    const primaryLink = startup.github_url || startup.website || null
    const isVerifiedYC = startup.source === 'yc_verified'
    const isCommunity = startup.source === 'hackernews'

    const handleCardClick = () => {
        if (primaryLink) {
            window.open(primaryLink, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div
            className={`card-glow bg-slate-900/50 rounded-xl border border-slate-800/50 p-5 flex flex-col h-full transition-all ${primaryLink ? 'cursor-pointer hover:border-emerald-500/30' : ''}`}
            onClick={handleCardClick}
        >
            {/* Header: Company Name + Badges */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-lg text-white truncate flex-1">
                    {startup.name}
                </h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isVerifiedYC && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                            <BadgeCheck className="w-3 h-3" />
                            YC Funded
                        </span>
                    )}
                    {isCommunity && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
                            <MessageCircle className="w-3 h-3" />
                            Community
                        </span>
                    )}
                    {startup.batch && (
                        <Badge variant="yc">{startup.batch}</Badge>
                    )}
                </div>
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
