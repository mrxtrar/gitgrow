// Navbar Component - Terminal-style logo with Beta badge

'use client'

export function Navbar() {
    return (
        <nav className="border-b border-slate-800/50 glass sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with blinking cursor */}
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                GitGrow<span className="text-emerald-400 animate-blink">_</span>
                            </span>
                        </a>
                        {/* Beta Badge */}
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                            Beta
                        </span>
                    </div>

                    {/* Tagline */}
                    <p className="hidden md:block text-sm text-slate-500">
                        Find YC startups · Contribute · Grow
                    </p>
                </div>
            </div>
        </nav>
    )
}
