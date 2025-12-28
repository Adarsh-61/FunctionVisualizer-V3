'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type StatMode = 'ungrouped' | 'grouped';

export function StatisticsSolver() {
    const [mode, setMode] = useState<StatMode>('ungrouped');
    const [input, setInput] = useState('10, 20, 36, 92, 95, 40, 50, 56, 60, 70');

    // Grouped Data Inputs
    const [classes, setClasses] = useState('0-10, 10-20, 20-30, 30-40, 40-50');
    const [frequencies, setFrequencies] = useState('5, 8, 15, 12, 10');

    const [results, setResults] = useState<{ label: string; value: string; step?: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string; step?: string }[] = [];

        if (mode === 'ungrouped') {
            try {
                const arr = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b);
                if (arr.length === 0) return;

                const n = arr.length;
                const sum = arr.reduce((acc, curr) => acc + curr, 0);
                const mean = sum / n;

                // Median
                let median;
                let medianStep;
                if (n % 2 === 1) {
                    median = arr[Math.floor(n / 2)];
                    medianStep = `n=${n} (odd) \\implies \\text{middle term}`;
                } else {
                    const m1 = arr[n / 2 - 1];
                    const m2 = arr[n / 2];
                    median = (m1 + m2) / 2;
                    medianStep = `n=${n} (even) \\implies \\text{average of } ${m1} \\text{ and } ${m2}`;
                }

                // Mode
                const counts: Record<number, number> = {};
                arr.forEach((x) => counts[x] = (counts[x] || 0) + 1);
                let maxFreq = 0;
                let modes: number[] = [];
                for (const k in counts) {
                    if (counts[k] > maxFreq) {
                        maxFreq = counts[k];
                        modes = [parseFloat(k)];
                    } else if (counts[k] === maxFreq) {
                        modes.push(parseFloat(k));
                    }
                }
                const modeStr = maxFreq > 1 ? modes.join(', ') : 'No unique mode';

                // Variance/StdDev
                const variance = arr.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / n;
                const stdDev = Math.sqrt(variance);

                res.push({ label: 'Count (n)', value: `${n}` });
                res.push({ label: 'Sorted Data', value: arr.join(', ') });
                res.push({ label: 'Mean', value: `\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}} = ${mean.toFixed(2)}` });
                res.push({ label: 'Median', value: `Median = ${median}`, step: medianStep });
                res.push({ label: 'Mode', value: `${modeStr} (Freq: ${maxFreq > 1 ? maxFreq : 1})` });
                res.push({ label: 'Standard Deviation', value: `\\sigma = \\sqrt{\\frac{\\sum(x_i-\\bar{x})^2}{n}} \\approx ${stdDev.toFixed(2)}` });
            } catch {
                // Ignore error
            }
        } else {
            // Grouped Data Logic
            try {
                const classArr = classes.split(',').map(s => s.trim().split('-').map(Number));
                const freqArr = frequencies.split(',').map(Number);

                if (classArr.length !== freqArr.length) {
                    res.push({ label: 'Error', value: 'Number of classes and frequencies must match.' });
                    setResults(res);
                    return;
                }

                const n = freqArr.reduce((a, b) => a + b, 0);
                let sumFX = 0;
                const midPoints = [];
                const cf = [];
                let currentCF = 0;

                for (let i = 0; i < classArr.length; i++) {
                    const [lower, upper] = classArr[i];
                    if (isNaN(lower) || isNaN(upper)) {
                        res.push({ label: 'Error', value: 'Invalid class format. Use format "0-10, 10-20"' });
                        setResults(res);
                        return;
                    }
                    const mid = (lower + upper) / 2;
                    midPoints.push(mid);
                    sumFX += mid * freqArr[i];
                    currentCF += freqArr[i];
                    cf.push(currentCF);
                }

                const mean = sumFX / n;
                res.push({ label: 'Total Frequency (N)', value: `${n}` });
                res.push({ label: 'Mean (Direct Method)', value: `\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\frac{${sumFX}}{${n}} = ${mean.toFixed(2)}` });

                // Mode Class
                let maxF = -1;
                let modeIdx = -1;
                for (let i = 0; i < freqArr.length; i++) {
                    if (freqArr[i] > maxF) {
                        maxF = freqArr[i];
                        modeIdx = i;
                    }
                }
                const l = classArr[modeIdx][0];
                const h = classArr[modeIdx][1] - classArr[modeIdx][0];
                const f1 = freqArr[modeIdx];
                const f0 = modeIdx > 0 ? freqArr[modeIdx - 1] : 0;
                const f2 = modeIdx < freqArr.length - 1 ? freqArr[modeIdx + 1] : 0;

                const modeVal = l + ((f1 - f0) / (2 * f1 - f0 - f2)) * h;
                res.push({ label: 'Modal Class', value: `${classArr[modeIdx][0]} - ${classArr[modeIdx][1]}` });
                res.push({ label: 'Mode', value: `l + \\left(\\frac{f_1-f_0}{2f_1-f_0-f_2}\\right) \\times h = ${l} + \\left(\\frac{${f1}-${f0}}{2(${f1})-${f0}-${f2}}\\right) \\times ${h} = ${modeVal.toFixed(2)}` });

                // Median Class
                const nby2 = n / 2;
                let medianIdx = -1;
                for (let i = 0; i < cf.length; i++) {
                    if (cf[i] >= nby2) {
                        medianIdx = i;
                        break;
                    }
                }
                const l_med = classArr[medianIdx][0];
                const h_med = classArr[medianIdx][1] - classArr[medianIdx][0];
                const f_med = freqArr[medianIdx];
                const cf_prev = medianIdx > 0 ? cf[medianIdx - 1] : 0;

                const medianVal = l_med + ((nby2 - cf_prev) / f_med) * h_med;
                res.push({ label: 'Median Class', value: `${classArr[medianIdx][0]} - ${classArr[medianIdx][1]}` });
                res.push({ label: 'Median', value: `l + \\left(\\frac{N/2 - cf}{f}\\right) \\times h = ${l_med} + \\left(\\frac{${nby2} - ${cf_prev}}{${f_med}}\\right) \\times ${h_med} = ${medianVal.toFixed(2)}` });

            } catch {
                res.push({ label: 'Error', value: 'Check inputs. Ensure classes are continuous and numeric.' });
            }
        }

        setResults(res);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Data Type</label>
                        <select
                            value={mode}
                            onChange={(e) => { setMode(e.target.value as StatMode); setResults(null); }}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus"
                        >
                            <option value="ungrouped">Ungrouped Data</option>
                            <option value="grouped">Grouped Data (Class Intervals)</option>
                        </select>
                    </div>

                    {mode === 'ungrouped' ? (
                        <div>
                            <label className="block text-sm font-medium mb-2">Data Set</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={6}
                                placeholder="1, 2, 3, 4, 5"
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus font-mono text-sm"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Enter numbers separated by commas.</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Class Intervals</label>
                                <textarea
                                    value={classes}
                                    onChange={(e) => setClasses(e.target.value)}
                                    rows={3}
                                    placeholder="0-10, 10-20, 20-30"
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus font-mono text-sm"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">e.g., 0-10, 10-20 (must be continuous)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Frequencies</label>
                                <textarea
                                    value={frequencies}
                                    onChange={(e) => setFrequencies(e.target.value)}
                                    rows={3}
                                    placeholder="5, 8, 12..."
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus font-mono text-sm"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">Corresponding frequencies</p>
                            </div>
                        </>
                    )}

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Calculate Statistics
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
                                    {item.step && <p className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2 font-mono">{item.step}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <p className="text-muted-foreground">Enter data and calculate to see statistics.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
