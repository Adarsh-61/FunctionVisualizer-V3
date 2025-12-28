'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'direction_cosines'
    | 'line_equation_two_points'
    | 'plane_equation_normal'
    | 'angle_between_lines'
    | 'distance_point_plane';

const operations = [
    { id: 'direction_cosines', label: 'Direction Cosines/Ratios' },
    { id: 'line_equation_two_points', label: 'Equation of Line (2 Points)' },
    { id: 'plane_equation_normal', label: 'Equation of Plane (Normal Form)' },
    { id: 'angle_between_lines', label: 'Angle Between Two Lines' },
    { id: 'distance_point_plane', label: 'Distance: Point to Plane' },
];

export function ThreeDGeometrySolver() {
    const [operation, setOperation] = useState<Operation>('direction_cosines');

    // Point 1 / Vector A
    const [x1, setX1] = useState('1');
    const [y1, setY1] = useState('2');
    const [z1, setZ1] = useState('3');

    // Point 2 / Vector B / Normal
    const [x2, setX2] = useState('4');
    const [y2, setY2] = useState('5');
    const [z2, setZ2] = useState('6');

    // For Plane distance: Ax + By + Cz + D = 0
    const [dParam, setDParam] = useState('0');

    const [results, setResults] = useState<any[] | null>(null);

    const calculate = useCallback(() => {
        const p1 = { x: parseFloat(x1) || 0, y: parseFloat(y1) || 0, z: parseFloat(z1) || 0 };
        const p2 = { x: parseFloat(x2) || 0, y: parseFloat(y2) || 0, z: parseFloat(z2) || 0 };
        const res: any[] = [];

        const formatVec = (v: { x: number, y: number, z: number }) =>
            `(${v.x})\\hat{i} + (${v.y})\\hat{j} + (${v.z})\\hat{k}`;

        switch (operation) {
            case 'direction_cosines': {
                // Input x1,y1,z1 as vector a
                const r = Math.sqrt(p1.x * p1.x + p1.y * p1.y + p1.z * p1.z);
                res.push({ label: 'Vector', value: `\\vec{a} = ${formatVec(p1)}` });
                if (r === 0) {
                    res.push({ label: 'Error', value: '\\text{Zero vector undefined direction}' });
                } else {
                    const l = p1.x / r;
                    const m = p1.y / r;
                    const n = p1.z / r;
                    res.push({ label: 'Magnitude r', value: `${r.toFixed(4)}` });
                    res.push({ label: 'Direction Cosines (l, m, n)', value: `l = \\frac{x}{r} = ${l.toFixed(4)}, m = \\frac{y}{r} = ${m.toFixed(4)}, n = \\frac{z}{r} = ${n.toFixed(4)}` });
                    res.push({ label: 'Property Check', value: `l^2 + m^2 + n^2 = ${(l * l + m * m + n * n).toFixed(4)} \\approx 1` });
                }
                break;
            }
            case 'line_equation_two_points': {
                res.push({ label: 'Point A', value: `(${p1.x}, ${p1.y}, ${p1.z})` });
                res.push({ label: 'Point B', value: `(${p2.x}, ${p2.y}, ${p2.z})` });

                const dr = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
                res.push({ label: 'Direction Ratios', value: `\\vec{b} = \\vec{B} - \\vec{A} = ${formatVec(dr)}` });

                res.push({ label: 'Vector Form', value: `\\vec{r} = \\vec{a} + \\lambda\\vec{b} = (${formatVec(p1)}) + \\lambda(${formatVec(dr)})` });

                // Cartesian Check to avoid div by zero in display
                const cx = dr.x === 0 ? '0' : dr.x.toString();
                const cy = dr.y === 0 ? '0' : dr.y.toString();
                const cz = dr.z === 0 ? '0' : dr.z.toString();

                res.push({ label: 'Cartesian Form', value: `\\frac{x - ${p1.x}}{${cx}} = \\frac{y - ${p1.y}}{${cy}} = \\frac{z - ${p1.z}}{${cz}}` });
                break;
            }
            case 'plane_equation_normal': {
                // p1 is normal vector n, p2 is point on plane? Or p1 is n, d is distance?
                // Let's assume Normal Form inputs: Normal Vector (x1, y1, z1), and Distance to Origin d (using x2 as d for simplicity? no use D param)
                // Actually Standard: Vector N and Point A.
                // Or simplified: Normal (A,B,C) and Point (x1, y1, z1).

                // Let's re-use inputs: Normal = (x1, y1, z1), Point on Plane = (x2, y2, z2). 
                // Equation: n . (r - a) = 0 => n.r = n.a
                res.push({ label: 'Normal Vector n', value: formatVec(p1) });
                res.push({ label: 'Point A on Plane', value: `(${p2.x}, ${p2.y}, ${p2.z})` });

                const dVal = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;

                res.push({ label: 'Vector Form', value: `\\vec{r} \\cdot (${formatVec(p1)}) = ${dVal}` });
                res.push({ label: 'Cartesian Form', value: `${p1.x}x + ${p1.y}y + ${p1.z}z = ${dVal}` });
                break;
            }
            case 'angle_between_lines': {
                // Line 1 direction b1: (x1, y1, z1)
                // Line 2 direction b2: (x2, y2, z2)
                res.push({ label: 'Line 1 Direction', value: formatVec(p1) });
                res.push({ label: 'Line 2 Direction', value: formatVec(p2) });

                const dot = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
                const m1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y + p1.z * p1.z);
                const m2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y + p2.z * p2.z);

                if (m1 === 0 || m2 === 0) {
                    res.push({ label: 'Error', value: '\\text{Direction vector cannot be zero}' });
                } else {
                    const cosTheta = Math.abs(dot) / (m1 * m2); // Acute angle usually desired
                    const thetaRad = Math.acos(Math.min(1, cosTheta));
                    const thetaDeg = thetaRad * (180 / Math.PI);

                    res.push({ label: 'Formula', value: '\\cos \\theta = \\left| \\frac{\\vec{b_1} \\cdot \\vec{b_2}}{|\\vec{b_1}||\\vec{b_2}|} \\right|' });
                    res.push({ label: 'Cos Theta', value: `${cosTheta.toFixed(4)}` });
                    res.push({ label: 'Angle', value: `${thetaDeg.toFixed(2)}^{\\circ}` });
                }
                break;
            }
            case 'distance_point_plane': {
                // Point P(x1, y1, z1)
                // Plane: Ax + By + Cz + D = 0 => Use (x2, y2, z2) as (A, B, C) and dParam as D.
                const D = parseFloat(dParam) || 0;
                res.push({ label: 'Point P', value: `(${p1.x}, ${p1.y}, ${p1.z})` });
                res.push({ label: 'Plane', value: `${p2.x}x + ${p2.y}y + ${p2.z}z + ${D} = 0` });

                const num = Math.abs(p2.x * p1.x + p2.y * p1.y + p2.z * p1.z + D);
                const den = Math.sqrt(p2.x * p2.x + p2.y * p2.y + p2.z * p2.z);

                if (den === 0) {
                    res.push({ label: 'Error', value: '\\text{Normal vector cannot be zero}' });
                } else {
                    const dist = num / den;
                    res.push({ label: 'Formula', value: 'd = \\frac{|Ax_1 + By_1 + Cz_1 + D|}{\\sqrt{A^2 + B^2 + C^2}}' });
                    res.push({ label: 'Distance', value: `${dist.toFixed(4)}` });
                }
                break;
            }
        }
        setResults(res);
    }, [operation, x1, y1, z1, x2, y2, z2, dParam]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const InputGroup = ({ label, x, setX, y, setY, z, setZ, labels = ['x', 'y', 'z'] }: any) => (
        <div className="space-y-4 p-4 rounded-lg bg-secondary/20 border border-border">
            <h4 className="font-semibold text-primary">{label}</h4>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="text-xs text-muted-foreground">{labels[0]}</label>
                    <input type="number" value={x} onChange={e => setX(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">{labels[1]}</label>
                    <input type="number" value={y} onChange={e => setY(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">{labels[2]}</label>
                    <input type="number" value={z} onChange={e => setZ(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    3D Geometry Solver
                </h2>
                <p className="text-muted-foreground mt-2">
                    Analyze lines and planes in three-dimensional space.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Operation</label>
                        <select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value as Operation)}
                            className="w-full p-2 rounded-md bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                            {operations.map(op => (
                                <option key={op.id} value={op.id}>{op.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Inputs based on Operation */}
                    {operation === 'direction_cosines' && (
                        <InputGroup label="Vector" x={x1} setX={setX1} y={y1} setY={setY1} z={z1} setZ={setZ1} labels={['i', 'j', 'k']} />
                    )}

                    {operation === 'line_equation_two_points' && (
                        <>
                            <InputGroup label="Point A" x={x1} setX={setX1} y={y1} setY={setY1} z={z1} setZ={setZ1} />
                            <InputGroup label="Point B" x={x2} setX={setX2} y={y2} setY={setY2} z={z2} setZ={setZ2} />
                        </>
                    )}

                    {operation === 'plane_equation_normal' && (
                        <>
                            <InputGroup label="Normal Vector (n)" x={x1} setX={setX1} y={y1} setY={setY1} z={z1} setZ={setZ1} labels={['i', 'j', 'k']} />
                            <InputGroup label="Point on Plane (A)" x={x2} setX={setX2} y={y2} setY={setY2} z={z2} setZ={setZ2} />
                        </>
                    )}

                    {operation === 'angle_between_lines' && (
                        <>
                            <InputGroup label="Line 1 Direction" x={x1} setX={setX1} y={y1} setY={setY1} z={z1} setZ={setZ1} labels={['i', 'j', 'k']} />
                            <InputGroup label="Line 2 Direction" x={x2} setX={setX2} y={y2} setY={setY2} z={z2} setZ={setZ2} labels={['i', 'j', 'k']} />
                        </>
                    )}

                    {operation === 'distance_point_plane' && (
                        <>
                            <InputGroup label="Point P" x={x1} setX={setX1} y={y1} setY={setY1} z={z1} setZ={setZ1} />
                            <InputGroup label="Plane Normal (A,B,C)" x={x2} setX={setX2} y={y2} setY={setY2} z={z2} setZ={setZ2} labels={['A', 'B', 'C']} />
                            <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                                <label className="text-xs text-muted-foreground">Plane Constant D</label>
                                <input type="number" value={dParam} onChange={e => setDParam(e.target.value)} className="w-full p-2 rounded bg-background border border-border" placeholder="D" />
                            </div>
                        </>
                    )}
                </div>

                <div className="md:col-span-2 space-y-4">
                    {results && (
                        <div className="grid gap-4">
                            <AnimatePresence mode="popLayout">
                                {results.map((res, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 rounded-lg bg-secondary/30 border border-border/50 backdrop-blur-sm"
                                    >
                                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                            {res.label}
                                        </div>
                                        <div className="text-lg font-medium">
                                            <MathBlock>{res.value}</MathBlock>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
