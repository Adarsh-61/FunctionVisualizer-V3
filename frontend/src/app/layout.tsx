import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
    title: {
        default: 'Function Visualizer | Advanced Math & AI Solver',
        template: '%s | Function Visualizer'
    },
    description: 'Interactive mathematical visualization engine featuring real-time graphing, calculus, linear algebra, and AI-powered step-by-step problem solving.',
    keywords: ['math', 'calculus', 'algebra', 'geometry', 'visualization', 'AI', 'solver', 'interactive graph', '3d graphing', 'linear algebra'],
    authors: [{ name: 'NAS Team' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://FunctionVisualizer.vercel.app',
        siteName: 'Function Visualizer',
        title: 'Function Visualizer | Advanced Math & AI Solver',
        description: 'Explore mathematics with interactive tools for calculus, algebra, and geometry. Features AI-powered problem solving and dynamic 3D visualization.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Function Visualizer Dashboard'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Function Visualizer | Advanced Math & AI Solver',
        description: 'Interactive mathematical visualization engine featuring real-time graphing, calculus, linear algebra, and AI-powered step-by-step problem solving.',
        images: ['/og-image.png'],
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body className="min-h-screen gradient-bg" suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="container mx-auto px-4 py-8 flex-1">
                        {children}
                    </main>
                    <ThemeToggle />
                </ThemeProvider>
            </body>
        </html>
    );
}
