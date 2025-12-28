
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';
import { PlotlyGraph } from '@/components/graphs/PlotlyGraph';
import { trigApi, ComputationResult } from '@/lib/api';
import { Loader2, XCircle } from 'lucide-react';

type Tab = 'basics' | 'unit_circle' | 'graphs' | 'identities' | 'equations' | 'compound' | 'heights';

export function TrigonometryWorkstation() {
    const [activeTab, setActiveTab] = useState<Tab>('basics');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ComputationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- State for each tab ---

    // Basics
    const [angleInput, setAngleInput] = useState('45');

    // Unit Circle
    const [ucAngle, setUcAngle] = useState(45);

    // Graphs
    const [graphFunc, setGraphFunc] = useState('sin');
    const [graphParams, setGraphParams] = useState({ A: 1, B: 1, C: 0, D: 0 });

    // Identities
    const [lhs, setLhs] = useState('sin(x)^2 + cos(x)^2');
    const [rhs, setRhs] = useState('1');

    // Equations
    const [equation, setEquation] = useState('sin(x) = 0.5');

    // Compound Angles
    const [compOp, setCompOp] = useState('sin_add');
    const [compA, setCompA] = useState('x');
    const [compB, setCompB] = useState('y');

    // Heights & Distances
    const [heightOp, setHeightOp] = useState('find_height');
    const [heightD, setHeightD] = useState(10);
    const [heightAngle, setHeightAngle] = useState(30);
    const [observerH, setObserverH] = useState(0);

    const handleCompute = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let res: ComputationResult;

            switch (activeTab) {
                case 'basics':
                    res = await trigApi.basicValues(angleInput);
                    break;
                case 'unit_circle':
                    res = await trigApi.unitCircle(ucAngle);
                    break;
                case 'graphs':
                    res = await trigApi.graph(graphFunc, graphParams);
                    break;
                case 'identities':
                    res = await trigApi.verifyIdentity(lhs, rhs);
                    break;
                case 'equations':
                    res = await trigApi.solveEquation(equation);
                    break;
                case 'compound':
                    res = await trigApi.compoundAngle(compOp, compA, compB);
                    break;
                case 'heights':
                    res = await trigApi.heightsDistances(heightOp, heightD, heightAngle, observerH);
                    break;
                default:
                    throw new Error("Unknown tab");
            }
            setResult(res);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [activeTab, angleInput, ucAngle, graphFunc, graphParams, lhs, rhs, equation, compOp, compA, compB, heightOp, heightD, heightAngle, observerH]);

    // Auto-update unit circle
    useEffect(() => {
        if (activeTab === 'unit_circle') {
            const timer = setTimeout(handleCompute, 50);
            return () => clearTimeout(timer);
        }
    }, [ucAngle, activeTab, handleCompute]);

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-2 justify-center">
                {[
                    { id: 'basics', label: 'Basic Values' },
                    { id: 'unit_circle', label: 'Unit Circle' },
                    { id: 'graphs', label: 'Graphs' },
                    { id: 'identities', label: 'Identities' },
                    { id: 'equations', label: 'Equations' },
                    { id: 'compound', label: 'Compound Angles' },
                    { id: 'heights', label: 'Heights & Distances' }
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
                <motion.div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Input</h2>

                    <div className="space-y-6">
                        {activeTab === 'basics' && (
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Angle</label>
                                <input value={angleInput} onChange={e => setAngleInput(e.target.value)} className="w-full input-field" placeholder="e.g. 45, pi/3" />
                                <p className="text-xs text-muted-foreground">Supports degrees or radians (pi)</p>
                            </div>
                        )}

                        {activeTab === 'unit_circle' && (
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Angle: {ucAngle}°</label>
                                <NumberControl value={ucAngle} onChange={setUcAngle} min={0} max={360} step={1} />
                                <div className="flex justify-between text-xs text-muted-foreground"><span>0°</span><span>360°</span></div>
                            </div>
                        )}

                        {activeTab === 'graphs' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Function</label>
                                    <select value={graphFunc} onChange={e => setGraphFunc(e.target.value)} className="w-full input-field mt-1">
                                        {['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'asin', 'acos', 'atan'].map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-3">
                                    <p className="font-mono text-center text-xs mb-2">y = A·func(Bx + C) + D</p>
                                    <ParamControl label="Ampl (A)" value={graphParams.A} onChange={v => setGraphParams({ ...graphParams, A: v })} min={-5} max={5} step={0.1} />
                                    <ParamControl label="Freq (B)" value={graphParams.B} onChange={v => setGraphParams({ ...graphParams, B: v })} min={0.1} max={5} step={0.1} />
                                    <ParamControl label="Phase (C)" value={graphParams.C} onChange={v => setGraphParams({ ...graphParams, C: v })} min={-3.14} max={3.14} step={0.1} />
                                    <ParamControl label="Vert (D)" value={graphParams.D} onChange={v => setGraphParams({ ...graphParams, D: v })} min={-5} max={5} step={0.1} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'identities' && (
                            <div className="space-y-4">
                                <div><label className="text-sm">LHS</label><input value={lhs} onChange={e => setLhs(e.target.value)} className="w-full input-field" /></div>
                                <div><label className="text-sm">RHS</label><input value={rhs} onChange={e => setRhs(e.target.value)} className="w-full input-field" /></div>
                            </div>
                        )}

                        {activeTab === 'equations' && (
                            <div><label className="text-sm">Equation</label><input value={equation} onChange={e => setEquation(e.target.value)} className="w-full input-field" placeholder="sin(x) = 0.5" /></div>
                        )}

                        {activeTab === 'compound' && (
                            <div className="space-y-4">
                                <select value={compOp} onChange={e => setCompOp(e.target.value)} className="w-full input-field">
                                    <option value="sin_add">sin(A + B)</option>
                                    <option value="sin_diff">sin(A - B)</option>
                                    <option value="cos_add">cos(A + B)</option>
                                    <option value="cos_diff">cos(A - B)</option>
                                    <option value="tan_add">tan(A + B)</option>
                                </select>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-xs">A</label><input value={compA} onChange={e => setCompA(e.target.value)} className="w-full input-field" /></div>
                                    <div><label className="text-xs">B</label><input value={compB} onChange={e => setCompB(e.target.value)} className="w-full input-field" /></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'heights' && (
                            <div className="space-y-4">
                                <select value={heightOp} onChange={e => setHeightOp(e.target.value)} className="w-full input-field">
                                    <option value="find_height">Find Height (given Base)</option>
                                    <option value="find_dist">Find Base (given Height)</option>
                                </select>
                                <div><label className="text-xs">Angle (deg)</label><input type="number" value={heightAngle} onChange={e => setHeightAngle(parseFloat(e.target.value))} className="w-full input-field" /></div>
                                <div><label className="text-xs">{heightOp === 'find_height' ? 'Base Distance' : 'Object Height'}</label><input type="number" value={heightD} onChange={e => setHeightD(parseFloat(e.target.value))} className="w-full input-field" /></div>
                                <div><label className="text-xs">Observer Height</label><input type="number" value={observerH} onChange={e => setObserverH(parseFloat(e.target.value))} className="w-full input-field" /></div>
                            </div>
                        )}

                        {activeTab !== 'unit_circle' && (
                            <button onClick={handleCompute} disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : 'Calculate'}
                            </button>
                        )}
                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2">
                                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

                                {/* Graphs Rendering - Common for many tabs */}
                                {result.plot_elements && result.plot_elements.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6 flex flex-col h-[500px]">
                                        <h3 className="font-semibold mb-2">Visualization</h3>
                                        <div className="flex-1 min-h-0">
                                            <PlotlyGraph elements={result.plot_elements} height={400} />
                                        </div>
                                    </div>
                                )}

                                {/* Latex Results */}
                                {result.latex && Object.keys(result.latex).length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-semibold mb-4">Results</h3>
                                        <div className="grid gap-4">
                                            {Object.entries(result.latex).map(([key, val]) => (
                                                <div key={key} className="p-3 bg-accent/30 rounded-lg">
                                                    <div className="text-xs text-muted-foreground uppercase mb-1">{key}</div>
                                                    <MathBlock>{val}</MathBlock>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Special handling for Basic Values Ratios */}
                                        {result.payload?.ratios && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                                {Object.entries(result.payload.ratios).map(([f, v]: [string, any]) => (
                                                    <div key={f} className="p-2 border rounded flex justify-between items-center bg-background/50">
                                                        <span className="font-serif italic">{f}</span>
                                                        <MathBlock>{v.exact}</MathBlock>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Steps */}
                                {result.steps && result.steps.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="font-semibold mb-4">Steps</h3>
                                        <div className="space-y-2">
                                            {result.steps.map((s, i) => (
                                                <div key={i} className="flex gap-3 text-sm p-2 hover:bg-muted/50 rounded">
                                                    <span className="text-muted-foreground font-mono">{i + 1}.</span>
                                                    <div><MathBlock>{s}</MathBlock></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

function NumberControl({ value, onChange, min, max, step }: { value: number, onChange: (n: number) => void, min: number, max: number, step: number }) {
    const update = (v: number) => {
        if (v >= min && v <= max) onChange(Number(v.toFixed(1)));
    };
    return (
        <div className="flex items-center gap-2">
            <button onClick={() => update(value - step)} className="w-10 h-10 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 text-lg font-medium active:scale-95 transition-transform">-</button>
            <div className="flex-1 text-center font-mono bg-background border border-border rounded-md py-2 text-sm">{value}</div>
            <button onClick={() => update(value + step)} className="w-10 h-10 flex items-center justify-center rounded-md bg-secondary hover:bg-secondary/80 text-lg font-medium active:scale-95 transition-transform">+</button>
        </div>
    );
}

function ParamControl({ label, value, onChange, min, max, step }: { label: string, value: number, onChange: (n: number) => void, min: number, max: number, step: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs"><span>{label}</span></div>
            <NumberControl value={value} onChange={onChange} min={min} max={max} step={step} />
        </div>
    );
}
