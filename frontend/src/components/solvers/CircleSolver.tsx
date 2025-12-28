'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'chord_properties'
    | 'cyclic_quad'
    | 'arc_angles'
    | 'tangent_properties'
    | 'sector_segment_area';

const operations = [
    { id: 'chord_properties' as Operation, label: 'Chord, Radius & Distance' },
    { id: 'cyclic_quad' as Operation, label: 'Cyclic Quadrilateral Angles' },
    { id: 'arc_angles' as Operation, label: 'Angles Subtended by Arc' },
    { id: 'tangent_properties' as Operation, label: 'Tangent Properties (Class 10)' },
    { id: 'sector_segment_area' as Operation, label: 'Area of Sector & Segment (Class 10)' },
];

export function CircleSolver() {
    const [operation, setOperation] = useState<Operation>('chord_properties');

    // Chord Inputs
    // formula: r^2 = d^2 + (c/2)^2
    const [radius, setRadius] = useState('');
    const [chord, setChord] = useState('');
    const [distance, setDistance] = useState('');

    // Cyclic Quad Inputs
    const [angleA, setAngleA] = useState('');
    const [angleC, setAngleC] = useState('');

    // Arc Inputs (simple ratio)
    const [centerAngle, setCenterAngle] = useState('');
    const [circleAngle, setCircleAngle] = useState('');

    // Tangent & Sector/Segment Inputs
    const [sectorAngle, setSectorAngle] = useState(60);

    const [results, setResults] = useState<{ label: string; value: string; step?: string; formula?: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string; step?: string; formula?: string }[] = [];
        const fmt = (n: number) => n.toFixed(2);

        switch (operation) {
            case 'chord_properties': {
                const r = parseFloat(radius);
                const c = parseFloat(chord);
                const d = parseFloat(distance);

                // Which one is missing?
                if (radius && chord && !distance) {
                    // Find distance
                    // d = sqrt(r^2 - (c/2)^2)
                    if (r < c / 2) {
                        res.push({ label: 'Error', value: '\\text{Radius cannot be less than half the chord length.}' });
                    } else {
                        const dVal = Math.sqrt(r * r - (c / 2) * (c / 2));
                        res.push({ label: 'Formula', value: 'd = \\sqrt{r^2 - (c/2)^2}' });
                        res.push({ label: 'Distance from Center', value: `d = ${fmt(dVal)}` });
                    }
                } else if (radius && distance && !chord) {
                    // Find chord
                    // (c/2) = sqrt(r^2 - d^2) -> c = 2 * sqrt...
                    if (r < d) {
                        res.push({ label: 'Error', value: '\\text{Radius cannot be less than distance from center.}' });
                    } else {
                        const halfC = Math.sqrt(r * r - d * d);
                        res.push({ label: 'Formula', value: 'c = 2\\sqrt{r^2 - d^2}' });
                        res.push({ label: 'Chord Length', value: `c = ${fmt(2 * halfC)}` });
                    }
                } else if (chord && distance && !radius) {
                    // Find radius
                    // r = sqrt(d^2 + (c/2)^2)
                    const rVal = Math.sqrt(d * d + (c / 2) * (c / 2));
                    res.push({ label: 'Formula', value: 'r = \\sqrt{d^2 + (c/2)^2}' });
                    res.push({ label: 'Radius', value: `r = ${fmt(rVal)}` });
                } else {
                    res.push({ label: 'Instruction', value: '\\text{Leave exactly one field empty to calculate it.}' });
                }
                break;
            }

            case 'cyclic_quad': {
                res.push({ label: 'Property', value: '\\text{Opposite angles sum to } 180^\\circ' });
                if (angleA) {
                    const a = parseFloat(angleA);
                    if (a >= 180) {
                        res.push({ label: 'Error', value: '\\text{Angle must be < 180}' });
                    } else {
                        res.push({ label: 'Given Angle A', value: `${a}^\\circ` });
                        res.push({ label: 'Opposite Angle C', value: `180^\\circ - ${a}^\\circ = ${180 - a}^\\circ` });
                    }
                } else if (angleC) {
                    const c = parseFloat(angleC);
                    if (c >= 180) {
                        res.push({ label: 'Error', value: '\\text{Angle must be < 180}' });
                    } else {
                        res.push({ label: 'Given Angle C', value: `${c}^\\circ` });
                        res.push({ label: 'Opposite Angle A', value: `180^\\circ - ${c}^\\circ = ${180 - c}^\\circ` });
                    }
                } else {
                    res.push({ label: 'Instruction', value: '\\text{Enter one angle to find its opposite.}' });
                }
                break;
            }

            case 'arc_angles': {
                res.push({ label: 'Property', value: '\\text{Angle at center = 2 } \\times \\text{ Angle at circle}' });
                if (centerAngle) {
                    const c = parseFloat(centerAngle);
                    res.push({ label: 'Given Center Angle', value: `${c}^\\circ` });
                    res.push({ label: 'Angle at Circle', value: `${c}/2 = ${c / 2}^\\circ` });
                } else if (circleAngle) {
                    const c = parseFloat(circleAngle);
                    res.push({ label: 'Given Circle Angle', value: `${c}^\\circ` });
                    res.push({ label: 'Angle at Center', value: `2 \\times ${c} = ${2 * c}^\\circ` });
                } else {
                    res.push({ label: 'Instruction', value: '\\text{Enter one angle to find the other.}' });
                }
                break;
            }

            case 'tangent_properties': {
                const r = parseFloat(radius);
                const d = parseFloat(distance);
                res.push({ label: 'Given', value: `r = ${radius || '?'}, d = ${distance || '?'}` });

                if (radius && distance) {
                    if (d <= r) {
                        res.push({ label: 'Error', value: '\\text{Distance must be > radius}' });
                    } else {
                        const l = Math.sqrt(d * d - r * r);
                        res.push({ label: 'Formula', value: 'l = \\sqrt{d^2 - r^2}' });
                        res.push({ label: 'Tangent Length', value: `l = ${fmt(l)}` });
                    }
                } else {
                    res.push({ label: 'Instruction', value: '\\text{Enter Radius and Distance.}' });
                }
                break;
            }

            case 'sector_segment_area': {
                const r = parseFloat(radius);
                const theta = sectorAngle;
                res.push({ label: 'Given', value: `r = ${r}, \\theta = ${theta}^\\circ` });

                if (radius) {
                    const angRad = (theta * Math.PI) / 180;
                    const arcL = (theta / 360) * 2 * Math.PI * r;
                    res.push({ label: 'Arc Length', formula: '\\frac{\\theta}{360} \\times 2\\pi r', value: `${fmt(arcL)}` });

                    const areaSec = (theta / 360) * Math.PI * r * r;
                    res.push({ label: 'Area of Sector', formula: '\\frac{\\theta}{360} \\times \\pi r^2', value: `${fmt(areaSec)}` });

                    const areaTri = 0.5 * r * r * Math.sin(angRad);
                    const areaSeg = areaSec - areaTri;
                    res.push({ label: 'Area of Minor Segment', formula: '\\text{Sector} - \\text{Triangle}', value: `${fmt(areaSec)} - ${fmt(areaTri)} = ${fmt(areaSeg)}` });
                } else {
                    res.push({ label: 'Instruction', value: '\\text{Enter Radius.}' });
                }
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
                        {operation === 'chord_properties' && (
                            <>
                                <p className="text-xs text-muted-foreground">Leave one field empty to calculate.</p>
                                <div><label className="block text-xs mb-1">Radius (r)</label><input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                                <div><label className="block text-xs mb-1">Chord Length (c)</label><input type="number" value={chord} onChange={(e) => setChord(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                                <div><label className="block text-xs mb-1">Dist from Center (d)</label><input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                            </>
                        )}

                        {operation === 'cyclic_quad' && (
                            <>
                                <p className="text-xs text-muted-foreground">Enter A or C.</p>
                                <div><label className="block text-xs mb-1">Angle A</label><input type="number" value={angleA} onChange={(e) => { setAngleA(e.target.value); setAngleC(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div className="text-center text-xs text-muted-foreground">OR</div>
                                <div><label className="block text-xs mb-1">Angle C</label><input type="number" value={angleC} onChange={(e) => { setAngleC(e.target.value); setAngleA(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}

                        {operation === 'arc_angles' && (
                            <>
                                <p className="text-xs text-muted-foreground">Enter one angle.</p>
                                <div><label className="block text-xs mb-1">Angle at Center</label><input type="number" value={centerAngle} onChange={(e) => { setCenterAngle(e.target.value); setCircleAngle(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div className="text-center text-xs text-muted-foreground">OR</div>
                                <div><label className="block text-xs mb-1">Angle on Circle</label><input type="number" value={circleAngle} onChange={(e) => { setCircleAngle(e.target.value); setCenterAngle(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}

                        {operation === 'tangent_properties' && (
                            <>
                                <div><label className="block text-xs mb-1">Radius (r)</label><input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs mb-1">Dist from Center (d)</label><input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                            </>
                        )}

                        {operation === 'sector_segment_area' && (
                            <>
                                <div><label className="block text-xs mb-1">Radius (r)</label><input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <div><label className="block text-xs mb-1">Angle (Degrees)</label><input type="number" value={sectorAngle} onChange={(e) => setSectorAngle(parseFloat(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
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
                                    {item.step && <p className="mt-2 text-xs text-muted-foreground">{item.step}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <p className="text-muted-foreground">Select operation and enter values.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
