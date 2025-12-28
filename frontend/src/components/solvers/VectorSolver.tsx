'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'dot_product'
    | 'cross_product'
    | 'magnitude'
    | 'unit_vector'
    | 'projection'
    | 'angle_between';

const operations = [
    { id: 'dot_product', label: 'Dot Product (a · b)' },
    { id: 'cross_product', label: 'Cross Product (a × b)' },
    { id: 'magnitude', label: 'Magnitude |a|' },
    { id: 'unit_vector', label: 'Unit Vector â' },
    { id: 'projection', label: 'Projection of a on b' },
    { id: 'angle_between', label: 'Angle between a and b' },
];

export function VectorSolver() {
    const [operation, setOperation] = useState<Operation>('dot_product');
    // Vector A
    const [ax, setAx] = useState('1');
    const [ay, setAy] = useState('2');
    const [az, setAz] = useState('3');
    // Vector B
    const [bx, setBx] = useState('4');
    const [by, setBy] = useState('-1');
    const [bz, setBz] = useState('1');

    const [results, setResults] = useState<any[] | null>(null);

    const calculate = useCallback(() => {
        const vA = { x: parseFloat(ax) || 0, y: parseFloat(ay) || 0, z: parseFloat(az) || 0 };
        const vB = { x: parseFloat(bx) || 0, y: parseFloat(by) || 0, z: parseFloat(bz) || 0 };
        const res: any[] = [];

        const formatVec = (v: { x: number, y: number, z: number }) =>
            `(${v.x})\\hat{i} + (${v.y})\\hat{j} + (${v.z})\\hat{k}`;

        const mag = (v: { x: number, y: number, z: number }) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        const dot = (a: { x: number, y: number, z: number }, b: { x: number, y: number, z: number }) => a.x * b.x + a.y * b.y + a.z * b.z;

        res.push({ label: 'Vector a', value: `\\vec{a} = ${formatVec(vA)}` });

        if (operation !== 'magnitude' && operation !== 'unit_vector') {
            res.push({ label: 'Vector b', value: `\\vec{b} = ${formatVec(vB)}` });
        }

        switch (operation) {
            case 'dot_product': {
                const result = dot(vA, vB);
                res.push({ label: 'Formula', value: '\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y + a_z b_z' });
                res.push({ label: 'Calculation', value: `(${vA.x})(${vB.x}) + (${vA.y})(${vB.y}) + (${vA.z})(${vB.z})` });
                res.push({ label: 'Result', value: `= ${result}` });
                break;
            }
            case 'cross_product': {
                const cx = vA.y * vB.z - vA.z * vB.y;
                const cy = vA.z * vB.x - vA.x * vB.z;
                const cz = vA.x * vB.y - vA.y * vB.x;

                res.push({ label: 'Formula', value: '\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{vmatrix}' });
                res.push({ label: 'Determinant expansion', value: `\\hat{i}(${vA.y}\\cdot${vB.z} - ${vA.z}\\cdot${vB.y}) - \\hat{j}(${vA.x}\\cdot${vB.z} - ${vA.z}\\cdot${vB.x}) + \\hat{k}(${vA.x}\\cdot${vB.y} - ${vA.y}\\cdot${vB.x})` });
                res.push({ label: 'Result', value: `\\vec{a} \\times \\vec{b} = ${formatVec({ x: cx, y: cy, z: cz })}` });
                res.push({ label: 'Magnitude of Cross Product (Area of parallelogram)', value: `|\\vec{a} \\times \\vec{b}| = ${Math.sqrt(cx * cx + cy * cy + cz * cz).toFixed(4)}` });
                break;
            }
            case 'magnitude': {
                const m = mag(vA);
                res.push({ label: 'Formula', value: '|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}' });
                res.push({ label: 'Calculation', value: `\\sqrt{(${vA.x})^2 + (${vA.y})^2 + (${vA.z})^2}` });
                res.push({ label: 'Result', value: `= ${m.toFixed(4)}` });
                break;
            }
            case 'unit_vector': {
                const m = mag(vA);
                if (m === 0) {
                    res.push({ label: 'Result', value: '\\text{Zero vector has no unit vector}' });
                } else {
                    res.push({ label: 'Formula', value: '\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}' });
                    res.push({ label: 'Magnitude', value: `|\\vec{a}| = ${m.toFixed(4)}` });
                    res.push({ label: 'Result', value: `\\hat{a} = \\left(\\frac{${vA.x}}{${m.toFixed(2)}}\\right)\\hat{i} + \\left(\\frac{${vA.y}}{${m.toFixed(2)}}\\right)\\hat{j} + \\left(\\frac{${vA.z}}{${m.toFixed(2)}}\\right)\\hat{k}` });
                }
                break;
            }
            case 'projection': {
                const mB = mag(vB);
                if (mB === 0) {
                    res.push({ label: 'Error', value: '\\text{Cannot project on zero vector}' });
                } else {
                    const dotVal = dot(vA, vB);
                    const projMag = dotVal / mB;
                    res.push({ label: 'Formula', value: '\\text{Proj}_{\\vec{b}} \\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}' });
                    res.push({ label: 'Dot Product', value: `${dotVal}` });
                    res.push({ label: 'Magnitude of b', value: `${mB.toFixed(4)}` });
                    res.push({ label: 'Scalar Projection', value: `= ${projMag.toFixed(4)}` });

                    // Vector projection
                    const vecProjX = (projMag * vB.x / mB);
                    const vecProjY = (projMag * vB.y / mB);
                    const vecProjZ = (projMag * vB.z / mB);
                    res.push({ label: 'Vector Projection', value: `\\left(\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\right)\\vec{b} = ${formatVec({ x: vecProjX, y: vecProjY, z: vecProjZ })}` });
                }
                break;
            }
            case 'angle_between': {
                const mA = mag(vA);
                const mB = mag(vB);
                if (mA === 0 || mB === 0) {
                    res.push({ label: 'Error', value: '\\text{Undefined for zero vectors}' });
                } else {
                    const d = dot(vA, vB);
                    const cosTheta = d / (mA * mB);
                    // clamp for FP errors
                    const clampedCos = Math.max(-1, Math.min(1, cosTheta));
                    const thetaRad = Math.acos(clampedCos);
                    const thetaDeg = thetaRad * (180 / Math.PI);

                    res.push({ label: 'Formula', value: '\\theta = \\cos^{-1}\\left(\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}\\right)' });
                    res.push({ label: 'Dot Product', value: `${d}` });
                    res.push({ label: 'Magnitudes', value: `|\\vec{a}|=${mA.toFixed(4)}, |\\vec{b}|=${mB.toFixed(4)}` });
                    res.push({ label: 'Cos Theta', value: `\\cos \\theta = ${clampedCos.toFixed(4)}` });
                    res.push({ label: 'Angle (Radians)', value: `\\theta = ${thetaRad.toFixed(4)} \\text{ rad}` });
                    res.push({ label: 'Angle (Degrees)', value: `\\theta = ${thetaDeg.toFixed(2)}^{\\circ}` });
                }
                break;
            }
        }

        setResults(res);
    }, [operation, ax, ay, az, bx, by, bz]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const InputGroup = ({ label, x, setX, y, setY, z, setZ }: any) => (
        <div className="space-y-4 p-4 rounded-lg bg-secondary/20 border border-border">
            <h4 className="font-semibold text-primary">{label}</h4>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="text-xs text-muted-foreground">i-component</label>
                    <input type="number" value={x} onChange={e => setX(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">j-component</label>
                    <input type="number" value={y} onChange={e => setY(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">k-component</label>
                    <input type="number" value={z} onChange={e => setZ(e.target.value)} className="w-full p-2 rounded bg-background border border-border" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Vector Algebra Solver
                </h2>
                <p className="text-muted-foreground mt-2">
                    Perform operations on 3D vectors including Dot/Cross products and Projections.
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

                    <InputGroup label="Vector A" x={ax} setX={setAx} y={ay} setY={setAy} z={az} setZ={setAz} />

                    {operation !== 'magnitude' && operation !== 'unit_vector' && (
                        <InputGroup label="Vector B" x={bx} setX={setBx} y={by} setY={setBy} z={bz} setZ={setBz} />
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
