'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'analyze_single'
    | 'solve_system_substitution'
    | 'solve_system_elimination'
    | 'solve_system_cramer'
    | 'consistency_check';

const operations = [
    { id: 'analyze_single' as Operation, label: 'Analyze Single Equation' },
    { id: 'solve_system_substitution' as Operation, label: 'Solve System (Substitution)' },
    { id: 'solve_system_elimination' as Operation, label: 'Solve System (Elimination)' },
    { id: 'solve_system_cramer' as Operation, label: 'Solve System (Cramer\'s Rule)' },
    { id: 'consistency_check' as Operation, label: 'Check Consistency (Nature of Solutions)' },
];

export function LinearEquationSolver() {
    const [operation, setOperation] = useState<Operation>('analyze_single');

    // Eq 1: a1x + b1y + c1 = 0
    const [a1, setA1] = useState('2');
    const [b1, setB1] = useState('3');
    const [c1, setC1] = useState('-12');

    // Eq 2: a2x + b2y + c2 = 0
    const [a2, setA2] = useState('1');
    const [b2, setB2] = useState('-1');
    const [c2, setC2] = useState('-1');

    const [results, setResults] = useState<{ label: string; value: string; step?: string }[] | null>(null);

    const formatEq = (a: number, b: number, c: number) => {
        const signB = b >= 0 ? '+' : '-';
        const signC = c >= 0 ? '+' : '-';
        return `${a}x ${signB} ${Math.abs(b)}y ${signC} ${Math.abs(c)} = 0`;
    };

    const calculate = () => {
        const res: { label: string; value: string; step?: string }[] = [];
        const A1 = parseFloat(a1) || 0;
        const B1 = parseFloat(b1) || 0;
        const C1 = parseFloat(c1) || 0;
        const A2 = parseFloat(a2) || 0;
        const B2 = parseFloat(b2) || 0;
        const C2 = parseFloat(c2) || 0;

        switch (operation) {
            case 'analyze_single': {
                res.push({ label: 'Equation', value: formatEq(A1, B1, C1) });

                // x-intercept (y=0)
                if (A1 !== 0) {
                    res.push({ label: 'X-Intercept (put y=0)', value: `x = -\\frac{c}{a} = -\\frac{${C1}}{${A1}} = ${(-C1 / A1).toFixed(2)}` });
                } else {
                    res.push({ label: 'X-Intercept', value: 'None (Parallel to X-axis)' });
                }

                // y-intercept (x=0)
                if (B1 !== 0) {
                    res.push({ label: 'Y-Intercept (put x=0)', value: `y = -\\frac{c}{b} = -\\frac{${C1}}{${B1}} = ${(-C1 / B1).toFixed(2)}` });
                } else {
                    res.push({ label: 'Y-Intercept', value: 'None (Parallel to Y-axis)' });
                }

                // Slope form
                if (B1 !== 0) {
                    res.push({ label: 'Slope-Intercept Form', value: `y = \\frac{-a}{b}x + \\frac{-c}{b}` });
                    res.push({ label: 'Converted', value: `y = ${(-A1 / B1).toFixed(2)}x + ${(-C1 / B1).toFixed(2)}` });
                    res.push({ label: 'Slope', value: `m = ${(-A1 / B1).toFixed(2)}` });
                }
                break;
            }

            case 'consistency_check': {
                res.push({ label: 'Equation 1', value: formatEq(A1, B1, C1) });
                res.push({ label: 'Equation 2', value: formatEq(A2, B2, C2) });

                const r1 = A1 / A2;
                const r2 = B1 / B2;
                const r3 = C1 / C2;

                res.push({ label: 'Ratios', value: `\\frac{a_1}{a_2} = ${r1.toFixed(2)}, \\quad \\frac{b_1}{b_2} = ${r2.toFixed(2)}, \\quad \\frac{c_1}{c_2} = ${r3.toFixed(2)}` });

                if (A1 / A2 !== B1 / B2) {
                    res.push({ label: 'Condition', value: `\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}` });
                    res.push({ label: 'Result', value: '\\text{Unique Solution (Intersecting Lines)}' });
                } else if (B1 / B2 === C1 / C2) {
                    res.push({ label: 'Condition', value: `\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}` });
                    res.push({ label: 'Result', value: '\\text{Infinitely Many Solutions (Coincident Lines)}' });
                } else {
                    res.push({ label: 'Condition', value: `\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}` });
                    res.push({ label: 'Result', value: '\\text{No Solution (Parallel Lines)}' });
                }
                break;
            }

            case 'solve_system_cramer': {
                const D = A1 * B2 - A2 * B1;
                const Dx = (-C1) * B2 - (-C2) * B1; // Using -C because standard form is ax+by=-c for Cramer's usually, but here ax+by+c=0 -> ax+by=-c. Let's stick to constants on RHS being -C.
                const Dy = A1 * (-C2) - A2 * (-C1);

                res.push({ label: 'Determinant D', value: `\\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix} = (${A1})(${B2}) - (${A2})(${B1}) = ${D}` });

                if (D === 0) {
                    res.push({ label: 'Result', value: 'D = 0, Unique solution does not exist.' });
                } else {
                    res.push({ label: 'Determinant Dx (replace col 1 with constants -c)', value: `\\begin{vmatrix} -c_1 & b_1 \\\\ -c_2 & b_2 \\end{vmatrix} = (${-C1})(${B2}) - (${-C2})(${B1}) = ${Dx}` });
                    res.push({ label: 'Determinant Dy (replace col 2 with constants -c)', value: `\\begin{vmatrix} a_1 & -c_1 \\\\ a_2 & -c_2 \\end{vmatrix} = (${A1})(${-C2}) - (${A2})(${-C1}) = ${Dy}` });

                    res.push({ label: 'Value x', value: `x = \\frac{D_x}{D} = \\frac{${Dx}}{${D}} = ${(Dx / D).toFixed(2)}` });
                    res.push({ label: 'Value y', value: `y = \\frac{D_y}{D} = \\frac{${Dy}}{${D}} = ${(Dy / D).toFixed(2)}` });
                }
                break;
            }

            case 'solve_system_substitution':
            case 'solve_system_elimination': {
                // Common logic for result, just different steps explanation
                const D = A1 * B2 - A2 * B1;
                if (D === 0) {
                    res.push({ label: 'Error', value: 'Lines are parallel or coincident. Cannot solve for unique point.' });
                    break;
                }
                const x = (B1 * C2 - B2 * C1) / D;
                const y = (C1 * A2 - C2 * A1) / D;

                res.push({ label: 'System', value: `\\begin{cases} ${formatEq(A1, B1, C1)} \\\\ ${formatEq(A2, B2, C2)} \\end{cases}` });

                if (operation === 'solve_system_substitution') {
                    res.push({ label: 'Step 1', value: `\\text{Express x from Eq 1: } x = \\frac{-${B1}y - ${C1}}{${A1}}` });
                    res.push({ label: 'Step 2', value: '\\text{Substitute into Eq 2 and solve for y.}' });
                } else {
                    res.push({ label: 'Step 1', value: `\\text{Multiply equations to equalize coefficients (e.g., make x coeff same).}` });
                    res.push({ label: 'Step 2', value: `\\text{Subtract new equations to eliminate x.}` });
                }

                res.push({ label: 'Solution', value: `x = ${x.toFixed(4)}, \\quad y = ${y.toFixed(4)}` });
                break;
            }
        }

        setResults(res);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Operation</label>
                        <select
                            value={operation}
                            onChange={(e) => { setOperation(e.target.value as Operation); setResults(null); }}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus"
                        >
                            {operations.map(op => <option key={op.id} value={op.id}>{op.label}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-semibold mb-2">Equation 1: a1x + b1y + c1 = 0</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div><label className="block text-xs mb-1">a1</label><input type="number" value={a1} onChange={(e) => setA1(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                                <div><label className="block text-xs mb-1">b1</label><input type="number" value={b1} onChange={(e) => setB1(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                                <div><label className="block text-xs mb-1">c1</label><input type="number" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                            </div>
                        </div>

                        {operation !== 'analyze_single' && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-semibold mb-2">Equation 2: a2x + b2y + c2 = 0</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div><label className="block text-xs mb-1">a2</label><input type="number" value={a2} onChange={(e) => setA2(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                                    <div><label className="block text-xs mb-1">b2</label><input type="number" value={b2} onChange={(e) => setB2(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                                    <div><label className="block text-xs mb-1">c2</label><input type="number" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full px-2 py-1 rounded border bg-background" /></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Calculate
                    </button>
                    <div className="text-xs text-muted-foreground mt-2">
                        {operation === 'solve_system_cramer' && <p>Advanced Method using Determinants.</p>}
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                {results ? (
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4">Results</h2>
                        <div className="space-y-4">
                            {results.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-accent/50">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                                    <MathBlock>{item.value}</MathBlock>
                                    {item.step && <p className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">{item.step}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <p className="text-muted-foreground">Select operation and enter coefficients.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
