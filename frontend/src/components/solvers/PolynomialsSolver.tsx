'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'evaluate'
    | 'find_zeros'
    | 'remainder_theorem'
    | 'factor_theorem'
    | 'expand_identity'
    | 'factorize'
    | 'division'
    | 'form_quadratic'
    | 'algebraic_eval'
    | 'rational_roots';

const operations = [
    { id: 'evaluate' as Operation, label: 'Evaluate Polynomial' },
    { id: 'find_zeros' as Operation, label: 'Find Zeros (Quadratic)' },
    { id: 'remainder_theorem' as Operation, label: 'Remainder Theorem' },
    { id: 'factor_theorem' as Operation, label: 'Factor Theorem' },
    { id: 'expand_identity' as Operation, label: 'Expand Using Identity' },
    { id: 'factorize' as Operation, label: 'Factorize Expression' },
    { id: 'division' as Operation, label: 'Polynomial Division' },
    { id: 'form_quadratic' as Operation, label: 'Form Quadratic from Roots' },
    { id: 'algebraic_eval' as Operation, label: 'Algebraic Evaluation (Given Sum/Prod)' },
    { id: 'rational_roots' as Operation, label: 'Find Rational Roots (Cubic)' },
];

const identities = [
    { id: 'sq_sum', label: '(x+y)^2', formula: '(x+y)^2 = x^2 + 2xy + y^2' },
    { id: 'sq_diff', label: '(x-y)^2', formula: '(x-y)^2 = x^2 - 2xy + y^2' },
    { id: 'diff_sq', label: 'x^2-y^2', formula: 'x^2 - y^2 = (x+y)(x-y)' },
    { id: 'sum_prod', label: '(x+a)(x+b)', formula: '(x+a)(x+b) = x^2 + (a+b)x + ab' },
    { id: 'cube_sum', label: '(x+y)^3', formula: '(x+y)^3 = x^3 + y^3 + 3xy(x+y)' },
    { id: 'cube_diff', label: '(x-y)^3', formula: '(x-y)^3 = x^3 - y^3 - 3xy(x-y)' },
    { id: 'sum_cubes', label: 'x^3+y^3', formula: 'x^3 + y^3 = (x+y)(x^2 - xy + y^2)' },
    { id: 'diff_cubes', label: 'x^3-y^3', formula: 'x^3 - y^3 = (x-y)(x^2 + xy + y^2)' },
    { id: 'triple_sq', label: '(x+y+z)^2', formula: '(x+y+z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx' },
    { id: 'cubes_3xyz', label: 'x^3+y^3+z^3-3xyz', formula: 'x^3+y^3+z^3-3xyz = (x+y+z)(x^2+y^2+z^2-xy-yz-zx)' },
];

