'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import * as Dialog from '@radix-ui/react-dialog';
import curriculumData from '@/data/curriculum.json';

// Types
type SearchResult = {
    classId: string;
    chapterId: string;
    topicId: string;
    title: string;
    path: string;
    context: string; // "Class 9 > Number Systems"
};

export function Search() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const router = useRouter();

    // Toggle with Cmd/Ctrl + K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Index content
    const index = React.useMemo(() => {
        const results: SearchResult[] = [];
        const data = curriculumData as any;

        Object.values(data).forEach((cls: any) => {
            cls.chapters.forEach((chap: any) => {
                chap.topics.forEach((topic: any) => {
                    results.push({
                        classId: cls.id,
                        chapterId: chap.id,
                        topicId: topic.id,
                        title: topic.title,
                        path: `/learn/${cls.id}/${chap.id}/${topic.id}`,
                        context: `${cls.title} > ${chap.title}`
                    });
                });
            });
        });
        return results;
    }, []);

    // Filter results
    const filteredResults = React.useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return index.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.context.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); // Limit to 10 results
    }, [query, index]);

    const handleSelect = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-accent/30 hover:bg-accent/50 border border-border/50 rounded-lg transition-colors mb-4"
            >
                <span>Search topics</span>
            </button>

            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                        <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">

                            <input
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Search topics"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
                            {filteredResults.length === 0 && query && (
                                <p className="p-4 text-sm text-center text-muted-foreground">No results found.</p>
                            )}

                            {filteredResults.map((result) => (
                                <button
                                    key={result.path}
                                    onClick={() => handleSelect(result.path)}
                                    className="w-full flex flex-col items-start px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left transition-colors"
                                >
                                    <span className="font-medium text-foreground">{result.title}</span>
                                    <span className="text-xs text-muted-foreground">{result.context}</span>
                                </button>
                            ))}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
