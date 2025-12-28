'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'basic_probability'
    | 'conditional'
    | 'addition_theorem'
    | 'multiplication'
    | 'bayes'
    | 'binomial'
    | 'expected_value';

const operations = [
    { id: 'basic_probability' as Operation, label: 'Basic Probability' },
    { id: 'conditional' as Operation, label: 'Conditional Probability' },
    { id: 'addition_theorem' as Operation, label: 'Addition Theorem' },
    { id: 'multiplication' as Operation, label: 'Multiplication Rule' },
    { id: 'bayes' as Operation, label: "Bayes' Theorem" },
    { id: 'binomial' as Operation, label: 'Binomial Distribution' },
    { id: 'expected_value' as Operation, label: 'Expected Value' },
];

export function ProbabilitySolver() {
    const [operation, setOperation] = useState<Operation>('basic_probability');
    const [favorable, setFavorable] = useState('3');
    const [total, setTotal] = useState('10');
    const [pA, setPA] = useState('0.4');
    const [pB, setPB] = useState('0.3');
    const [pAB, setPAB] = useState('0.12');
    const [pBgivenA, setPBgivenA] = useState('0.3');
    const [n, setN] = useState('10');
    const [r, setR] = useState('3');
    const [p, setP] = useState('0.5');
    const [values, setValues] = useState('1,2,3,4,5');
    const [probs, setProbs] = useState('0.1,0.2,0.3,0.25,0.15');
    const [results, setResults] = useState<{ label: string; value: string }[] | null>(null);

    const factorial = (n: number): number => {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    };

    const nCr = (n: number, r: number): number => {
        if (r > n || r < 0) return 0;
        return factorial(n) / (factorial(r) * factorial(n - r));
    };

    const calculate = () => {
        const res: { label: string; value: string }[] = [];

        switch (operation) {
            case 'basic_probability': {
                const fav = parseFloat(favorable) || 0;
                const tot = parseFloat(total) || 1;

                const prob = fav / tot;
                const compProb = 1 - prob;

                res.push({ label: 'Favorable Outcomes', value: `n(E) = ${fav}` });
                res.push({ label: 'Total Outcomes', value: `n(S) = ${tot}` });
                res.push({ label: 'Formula', value: `P(E) = \\frac{n(E)}{n(S)}` });
                res.push({ label: 'Probability P(E)', value: `\\frac{${fav}}{${tot}} = ${prob.toFixed(6)}` });
                res.push({ label: 'Complement P(E\')', value: `1 - P(E) = 1 - ${prob.toFixed(6)} = ${compProb.toFixed(6)}` });

                // Odds
                if (fav > 0 && tot > fav) {
                    res.push({ label: 'Odds in favor', value: `${fav} : ${tot - fav}` });
                    res.push({ label: 'Odds against', value: `${tot - fav} : ${fav}` });
                }
                break;
            }

            case 'conditional': {
                const pa = parseFloat(pA) || 0;
                const pab = parseFloat(pAB) || 0;
                const pb = parseFloat(pB) || 0;

                res.push({ label: 'Given', value: `P(A) = ${pa}, P(B) = ${pb}, P(A \\cap B) = ${pab}` });
                res.push({ label: 'Formula', value: `P(A|B) = \\frac{P(A \\cap B)}{P(B)}` });

                if (pb > 0) {
                    const pAgivenB = pab / pb;
                    res.push({ label: 'P(A|B)', value: `\\frac{${pab}}{${pb}} = ${pAgivenB.toFixed(6)}` });
                }

                if (pa > 0) {
                    const pBgivenA = pab / pa;
                    res.push({ label: 'P(B|A)', value: `\\frac{${pab}}{${pa}} = ${pBgivenA.toFixed(6)}` });
                }

                // Check independence
                const productTest = pa * pb;
                res.push({ label: 'Independence Check', value: `P(A) \\times P(B) = ${pa} \\times ${pb} = ${productTest.toFixed(6)}` });
                if (Math.abs(productTest - pab) < 0.0001) {
                    res.push({ label: 'Conclusion', value: `\\text{Events are INDEPENDENT since } P(A)P(B) = P(A \\cap B)` });
                } else {
                    res.push({ label: 'Conclusion', value: `\\text{Events are DEPENDENT since } P(A)P(B) \\neq P(A \\cap B)` });
                }
                break;
            }

            case 'addition_theorem': {
                const pa = parseFloat(pA) || 0;
                const pb = parseFloat(pB) || 0;
                const pab = parseFloat(pAB) || 0;

                res.push({ label: 'Given', value: `P(A) = ${pa}, P(B) = ${pb}, P(A \\cap B) = ${pab}` });
                res.push({ label: 'Addition Theorem', value: `P(A \\cup B) = P(A) + P(B) - P(A \\cap B)` });

                const pAorB = pa + pb - pab;
                res.push({ label: 'P(A \\cup B)', value: `${pa} + ${pb} - ${pab} = ${pAorB.toFixed(6)}` });

                // Mutually exclusive case
                res.push({ label: 'If Mutually Exclusive', value: `P(A \\cap B) = 0 \\Rightarrow P(A \\cup B) = P(A) + P(B) = ${pa + pb}` });

                // Neither A nor B
                const pNeither = 1 - pAorB;
                res.push({ label: 'P(neither A nor B)', value: `1 - P(A \\cup B) = 1 - ${pAorB.toFixed(6)} = ${pNeither.toFixed(6)}` });
                break;
            }

            case 'multiplication': {
                const pa = parseFloat(pA) || 0;
                const pbGivenA = parseFloat(pBgivenA) || 0;

                res.push({ label: 'Given', value: `P(A) = ${pa}, P(B|A) = ${pbGivenA}` });
                res.push({ label: 'Multiplication Rule', value: `P(A \\cap B) = P(A) \\times P(B|A)` });

                const pAandB = pa * pbGivenA;
                res.push({ label: 'P(A \\cap B)', value: `${pa} \\times ${pbGivenA} = ${pAandB.toFixed(6)}` });

                // For independent events
                res.push({ label: 'For Independent Events', value: `P(A \\cap B) = P(A) \\times P(B)` });
                break;
            }

            case 'bayes': {
                const pa = parseFloat(pA) || 0;
                const pNotA = 1 - pa;
                const pbGivenA = parseFloat(pBgivenA) || 0;
                const pbGivenNotA = parseFloat(pB) || 0; // Using pB field for P(B|A')

                res.push({ label: 'Prior Probabilities', value: `P(A) = ${pa}, P(A') = ${pNotA}` });
                res.push({ label: 'Likelihoods', value: `P(B|A) = ${pbGivenA}, P(B|A') = ${pbGivenNotA}` });

                // Total probability of B
                const pBTotal = pa * pbGivenA + pNotA * pbGivenNotA;
                res.push({ label: 'Total Probability P(B)', value: `P(A)P(B|A) + P(A')P(B|A') = ${pa}(${pbGivenA}) + ${pNotA}(${pbGivenNotA}) = ${pBTotal.toFixed(6)}` });

                // Bayes' theorem
                res.push({ label: "Bayes' Theorem", value: `P(A|B) = \\frac{P(A)P(B|A)}{P(B)}` });

                if (pBTotal > 0) {
                    const pAgivenB = (pa * pbGivenA) / pBTotal;
                    res.push({ label: 'P(A|B)', value: `\\frac{${pa}(${pbGivenA})}{${pBTotal.toFixed(6)}} = ${pAgivenB.toFixed(6)}` });

                    const pNotAgivenB = (pNotA * pbGivenNotA) / pBTotal;
                    res.push({ label: "P(A'|B)", value: `\\frac{${pNotA}(${pbGivenNotA})}{${pBTotal.toFixed(6)}} = ${pNotAgivenB.toFixed(6)}` });
                }
                break;
            }

            case 'binomial': {
                const nVal = parseInt(n) || 10;
                const rVal = parseInt(r) || 3;
                const pVal = parseFloat(p) || 0.5;
                const qVal = 1 - pVal;

                res.push({ label: 'Parameters', value: `n = ${nVal}, r = ${rVal}, p = ${pVal}, q = ${qVal}` });
                res.push({ label: 'Binomial Formula', value: `P(X = r) = \\binom{n}{r} p^r q^{n-r}` });

                const coeff = nCr(nVal, rVal);
                const prob = coeff * Math.pow(pVal, rVal) * Math.pow(qVal, nVal - rVal);

                res.push({ label: '\\binom{n}{r}', value: `\\binom{${nVal}}{${rVal}} = ${coeff}` });
                res.push({ label: 'P(X = ' + rVal + ')', value: `${coeff} \\times (${pVal})^{${rVal}} \\times (${qVal})^{${nVal - rVal}} = ${prob.toFixed(6)}` });

                // Mean and variance
                const mean = nVal * pVal;
                const variance = nVal * pVal * qVal;
                const sd = Math.sqrt(variance);

                res.push({ label: 'Mean E(X)', value: `np = ${nVal} \\times ${pVal} = ${mean}` });
                res.push({ label: 'Variance Var(X)', value: `npq = ${nVal} \\times ${pVal} \\times ${qVal} = ${variance.toFixed(6)}` });
                res.push({ label: 'Standard Deviation', value: `\\sqrt{npq} = ${sd.toFixed(6)}` });
                break;
            }

            case 'expected_value': {
                const vals = values.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                const probabilities = probs.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));

                if (vals.length !== probabilities.length || vals.length === 0) {
                    res.push({ label: 'Error', value: 'Values and probabilities must have same count' });
                    break;
                }

                const probSum = probabilities.reduce((a, b) => a + b, 0);
                res.push({ label: 'Sum of Probabilities', value: `\\sum P(x_i) = ${probSum.toFixed(6)}` });

                if (Math.abs(probSum - 1) > 0.01) {
                    res.push({ label: 'Warning', value: 'Probabilities should sum to 1' });
                }

                // E(X)
                let expectedValue = 0;
                let expStr = '';
                for (let i = 0; i < vals.length; i++) {
                    expectedValue += vals[i] * probabilities[i];
                    expStr += `(${vals[i]})(${probabilities[i]})${i < vals.length - 1 ? ' + ' : ''}`;
                }

                res.push({ label: 'E(X) = \\sum x_i P(x_i)', value: expStr });
                res.push({ label: 'Expected Value E(X)', value: `= ${expectedValue.toFixed(6)}` });

                // E(X^2)
                let eX2 = 0;
                for (let i = 0; i < vals.length; i++) {
                    eX2 += vals[i] * vals[i] * probabilities[i];
                }
                res.push({ label: 'E(X^2)', value: `= ${eX2.toFixed(6)}` });

                // Variance
                const variance = eX2 - expectedValue * expectedValue;
                res.push({ label: 'Var(X) = E(X^2) - [E(X)]^2', value: `${eX2.toFixed(6)} - (${expectedValue.toFixed(4)})^2 = ${variance.toFixed(6)}` });
                res.push({ label: 'Standard Deviation', value: `\\sigma = ${Math.sqrt(variance).toFixed(6)}` });
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
                        {operation === 'basic_probability' && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Favorable Outcomes</label>
                                    <input type="number" value={favorable} onChange={(e) => setFavorable(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Total Outcomes</label>
                                    <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
                        )}

                        {(operation === 'conditional' || operation === 'addition_theorem') && (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs mb-1">P(A)</label>
                                        <input type="number" step="0.01" value={pA} onChange={(e) => setPA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">P(B)</label>
                                        <input type="number" step="0.01" value={pB} onChange={(e) => setPB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">P(A and B)</label>
                                    <input type="number" step="0.01" value={pAB} onChange={(e) => setPAB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
                        )}

                        {(operation === 'multiplication' || operation === 'bayes') && (
                            <>
                                <div>
                                    <label className="block text-xs mb-1">P(A)</label>
                                    <input type="number" step="0.01" value={pA} onChange={(e) => setPA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">P(B|A)</label>
                                    <input type="number" step="0.01" value={pBgivenA} onChange={(e) => setPBgivenA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                {operation === 'bayes' && (
                                    <div>
                                        <label className="block text-xs mb-1">P(B|A&apos;)</label>
                                        <input type="number" step="0.01" value={pB} onChange={(e) => setPB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                )}
                            </>
                        )}

                        {operation === 'binomial' && (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs mb-1">n (trials)</label>
                                        <input type="number" value={n} onChange={(e) => setN(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">r (successes)</label>
                                        <input type="number" value={r} onChange={(e) => setR(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">p (success prob)</label>
                                    <input type="number" step="0.01" value={p} onChange={(e) => setP(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
                        )}

                        {operation === 'expected_value' && (
                            <>
                                <div>
                                    <label className="block text-xs mb-1">Values (comma-separated)</label>
                                    <input type="text" value={values} onChange={(e) => setValues(e.target.value)} placeholder="1,2,3,4,5" className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Probabilities (comma-separated)</label>
                                    <input type="text" value={probs} onChange={(e) => setProbs(e.target.value)} placeholder="0.1,0.2,0.3,0.25,0.15" className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
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