export function PolynomialsSolver() {
    const [operation, setOperation] = useState<Operation>('evaluate');
    const [coeffA, setCoeffA] = useState('1');
    const [coeffB, setCoeffB] = useState('-5');
    const [coeffC, setCoeffC] = useState('6');
    const [coeffD, setCoeffD] = useState('0');
    const [valueX, setValueX] = useState('2');
    const [valueY, setValueY] = useState('3');
    const [valueZ, setValueZ] = useState('0');
    const [selectedIdentity, setSelectedIdentity] = useState('sq_sum');
    const [results, setResults] = useState<{ label: string; value: string; step?: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string; step?: string }[] = [];
        const a = parseFloat(coeffA) || 0;
        const b = parseFloat(coeffB) || 0;
        const c = parseFloat(coeffC) || 0;
        const d = parseFloat(coeffD) || 0;
        const x = parseFloat(valueX) || 0;
        const y = parseFloat(valueY) || 0;
        const z = parseFloat(valueZ) || 0;

        switch (operation) {
            case 'evaluate': {
                res.push({ label: 'Polynomial', value: `p(x) = ${a}x^3 + ${b}x^2 + ${c}x + ${d}` });
                res.push({ label: 'Evaluate at', value: `x = ${x}` });

                const term1 = a * Math.pow(x, 3);
                const term2 = b * Math.pow(x, 2);
                const term3 = c * x;
                const term4 = d;

                res.push({
                    label: 'Step 1: Substitute',
                    value: `p(${x}) = ${a}(${x})^3 + ${b}(${x})^2 + ${c}(${x}) + ${d}`
                });
                res.push({
                    label: 'Step 2: Calculate powers',
                    value: `= ${a}(${Math.pow(x, 3)}) + ${b}(${Math.pow(x, 2)}) + ${c}(${x}) + ${d}`
                });
                res.push({
                    label: 'Step 3: Multiply',
                    value: `= ${term1} + ${term2} + ${term3} + ${term4}`
                });
                res.push({
                    label: 'Result',
                    value: `p(${x}) = ${term1 + term2 + term3 + term4}`
                });
                break;
            }

            case 'find_zeros': {
                res.push({ label: 'Quadratic Polynomial', value: `p(x) = ${a}x^2 + ${b}x + ${c}` });

                const discriminant = b * b - 4 * a * c;
                res.push({ label: 'Discriminant', value: `D = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${discriminant}` });

                if (discriminant > 0) {
                    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                    res.push({ label: 'Nature of Roots', value: 'D > 0: Two distinct real roots' });
                    res.push({
                        label: 'Formula',
                        value: `x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{${-b} \\pm \\sqrt{${discriminant}}}{${2 * a}}`
                    });
                    res.push({ label: 'Zero 1 (alpha)', value: `\\alpha = ${root1.toFixed(4)}` });
                    res.push({ label: 'Zero 2 (beta)', value: `\\beta = ${root2.toFixed(4)}` });

                    // Verify sum and product
                    res.push({ label: 'Sum of zeros', value: `\\alpha + \\beta = -\\frac{b}{a} = -\\frac{${b}}{${a}} = ${-b / a}` });
                    res.push({ label: 'Product of zeros', value: `\\alpha \\cdot \\beta = \\frac{c}{a} = \\frac{${c}}{${a}} = ${c / a}` });
                } else if (discriminant === 0) {
                    const root = -b / (2 * a);
                    res.push({ label: 'Nature of Roots', value: 'D = 0: Two equal real roots' });
                    res.push({ label: 'Zero (repeated)', value: `x = -\\frac{b}{2a} = ${root}` });
                } else {
                    res.push({ label: 'Nature of Roots', value: 'D < 0: No real roots (Complex roots)' });
                    const realPart = -b / (2 * a);
                    const imagPart = Math.sqrt(-discriminant) / (2 * a);
                    res.push({ label: 'Complex Zero 1', value: `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i` });
                    res.push({ label: 'Complex Zero 2', value: `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i` });
                }
                break;
            }

            case 'remainder_theorem': {
                res.push({ label: 'Polynomial', value: `p(x) = ${a}x^3 + ${b}x^2 + ${c}x + ${d}` });
                res.push({ label: 'Divisor', value: `(x - ${x})` });

                res.push({
                    label: 'Remainder Theorem',
                    value: `\\text{If } p(x) \\text{ is divided by } (x-a), \\text{ remainder } = p(a)`
                });

                const remainder = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;

                res.push({
                    label: 'Calculate p(' + x + ')',
                    value: `p(${x}) = ${a}(${x})^3 + ${b}(${x})^2 + ${c}(${x}) + ${d}`
                });
                res.push({
                    label: 'Remainder',
                    value: `= ${remainder}`
                });
                break;
            }

            case 'factor_theorem': {
                res.push({ label: 'Polynomial', value: `p(x) = ${a}x^3 + ${b}x^2 + ${c}x + ${d}` });
                res.push({ label: 'Testing factor', value: `(x - ${x})` });

                res.push({
                    label: 'Factor Theorem',
                    value: `(x-a) \\text{ is a factor of } p(x) \\Leftrightarrow p(a) = 0`
                });

                const pValue = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;

                res.push({
                    label: 'Calculate p(' + x + ')',
                    value: `p(${x}) = ${pValue}`
                });

                if (pValue === 0) {
                    res.push({
                        label: 'Conclusion',
                        value: `\\text{Since } p(${x}) = 0, (x - ${x}) \\text{ IS a factor of } p(x)`
                    });
                } else {
                    res.push({
                        label: 'Conclusion',
                        value: `\\text{Since } p(${x}) \\neq 0, (x - ${x}) \\text{ is NOT a factor of } p(x)`
                    });
                }
                break;
            }

            case 'expand_identity': {
                const identity = identities.find(id => id.id === selectedIdentity);
                if (!identity) break;

                res.push({ label: 'Identity', value: identity.formula });
                res.push({ label: 'Values', value: `x = ${x}, y = ${y}${selectedIdentity.includes('z') ? `, z = ${z}` : ''}` });

                let result = 0;
                let expansion = '';

                switch (selectedIdentity) {
                    case 'sq_sum':
                        result = Math.pow(x + y, 2);
                        expansion = `(${x})^2 + 2(${x})(${y}) + (${y})^2 = ${x * x} + ${2 * x * y} + ${y * y} = ${result}`;
                        break;
                    case 'sq_diff':
                        result = Math.pow(x - y, 2);
                        expansion = `(${x})^2 - 2(${x})(${y}) + (${y})^2 = ${x * x} - ${2 * x * y} + ${y * y} = ${result}`;
                        break;
                    case 'diff_sq':
                        result = x * x - y * y;
                        expansion = `(${x}+${y})(${x}-${y}) = (${x + y})(${x - y}) = ${result}`;
                        break;
                    case 'cube_sum':
                        result = Math.pow(x + y, 3);
                        expansion = `(${x})^3 + (${y})^3 + 3(${x})(${y})(${x}+${y}) = ${x * x * x} + ${y * y * y} + ${3 * x * y * (x + y)} = ${result}`;
                        break;
                    case 'cube_diff':
                        result = Math.pow(x - y, 3);
                        expansion = `(${x})^3 - (${y})^3 - 3(${x})(${y})(${x}-${y}) = ${x * x * x} - ${y * y * y} - ${3 * x * y * (x - y)} = ${result}`;
                        break;
                    case 'sum_cubes':
                        result = x * x * x + y * y * y;
                        expansion = `(${x}+${y})((${x})^2 - (${x})(${y}) + (${y})^2) = (${x + y})(${x * x - x * y + y * y}) = ${result}`;
                        break;
                    case 'diff_cubes':
                        result = x * x * x - y * y * y;
                        expansion = `(${x}-${y})((${x})^2 + (${x})(${y}) + (${y})^2) = (${x - y})(${x * x + x * y + y * y}) = ${result}`;
                        break;
                    case 'triple_sq':
                        result = Math.pow(x + y + z, 2);
                        expansion = `${x * x} + ${y * y} + ${z * z} + ${2 * x * y} + ${2 * y * z} + ${2 * z * x} = ${result}`;
                        break;
                    case 'cubes_3xyz':
                        result = x * x * x + y * y * y + z * z * z - 3 * x * y * z;
                        if (x + y + z === 0) {
                            expansion = `\\text{Since } x+y+z = 0, \\text{ result } = 0`;
                        } else {
                            expansion = `(${x + y + z})(${x * x + y * y + z * z - x * y - y * z - z * x}) = ${result}`;
                        }
                        break;
                }

                res.push({ label: 'Expansion', value: expansion });
                res.push({ label: 'Direct Calculation', value: `= ${result}` });
                break;
            }

            case 'factorize': {
                // Attempt to factorize quadratic ax^2 + bx + c
                res.push({ label: 'Expression', value: `${a}x^2 + ${b}x + ${c}` });

                // Using middle term splitting
                const product = a * c;
                res.push({ label: 'Step 1: Find ac', value: `a \\times c = ${a} \\times ${c} = ${product}` });

                // Find factors of product that sum to b
                let factor1 = 0, factor2 = 0;
                for (let i = -Math.abs(product); i <= Math.abs(product); i++) {
                    if (i !== 0 && product % i === 0) {
                        const j = product / i;
                        if (i + j === b) {
                            factor1 = i;
                            factor2 = j;
                            break;
                        }
                    }
                }

                if (factor1 !== 0 && factor2 !== 0) {
                    res.push({ label: 'Step 2: Split middle term', value: `\\text{Find } m, n \\text{ such that } m + n = ${b} \\text{ and } mn = ${product}` });
                    res.push({ label: 'Found', value: `m = ${factor1}, n = ${factor2}` });
                    res.push({ label: 'Step 3: Rewrite', value: `${a}x^2 + ${factor1}x + ${factor2}x + ${c}` });

                    // Find GCF for grouping
                    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
                    const g1 = gcd(a, factor1);
                    const g2 = gcd(factor2, c);

                    res.push({ label: 'Step 4: Factor by grouping', value: `x(${a / g1}x + ${factor1 / g1}) + (${factor2 / g2})(${factor2 / (factor2 / g2)}x + ${c / g2})` });

                    // Calculate actual roots for verification
                    const discriminant = b * b - 4 * a * c;
                    if (discriminant >= 0) {
                        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                        res.push({ label: 'Factored Form', value: `${a}(x - ${root1.toFixed(2)})(x - ${root2.toFixed(2)})` });
                    }
                } else {
                    res.push({ label: 'Note', value: 'Cannot be easily factorized by middle term splitting' });
                    const discriminant = b * b - 4 * a * c;
                    if (discriminant >= 0) {
                        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                        res.push({ label: 'Using Quadratic Formula', value: `${a}(x - ${root1.toFixed(4)})(x - ${root2.toFixed(4)})` });
                    }
                }
                break;
            }

            case 'division': {
                // Synthetic division: divide ax^3 + bx^2 + cx + d by (x - r)
                const r = x; // divisor root
                res.push({ label: 'Dividend', value: `${a}x^3 + ${b}x^2 + ${c}x + ${d}` });
                res.push({ label: 'Divisor', value: `(x - ${r})` });

                // Synthetic division steps
                const c0 = a;
                const c1 = c0 * r + b;
                const c2 = c1 * r + c;
                const remainder = c2 * r + d;

                res.push({ label: 'Synthetic Division', value: '' });
                res.push({ label: 'Step 1', value: `\\text{Bring down } ${a}` });
                res.push({ label: 'Step 2', value: `${a} \\times ${r} + ${b} = ${c1}` });
                res.push({ label: 'Step 3', value: `${c1} \\times ${r} + ${c} = ${c2}` });
                res.push({ label: 'Step 4', value: `${c2} \\times ${r} + ${d} = ${remainder}` });

                res.push({ label: 'Quotient', value: `${c0}x^2 + ${c1}x + ${c2}` });
                res.push({ label: 'Remainder', value: `${remainder}` });

                res.push({
                    label: 'Verification',
                    value: `(x - ${r})(${c0}x^2 + ${c1}x + ${c2}) + ${remainder}`
                });
                break;
            }

            case 'form_quadratic': {
                const sum = parseFloat(valueX) || 0;
                const prod = parseFloat(valueY) || 0;

                res.push({ label: 'Given', value: `\\text{Sum } (\\alpha + \\beta) = ${sum}, \\text{ Product } (\\alpha\\beta) = ${prod}` });
                res.push({ label: 'Formula', value: `x^2 - (\\text{Sum})x + (\\text{Product}) = 0` });

                const middleTerm = sum >= 0 ? `- ${sum}x` : `+ ${Math.abs(sum)}x`;
                const endTerm = prod >= 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`;

                res.push({ label: 'Polynomial', value: `x^2 ${middleTerm} ${endTerm}` });
                break;
            }

            case 'algebraic_eval': {
                const sum = parseFloat(valueX) || 0;
                const prod = parseFloat(valueY) || 0;

                res.push({ label: 'Given', value: `x + y = ${sum}, xy = ${prod}` });

                const sqSum = sum * sum - 2 * prod;
                res.push({ label: '1. Find x^2 + y^2', value: `(x+y)^2 - 2xy = ${sqSum}` });

                const cubeSum = sum * sum * sum - 3 * prod * sum;
                res.push({ label: '2. Find x^3 + y^3', value: `(x+y)^3 - 3xy(x+y) = ${cubeSum}` });

                const diffSq = Math.pow(sum, 2) - 4 * prod;
                res.push({ label: '3. Find (x-y)^2', value: `(x+y)^2 - 4xy = ${diffSq}` });
                break;
            }

            case 'rational_roots': {
                res.push({ label: 'Polynomial', value: `${a}x^3 + ${b}x^2 + ${c}x + ${d}` });
                if (a === 0 || d === 0) {
                    res.push({ label: 'Note', value: 'Requires non-zero leading and constant terms.' });
                    break;
                }
                const factorsD: number[] = [];
                const absD = Math.abs(d);
                for (let i = 1; i <= absD; i++) { if (absD % i === 0) { factorsD.push(i); factorsD.push(-i); } }

                const factorsA: number[] = [];
                const absA = Math.abs(a);
                for (let i = 1; i <= absA; i++) { if (absA % i === 0) { factorsA.push(i); factorsA.push(-i); } }

                const potential = new Set<string>();
                factorsD.forEach(p => factorsA.forEach(q => potential.add((p / q).toFixed(2))));

                res.push({ label: 'Possible Roots', value: Array.from(potential).join(', ') });
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

                    {operation === 'expand_identity' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Identity</label>
                            <select
                                value={selectedIdentity}
                                onChange={(e) => setSelectedIdentity(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus"
                            >
                                {identities.map(id => <option key={id.id} value={id.id}>{id.label}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-xs text-muted-foreground">Polynomial: ax^3 + bx^2 + cx + d</p>

                        {(operation === 'evaluate' || operation === 'find_zeros' || operation === 'remainder_theorem' || operation === 'factor_theorem' || operation === 'factorize' || operation === 'division' || operation === 'rational_roots') && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium mb-1">a (x^3 coeff)</label>
                                    <input type="number" value={coeffA} onChange={(e) => setCoeffA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">b (x^2 coeff)</label>
                                    <input type="number" value={coeffB} onChange={(e) => setCoeffB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">c (x coeff)</label>
                                    <input type="number" value={coeffC} onChange={(e) => setCoeffC(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">d (constant)</label>
                                    <input type="number" value={coeffD} onChange={(e) => setCoeffD(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium mb-1">x value</label>
                                <input type="number" value={valueX} onChange={(e) => setValueX(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">y value</label>
                                <input type="number" value={valueY} onChange={(e) => setValueY(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">z value</label>
                                <input type="number" value={valueZ} onChange={(e) => setValueZ(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                        </div>

                        {(operation === 'form_quadratic' || operation === 'algebraic_eval') && (
                            <div className="text-xs text-muted-foreground mt-2">
                                <p>Use &quot;x value&quot; for Sum/First, &quot;y value&quot; for Product/Second.</p>
                            </div>
                        )}
                    </div>

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Calculate
                    </button>
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
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <p className="text-muted-foreground">Select an operation and enter values.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
