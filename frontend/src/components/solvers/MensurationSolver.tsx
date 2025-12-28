'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Shape = 'cuboid' | 'cube' | 'cylinder' | 'cone' | 'sphere' | 'hemisphere' | 'triangle' | 'frustum';

const shapes = [
    { id: 'cuboid' as Shape, label: 'Cuboid' },
    { id: 'cube' as Shape, label: 'Cube' },
    { id: 'cylinder' as Shape, label: 'Right Circular Cylinder' },
    { id: 'cone' as Shape, label: 'Right Circular Cone' },
    { id: 'sphere' as Shape, label: 'Sphere' },
    { id: 'hemisphere' as Shape, label: 'Hemisphere' },
    { id: 'triangle' as Shape, label: 'Triangle (Heron\'s Formula)' },
    { id: 'frustum' as Shape, label: 'Frustum of a Cone (Class 10)' },
];

export function MensurationSolver() {
    const [shape, setShape] = useState<Shape>('cylinder');

    // Parameters
    const [l, setL] = useState(10);
    const [b, setB] = useState(5);
    const [h, setH] = useState(8);
    const [r, setR] = useState(3);
    const [r2, setR2] = useState(2); // Top radius for frustum
    const [a, setA] = useState(4); // Side for cube or Triangle side a
    const [sideB, setSideB] = useState(5); // Triangle side b
    const [sideC, setSideC] = useState(6); // Triangle side c

    const [results, setResults] = useState<{ label: string; formula: string; value: string }[]>([]);

    useEffect(() => {
        const calculate = () => {
            const res = [];
            const pi = Math.PI;
            const fmt = (n: number) => n.toFixed(2);

            switch (shape) {
                case 'cuboid':
                    const lsa_cuboid = 2 * h * (l + b);
                    const tsa_cuboid = 2 * (l * b + b * h + h * l);
                    const vol_cuboid = l * b * h;
                    res.push({ label: 'Lateral Surface Area', formula: '2h(l+b)', value: `${2}(${h})(${l}+${b}) = ${fmt(lsa_cuboid)}` });
                    res.push({ label: 'Total Surface Area', formula: '2(lb+bh+hl)', value: `${2}(${l}\\cdot${b} + ${b}\\cdot${h} + ${h}\\cdot${l}) = ${fmt(tsa_cuboid)}` });
                    res.push({ label: 'Volume', formula: 'l \\times b \\times h', value: `${l} \\times ${b} \\times ${h} = ${fmt(vol_cuboid)}` });
                    break;
                case 'cube':
                    const lsa_cube = 4 * a * a;
                    const tsa_cube = 6 * a * a;
                    const vol_cube = a * a * a;
                    res.push({ label: 'Lateral Surface Area', formula: '4a^2', value: `4(${a})^2 = ${fmt(lsa_cube)}` });
                    res.push({ label: 'Total Surface Area', formula: '6a^2', value: `6(${a})^2 = ${fmt(tsa_cube)}` });
                    res.push({ label: 'Volume', formula: 'a^3', value: `(${a})^3 = ${fmt(vol_cube)}` });
                    break;
                case 'cylinder':
                    const csa_cyl = 2 * pi * r * h;
                    const tsa_cyl = 2 * pi * r * (r + h);
                    const vol_cyl = pi * r * r * h;
                    res.push({ label: 'Curved Surface Area', formula: '2\\pi rh', value: `2\\pi(${r})(${h}) \\approx ${fmt(csa_cyl)}` });
                    res.push({ label: 'Total Surface Area', formula: '2\\pi r(r+h)', value: `2\\pi(${r})(${r}+${h}) \\approx ${fmt(tsa_cyl)}` });
                    res.push({ label: 'Volume', formula: '\\pi r^2 h', value: `\\pi(${r})^2(${h}) \\approx ${fmt(vol_cyl)}` });
                    break;
                case 'cone':
                    const slant = Math.sqrt(h * h + r * r);
                    const csa_cone = pi * r * slant;
                    const tsa_cone = pi * r * (r + slant);
                    const vol_cone = (1 / 3) * pi * r * r * h;
                    res.push({ label: 'Slant Height (l)', formula: '\\sqrt{h^2+r^2}', value: `\\sqrt{${h}^2+${r}^2} \\approx ${fmt(slant)}` });
                    res.push({ label: 'Curved Surface Area', formula: '\\pi rl', value: `\\pi(${r})(${fmt(slant)}) \\approx ${fmt(csa_cone)}` });
                    res.push({ label: 'Total Surface Area', formula: '\\pi r(r+l)', value: `\\pi(${r})(${r}+${fmt(slant)}) \\approx ${fmt(tsa_cone)}` });
                    res.push({ label: 'Volume', formula: '\\frac{1}{3}\\pi r^2 h', value: `\\frac{1}{3}\\pi(${r})^2(${h}) \\approx ${fmt(vol_cone)}` });
                    break;
                case 'sphere':
                    const sa_sphere = 4 * pi * r * r;
                    const vol_sphere = (4 / 3) * pi * Math.pow(r, 3);
                    res.push({ label: 'Surface Area', formula: '4\\pi r^2', value: `4\\pi(${r})^2 \\approx ${fmt(sa_sphere)}` });
                    res.push({ label: 'Volume', formula: '\\frac{4}{3}\\pi r^3', value: `\\frac{4}{3}\\pi(${r})^3 \\approx ${fmt(vol_sphere)}` });
                    break;
                case 'hemisphere':
                    const csa_hemi = 2 * pi * r * r;
                    const tsa_hemi = 3 * pi * r * r;
                    const vol_hemi = (2 / 3) * pi * Math.pow(r, 3);
                    res.push({ label: 'Curved Surface Area', formula: '2\\pi r^2', value: `2\\pi(${r})^2 \\approx ${fmt(csa_hemi)}` });
                    res.push({ label: 'Total Surface Area', formula: '3\\pi r^2', value: `3\\pi(${r})^2 \\approx ${fmt(tsa_hemi)}` });
                    res.push({ label: 'Total Surface Area', formula: '3\\pi r^2', value: `3\\pi(${r})^2 \\approx ${fmt(tsa_hemi)}` });
                    res.push({ label: 'Volume', formula: '\\frac{2}{3}\\pi r^3', value: `\\frac{2}{3}\\pi(${r})^3 \\approx ${fmt(vol_hemi)}` });
                    break;
                case 'triangle':
                    const s = (a + sideB + sideC) / 2;
                    const areaSq = s * (s - a) * (s - sideB) * (s - sideC);
                    res.push({ label: 'Semi-perimeter (s)', formula: '(a+b+c)/2', value: `(${a}+${sideB}+${sideC})/2 = ${fmt(s)}` });
                    if (areaSq < 0) {
                        res.push({ label: 'Error', formula: 'Invalid', value: '\\text{Sides do not form a valid triangle}' });
                    } else {
                        const areaTri = Math.sqrt(areaSq);
                        res.push({ label: 'Area', formula: '\\sqrt{s(s-a)(s-b)(s-c)}', value: `\\sqrt{${fmt(s)}(${fmt(s - a)})(${fmt(s - sideB)})(${fmt(s - sideC)})} \\approx ${fmt(areaTri)}` });
                    }
                    break;
                case 'frustum':
                    const l_frust = Math.sqrt(h * h + (r - r2) * (r - r2));
                    const csa_frust = pi * (r + r2) * l_frust;
                    try {
                        const tsa_frust = pi * (r + r2) * l_frust + pi * r * r + pi * r2 * r2;
                        const vol_frust = (1 / 3) * pi * h * (r * r + r2 * r2 + r * r2);
                        res.push({ label: 'Slant Height (l)', formula: '\\sqrt{h^2+(r_1-r_2)^2}', value: `\\sqrt{${h}^2+(${r}-${r2})^2} = ${fmt(l_frust)}` });
                        res.push({ label: 'Curved Surface Area', formula: '\\pi(r_1+r_2)l', value: `\\pi(${r}+${r2})(${fmt(l_frust)}) \\approx ${fmt(csa_frust)}` });
                        res.push({ label: 'Total Surface Area', formula: '\\pi(r_1+r_2)l + \\pi r_1^2 + \\pi r_2^2', value: `\\approx ${fmt(tsa_frust)}` });
                        res.push({ label: 'Volume', formula: '\\frac{1}{3}\\pi h(r_1^2+r_2^2+r_1r_2)', value: `\\approx ${fmt(vol_frust)}` });
                    } catch { }
                    break;
            }
            setResults(res);
        };
        calculate();
    }, [shape, l, b, h, r, r2, a, sideB, sideC]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Shape</label>
                        <select
                            value={shape}
                            onChange={(e) => setShape(e.target.value as Shape)}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background input-focus"
                        >
                            {shapes.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {(shape === 'cuboid') && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">Length (l)</label><input type="number" value={l} onChange={(e) => setL(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Breadth (b)</label><input type="number" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Height (h)</label><input type="number" value={h} onChange={(e) => setH(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}
                        {(shape === 'cube') && (
                            <div><label className="block text-xs font-medium mb-1">Side (a)</label><input type="number" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                        )}
                        {(shape === 'cylinder' || shape === 'cone') && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">Radius (r)</label><input type="number" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Height (h)</label><input type="number" value={h} onChange={(e) => setH(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}
                        {(shape === 'sphere' || shape === 'hemisphere') && (
                            <div><label className="block text-xs font-medium mb-1">Radius (r)</label><input type="number" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                        )}
                        {(shape === 'frustum') && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">Bottom Radius (r1)</label><input type="number" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Top Radius (r2)</label><input type="number" value={r2} onChange={(e) => setR2(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Height (h)</label><input type="number" value={h} onChange={(e) => setH(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}
                        {(shape === 'triangle') && (
                            <>
                                <div><label className="block text-xs font-medium mb-1">Side a</label><input type="number" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Side b</label><input type="number" value={sideB} onChange={(e) => setSideB(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs font-medium mb-1">Side c</label><input type="number" value={sideC} onChange={(e) => setSideC(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">
                <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold mb-4">Results</h2>
                    <div className="grid gap-4">
                        {results.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-accent/50 border border-border/50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-background/50 border border-border text-muted-foreground font-mono">
                                        {item.formula}
                                    </span>
                                </div>
                                <MathBlock>{item.value}</MathBlock>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
