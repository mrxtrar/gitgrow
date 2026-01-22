// Badge Component - Reusable pill-shaped badge

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'yc' | 'tech' | 'success'
    className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors'

    const variants = {
        default: 'bg-slate-800/50 text-slate-300 border-slate-700/50',
        yc: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        tech: 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    }

    return (
        <span className={twMerge(clsx(baseStyles, variants[variant], className))}>
            {children}
        </span>
    )
}
