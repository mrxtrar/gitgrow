// SearchBar Component - Clean search input with icon

import { Search, X } from 'lucide-react'

interface Props {
    value: string
    onChange: (value: string) => void
    resultCount: number
}

export function SearchBar({ value, onChange, resultCount }: Props) {
    return (
        <div className="mb-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search by name, description, or tags..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
            {value && (
                <p className="text-sm text-slate-500 mt-2 ml-1">
                    Found <span className="text-emerald-400 font-medium">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'} for "{value}"
                </p>
            )}
        </div>
    )
}
