'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import curriculumData from '@/data/curriculum.json';
import { Search } from './Search';

// Type definitions for our data
type Topic = {
    id: string;
    title: string;
};

type Chapter = {
    id: string;
    title: string;
    topics: Topic[];
};

type ClassData = {
    id: string;
    title: string;
    chapters: Chapter[];
};

type Curriculum = {
    [key: string]: ClassData;
};

const curriculum = curriculumData as Curriculum;

export function Sidebar() {
    const pathname = usePathname();

    // Determine which class to open based on URL
    const getInitialOpenState = () => {
        const pathParts = pathname.split('/');
        // URL format: /learn/class_X/chapter_id/topic_id
        if (pathParts.length >= 3 && pathParts[1] === 'learn') {
            const classId = pathParts[2];
            if (classId && curriculum[classId]) {
                return { [classId]: true };
            }
        }
        // Default: open Class 9
        return { class_9: true };
    };

    const [openClasses, setOpenClasses] = useState<Record<string, boolean>>(getInitialOpenState);

    // Update open state when URL changes
    useEffect(() => {
        const pathParts = pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'learn') {
            const classId = pathParts[2];
            if (classId && curriculum[classId]) {
                // Always expand the class from URL, using functional update to avoid dependency on openClasses
                setOpenClasses(prev => prev[classId] ? prev : { ...prev, [classId]: true });
            }
        }
    }, [pathname]);

    // Toggle class accordion
    const toggleClass = (classId: string) => {
        setOpenClasses(prev => ({ ...prev, [classId]: !prev[classId] }));
    };


    return (
        <aside className="w-64 flex-shrink-0 border-r border-border bg-card/50 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 hidden lg:block">
            <div className="p-4">
                <h2 className="font-semibold text-lg mb-4 px-2">Curriculum</h2>
                <Search />
                <div className="space-y-1">
                    {Object.values(curriculum).map((cls) => (
                        <div key={cls.id} className="space-y-1">
                            {/* Class Header */}
                            <button
                                onClick={() => toggleClass(cls.id)}
                                className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-accent text-left font-medium"
                            >
                                <span className="flex items-center gap-2">
                                    {cls.title}
                                </span>
                                {openClasses[cls.id] ? (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>

                            {/* Chapters List */}
                            {openClasses[cls.id] && (
                                <div className="ml-4 border-l border-border pl-2 space-y-4 py-2">
                                    {cls.chapters.length === 0 ? (
                                        <p className="text-xs text-muted-foreground px-2 py-1">No chapters yet</p>
                                    ) : (
                                        cls.chapters.map((chapter) => (
                                            <div key={chapter.id} className="space-y-1">
                                                <h3 className="text-sm font-semibold text-muted-foreground px-2">
                                                    {chapter.title}
                                                </h3>
                                                {/* Topics */}
                                                <div className="space-y-0.5">
                                                    {chapter.topics.map((topic) => {
                                                        const href = `/learn/${cls.id}/${chapter.id}/${topic.id}`;
                                                        const isActive = pathname === href;
                                                        return (
                                                            <Link
                                                                key={topic.id}
                                                                href={href}
                                                                className={`
                                                                    block px-2 py-1.5 text-sm rounded-md transition-colors
                                                                    ${isActive
                                                                        ? 'bg-primary/10 text-primary font-medium'
                                                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}
                                                                `}
                                                            >
                                                                {topic.title}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Interactive Tools Section */}
                <div className="mt-6 pt-6 border-t border-border px-2">
                    <h2 className="font-semibold text-lg mb-4">Interactive Tools</h2>
                    <div className="space-y-1">
                        <Link
                            href="/calculus"
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${pathname.startsWith('/calculus')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                            Calculus
                        </Link>
                        <Link
                            href="/algebra"
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${pathname.startsWith('/algebra')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                            Algebra
                        </Link>
                        <Link
                            href="/geometry"
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${pathname.startsWith('/geometry')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                            Geometry
                        </Link>
                        <Link
                            href="/trigonometry"
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${pathname.startsWith('/trigonometry')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                            Trigonometry
                        </Link>
                        <Link
                            href="/ai-assistant"
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${pathname.startsWith('/ai-assistant')
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                            AI Assistant
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
