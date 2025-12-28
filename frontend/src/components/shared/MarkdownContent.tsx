'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Table rendering customization
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto my-4 border border-border rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-muted-foreground" {...props} />
                        </div>
                    ),
                    thead: ({ ...props }) => (
                        <thead className="text-xs uppercase bg-accent text-muted-foreground" {...props} />
                    ),
                    tbody: ({ ...props }) => (
                        <tbody className="bg-card border-b border-border" {...props} />
                    ),
                    tr: ({ ...props }) => (
                        <tr className="border-b border-border hover:bg-accent/50" {...props} />
                    ),
                    th: ({ ...props }) => (
                        <th scope="col" className="px-6 py-3 font-medium text-foreground whitespace-nowrap" {...props} />
                    ),
                    td: ({ ...props }) => (
                        <td className="px-6 py-4" {...props} />
                    ),
                    // Style links
                    a: ({ ...props }) => (
                        <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    // Ensure headers have top margin
                    h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />,
                    // List styling
                    ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 my-4" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1 my-4" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
