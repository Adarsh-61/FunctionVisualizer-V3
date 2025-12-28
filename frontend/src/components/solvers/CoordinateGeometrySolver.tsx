'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'distance'
    | 'midpoint'
    | 'section'
    | 'slope'
    | 'line_equation'
    | 'triangle_area'
    | 'collinearity'
    | 'angle_between_lines'
    | 'angle_between_lines'
    | 'point_to_line'
    | 'reflection_point'
    | 'triangle_centers';

const operations = [
    { id: 'distance' as Operation, label: 'Distance Between Points' },
    { id: 'midpoint' as Operation, label: 'Midpoint' },
    { id: 'section' as Operation, label: 'Section Formula' },
    { id: 'slope' as Operation, label: 'Slope of Line' },
    { id: 'line_equation' as Operation, label: 'Equation of Line' },
    { id: 'triangle_area' as Operation, label: 'Area of Triangle' },
    { id: 'collinearity' as Operation, label: 'Collinearity Check' },
    { id: 'angle_between_lines' as Operation, label: 'Angle Between Lines' },
    { id: 'point_to_line' as Operation, label: 'Distance: Point to Line' },
    { id: 'reflection_point' as Operation, label: 'Reflection of Point' },
    { id: 'triangle_centers' as Operation, label: 'Triangle Centers (Centroid, etc.)' },
];

