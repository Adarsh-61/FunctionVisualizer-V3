'use client';

import { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { aiApi } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

// Generate unique connection ID to prevent duplicate handling
let connectionCounter = 0;
const generateConnectionId = () => ++connectionCounter;

import { useSearchParams } from 'next/navigation';
import curriculumData from '@/data/curriculum.json';

// Wrapper component with Suspense for SSG compatibility
export default function AIAssistantPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-pulse">Loading AI Assistant...</div></div>}>
            <AIAssistantContent />
        </Suspense>
    );
}

function AIAssistantContent() {
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [context, setContext] = useState<{ title: string; content: string } | null>(null);
    const [aiStatus, setAiStatus] = useState<{
        mode: string;
        current_provider: string | null;
        openrouter: { available: boolean; model: string | null };
        ollama: { available: boolean; model: string | null };
    } | null>(null);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const responseBufferRef = useRef('');
    const activeConnectionIdRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load context from URL
    useEffect(() => {
        const contextParam = searchParams.get('context');
        if (contextParam) {
            try {
                const [classId, chapterId, topicId] = contextParam.split('.');
                const curriculum = curriculumData as any;
                const cls = curriculum[classId];
                const chapter = cls?.chapters?.find((c: any) => c.id === chapterId);
                const topic = chapter?.topics?.find((t: any) => t.id === topicId);

                // Check towards clearing history if chapter changes
                setContext((prev) => {
                    const newTitle = `${cls.title} > ${chapter.title} > ${topic.title}`;
                    // Simple heuristic: if title changed significantly (different chapter), clear chat
                    // However, preventing state loops is key.
                    // Let's use a separate refined check or just rely on manual clear for now? 
                    // User requested: "Forget irrelevant history when user changes chapter/class"
                    // We can check if the chapter title part of the string is different.

                    if (prev && !prev.title.includes(chapter.title)) {
                        setMessages([]); // Auto-clear for new chapter
                    }
                    return {
                        title: newTitle,
                        content: topic.content || ''
                    };
                });
            } catch (e) {
                console.error("Failed to load context", e);
            }
        }
    }, [searchParams]);

    // Fetch AI status on mount
    useEffect(() => {
        fetchStatus();
        return () => {
            activeConnectionIdRef.current = 0;
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
    }, [messages]);

    const fetchStatus = async () => {
        try {
            const status = await aiApi.getStatus();
            setAiStatus(status);
        } catch (error) {
            console.error('Failed to fetch AI status:', error);
            // Set a fallback status so the UI doesn't look broken
            setAiStatus({
                mode: 'unknown',
                current_provider: null,
                openrouter: { available: false, model: null },
                ollama: { available: false, model: null }
            });
        }
    };

    // Helper to determine status text
    const statusText = useMemo(() => {
        if (!aiStatus) return 'Connecting...';
        // Map provider names to properly capitalized display names
        const providerDisplayNames: Record<string, string> = {
            'openrouter': 'OpenRouter',
            'ollama': 'Ollama',
        };
        if (aiStatus.current_provider) {
            return providerDisplayNames[aiStatus.current_provider.toLowerCase()] ||
                aiStatus.current_provider.charAt(0).toUpperCase() + aiStatus.current_provider.slice(1);
        }
        if (aiStatus.openrouter.available) return 'OpenRouter';
        if (aiStatus.ollama.available) return 'Ollama';
        return 'Disconnected';
    }, [aiStatus]);

    const isOnline = useMemo(() => {
        if (!aiStatus) return false;
        return aiStatus.openrouter.available || aiStatus.ollama.available;
    }, [aiStatus]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userContent = input.trim();
        const userMessage: Message = { role: 'user', content: userContent };
        const currentMessages = [...messages];

        // Add user message and empty assistant message (marked as streaming)
        setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '', isStreaming: true }]);
        setInput('');
        setLoading(true);
        responseBufferRef.current = '';
        lastUpdateRef.current = Date.now();

        // Close existing connection
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Generate new connection ID
        const thisConnectionId = generateConnectionId();
        activeConnectionIdRef.current = thisConnectionId;

        try {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/ai/chat/stream';
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (activeConnectionIdRef.current !== thisConnectionId) {
                    ws.close();
                    return;
                }
                const systemPrompt = context
                    ? `You are a helpful mathematical assistant.\n\nContext: The user is currently studying "${context.title}".\nContent Reference:\n${context.content}\n\nUse this context to answer questions if relevant.\n\nIMPORTANT: If the user asks who created you, who the developer is, your origin, your address, or any personal information about the creators, always respond with: "Developed by NAS Team as an MSc AIML Semester 1 project."`
                    : "You are a helpful mathematical assistant.\n\nIMPORTANT: If the user asks who created you, who the developer is, your origin, your address, or any personal information about the creators, always respond with: \"Developed by NAS Team as an MSc AIML Semester 1 project.\"";

                ws.send(JSON.stringify({
                    messages: [...currentMessages, userMessage],
                    system_prompt: systemPrompt
                }));
            };

            const updateState = () => {
                setMessages(prev => {
                    if (prev.length === 0) return prev;
                    const newMessages = [...prev];
                    const lastIdx = newMessages.length - 1;
                    if (newMessages[lastIdx]?.role === 'assistant') {
                        newMessages[lastIdx] = {
                            role: 'assistant',
                            content: responseBufferRef.current,
                            isStreaming: true
                        };
                    }
                    return newMessages;
                });
            };

            ws.onmessage = (event) => {
                if (activeConnectionIdRef.current !== thisConnectionId) return;

                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'token') {
                        responseBufferRef.current += data.content;

                        // Throttled update: only update state every ~50ms
                        const now = Date.now();
                        if (now - lastUpdateRef.current > 50) {
                            updateState();
                            lastUpdateRef.current = now;
                        } else {
                            // Schedule a trailing update if one isn't pending
                            if (!updateTimeoutRef.current) {
                                updateTimeoutRef.current = setTimeout(() => {
                                    updateState();
                                    lastUpdateRef.current = Date.now();
                                    updateTimeoutRef.current = null;
                                }, 50);
                            }
                        }

                    } else if (data.type === 'done') {
                        // Clear any pending throttled updates
                        if (updateTimeoutRef.current) {
                            clearTimeout(updateTimeoutRef.current);
                            updateTimeoutRef.current = null;
                        }

                        // Final state update
                        setMessages(prev => {
                            if (prev.length === 0) return prev;
                            const newMessages = [...prev];
                            const lastIdx = newMessages.length - 1;
                            if (newMessages[lastIdx]?.role === 'assistant') {
                                newMessages[lastIdx] = {
                                    role: 'assistant',
                                    content: responseBufferRef.current,
                                    isStreaming: false
                                };
                            }
                            return newMessages;
                        });
                        setLoading(false);
                        ws.close();
                    } else if (data.error) {
                        console.error('AI Error:', data.error);
                        responseBufferRef.current += `\n\n[Error: ${data.error}]`;

                        // Force update
                        setMessages(prev => {
                            if (prev.length === 0) return prev;
                            const newMessages = [...prev];
                            const lastIdx = newMessages.length - 1;
                            if (newMessages[lastIdx]?.role === 'assistant') {
                                newMessages[lastIdx] = {
                                    role: 'assistant',
                                    content: responseBufferRef.current,
                                    isStreaming: false
                                };
                            }
                            return newMessages;
                        });
                    }
                } catch (e) {
                    console.error('Failed to parse info message:', e);
                }
            };

            ws.onerror = () => {
                if (activeConnectionIdRef.current !== thisConnectionId) return;
                console.error('WebSocket error');
                setLoading(false);
                setMessages(prev => {
                    if (prev.length === 0) return prev;
                    const newMessages = [...prev];
                    const lastIdx = newMessages.length - 1;
                    if (newMessages[lastIdx]?.role === 'assistant') {
                        newMessages[lastIdx] = {
                            role: 'assistant',
                            content: responseBufferRef.current + '\n\n[Connection error - Please try again]',
                            isStreaming: false
                        };
                    }
                    return newMessages;
                });
            };

            ws.onclose = () => {
                if (activeConnectionIdRef.current !== thisConnectionId) return;
                setLoading(false);
                setMessages(prev => {
                    if (prev.length === 0) return prev;
                    const newMessages = [...prev];
                    const lastIdx = newMessages.length - 1;
                    if (newMessages[lastIdx]?.role === 'assistant' && newMessages[lastIdx]?.isStreaming) {
                        newMessages[lastIdx] = {
                            ...newMessages[lastIdx],
                            isStreaming: false
                        };
                    }
                    return newMessages;
                });
            };

        } catch (error) {
            console.error('WebSocket setup failed:', error);
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        activeConnectionIdRef.current = 0;
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        responseBufferRef.current = '';
        setMessages([]);
        setLoading(false);
    };

    const examplePrompts = [
        "Solve x² + 5x + 6 = 0 step by step",
        "Find the derivative of sin(x) * cos(x)",
        "Explain the chain rule",
        "Calculate ∫ x² dx from 0 to 1",
    ];

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-9rem)] overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 mb-8"
            >
                <div className="relative text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gradient">AI Assistant</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Ask any math question and get step-by-step solutions
                    </p>
                    {aiStatus ? (
                        <div className="absolute right-0 top-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-sm">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-muted-foreground">
                                {statusText}
                            </span>
                        </div>
                    ) : (
                        <div className="absolute right-0 top-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-sm opacity-50">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-muted-foreground">Connecting...</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Context Banner */}
            {context && (
                <div className="mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between text-sm">
                    <span className="text-primary font-medium">
                        Active Context: {context.title}
                    </span>
                    <button
                        onClick={() => setContext(null)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* Chat Container */}
            <div className="flex-1 min-h-0 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <h2 className="text-lg font-semibold mb-2">How can I help you today?</h2>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                I can solve math problems and explain concepts step-by-step.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                                {examplePrompts.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(prompt)}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <MessageBubble key={index} message={message} />
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 border-t border-border p-4 bg-card">
                    <div className="flex gap-2">
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="px-4 py-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
                            >
                                Clear
                            </button>
                        )}
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={!isOnline}
                                placeholder={isOnline ? "Ask a math question..." : "AI Assistant is currently unavailable"}
                                rows={1}
                                className="w-full px-4 py-3 pr-20 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading || !isOnline}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                {loading ? 'Generating...' : 'Send'}
                            </button>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-center text-muted-foreground">
                        AI can make mistakes. Verify important calculations.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Separate component for message rendering to optimize re-renders
function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user';

    // Memoize the rendered content to prevent unnecessary re-renders of LaTeX
    const renderedContent = useMemo(() => {
        if (!message.content) {
            return <span className="opacity-50 animate-pulse">Thinking...</span>;
        }

        // Normalize LaTeX delimiters for ReactMarkdown
        const normalizeMath = (text: string) => {
            return text
                .replace(/\\\[/g, '$$$')
                .replace(/\\\]/g, '$$$')
                .replace(/\\\(/g, '$')
                .replace(/\\\)/g, '$');
        };

        // Render with full Markdown + LaTeX
        return (
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ className, children, ...props }: any) => {
                        const isBlock = className?.includes('language-') ||
                            (typeof children === 'string' && children.includes('\n'));
                        return isBlock ? (
                            <pre className="bg-muted/50 p-2 rounded my-2 overflow-x-auto text-xs">
                                <code {...props}>{children}</code>
                            </pre>
                        ) : (
                            <code className="bg-muted/30 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {normalizeMath(message.content)}
            </ReactMarkdown>
        );
    }, [message.content]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isUser ? 'bg-primary text-primary-foreground' : 'bg-accent'
                }`}>
                {isUser ? 'You' : 'AI'}
            </div>

            <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl ${isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md text-left'
                    : 'bg-accent rounded-bl-md'
                    }`}>
                    <div className={`text-sm leading-relaxed text-left ${isUser ? 'text-primary-foreground' : ''}`}>
                        {renderedContent}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
