'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'classify'
    | 'rationalize'
    | 'rationalize_threeterm'
    | 'exponent_simplify'
    | 'surd_simplify'
    | 'nested_radical'
    | 'decimal_to_fraction'
    | 'hcf_lcm'
    | 'prime_factorization'
    | 'algebraic_id';

const operations = [
    { id: 'classify' as Operation, label: 'Classify Number' },
    { id: 'rationalize' as Operation, label: 'Rationalize Denominator (2 Terms)' },
    { id: 'rationalize_threeterm' as Operation, label: 'Rationalize Denominator (3 Terms)' },
    { id: 'exponent_simplify' as Operation, label: 'Simplify Exponents' },
    { id: 'surd_simplify' as Operation, label: 'Simplify Surds' },
    { id: 'nested_radical' as Operation, label: 'Simplify Nested Radical' },
    { id: 'algebraic_id' as Operation, label: 'Algebraic Identities (x + 1/x)' },
    { id: 'decimal_to_fraction' as Operation, label: 'Decimal to Fraction' },
    { id: 'hcf_lcm' as Operation, label: 'HCF and LCM' },
    { id: 'prime_factorization' as Operation, label: 'Prime Factorization' },
];

export function NumberSystemsSolver() {
    const [operation, setOperation] = useState<Operation>('classify');
    const [inputNumber, setInputNumber] = useState('');
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');
    const [inputC, setInputC] = useState('');
    const [base, setBase] = useState('2');
    const [exponent, setExponent] = useState('5');
    const [results, setResults] = useState<{ label: string; value: string; step?: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string; step?: string }[] = [];

        switch (operation) {
            case 'classify': {
                const num = inputNumber.trim();
                if (!num) return;

                const isInteger = /^-?\d+$/.test(num);
                const isFraction = /^-?\d+\/\d+$/.test(num);
                const isTerminating = /^-?\d+\.\d+$/.test(num) && !num.includes('...');
                const knownIrrationals = ['sqrt(2)', 'sqrt(3)', 'sqrt(5)', 'pi', 'e'];
                const isKnownIrrational = knownIrrationals.some(ir => num.toLowerCase().includes(ir));

                res.push({ label: 'Input', value: num });

                if (isInteger) {
                    const n = parseInt(num);
                    res.push({ label: 'Classification', value: 'Integer (Z)' });
                    if (n > 0) {
                        res.push({ label: 'Subset', value: 'Natural Number (N), Whole Number (W), Positive Integer' });
                    } else if (n === 0) {
                        res.push({ label: 'Subset', value: 'Whole Number (W), Zero' });
                    } else {
                        res.push({ label: 'Subset', value: 'Negative Integer' });
                    }
                    res.push({ label: 'Rational/Irrational', value: `Rational (can be written as \\frac{${n}}{1})` });
                } else if (isFraction) {
                    res.push({ label: 'Classification', value: 'Rational Number (Q)' });
                    res.push({ label: 'Form', value: `\\frac{p}{q} \\text{ where } p, q \\in \\mathbb{Z}, q \\neq 0` });
                } else if (isTerminating) {
                    const parts = num.split('.');
                    const decimals = parts[1].length;
                    const numerator = parseInt(num.replace('.', ''));
                    const denominator = Math.pow(10, decimals);
                    res.push({ label: 'Classification', value: 'Rational Number (Terminating Decimal)' });
                    res.push({ label: 'Fraction Form', value: `\\frac{${numerator}}{${denominator}}` });
                } else if (isKnownIrrational) {
                    res.push({ label: 'Classification', value: 'Irrational Number' });
                    res.push({ label: 'Property', value: 'Non-terminating, non-repeating decimal expansion' });
                    res.push({ label: 'Note', value: 'Cannot be expressed as \\frac{p}{q}' });
                } else {
                    res.push({ label: 'Classification', value: 'Real Number (R)' });
                    res.push({ label: 'Note', value: 'Enter specific format for detailed classification' });
                }
                break;
            }

            case 'rationalize': {
                const a = parseFloat(inputA) || 0;
                const b = parseFloat(inputB) || 0;

                if (a <= 0 || b <= 0) {
                    res.push({ label: 'Error', value: 'Enter positive values for a and b' });
                    break;
                }

                res.push({ label: 'Expression', value: `\\frac{1}{\\sqrt{${a}} + \\sqrt{${b}}}` });
                res.push({
                    label: 'Step 1: Multiply by Conjugate',
                    value: `\\frac{1}{\\sqrt{${a}} + \\sqrt{${b}}} \\times \\frac{\\sqrt{${a}} - \\sqrt{${b}}}{\\sqrt{${a}} - \\sqrt{${b}}}`
                });
                res.push({
                    label: 'Step 2: Simplify Denominator',
                    value: `\\frac{\\sqrt{${a}} - \\sqrt{${b}}}{(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2} = \\frac{\\sqrt{${a}} - \\sqrt{${b}}}{${a} - ${b}}`
                });

                const diff = a - b;
                res.push({
                    label: 'Final Result',
                    value: diff === 1 ? `\\sqrt{${a}} - \\sqrt{${b}}` : `\\frac{\\sqrt{${a}} - \\sqrt{${b}}}{${diff}}`
                });
                break;
            }

            case 'rationalize_threeterm': {
                const a = parseFloat(inputA) || 0;
                const b = parseFloat(inputB) || 0;
                const c = parseFloat(inputC) || 0;

                if (a <= 0 || b <= 0 || c <= 0) {
                    res.push({ label: 'Error', value: 'Enter positive values for a, b, and c' });
                    break;
                }

                res.push({ label: 'Expression', value: `\\frac{1}{\\sqrt{${a}} + \\sqrt{${b}} + \\sqrt{${c}}}` });
                res.push({ label: 'Method', value: 'Group terms and multiply by conjugate twice.' });

                // Group as (sqrt(a) + sqrt(b)) + sqrt(c)
                res.push({
                    label: 'Step 1: Group Terms',
                    value: `\\frac{1}{(\\sqrt{${a}} + \\sqrt{${b}}) + \\sqrt{${c}}}`
                });
                res.push({
                    label: 'Step 2: Multiply by Conjugate',
                    value: `\\frac{(\\sqrt{${a}} + \\sqrt{${b}}) - \\sqrt{${c}}}{((\\sqrt{${a}} + \\sqrt{${b}}) + \\sqrt{${c}})((\\sqrt{${a}} + \\sqrt{${b}}) - \\sqrt{${c}})}`
                });
                const denomStep2 = `(\\sqrt{${a}} + \\sqrt{${b}})^2 - usage(\\sqrt{${c}})^2 = (${a} + ${b} + 2\\sqrt{${a * b}}) - ${c} = ${a + b - c} + 2\\sqrt{${a * b}}`;
                res.push({
                    label: 'Step 3: Simplify Denominator',
                    value: denomStep2
                });
                res.push({
                    label: 'Note',
                    value: 'Further simplification requires rationalizing the new denominator again. This demonstrates the advanced technique.'
                });
                break;
            }

            case 'nested_radical': {
                const a = parseFloat(inputA) || 0; // The integer part
                const b = parseFloat(inputB) || 0; // The number inside inner root
                // standard form sqrt(a + sqrt(b))

                res.push({ label: 'Expression', value: `\\sqrt{${a} + \\sqrt{${b}}}` });

                // Check if it fits form sqrt(x + y + 2sqrt(xy)) = sqrt(x) + sqrt(y)
                // We need to transform sqrt(b) into 2*sqrt(k). So b must be divisible by 4.
                if (b % 4 === 0) {
                    const k = b / 4;
                    // Find two numbers that sum to a and multiply to k
                    // x + y = a, xy = k
                    // Quadratic: t^2 - at + k = 0
                    const D = a * a - 4 * k;
                    if (D >= 0) {
                        const sqrtD = Math.sqrt(D);
                        if (Number.isInteger(sqrtD)) {
                            const x = (a + sqrtD) / 2;
                            const y = (a - sqrtD) / 2;
                            res.push({ label: 'Step 1: Transform', value: `\\sqrt{${a} + 2\\sqrt{${k}}}` });
                            res.push({ label: 'Step 2: Identify factors', value: `Find x, y such that x+y=${a} and xy=${k}. We find ${x} and ${y}.` });
                            res.push({ label: 'Step 3: Apply Identity', value: `\\sqrt{(\\sqrt{${x}} + \\sqrt{${y}})^2} = \\sqrt{${x}} + \\sqrt{${y}}` });
                            res.push({ label: 'Final Result', value: `\\sqrt{${x}} + \\sqrt{${y}}` });
                        } else {
                            res.push({ label: 'Result', value: 'Cannot be simplified to simple surds (discriminant is not a perfect square).' });
                        }
                    } else {
                        res.push({ label: 'Result', value: 'No real solution for decomposition.' });
                    }
                } else {
                    res.push({ label: 'Method', value: 'Try to express inner root as 2\\sqrt{k}' });
                    res.push({ label: 'Result', value: `Cannot simplify easily: ${b} is not divisible by 4 to extract a 2.` });
                }
                break;
            }

            case 'algebraic_id': {
                const a = parseFloat(inputA) || 0;
                const b = parseFloat(inputB) || 0;
                // x = a + sqrt(b)

                if (a === 0 && b === 0) {
                    res.push({ label: 'Error', value: 'Enter valid values' });
                    break;
                }

                res.push({ label: 'Given', value: `x = ${a} + \\sqrt{${b}}` });

                // Calculate 1/x
                const denom = a * a - b;
                res.push({ label: 'Step 1: Find 1/x', value: `\\frac{1}{x} = \\frac{1}{${a} + \\sqrt{${b}}} = \\frac{${a} - \\sqrt{${b}}}{${a}^2 - (\\sqrt{${b}})^2} = \\frac{${a} - \\sqrt{${b}}}{${denom}}` });

                let oneOverX_val = `\\frac{${a} - \\sqrt{${b}}}{${denom}}`;


                if (denom === 1) {
                    oneOverX_val = `${a} - \\sqrt{${b}}`;
                    res.push({ label: 'Simplified 1/x', value: oneOverX_val });

                    // x + 1/x
                    // (a + sqrt(b)) + (a - sqrt(b)) = 2a
                    const sum = 2 * a;
                    res.push({ label: 'Step 2: Find x + 1/x', value: `(${a} + \\sqrt{${b}}) + (${a} - \\sqrt{${b}}) = ${sum}` });

                    // x^2 + 1/x^2 = (x+1/x)^2 - 2
                    const sqSum = sum * sum - 2;
                    res.push({ label: 'Step 3: Find x^2 + 1/x^2', value: `(x + \\frac{1}{x})^2 - 2 = ${sum}^2 - 2 = ${sqSum}` });

                    // x^3 + 1/x^3 = (x+1/x)^3 - 3(x+1/x)
                    const cubeSum = Math.pow(sum, 3) - 3 * sum;
                    res.push({ label: 'Step 4: Find x^3 + 1/x^3', value: `(x + \\frac{1}{x})^3 - 3(x + \\frac{1}{x}) = ${sum}^3 - 3(${sum}) = ${cubeSum}` });
                } else {
                    res.push({ label: 'Note', value: `Since denominator is ${denom} (not 1), calculations are more complex fractions.` });
                    // Could implement full fraction logic, but keep simple for now
                }
                break;
            }

            case 'exponent_simplify': {
                const b = parseFloat(base) || 2;
                const e = parseFloat(exponent) || 1;

                res.push({ label: 'Expression', value: `${b}^{${e}}` });
                res.push({ label: 'Result', value: `${Math.pow(b, e)}` });

                res.push({ label: 'Law 1: Multiplication', value: `a^m \\times a^n = a^{m+n}` });
                res.push({ label: 'Law 2: Division', value: `\\frac{a^m}{a^n} = a^{m-n}` });
                res.push({ label: 'Law 3: Power of Power', value: `(a^m)^n = a^{mn}` });
                res.push({ label: 'Law 4: Product Rule', value: `a^m \\times b^m = (ab)^m` });
                res.push({ label: 'Law 5: Zero Exponent', value: `a^0 = 1 \\text{ (for } a \\neq 0\\text{)}` });
                res.push({ label: 'Law 6: Negative Exponent', value: `a^{-n} = \\frac{1}{a^n}` });
                res.push({ label: 'Law 7: Fractional Exponent', value: `a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m` });
                break;
            }

            case 'surd_simplify': {
                const n = parseFloat(inputNumber) || 0;
                if (n <= 0) {
                    res.push({ label: 'Error', value: 'Enter a positive number' });
                    break;
                }

                let largestSquare = 1;
                let remaining = n;
                for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
                    if (n % (i * i) === 0) {
                        largestSquare = i * i;
                        remaining = n / largestSquare;
                        break;
                    }
                }

                res.push({ label: 'Expression', value: `\\sqrt{${n}}` });

                if (largestSquare > 1) {
                    res.push({
                        label: 'Step 1: Factor',
                        value: `\\sqrt{${n}} = \\sqrt{${largestSquare} \\times ${remaining}}`
                    });
                    res.push({
                        label: 'Step 2: Separate',
                        value: `= \\sqrt{${largestSquare}} \\times \\sqrt{${remaining}}`
                    });
                    res.push({
                        label: 'Step 3: Simplify',
                        value: `= ${Math.sqrt(largestSquare)}\\sqrt{${remaining}}`
                    });
                } else {
                    res.push({ label: 'Result', value: `\\sqrt{${n}} \\text{ is already in simplest form}` });
                }

                res.push({ label: 'Decimal Value', value: `\\approx ${Math.sqrt(n).toFixed(6)}` });
                break;
            }

            case 'decimal_to_fraction': {
                const decimal = inputNumber.trim();
                if (!decimal) return;

                if (decimal.includes('...') || decimal.includes('(')) {
                    const cleanDecimal = decimal.replace('...', '').replace('(', '').replace(')', '');
                    const parts = cleanDecimal.split('.');
                    const repeating = parts[1] || '';

                    res.push({ label: 'Input', value: `0.\\overline{${repeating}}` });
                    res.push({ label: 'Step 1: Let x =', value: `0.${repeating}${repeating}...` });

                    const multiplier = Math.pow(10, repeating.length);
                    res.push({ label: `Step 2: Multiply by ${multiplier}`, value: `${multiplier}x = ${repeating}.${repeating}...` });
                    res.push({ label: 'Step 3: Subtract', value: `${multiplier}x - x = ${repeating}` });
                    res.push({ label: 'Step 4: Solve', value: `${multiplier - 1}x = ${repeating}` });
                    res.push({ label: 'Result', value: `x = \\frac{${repeating}}{${multiplier - 1}}` });
                } else {
                    const num = parseFloat(decimal);
                    if (isNaN(num)) return;

                    const parts = decimal.split('.');
                    if (parts.length === 2) {
                        const decimals = parts[1].length;
                        const numerator = parseInt(decimal.replace('.', ''));
                        const denominator = Math.pow(10, decimals);

                        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
                        const g = gcd(Math.abs(numerator), denominator);

                        res.push({ label: 'Input', value: decimal });
                        res.push({ label: 'Step 1: Write as fraction', value: `\\frac{${numerator}}{${denominator}}` });
                        res.push({ label: 'Step 2: Find GCD', value: `\\gcd(${Math.abs(numerator)}, ${denominator}) = ${g}` });
                        res.push({ label: 'Step 3: Simplify', value: `\\frac{${numerator / g}}{${denominator / g}}` });
                    }
                }
                break;
            }

            case 'hcf_lcm': {
                const a = parseInt(inputA) || 0;
                const b = parseInt(inputB) || 0;

                if (a <= 0 || b <= 0) {
                    res.push({ label: 'Error', value: 'Enter two positive integers' });
                    break;
                }

                const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
                const hcf = gcd(a, b);
                const lcm = (a * b) / hcf;

                res.push({ label: 'Numbers', value: `${a} \\text{ and } ${b}` });

                let x = Math.max(a, b);
                let y = Math.min(a, b);
                let stepNum = 1;
                res.push({ label: 'Euclidean Algorithm', value: '' });
                while (y !== 0) {
                    const remainder = x % y;
                    res.push({ label: `Step ${stepNum}`, value: `${x} = ${Math.floor(x / y)} \\times ${y} + ${remainder}` });
                    x = y;
                    y = remainder;
                    stepNum++;
                }

                res.push({ label: 'HCF (GCD)', value: `${hcf}` });
                res.push({ label: 'LCM', value: `${lcm}` });
                res.push({ label: 'Relationship', value: `\\text{HCF} \\times \\text{LCM} = ${a} \\times ${b} = ${a * b}` });
                res.push({ label: 'Verification', value: `${hcf} \\times ${lcm} = ${hcf * lcm}` });
                break;
            }

            case 'prime_factorization': {
                const n = parseInt(inputNumber) || 0;

                if (n <= 1) {
                    res.push({ label: 'Error', value: 'Enter an integer greater than 1' });
                    break;
                }

                const factors: number[] = [];
                let temp = n;
                let divisor = 2;

                while (temp > 1) {
                    while (temp % divisor === 0) {
                        factors.push(divisor);
                        temp = temp / divisor;
                    }
                    divisor++;
                }

                res.push({ label: 'Number', value: `${n}` });

                temp = n;
                let stepNum = 1;
                for (const factor of factors) {
                    res.push({ label: `Step ${stepNum}`, value: `${temp} \\div ${factor} = ${temp / factor}` });
                    temp = temp / factor;
                    stepNum++;
                }

                const factorCount: { [key: number]: number } = {};
                factors.forEach(f => factorCount[f] = (factorCount[f] || 0) + 1);

                const factorization = Object.entries(factorCount)
                    .map(([base, exp]) => exp === 1 ? base : `${base}^{${exp}}`)
                    .join(' \\times ');

                res.push({ label: 'Prime Factorization', value: `${n} = ${factorization}` });
                res.push({ label: 'Prime Factors', value: `\\{${Array.from(new Set(factors)).join(', ')}\\}` });
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
                        {(operation === 'classify' || operation === 'surd_simplify' || operation === 'decimal_to_fraction' || operation === 'prime_factorization') && (
                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    {operation === 'decimal_to_fraction' ? 'Decimal (use ... for repeating)' : 'Number'}
                                </label>
                                <input
                                    type="text"
                                    value={inputNumber}
                                    onChange={(e) => setInputNumber(e.target.value)}
                                    placeholder={operation === 'decimal_to_fraction' ? '0.333... or 0.125' : 'Enter number'}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus"
                                />
                            </div>
                        )}

                        {(operation === 'rationalize' || operation === 'hcf_lcm' || operation === 'nested_radical' || operation === 'algebraic_id') && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {operation === 'rationalize' || operation === 'nested_radical' || operation === 'algebraic_id' ? 'Part A (Integer/First Term)' : 'First Number'}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputA}
                                        onChange={(e) => setInputA(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">
                                        {operation === 'rationalize' || operation === 'nested_radical' || operation === 'algebraic_id' ? 'Part B (Number inside sqrt)' : 'Second Number'}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputB}
                                        onChange={(e) => setInputB(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus"
                                    />
                                </div>
                            </>
                        )}

                        {(operation === 'rationalize_threeterm') && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">First Term (sqrt(a))</label><input type="number" value={inputA} onChange={(e) => setInputA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Second Term (sqrt(b))</label><input type="number" value={inputB} onChange={(e) => setInputB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Third Term (sqrt(c))</label><input type="number" value={inputC} onChange={(e) => setInputC(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}

                        {operation === 'exponent_simplify' && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">Base</label><input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Exponent</label><input type="number" value={exponent} onChange={(e) => setExponent(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}
                    </div>

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Calculate
                    </button>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">Quick Reference:</p>
                        <p>N = Natural Numbers: 1, 2, 3, ...</p>
                        <p>W = Whole Numbers: 0, 1, 2, ...</p>
                        <p>Z = Integers: ..., -2, -1, 0, 1, 2, ...</p>
                        <p>Q = Rational Numbers: p/q form (p, q ∈ Z, q ≠ 0)</p>
                        <p>R = Real Numbers: Q ∪ Irrational</p>
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
                        <p className="text-muted-foreground">Select an operation and enter values to see detailed step-by-step solutions.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
