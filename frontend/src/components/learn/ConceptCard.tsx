'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { StepByStepSolution, ExampleProblem } from './StepByStepSolution';
import { DynamicGraph, GraphConfig } from './DynamicGraph';
import { DynamicFormulaSolver } from '@/components/solvers/DynamicFormulaSolver';

const MarkdownContent = dynamic(
    () => import('@/components/shared/MarkdownContent').then(mod => mod.MarkdownContent),
    { ssr: false, loading: () => <div className="animate-pulse h-20 bg-accent/20 rounded-lg"></div> }
);

interface ConceptCardProps {
    title: string;
    content: string;
    formulas?: string[];
    visualizationType?: string;
    graphConfig?: GraphConfig;
    context?: {
        classId: string;
        chapterId: string;
        topicId: string;
    };
    examples?: ExampleProblem[];
    solverId?: string;
}

export function ConceptCard({ title, content, formulas = [], visualizationType, graphConfig, context, examples, solverId }: ConceptCardProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold mb-2 text-gradient">{title}</h1>
                {context && (
                    <Link
                        href={`/ai-assistant?context=${context.classId}.${context.chapterId}.${context.topicId}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Ask AI
                    </Link>
                )}
            </div>

            {/* Visualization (Graph) */}
            {visualizationType === 'graph_2d' && graphConfig && (
                <div className="my-6">
                    <DynamicGraph config={graphConfig} />
                </div>
            )}

            {/* Content */}
            <MarkdownContent content={content} />

            {/* Formulas */}
            {formulas.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Key Formulas</h3>
                    <div className="grid gap-4">
                        {formulas.map((formula: any, idx) => {
                            const isString = typeof formula === 'string';
                            const tex = isString ? formula : formula.tex;
                            const label = isString ? null : formula.label;

                            return (
                                <div key={idx} className="bg-accent/30 p-4 rounded-lg border border-border/50 overflow-x-auto">
                                    {label && (
                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                            {label}
                                        </div>
                                    )}
                                    <MarkdownContent content={`$$ ${tex} $$`} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Examples */}
            {examples && examples.length > 0 && (
                <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                        Solved Examples
                    </h3>
                    <div className="space-y-6">
                        {examples.map((ex, idx) => (
                            <StepByStepSolution
                                key={ex.id || idx}
                                problem={ex}
                                defaultOpen={idx === 0}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Interactive Solver */}
            {solverId && <DynamicFormulaSolver solverId={solverId} />}
        </div>
    );
}
