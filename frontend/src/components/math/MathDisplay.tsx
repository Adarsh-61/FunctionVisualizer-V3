'use client';

import { memo, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

interface MathDisplayProps {
    math: string;
    block?: boolean;
    className?: string;
}

/**
 * MathDisplay component for rendering LaTeX expressions.
 * Uses KaTeX for fast, high-quality math rendering.
 */
export const MathDisplay = memo(function MathDisplay({ math, block = false, className = '' }: MathDisplayProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const renderMath = async () => {
            if (!containerRef.current || !math) return;

            try {
                // Dynamic import to reduce bundle size
                const katex = (await import('katex')).default;

                katex.render(math, containerRef.current, {
                    throwOnError: false,
                    displayMode: block,
                    trust: true,
                    strict: false,
                    macros: {
                        '\\f': '#1f(#2)',
                    },
                });
            } catch (error) {
                console.error('KaTeX render error:', error);
                if (containerRef.current) {
                    containerRef.current.textContent = math;
                }
            }
        };

        renderMath();
    }, [math, block]);

    if (block) {
        return (
            <div className={`math-container ${className}`}>
                <span ref={containerRef} className="katex-display" />
            </div>
        );
    }

    return <span ref={containerRef} className={className} />;
});

interface MathBlockProps {
    children: string;
    className?: string;
}

/**
 * MathBlock component for display-mode math (centered, larger).
 */
export function MathBlock({ children, className = '' }: MathBlockProps) {
    return <MathDisplay math={children} block className={className} />;
}

interface InlineMathProps {
    children: string;
    className?: string;
}

/**
 * InlineMath component for inline math expressions.
 */
export function InlineMath({ children, className = '' }: InlineMathProps) {
    return <MathDisplay math={children} className={className} />;
}
