'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'evaluate'
    | 'verify_identity'
    | 'compound_angle'
    | 'multiple_angle'
    | 'inverse'
    | 'solve_equation'
    | 'triangle_laws'
    | 'heights_distances';

const operations = [
    { id: 'evaluate' as Operation, label: 'Evaluate Trig Functions' },
    { id: 'verify_identity' as Operation, label: 'Verify Identities' },
    { id: 'compound_angle' as Operation, label: 'Compound Angles' },
    { id: 'multiple_angle' as Operation, label: 'Multiple Angles' },
    { id: 'inverse' as Operation, label: 'Inverse Functions' },
    { id: 'solve_equation' as Operation, label: 'Solve Trig Equation' },
    { id: 'triangle_laws' as Operation, label: 'Triangle Laws (Sine/Cosine)' },
    { id: 'heights_distances' as Operation, label: 'Heights & Distances (Class 10)' },
];

const standardAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

export function TrigonometrySolver() {
    const [operation, setOperation] = useState<Operation>('evaluate');
    const [angle, setAngle] = useState('30');
    const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
    const [angle2, setAngle2] = useState('45');
    const [sideA, setSideA] = useState('5');
    const [sideB, setSideB] = useState('7');
    const [sideC, setSideC] = useState('8');
    const [angleA, setAngleA] = useState('60');
    const [inverseValue, setInverseValue] = useState('0.5');
    const [inverseFunc, setInverseFunc] = useState('sin');
    const [results, setResults] = useState<{ label: string; value: string }[] | null>(null);

    const toRadians = (deg: number) => deg * Math.PI / 180;
    const toDegrees = (rad: number) => rad * 180 / Math.PI;

    const calculate = () => {
        const res: { label: string; value: string }[] = [];
        const ang = parseFloat(angle) || 0;
        const ang2 = parseFloat(angle2) || 0;
        const angRad = angleUnit === 'degrees' ? toRadians(ang) : ang;
        const ang2Rad = angleUnit === 'degrees' ? toRadians(ang2) : ang2;

        switch (operation) {
            case 'evaluate': {
                const angDisplay = angleUnit === 'degrees' ? `${ang}°` : `${ang} \\text{ rad}`;
                res.push({ label: 'Angle', value: angDisplay });

                const sinVal = Math.sin(angRad);
                const cosVal = Math.cos(angRad);
                const tanVal = Math.tan(angRad);
                const cotVal = 1 / tanVal;
                const secVal = 1 / cosVal;
                const cscVal = 1 / sinVal;

                res.push({ label: '\\sin \\theta', value: sinVal.toFixed(6) });
                res.push({ label: '\\cos \\theta', value: cosVal.toFixed(6) });

                if (Math.abs(cosVal) > 0.0001) {
                    res.push({ label: '\\tan \\theta', value: tanVal.toFixed(6) });
                } else {
                    res.push({ label: '\\tan \\theta', value: '\\text{Undefined}' });
                }

                if (Math.abs(sinVal) > 0.0001) {
                    res.push({ label: '\\cot \\theta', value: cotVal.toFixed(6) });
                    res.push({ label: '\\csc \\theta', value: cscVal.toFixed(6) });
                } else {
                    res.push({ label: '\\cot \\theta', value: '\\text{Undefined}' });
                    res.push({ label: '\\csc \\theta', value: '\\text{Undefined}' });
                }

                if (Math.abs(cosVal) > 0.0001) {
                    res.push({ label: '\\sec \\theta', value: secVal.toFixed(6) });
                } else {
                    res.push({ label: '\\sec \\theta', value: '\\text{Undefined}' });
                }

                // Quadrant info
                const normAng = ((ang % 360) + 360) % 360;
                let quadrant = '';
                if (normAng >= 0 && normAng < 90) quadrant = 'I (All positive)';
                else if (normAng >= 90 && normAng < 180) quadrant = 'II (sin, csc positive)';
                else if (normAng >= 180 && normAng < 270) quadrant = 'III (tan, cot positive)';
                else quadrant = 'IV (cos, sec positive)';

                res.push({ label: 'Quadrant', value: quadrant });

                // Standard angle exact values
                if (standardAngles.includes(normAng)) {
                    res.push({ label: 'Note', value: `\\text{Standard angle - exact values available}` });
                }
                break;
            }

            case 'verify_identity': {
                res.push({ label: 'Fundamental Identities', value: '' });

                const s = Math.sin(angRad);
                const c = Math.cos(angRad);
                const t = Math.tan(angRad);

                // sin^2 + cos^2 = 1
                const id1 = s * s + c * c;
                res.push({ label: '\\sin^2\\theta + \\cos^2\\theta', value: `${(s * s).toFixed(6)} + ${(c * c).toFixed(6)} = ${id1.toFixed(6)} \\approx 1` });

                // 1 + tan^2 = sec^2
                if (Math.abs(c) > 0.0001) {
                    const sec2 = 1 / (c * c);
                    const id2 = 1 + t * t;
                    res.push({ label: '1 + \\tan^2\\theta = \\sec^2\\theta', value: `1 + ${(t * t).toFixed(6)} = ${id2.toFixed(6)} = ${sec2.toFixed(6)}` });
                }

                // 1 + cot^2 = csc^2
                if (Math.abs(s) > 0.0001) {
                    const csc2 = 1 / (s * s);
                    const cot = c / s;
                    const id3 = 1 + cot * cot;
                    res.push({ label: '1 + \\cot^2\\theta = \\csc^2\\theta', value: `1 + ${(cot * cot).toFixed(6)} = ${id3.toFixed(6)} = ${csc2.toFixed(6)}` });
                }

                // tan = sin/cos
                if (Math.abs(c) > 0.0001) {
                    res.push({ label: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}', value: `\\frac{${s.toFixed(6)}}{${c.toFixed(6)}} = ${(s / c).toFixed(6)} = ${t.toFixed(6)}` });
                }
                break;
            }

            case 'compound_angle': {
                const A = angRad;
                const B = ang2Rad;

                res.push({ label: 'Angles', value: `A = ${ang}°, B = ${ang2}°` });

                // sin(A+B)
                const sinAplusB = Math.sin(A + B);
                const sinAcosB = Math.sin(A) * Math.cos(B);
                const cosAsinB = Math.cos(A) * Math.sin(B);
                res.push({ label: '\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B', value: `${sinAcosB.toFixed(6)} + ${cosAsinB.toFixed(6)} = ${sinAplusB.toFixed(6)}` });

                // sin(A-B)
                const sinAminusB = Math.sin(A - B);
                res.push({ label: '\\sin(A-B) = \\sin A \\cos B - \\cos A \\sin B', value: `${sinAcosB.toFixed(6)} - ${cosAsinB.toFixed(6)} = ${sinAminusB.toFixed(6)}` });

                // cos(A+B)
                const cosAplusB = Math.cos(A + B);
                const cosAcosB = Math.cos(A) * Math.cos(B);
                const sinAsinB = Math.sin(A) * Math.sin(B);
                res.push({ label: '\\cos(A+B) = \\cos A \\cos B - \\sin A \\sin B', value: `${cosAcosB.toFixed(6)} - ${sinAsinB.toFixed(6)} = ${cosAplusB.toFixed(6)}` });

                // cos(A-B)
                const cosAminusB = Math.cos(A - B);
                res.push({ label: '\\cos(A-B) = \\cos A \\cos B + \\sin A \\sin B', value: `${cosAcosB.toFixed(6)} + ${sinAsinB.toFixed(6)} = ${cosAminusB.toFixed(6)}` });

                // tan(A+B)
                const tanA = Math.tan(A);
                const tanB = Math.tan(B);
                if (Math.abs(1 - tanA * tanB) > 0.0001) {
                    const tanAplusB = (tanA + tanB) / (1 - tanA * tanB);
                    res.push({ label: '\\tan(A+B) = \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}', value: `\\frac{${tanA.toFixed(4)} + ${tanB.toFixed(4)}}{1 - ${(tanA * tanB).toFixed(4)}} = ${tanAplusB.toFixed(6)}` });
                }
                break;
            }

            case 'multiple_angle': {
                const theta = angRad;
                const s = Math.sin(theta);
                const c = Math.cos(theta);
                const t = Math.tan(theta);

                res.push({ label: 'Angle', value: `\\theta = ${ang}°` });

                // Double angle
                res.push({ label: '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta', value: `2(${s.toFixed(4)})(${c.toFixed(4)}) = ${(2 * s * c).toFixed(6)}` });
                res.push({ label: '\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta', value: `${(c * c).toFixed(4)} - ${(s * s).toFixed(4)} = ${(c * c - s * s).toFixed(6)}` });
                res.push({ label: '\\cos 2\\theta = 2\\cos^2\\theta - 1', value: `2(${(c * c).toFixed(4)}) - 1 = ${(2 * c * c - 1).toFixed(6)}` });
                res.push({ label: '\\cos 2\\theta = 1 - 2\\sin^2\\theta', value: `1 - 2(${(s * s).toFixed(4)}) = ${(1 - 2 * s * s).toFixed(6)}` });

                if (Math.abs(1 - t * t) > 0.0001) {
                    res.push({ label: '\\tan 2\\theta = \\frac{2\\tan\\theta}{1-\\tan^2\\theta}', value: `\\frac{2(${t.toFixed(4)})}{1-(${t.toFixed(4)})^2} = ${((2 * t) / (1 - t * t)).toFixed(6)}` });
                }

                // Triple angle
                res.push({ label: '\\sin 3\\theta = 3\\sin\\theta - 4\\sin^3\\theta', value: `3(${s.toFixed(4)}) - 4(${s.toFixed(4)})^3 = ${(3 * s - 4 * s * s * s).toFixed(6)}` });
                res.push({ label: '\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta', value: `4(${c.toFixed(4)})^3 - 3(${c.toFixed(4)}) = ${(4 * c * c * c - 3 * c).toFixed(6)}` });
                break;
            }

            case 'inverse': {
                const val = parseFloat(inverseValue) || 0;

                res.push({ label: 'Value', value: `${val}` });

                if (inverseFunc === 'sin' && Math.abs(val) <= 1) {
                    const result = Math.asin(val);
                    res.push({ label: '\\sin^{-1}(' + val + ')', value: `${toDegrees(result).toFixed(4)}° = ${result.toFixed(6)} \\text{ rad}` });
                    res.push({ label: 'Principal Range', value: `[-90°, 90°] \\text{ or } [-\\frac{\\pi}{2}, \\frac{\\pi}{2}]` });
                } else if (inverseFunc === 'cos' && Math.abs(val) <= 1) {
                    const result = Math.acos(val);
                    res.push({ label: '\\cos^{-1}(' + val + ')', value: `${toDegrees(result).toFixed(4)}° = ${result.toFixed(6)} \\text{ rad}` });
                    res.push({ label: 'Principal Range', value: `[0°, 180°] \\text{ or } [0, \\pi]` });
                } else if (inverseFunc === 'tan') {
                    const result = Math.atan(val);
                    res.push({ label: '\\tan^{-1}(' + val + ')', value: `${toDegrees(result).toFixed(4)}° = ${result.toFixed(6)} \\text{ rad}` });
                    res.push({ label: 'Principal Range', value: `(-90°, 90°) \\text{ or } (-\\frac{\\pi}{2}, \\frac{\\pi}{2})` });
                } else {
                    res.push({ label: 'Error', value: 'Value out of domain for selected function' });
                }

                // Properties
                res.push({ label: 'Property', value: '\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2}' });
                res.push({ label: 'Property', value: '\\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2}' });
                break;
            }

            case 'solve_equation': {
                res.push({ label: 'Equation Type', value: `\\sin x = ${Math.sin(angRad).toFixed(4)}` });

                const sinVal = Math.sin(angRad);
                const alpha = Math.asin(Math.abs(sinVal));

                res.push({ label: 'Reference Angle', value: `\\alpha = ${toDegrees(alpha).toFixed(2)}°` });
                res.push({ label: 'General Solution for \\sin x = \\sin\\alpha', value: `x = n\\pi + (-1)^n \\alpha, n \\in \\mathbb{Z}` });

                // First few solutions
                for (let n = -2; n <= 2; n++) {
                    const solution = n * 180 + Math.pow(-1, n) * toDegrees(alpha);
                    res.push({ label: `n = ${n}`, value: `x = ${solution.toFixed(2)}°` });
                }

                res.push({ label: 'General Solution for \\cos x = \\cos\\alpha', value: `x = 2n\\pi \\pm \\alpha, n \\in \\mathbb{Z}` });
                res.push({ label: 'General Solution for \\tan x = \\tan\\alpha', value: `x = n\\pi + \\alpha, n \\in \\mathbb{Z}` });
                break;
            }

            case 'triangle_laws': {
                const a = parseFloat(sideA) || 5;
                const b = parseFloat(sideB) || 7;
                const c = parseFloat(sideC) || 8;
                const A = toRadians(parseFloat(angleA) || 60);

                res.push({ label: 'Triangle', value: `a = ${a}, b = ${b}, c = ${c}, A = ${toDegrees(A).toFixed(2)}°` });

                // Sine Rule
                res.push({ label: 'Sine Rule', value: `\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R` });
                const sinARatio = a / Math.sin(A);
                res.push({ label: '\\frac{a}{\\sin A}', value: `\\frac{${a}}{\\sin(${toDegrees(A).toFixed(2)}°)} = \\frac{${a}}{${Math.sin(A).toFixed(4)}} = ${sinARatio.toFixed(4)}` });
                res.push({ label: 'Circumradius R', value: `R = \\frac{${sinARatio.toFixed(4)}}{2} = ${(sinARatio / 2).toFixed(4)}` });

                // Cosine Rule
                res.push({ label: 'Cosine Rule', value: `a^2 = b^2 + c^2 - 2bc\\cos A` });
                const cosARHS = b * b + c * c - 2 * b * c * Math.cos(A);
                res.push({ label: 'Check', value: `a^2 = ${b}^2 + ${c}^2 - 2(${b})(${c})\\cos(${toDegrees(A).toFixed(2)}°) = ${cosARHS.toFixed(4)}` });
                res.push({ label: 'a', value: `= \\sqrt{${cosARHS.toFixed(4)}} = ${Math.sqrt(cosARHS).toFixed(4)}` });

                // Find angle using cosine rule
                if (a > 0 && b > 0 && c > 0) {
                    const cosAngleA = (b * b + c * c - a * a) / (2 * b * c);
                    if (Math.abs(cosAngleA) <= 1) {
                        const angleFromSides = Math.acos(cosAngleA);
                        res.push({ label: 'Angle A from sides', value: `\\cos A = \\frac{b^2+c^2-a^2}{2bc} = ${cosAngleA.toFixed(4)} \\Rightarrow A = ${toDegrees(angleFromSides).toFixed(2)}°` });
                    }
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
                        {(operation !== 'triangle_laws') && (
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium mb-1">Angle</label>
                                    <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium mb-1">Unit</label>
                                    <select value={angleUnit} onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')} className="w-full px-2 py-2 rounded-lg border border-input bg-background input-focus text-sm">
                                        <option value="degrees">Deg</option>
                                        <option value="radians">Rad</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {operation === 'compound_angle' && (
                            <div>
                                <label className="block text-xs font-medium mb-1">Second Angle</label>
                                <input type="number" value={angle2} onChange={(e) => setAngle2(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                        )}

                        {operation === 'inverse' && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Function</label>
                                    <select value={inverseFunc} onChange={(e) => setInverseFunc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus">
                                        <option value="sin">arcsin</option>
                                        <option value="cos">arccos</option>
                                        <option value="tan">arctan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Value</label>
                                    <input type="number" step="0.1" value={inverseValue} onChange={(e) => setInverseValue(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
                        )}

                        {operation === 'triangle_laws' && (
                            <>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs mb-1">Side a</label>
                                        <input type="number" value={sideA} onChange={(e) => setSideA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">Side b</label>
                                        <input type="number" value={sideB} onChange={(e) => setSideB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">Side c</label>
                                        <input type="number" value={sideC} onChange={(e) => setSideC(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Angle A (degrees)</label>
                                    <input type="number" value={angleA} onChange={(e) => setAngleA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </>
                        )}

                        {operation === 'heights_distances' && (
                            <div className="space-y-4">
                                <div><label className="block text-xs font-medium mb-1">Angle of Elevation/Depression</label><input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" /></div>
                                <p className="text-xs text-muted-foreground">Fill exactly ONE of the below:</p>
                                <div><label className="block text-xs mb-1">Height (Opposite)</label><input type="number" value={sideA} onChange={(e) => { setSideA(e.target.value); setSideB(''); setSideC(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                                <div><label className="block text-xs mb-1">Base Distance (Adjacent)</label><input type="number" value={sideB} onChange={(e) => { setSideB(e.target.value); setSideA(''); setSideC(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                                <div><label className="block text-xs mb-1">Line of Sight (Hypotenuse)</label><input type="number" value={sideC} onChange={(e) => { setSideC(e.target.value); setSideA(''); setSideB(''); }} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" placeholder="?" /></div>
                            </div>
                        )}
                    </div>

                    <button onClick={calculate} className="w-full btn-primary py-3">
                        Calculate
                    </button>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">Standard Values:</p>
                        <p>sin 0 = 0, sin 30 = 0.5, sin 45 = 0.707, sin 60 = 0.866, sin 90 = 1</p>
                        <p>cos 0 = 1, cos 30 = 0.866, cos 45 = 0.707, cos 60 = 0.5, cos 90 = 0</p>
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
