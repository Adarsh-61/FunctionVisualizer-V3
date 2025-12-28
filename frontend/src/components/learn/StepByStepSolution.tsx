'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

export interface SolutionStep {
    explanation: string;
    math?: string;
    image?: string;
}

export interface ExampleProblem {
    id: string;
    question: string;
    steps?: SolutionStep[];
    solution?: string;
    finalAnswer?: string;
}

interface StepByStepSolutionProps {
    problem: ExampleProblem;
    defaultOpen?: boolean;
}

export function StepByStepSolution({ problem, defaultOpen = false }: StepByStepSolutionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header / Question */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex items-start justify-between bg-muted/20 hover:bg-muted/30 transition-colors"
            >
                <div className="flex gap-3 w-full">
                    <div className="w-1.5 self-stretch bg-green-500 rounded-full shrink-0 my-1 mr-2 opacity-80"></div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                            Example Problem
                        </h3>
                        <div className="text-foreground font-medium leading-relaxed">
                            <MarkdownContent content={problem.question} />
                        </div>
                    </div>
                    <div className={`p-1 rounded-full text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </button>

            {/* Steps Body */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border"
                    >
                        <div className="p-6 space-y-6 bg-card/50">
                            {problem.steps ? (
                                <>
                                    {problem.steps.map((step, index) => (
                                        <div key={index} className="relative pl-8 pb-6 border-l-2 border-border last:border-0 last:pb-0">
                                            {/* Step Indicator */}
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Step {index + 1}
                                                </p>
                                                <div className="text-foreground leading-relaxed">
                                                    <MarkdownContent content={step.explanation} />
                                                </div>
                                                {step.math && (
                                                    <div className="bg-accent/30 p-4 rounded-lg border border-border/50 overflow-x-auto">
                                                        <MarkdownContent content={`$$ ${step.math} $$`} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : problem.solution ? (
                                <div className="text-foreground leading-relaxed">
                                    <MarkdownContent content={problem.solution} />
                                </div>
                            ) : null}

                            {/* Final Answer */}
                            {problem.finalAnswer && (
                                <div className="mt-8 pt-6 border-t border-border bg-green-500/5 -mx-6 -mb-6 p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="font-semibold text-green-600 dark:text-green-400">Final Answer</span>
                                    </div>
                                    <div className="text-lg font-medium text-foreground">
                                        <MarkdownContent content={problem.finalAnswer} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
