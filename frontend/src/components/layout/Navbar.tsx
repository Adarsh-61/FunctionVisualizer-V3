'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'NCERT', href: '/ncert' },
    { label: 'Calculus', href: '/calculus' },
    { label: 'Algebra', href: '/algebra' },
    { label: 'Geometry', href: '/geometry' },
    { label: 'Trigonometry', href: '/trigonometry' },
    { label: 'AI Assistant', href: '/ai-assistant' },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass border-b border-border/50">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">FV</span>
                        </div>
                        <span className="font-semibold text-lg hidden sm:block">
                            Function Visualiser
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    relative px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    flex items-center gap-2
                    ${isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }
                  `}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-accent"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden py-4 border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                      px-4 py-3 rounded-lg font-medium transition-colors
                      flex items-center gap-3
                      ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }
                    `}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </nav>
        </header>
    );
}
