'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';
import { PlotlyGraph } from '@/components/graphs/PlotlyGraph';
import { calculusApi, ComputationResult } from '@/lib/api';

type Operation = 'analyze' | 'derivative' | 'integral' | 'critical_points' | 'taylor' | 'limit' | 'indefinite_integral' | 'ode' | 'partial_derivative';

const operations = [
    { id: 'analyze' as Operation, label: 'Analyze Function (Plot, Domain)' },
    { id: 'limit' as Operation, label: 'Limit' },
    { id: 'derivative' as Operation, label: 'Derivative at Point' },
    { id: 'partial_derivative' as Operation, label: 'Partial Derivative' },
    { id: 'integral' as Operation, label: 'Definite Integral (Area)' },
    { id: 'indefinite_integral' as Operation, label: 'Indefinite Integral' },
    { id: 'critical_points' as Operation, label: 'Find Critical Points' },
    { id: 'taylor' as Operation, label: 'Taylor Series Expansion' },
    { id: 'ode' as Operation, label: 'Differential Equation (ODE)' },
];

interface CalculusSolverProps {
    initialOperation?: Operation;
}

export function CalculusSolver({ initialOperation }: CalculusSolverProps) {
    const [operation, setOperation] = useState<Operation>(initialOperation || 'analyze');
    const [expression, setExpression] = useState('x^2 * sin(x)');
    const [domainStart, setDomainStart] = useState(-5);
    const [domainEnd, setDomainEnd] = useState(5);
    const [point, setPoint] = useState(1);
    const [limitDirection, setLimitDirection] = useState('+/-');
    const [odeEquation, setOdeEquation] = useState("y' + y = x");
    const [partialVar, setPartialVar] = useState('x');
    const [taylorOrder, setTaylorOrder] = useState(5);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ComputationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialOperation) setOperation(initialOperation);
    }, [initialOperation]);

    const handleCompute = async () => {
        setLoading(true);
        setError(null);

        try {
            let res: ComputationResult;

            switch (operation) {
                case 'analyze':
                    res = await calculusApi.analyze(expression, domainStart, domainEnd);
                    break;
                case 'derivative':
                    res = await calculusApi.derivative(expression, point);
                    break;
                case 'integral':
                    res = await calculusApi.integrate(expression, domainStart, domainEnd);
                    break;
                case 'critical_points':
                    res = await calculusApi.criticalPoints(expression, domainStart, domainEnd);
                    break;
                case 'taylor':
                    res = await calculusApi.taylor(expression, point, taylorOrder);
                    break;
                case 'limit':
                    res = await calculusApi.limit(expression, point, limitDirection);
                    break;
                case 'indefinite_integral':
                    res = await calculusApi.indefiniteIntegral(expression);
                    break;
                case 'ode':
                    res = await calculusApi.ode(odeEquation);
                    break;
                case 'partial_derivative':
                    res = await calculusApi.partialDerivative(expression, partialVar);
                    break;
                default:
                    throw new Error('Unknown operation');
            }

            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Operation</label>
                        <select value={operation} onChange={(e) => setOperation(e.target.value as Operation)} className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus">
                            {operations.map(op => <option key={op.id} value={op.id}>{op.label}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {operation === 'ode' ? (
                            <div>
                                <label className="block text-sm font-medium mb-2">Differential Equation</label>
                                <input type="text" value={odeEquation} onChange={(e) => setOdeEquation(e.target.value)} placeholder="e.g., y' + y = x" className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus font-mono" />
                                <p className="mt-1 text-xs text-muted-foreground">Use y&apos; for derivative, y for function</p>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-2">Expression (f(x))</label>
                                <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g., x^2 * sin(x)" className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus font-mono" />
                            </div>
                        )}

                        {(operation === 'analyze' || operation === 'integral' || operation === 'critical_points') && (
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-medium mb-1">Start</label><input type="number" value={domainStart} onChange={(e) => setDomainStart(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">End</label><input type="number" value={domainEnd} onChange={(e) => setDomainEnd(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </div>
                        )}

                        {(operation === 'derivative' || operation === 'taylor' || operation === 'limit') && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Point (x)</label>
                                <input type="number" value={point} onChange={(e) => setPoint(parseFloat(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                        )}

                        {operation === 'limit' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Direction</label>
                                <select value={limitDirection} onChange={(e) => setLimitDirection(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus">
                                    <option value="+/-">Two-sided (+/-)</option>
                                    <option value="+">Right (+)</option>
                                    <option value="-">Left (-)</option>
                                </select>
                            </div>
                        )}

                        {operation === 'partial_derivative' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Variable to differentiate</label>
                                <select value={partialVar} onChange={(e) => setPartialVar(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus">
                                    <option value="x">x</option>
                                    <option value="y">y</option>
                                    <option value="z">z</option>
                                </select>
                            </div>
                        )}

                        {operation === 'taylor' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Order</label>
                                <input type="number" value={taylorOrder} min={1} max={20} onChange={(e) => setTaylorOrder(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                        )}
                    </div>

                    <button onClick={handleCompute} disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
                        {loading ? 'Computing...' : 'Compute'}
                    </button>

                    {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
                {result ? (
                    <>
                        {result.plot_elements.length > 0 && (
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="text-lg font-semibold mb-4">Visualization</h2>
                                <PlotlyGraph elements={result.plot_elements} height={400} />
                            </div>
                        )}

                        {Object.keys(result.latex).length > 0 && (
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="text-lg font-semibold mb-4">Results</h2>
                                <div className="space-y-4">
                                    {Object.entries(result.latex).map(([key, value]) => (
                                        <div key={key} className="p-4 rounded-lg bg-accent/50">
                                            <p className="text-sm text-muted-foreground mb-2 capitalize">{key.replace(/_/g, ' ')}</p>
                                            <MathBlock>{value}</MathBlock>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.steps.length > 0 && (
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="text-lg font-semibold mb-4">Step-by-Step</h2>
                                <div className="space-y-2">
                                    {result.steps.map((step, i) => (
                                        <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-accent/50">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">{i + 1}</span>
                                            <span className="text-sm"><MathBlock>{step}</MathBlock></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <h2 className="text-lg font-semibold mb-2">Ready to Compute</h2>
                        <p className="text-muted-foreground">Select an operation and enter values to see results.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
