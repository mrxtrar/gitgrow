import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains',
})

export const metadata: Metadata = {
    title: 'GitGrow - Find Your Next Open Source Contribution',
    description: 'Discover active YC startups with open-source repositories. Contribute and grow your developer profile.',
    keywords: ['github', 'open source', 'yc', 'startups', 'contribute', 'developer', 'good first issue'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-slate-950 text-slate-100 min-h-screen antialiased`}>
                {children}
            </body>
        </html>
    )
}
