'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';
import { PlotlyGraph } from '@/components/graphs/PlotlyGraph';
import { algebraApi, ComputationResult } from '@/lib/api';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type Tab = 'matrix' | 'system' | 'polynomial' | 'complex';

export function AlgebraSolver() {
    const [activeTab, setActiveTab] = useState<Tab>('matrix');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ComputationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Matrix State
    const [matrixA, setMatrixA] = useState<string[][]>([['1', '2'], ['3', '4']]);
    const [matrixB, setMatrixB] = useState<string[][]>([['1', '0'], ['0', '1']]); // For operations
    const [matrixOp, setMatrixOp] = useState<'properties' | 'add' | 'subtract' | 'multiply'>('properties');

    // System State
    const [equations, setEquations] = useState<string[]>(['2*x + y = 5', 'x - y = 1']);

    // Polynomial/Complex State
    const [expression, setExpression] = useState('');

    const handleCompute = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let res: ComputationResult;

            switch (activeTab) {
                case 'matrix':
                    if (matrixOp === 'properties') {
                        res = await algebraApi.matrixProperties(matrixA);
                    } else {
                        res = await algebraApi.matrixOperate(matrixA, matrixB, matrixOp);
                    }
                    break;
                case 'system':
                    res = await algebraApi.solveSystem(equations.filter(e => e.trim()));
                    break;
                case 'polynomial':
                    res = await algebraApi.analyzePolynomial(expression || 'x^2 - 4');
                    break;
                case 'complex':
                    res = await algebraApi.analyzeComplex(expression || '3 + 4*I');
                    break;
                default:
                    throw new Error("Invalid tab");
            }
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-2 justify-center">
                {[
                    { id: 'matrix', label: 'Matrices' },
                    { id: 'system', label: 'Linear Systems' },
                    { id: 'polynomial', label: 'Polynomials' },
                    { id: 'complex', label: 'Complex Numbers' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as Tab); setResult(null); setError(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent text-muted-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <motion.div
                    className="lg:col-span-1 bg-card rounded-xl border border-border p-6 h-fit"
                >
                    <h2 className="text-lg font-semibold mb-4">Input</h2>

                    <div className="space-y-6">
                        {activeTab === 'matrix' && (
                            <div className="space-y-4">
                                <div className="flex gap-2 mb-2">
                                    <select
                                        value={matrixOp}
                                        onChange={(e) => setMatrixOp(e.target.value as any)}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                    >
                                        <option value="properties">Properties (Det, Inv, Rank)</option>
                                        <option value="add">Add (A + B)</option>
                                        <option value="subtract">Subtract (A - B)</option>
                                        <option value="multiply">Multiply (A × B)</option>
                                    </select>
                                </div>

                                {/* Matrix A Input */}
                                <MatrixInput
                                    label={matrixOp === 'properties' ? "Matrix" : "Matrix A"}
                                    matrix={matrixA}
                                    onChange={setMatrixA}
                                />

                                {/* Matrix B Input (if opcode requires it) */}
                                {matrixOp !== 'properties' && (
                                    <MatrixInput
                                        label="Matrix B"
                                        matrix={matrixB}
                                        onChange={setMatrixB}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Enter equations (one per line)</p>
                                {equations.map((eq, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={eq}
                                            onChange={(e) => {
                                                const newEqs = [...equations];
                                                newEqs[i] = e.target.value;
                                                setEquations(newEqs);
                                            }}
                                            placeholder="e.g. 2*x + y = 5"
                                            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm font-mono"
                                        />
                                        <button
                                            onClick={() => setEquations(equations.filter((_, idx) => idx !== i))}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setEquations([...equations, ''])}
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <Plus size={16} /> Add Equation
                                </button>
                            </div>
                        )}

                        {activeTab === 'polynomial' && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Expression</label>
                                <input
                                    value={expression}
                                    onChange={(e) => setExpression(e.target.value)}
                                    placeholder="e.g. x^3 - 6*x^2 + 11*x - 6"
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background font-mono"
                                />
                            </div>
                        )}

                        {activeTab === 'complex' && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium">Complex Number</label>
                                <input
                                    value={expression}
                                    onChange={(e) => setExpression(e.target.value)}
                                    placeholder="e.g. 3 + 4*I"
                                    className="w-full px-4 py-2 rounded-md border border-input bg-background font-mono"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleCompute}
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Calculate'}
                        </button>

                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                >
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* LaTeX Results */}
                                {Object.keys(result.latex).length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4">Results</h3>
                                        <div className="grid gap-4">
                                            {Object.entries(result.latex).map(([key, val]) => (
                                                <div key={key} className="p-4 bg-accent/30 rounded-lg">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</div>
                                                    <MathBlock>{val}</MathBlock>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Graphs */}
                                {result.plot_elements.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6 h-[500px]">
                                        <h3 className="text-lg font-semibold mb-4">Visualization</h3>
                                        <PlotlyGraph elements={result.plot_elements} height={400} />
                                    </div>
                                )}

                                {/* Steps */}
                                {result.steps.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4">Step-by-Step Solution</h3>
                                        <div className="space-y-3">
                                            {result.steps.map((step, i) => (
                                                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div className="text-sm pt-0.5">
                                                        <MathBlock>{step}</MathBlock>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border p-12">
                                <p>Select an operation and click Calculate to see results</p>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

// Subcomponent: Dynamic Matrix Input
function MatrixInput({ label, matrix, onChange }: { label: string, matrix: string[][], onChange: (m: string[][]) => void }) {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    const resize = (r: number, c: number) => {
        const newMat = Array(r).fill(0).map((_, i) =>
            Array(c).fill(0).map((_, j) => matrix[i]?.[j] || '0')
        );
        onChange(newMat);
    };

    const update = (r: number, c: number, val: string) => {
        const newMat = [...matrix];
        newMat[r] = [...newMat[r]];
        newMat[r][c] = val;
        onChange(newMat);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{label}</label>
                <div className="flex items-center gap-1 text-xs bg-accent rounded-md p-1">
                    <button onClick={() => resize(Math.max(1, rows - 1), cols)} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded">-</button>
                    <span className="w-4 text-center">{rows}</span>
                    <button onClick={() => resize(rows + 1, cols)} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded">+</button>
                    <span className="mx-1">×</span>
                    <button onClick={() => resize(rows, Math.max(1, cols - 1))} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded">-</button>
                    <span className="w-4 text-center">{cols}</span>
                    <button onClick={() => resize(rows, cols + 1)} className="w-6 h-6 flex items-center justify-center hover:bg-background rounded">+</button>
                </div>
            </div>
            <div className="overflow-x-auto pb-2">
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(50px, 1fr))` }}>
                    {matrix.map((row, i) => (
                        row.map((val, j) => (
                            <input
                                key={`${i}-${j}`}
                                value={val}
                                onChange={(e) => update(i, j, e.target.value)}
                                className="w-full px-2 py-1.5 text-center text-sm rounded bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
}