export function CoordinateGeometrySolver() {
    const [operation, setOperation] = useState<Operation>('distance');
    const [x1, setX1] = useState('1');
    const [y1, setY1] = useState('2');
    const [x2, setX2] = useState('4');
    const [y2, setY2] = useState('6');
    const [x3, setX3] = useState('7');
    const [y3, setY3] = useState('2');
    const [m, setM] = useState('2');
    const [n, setN] = useState('1');
    const [lineA, setLineA] = useState('3');
    const [lineB, setLineB] = useState('4');
    const [lineC, setLineC] = useState('-5');
    const [slope1, setSlope1] = useState('2');
    const [slope2, setSlope2] = useState('0.5');
    const [results, setResults] = useState<{ label: string; value: string }[] | null>(null);

    const calculate = () => {
        const res: { label: string; value: string }[] = [];
        const px1 = parseFloat(x1) || 0;
        const py1 = parseFloat(y1) || 0;
        const px2 = parseFloat(x2) || 0;
        const py2 = parseFloat(y2) || 0;
        const px3 = parseFloat(x3) || 0;
        const py3 = parseFloat(y3) || 0;
        const rm = parseFloat(m) || 1;
        const rn = parseFloat(n) || 1;
        const lA = parseFloat(lineA) || 0;
        const lB = parseFloat(lineB) || 0;
        const lC = parseFloat(lineC) || 0;

        switch (operation) {
            case 'distance': {
                res.push({ label: 'Points', value: `P_1(${px1}, ${py1}) \\text{ and } P_2(${px2}, ${py2})` });
                res.push({ label: 'Formula', value: `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}` });

                const dx = px2 - px1;
                const dy = py2 - py1;
                const d = Math.sqrt(dx * dx + dy * dy);

                res.push({ label: 'Step 1', value: `d = \\sqrt{(${px2} - ${px1})^2 + (${py2} - ${py1})^2}` });
                res.push({ label: 'Step 2', value: `= \\sqrt{(${dx})^2 + (${dy})^2}` });
                res.push({ label: 'Step 3', value: `= \\sqrt{${dx * dx} + ${dy * dy}}` });
                res.push({ label: 'Step 4', value: `= \\sqrt{${dx * dx + dy * dy}}` });
                res.push({ label: 'Distance', value: `= ${d.toFixed(4)} \\text{ units}` });
                break;
            }

            case 'midpoint': {
                res.push({ label: 'Points', value: `P_1(${px1}, ${py1}) \\text{ and } P_2(${px2}, ${py2})` });
                res.push({ label: 'Formula', value: `M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)` });

                const mx = (px1 + px2) / 2;
                const my = (py1 + py2) / 2;

                res.push({ label: 'Step 1', value: `M = \\left(\\frac{${px1} + ${px2}}{2}, \\frac{${py1} + ${py2}}{2}\\right)` });
                res.push({ label: 'Midpoint', value: `M = (${mx}, ${my})` });
                break;
            }

            case 'section': {
                res.push({ label: 'Points', value: `A(${px1}, ${py1}) \\text{ and } B(${px2}, ${py2})` });
                res.push({ label: 'Ratio', value: `m:n = ${rm}:${rn}` });
                res.push({ label: 'Formula (Internal)', value: `P = \\left(\\frac{m \\cdot x_2 + n \\cdot x_1}{m+n}, \\frac{m \\cdot y_2 + n \\cdot y_1}{m+n}\\right)` });

                const sx = (rm * px2 + rn * px1) / (rm + rn);
                const sy = (rm * py2 + rn * py1) / (rm + rn);

                res.push({ label: 'Step 1', value: `x = \\frac{${rm}(${px2}) + ${rn}(${px1})}{${rm}+${rn}} = \\frac{${rm * px2 + rn * px1}}{${rm + rn}} = ${sx.toFixed(4)}` });
                res.push({ label: 'Step 2', value: `y = \\frac{${rm}(${py2}) + ${rn}(${py1})}{${rm}+${rn}} = \\frac{${rm * py2 + rn * py1}}{${rm + rn}} = ${sy.toFixed(4)}` });
                res.push({ label: 'Point P (Internal Division)', value: `P = (${sx.toFixed(4)}, ${sy.toFixed(4)})` });

                // External division
                if (rm !== rn) {
                    const ex = (rm * px2 - rn * px1) / (rm - rn);
                    const ey = (rm * py2 - rn * py1) / (rm - rn);
                    res.push({ label: 'Point Q (External Division)', value: `Q = (${ex.toFixed(4)}, ${ey.toFixed(4)})` });
                }
                break;
            }

            case 'slope': {
                res.push({ label: 'Points', value: `P_1(${px1}, ${py1}) \\text{ and } P_2(${px2}, ${py2})` });
                res.push({ label: 'Formula', value: `m = \\frac{y_2 - y_1}{x_2 - x_1}` });

                if (px2 === px1) {
                    res.push({ label: 'Result', value: `\\text{Slope is undefined (vertical line)}` });
                    res.push({ label: 'Line Equation', value: `x = ${px1}` });
                } else {
                    const slope = (py2 - py1) / (px2 - px1);
                    res.push({ label: 'Step 1', value: `m = \\frac{${py2} - ${py1}}{${px2} - ${px1}} = \\frac{${py2 - py1}}{${px2 - px1}}` });
                    res.push({ label: 'Slope', value: `m = ${slope.toFixed(4)}` });
                    res.push({ label: 'Inclination Angle', value: `\\theta = \\tan^{-1}(${slope.toFixed(4)}) = ${(Math.atan(slope) * 180 / Math.PI).toFixed(2)}°` });
                }
                break;
            }

            case 'line_equation': {
                res.push({ label: 'Points', value: `P_1(${px1}, ${py1}) \\text{ and } P_2(${px2}, ${py2})` });

                if (px2 === px1) {
                    res.push({ label: 'Result', value: `x = ${px1} \\text{ (Vertical line)}` });
                } else if (py2 === py1) {
                    res.push({ label: 'Result', value: `y = ${py1} \\text{ (Horizontal line)}` });
                } else {
                    const slope = (py2 - py1) / (px2 - px1);
                    res.push({ label: 'Slope', value: `m = ${slope.toFixed(4)}` });

                    // Point-slope form
                    res.push({ label: 'Point-Slope Form', value: `y - ${py1} = ${slope.toFixed(4)}(x - ${px1})` });

                    // Slope-intercept form
                    const c = py1 - slope * px1;
                    res.push({ label: 'Slope-Intercept Form', value: `y = ${slope.toFixed(4)}x + ${c.toFixed(4)}` });

                    // General form Ax + By + C = 0
                    const A = py2 - py1;
                    const B = px1 - px2;
                    const C = px2 * py1 - px1 * py2;
                    res.push({ label: 'General Form', value: `${A}x + ${B}y + ${C} = 0` });

                    // Two-point form
                    res.push({ label: 'Two-Point Form', value: `\\frac{y - ${py1}}{${py2} - ${py1}} = \\frac{x - ${px1}}{${px2} - ${px1}}` });
                }
                break;
            }

            case 'triangle_area': {
                res.push({ label: 'Vertices', value: `A(${px1}, ${py1}), B(${px2}, ${py2}), C(${px3}, ${py3})` });
                res.push({ label: 'Formula', value: `\\text{Area} = \\frac{1}{2}|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)|` });

                const area = Math.abs(px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2)) / 2;

                res.push({ label: 'Step 1', value: `= \\frac{1}{2}|${px1}(${py2}-${py3}) + ${px2}(${py3}-${py1}) + ${px3}(${py1}-${py2})|` });
                res.push({ label: 'Step 2', value: `= \\frac{1}{2}|${px1}(${py2 - py3}) + ${px2}(${py3 - py1}) + ${px3}(${py1 - py2})|` });
                res.push({ label: 'Step 3', value: `= \\frac{1}{2}|${px1 * (py2 - py3)} + ${px2 * (py3 - py1)} + ${px3 * (py1 - py2)}|` });
                res.push({ label: 'Step 4', value: `= \\frac{1}{2}|${px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2)}|` });
                res.push({ label: 'Area', value: `= ${area.toFixed(4)} \\text{ square units}` });
                break;
            }

            case 'collinearity': {
                res.push({ label: 'Points', value: `A(${px1}, ${py1}), B(${px2}, ${py2}), C(${px3}, ${py3})` });
                res.push({ label: 'Condition', value: `\\text{Points are collinear if Area of triangle = 0}` });

                const area = px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2);

                res.push({ label: 'Determinant', value: `= ${px1}(${py2}-${py3}) + ${px2}(${py3}-${py1}) + ${px3}(${py1}-${py2}) = ${area}` });

                if (area === 0) {
                    res.push({ label: 'Conclusion', value: `\\text{Points ARE collinear (lie on the same line)}` });
                } else {
                    res.push({ label: 'Conclusion', value: `\\text{Points are NOT collinear}` });
                }
                break;
            }

            case 'angle_between_lines': {
                const m1 = parseFloat(slope1) || 0;
                const m2 = parseFloat(slope2) || 0;

                res.push({ label: 'Slopes', value: `m_1 = ${m1}, m_2 = ${m2}` });
                res.push({ label: 'Formula', value: `\\tan\\theta = \\left|\\frac{m_1 - m_2}{1 + m_1 m_2}\\right|` });

                if (m1 * m2 === -1) {
                    res.push({ label: 'Result', value: `\\text{Lines are PERPENDICULAR (angle = 90°)}` });
                    res.push({ label: 'Verification', value: `m_1 \\times m_2 = ${m1} \\times ${m2} = -1` });
                } else if (m1 === m2) {
                    res.push({ label: 'Result', value: `\\text{Lines are PARALLEL (angle = 0°)}` });
                } else {
                    const tanTheta = Math.abs((m1 - m2) / (1 + m1 * m2));
                    const angle = Math.atan(tanTheta) * 180 / Math.PI;

                    res.push({ label: 'Step 1', value: `\\tan\\theta = \\left|\\frac{${m1} - ${m2}}{1 + (${m1})(${m2})}\\right| = \\left|\\frac{${m1 - m2}}{${1 + m1 * m2}}\\right| = ${tanTheta.toFixed(4)}` });
                    res.push({ label: 'Angle', value: `\\theta = ${angle.toFixed(2)}°` });
                }
                break;
            }

            case 'point_to_line': {
                res.push({ label: 'Point', value: `P(${px1}, ${py1})` });
                res.push({ label: 'Line', value: `${lA}x + ${lB}y + ${lC} = 0` });
                res.push({ label: 'Formula', value: `d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}` });

                const numerator = Math.abs(lA * px1 + lB * py1 + lC);
                const denominator = Math.sqrt(lA * lA + lB * lB);
                const distance = numerator / denominator;

                res.push({ label: 'Step 1', value: `d = \\frac{|${lA}(${px1}) + ${lB}(${py1}) + ${lC}|}{\\sqrt{${lA}^2 + ${lB}^2}}` });
                res.push({ label: 'Step 2', value: `= \\frac{|${lA * px1 + lB * py1 + lC}|}{\\sqrt{${lA * lA + lB * lB}}}` });
                res.push({ label: 'Step 3', value: `= \\frac{${numerator}}{${denominator.toFixed(4)}}` });
                res.push({ label: 'Distance', value: `= ${distance.toFixed(4)} \\text{ units}` });
                break;
            }

            case 'reflection_point': {
                res.push({ label: 'Point', value: `P(${px1}, ${py1})` });

                res.push({ label: '1. Reflection over X-axis', value: `(x, -y) \\rightarrow (${px1}, ${-py1})` });
                res.push({ label: '2. Reflection over Y-axis', value: `(-x, y) \\rightarrow (${-px1}, ${py1})` });
                res.push({ label: '3. Reflection over Origin', value: `(-x, -y) \\rightarrow (${-px1}, ${-py1})` });
                res.push({ label: '4. Reflection over Line y = x', value: `(y, x) \\rightarrow (${py1}, ${px1})` });
                res.push({ label: '5. Reflection over Line y = -x', value: `(-y, -x) \\rightarrow (${-py1}, ${-px1})` });
                break;
            }

            case 'triangle_centers': {
                res.push({ label: 'Vertices', value: `A(${px1}, ${py1}), B(${px2}, ${py2}), C(${px3}, ${py3})` });

                // Centroid G
                const gx = (px1 + px2 + px3) / 3;
                const gy = (py1 + py2 + py3) / 3;
                res.push({ label: '1. Centroid (G)', value: `\\left(\\frac{x_1+x_2+x_3}{3}, \\frac{y_1+y_2+y_3}{3}\\right) = (${gx.toFixed(2)}, ${gy.toFixed(2)})` });

                // Side lengths
                const a = Math.sqrt(Math.pow(px2 - px3, 2) + Math.pow(py2 - py3, 2)); // BC
                const b = Math.sqrt(Math.pow(px1 - px3, 2) + Math.pow(py1 - py3, 2)); // AC
                const c = Math.sqrt(Math.pow(px1 - px2, 2) + Math.pow(py1 - py2, 2)); // AB
                const p = a + b + c;

                // Incenter I
                const ix = (a * px1 + b * px2 + c * px3) / p;
                const iy = (a * py1 + b * py2 + c * py3) / p;
                res.push({ label: '2. Incenter (I)', value: `\\left(\\frac{ax_1+bx_2+cx_3}{a+b+c}, \\dots\\right) = (${ix.toFixed(2)}, ${iy.toFixed(2)})` });

                // Circumcenter O (Using geometry or det)
                // D = 2(x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2))
                const D = 2 * (px1 * (py2 - py3) + px2 * (py3 - py1) + px3 * (py1 - py2));
                if (Math.abs(D) < 0.0001) {
                    res.push({ label: 'Error', value: 'Points are collinear, triangle not formed.' });
                } else {
                    const ux = (1 / D) * ((px1 * px1 + py1 * py1) * (py2 - py3) + (px2 * px2 + py2 * py2) * (py3 - py1) + (px3 * px3 + py3 * py3) * (py1 - py2));
                    const uy = (1 / D) * ((px1 * px1 + py1 * py1) * (px3 - px2) + (px2 * px2 + py2 * py2) * (px1 - px3) + (px3 * px3 + py3 * py3) * (px2 - px1));
                    res.push({ label: '3. Circumcenter (O)', value: `(${ux.toFixed(2)}, ${uy.toFixed(2)})` });

                    // Orthocenter H (Euler Line: H = 3G - 2O)
                    const hx = 3 * gx - 2 * ux;
                    const hy = 3 * gy - 2 * uy;
                    res.push({ label: '4. Orthocenter (H)', value: `(Using H = 3G - 2O) = (${hx.toFixed(2)}, ${hy.toFixed(2)})` });
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
                        <p className="text-xs text-muted-foreground font-medium">Point Coordinates</p>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs mb-1">x1</label>
                                <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">y1</label>
                                <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">x2</label>
                                <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">y2</label>
                                <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                            </div>
                        </div>

                        {(operation === 'triangle_area' || operation === 'collinearity' || operation === 'triangle_centers') && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs mb-1">x3</label>
                                    <input type="number" value={x3} onChange={(e) => setX3(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">y3</label>
                                    <input type="number" value={y3} onChange={(e) => setY3(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </div>
                        )}

                        {operation === 'section' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs mb-1">m (ratio)</label>
                                    <input type="number" value={m} onChange={(e) => setM(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">n (ratio)</label>
                                    <input type="number" value={n} onChange={(e) => setN(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                            </div>
                        )}

                        {operation === 'point_to_line' && (
                            <>
                                <p className="text-xs text-muted-foreground font-medium">Line: Ax + By + C = 0</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs mb-1">A</label>
                                        <input type="number" value={lineA} onChange={(e) => setLineA(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">B</label>
                                        <input type="number" value={lineB} onChange={(e) => setLineB(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                    <div>
                                        <label className="block text-xs mb-1">C</label>
                                        <input type="number" value={lineC} onChange={(e) => setLineC(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                    </div>
                                </div>
                            </>
                        )}

                        {operation === 'angle_between_lines' && (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs mb-1">Slope 1 (m1)</label>
                                    <input type="number" step="0.1" value={slope1} onChange={(e) => setSlope1(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Slope 2 (m2)</label>
                                    <input type="number" step="0.1" value={slope2} onChange={(e) => setSlope2(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background input-focus" />
                                </div>
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
                        <p className="text-muted-foreground">Select an operation and enter coordinates.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
