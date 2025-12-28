"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass border border-border/50 shadow-xl flex items-center justify-center text-foreground outline-none focus:ring-2 focus:ring-primary/50"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-blue-400" />
            ) : (
                <Sun className="w-5 h-5 text-amber-500" />
            )}
        </button>
    )
}
