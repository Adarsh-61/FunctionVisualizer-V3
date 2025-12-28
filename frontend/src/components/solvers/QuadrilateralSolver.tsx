'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'analyze_coordinates'
    | 'properties_check';

const operations = [
    { id: 'analyze_coordinates' as Operation, label: 'Analyze via Vertices (Advanced)' },
    { id: 'properties_check' as Operation, label: 'Properties Checklist' },
];

export function QuadrilateralSolver() {
    const [operation, setOperation] = useState<Operation>('analyze_coordinates');

    // Coordinates inputs
    const [x1, setX1] = useState('0'); const [y1, setY1] = useState('0');
    const [x2, setX2] = useState('4'); const [y2, setY2] = useState('0');
    const [x3, setX3] = useState('4'); const [y3, setY3] = useState('3');
    const [x4, setX4] = useState('0'); const [y4, setY4] = useState('3');

    const [results, setResults] = useState<{ label: string; value: string; step?: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string; step?: string }[] = [];

        if (operation === 'analyze_coordinates') {
            const p1 = { x: parseFloat(x1), y: parseFloat(y1) };
            const p2 = { x: parseFloat(x2), y: parseFloat(y2) };
            const p3 = { x: parseFloat(x3), y: parseFloat(y3) };
            const p4 = { x: parseFloat(x4), y: parseFloat(y4) };

            // Distance Formula
            const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
            // Slope Formula
            const slope = (a: { x: number, y: number }, b: { x: number, y: number }) => {
                if (b.x === a.x) return Infinity;
                return (b.y - a.y) / (b.x - a.x);
            };

            const s1 = dist(p1, p2);
            const s2 = dist(p2, p3);
            const s3 = dist(p3, p4);
            const s4 = dist(p4, p1);

            const d1 = dist(p1, p3); // Diagonal 1
            const d2 = dist(p2, p4); // Diagonal 2

            const m1 = slope(p1, p2);
            const m2 = slope(p2, p3);
            const m3 = slope(p3, p4);
            const m4 = slope(p4, p1);

            const fmt = (n: number) => n.toFixed(2);

            res.push({ label: 'Side Lengths', value: `AB=${fmt(s1)}, BC=${fmt(s2)}, CD=${fmt(s3)}, DA=${fmt(s4)}` });
            res.push({ label: 'Diagonals', value: `AC=${fmt(d1)}, BD=${fmt(d2)}` });

            // Identification Logic
            let shape = 'Quadrilateral';
            const oppSidesEqual = Math.abs(s1 - s3) < 0.01 && Math.abs(s2 - s4) < 0.01;
            const allSidesEqual = oppSidesEqual && Math.abs(s1 - s2) < 0.01;

            const isParallel = (sl1: number, sl2: number) => {
                if (sl1 === Infinity && sl2 === Infinity) return true;
                return Math.abs(sl1 - sl2) < 0.01;
            };

            const oppParallel = isParallel(m1, m3) && isParallel(m2, m4);

            // Check right angles (slopes product = -1)
            const isPerpendicular = (sl1: number, sl2: number) => {
                if (Math.abs(sl1) === Infinity && Math.abs(sl2) < 0.01) return true;
                if (Math.abs(sl2) === Infinity && Math.abs(sl1) < 0.01) return true;
                return Math.abs(sl1 * sl2 + 1) < 0.01;
            }

            const hasRightAngle = isPerpendicular(m1, m2);

            if (oppParallel) {
                if (allSidesEqual) {
                    if (hasRightAngle || Math.abs(d1 - d2) < 0.01) {
                        shape = 'Square';
                    } else {
                        shape = 'Rhombus';
                    }
                } else if (oppSidesEqual) {
                    if (hasRightAngle || Math.abs(d1 - d2) < 0.01) {
                        shape = 'Rectangle';
                    } else {
                        shape = 'Parallelogram';
                    }
                }
            } else {
                // Trapezium Check
                if (isParallel(m1, m3) || isParallel(m2, m4)) {
                    shape = 'Trapezium';
                } else {
                    // Kite Check? (Two pairs of adjacent sides equal)
                    if ((Math.abs(s1 - s2) < 0.01 && Math.abs(s3 - s4) < 0.01) || (Math.abs(s2 - s3) < 0.01 && Math.abs(s4 - s1) < 0.01)) {
                        shape = 'Kite';
                    }
                }
            }

            res.push({ label: 'Identified Shape', value: `\\textbf{${shape}}` });

            // Area using Shoelace Formula
            const area = 0.5 * Math.abs((p1.x * p2.y + p2.x * p3.y + p3.x * p4.y + p4.x * p1.y) - (p1.y * p2.x + p2.y * p3.x + p3.y * p4.x + p4.y * p1.x));
            res.push({ label: 'Area (Coordinate Method)', value: `Area = ${fmt(area)} \\text{ sq units}` });
        } else {
            // Properties Check
            res.push({ label: 'Parallelogram Properties', value: '' });
            res.push({ label: '1. Opposite Sides', value: '\\text{Equal and Parallel}' });
            res.push({ label: '2. Opposite Angles', value: '\\text{Equal}' });
            res.push({ label: '3. Diagonals', value: '\\text{Bisect each other}' });

            res.push({ label: 'Mid-Point Theorem', value: '' });
            res.push({ label: 'Statement', value: '\\text{Line segment joining mid-points of two sides of a triangle is parallel to the third side and half of it.}' });
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

                    {operation === 'analyze_coordinates' && (
                        <div className="space-y-4">
                            <p className="text-xs text-muted-foreground">Enter vertices in order (A-B-C-D).</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div><label className="block text-xs mb-1">A (x1, y1)</label><div className="flex gap-1"><input type="number" value={x1} onChange={e => setX1(e.target.value)} className="w-full p-1 rounded border" /> <input type="number" value={y1} onChange={e => setY1(e.target.value)} className="w-full p-1 rounded border" /></div></div>
                                <div><label className="block text-xs mb-1">B (x2, y2)</label><div className="flex gap-1"><input type="number" value={x2} onChange={e => setX2(e.target.value)} className="w-full p-1 rounded border" /> <input type="number" value={y2} onChange={e => setY2(e.target.value)} className="w-full p-1 rounded border" /></div></div>
                                <div><label className="block text-xs mb-1">C (x3, y3)</label><div className="flex gap-1"><input type="number" value={x3} onChange={e => setX3(e.target.value)} className="w-full p-1 rounded border" /> <input type="number" value={y3} onChange={e => setY3(e.target.value)} className="w-full p-1 rounded border" /></div></div>
                                <div><label className="block text-xs mb-1">D (x4, y4)</label><div className="flex gap-1"><input type="number" value={x4} onChange={e => setX4(e.target.value)} className="w-full p-1 rounded border" /> <input type="number" value={y4} onChange={e => setY4(e.target.value)} className="w-full p-1 rounded border" /></div></div>
                            </div>
                        </div>
                    )}

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Analyze / Check
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                {results ? (
                    <div className="bg-card rounded-xl border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
                        <div className="space-y-4">
                            {results.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-accent/50">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                                    {item.value && <MathBlock>{item.value}</MathBlock>}
                                    {item.step && <p className="mt-2 text-xs text-muted-foreground">{item.step}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <p className="text-muted-foreground">Enter values and click Analyze.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
