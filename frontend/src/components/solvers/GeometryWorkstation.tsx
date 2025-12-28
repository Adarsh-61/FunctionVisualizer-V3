
'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';
import { PlotlyGraph } from '@/components/graphs/PlotlyGraph';
import { geometryApi, ComputationResult } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type Tab = 'basic' | 'triangle' | 'quad' | 'advanced2d' | 'transform' | 'vector' | 'line3d' | 'plane3d' | 'conic' | 'conicoid3d' | 'mensuration';

export function GeometryWorkstation() {
    const [activeTab, setActiveTab] = useState<Tab>('vector'); // Start with vectors to show advanced
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ComputationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Basic 2D State
    const [basicOp, setBasicOp] = useState('distance');
    const [p1Basic, setP1Basic] = useState({ x: 0, y: 0 });
    const [p2Basic, setP2Basic] = useState({ x: 4, y: 3 });
    const [sectionRatio, setSectionRatio] = useState({ m: '1', n: '1' });

    // Vector State
    const [v1, setV1] = useState<string[]>(['1', '0', '0']);
    const [v2, setV2] = useState<string[]>(['0', '1', '0']);
    const [vectorOp, setVectorOp] = useState('properties');

    // 3D Line / Plane State (Points)
    const [p1, setP1] = useState<string[]>(['0', '0', '0']);
    const [p2, setP2] = useState<string[]>(['1', '1', '1']);
    const [p3, setP3] = useState<string[]>(['1', '0', '0']);

    // Conic State (Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0)
    const [conicCoeffs, setConicCoeffs] = useState({
        A: '1', B: '0', C: '1', D: '0', E: '0', F: '-1'
    });

    // Triangle State
    const [tP1, setTP1] = useState({ x: 0, y: 0 });
    const [tP2, setTP2] = useState({ x: 4, y: 0 });
    const [tP3, setTP3] = useState({ x: 0, y: 3 });

    // Quadrilateral State
    const [qP1, setQP1] = useState({ x: '0', y: '0' });
    const [qP2, setQP2] = useState({ x: '4', y: '0' });
    const [qP3, setQP3] = useState({ x: '4', y: '3' });
    const [qP4, setQP4] = useState({ x: '0', y: '3' });

    // Advanced 2D (Intersections/Tangents)
    const [advOp, setAdvOp] = useState('line_intersect'); // line_intersect, line_circle, circle_circle, tangent
    const [l1, setL1] = useState({ A: '1', B: '-1', C: '0' });
    const [l2, setL2] = useState({ A: '1', B: '1', C: '-2' });
    const [c1, setC1] = useState({ x: '0', y: '0', r: '5' });
    const [c2, setC2] = useState({ x: '5', y: '0', r: '3' });

    const [tanPt, setTanPt] = useState({ x: '10', y: '0' });

    // Transform State
    const [transOp, setTransOp] = useState('rotate'); // rotate, reflect, translate, scale
    const [transPt, setTransPt] = useState({ x: '1', y: '1' });
    const [transParams, setTransParams] = useState({
        angle: '45', cx: '0', cy: '0', dx: '2', dy: '3', factor: '2',
        a: '1', b: '-1', c: '0'
    });

    // Conicoid 3D State
    const [conicoidShape, setConicoidShape] = useState('sphere');
    const [conicoidParams, setConicoidParams] = useState({
        cx: '0', cy: '0', cz: '0', r: '5', a: '3', b: '4', c: '2', h: '5'
    });

    // Mensuration State
    const [mensOp, setMensOp] = useState('heron');
    const [heron, setHeron] = useState({ a: '3', b: '4', c: '5' });
    const [solidShape, setSolidShape] = useState('cylinder');
    const [solidParams, setSolidParams] = useState({ r: '3', h: '5', side: '5', l: '5', b: '3' });

    const handleCompute = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let res: ComputationResult;
            const parseVec = (v: string[]) => v.map(n => parseFloat(n) || 0);

            switch (activeTab) {
                case 'basic':
                    if (basicOp === 'distance') res = await geometryApi.distance(p1Basic, p2Basic);
                    else if (basicOp === 'midpoint') res = await geometryApi.midpoint(p1Basic, p2Basic);
                    else if (basicOp === 'section') res = await geometryApi.section(p1Basic, p2Basic, parseFloat(sectionRatio.m), parseFloat(sectionRatio.n));
                    else if (basicOp === 'line') res = await geometryApi.lineFromPoints(p1Basic, p2Basic);
                    else throw new Error("Unknown basic operation");
                    break;
                case 'triangle':
                    res = await geometryApi.triangleAnalyze(tP1, tP2, tP3);
                    break;
                case 'quad':
                    const parseQP = (p: any) => ({ x: parseFloat(p.x), y: parseFloat(p.y) });
                    res = await geometryApi.quadrilateral(parseQP(qP1), parseQP(qP2), parseQP(qP3), parseQP(qP4));
                    break;
                case 'advanced2d':
                    const parseLine = (l: any) => ({ A: parseFloat(l.A), B: parseFloat(l.B), C: parseFloat(l.C) });
                    const parseCirc = (c: any) => ({ center_x: parseFloat(c.x), center_y: parseFloat(c.y), radius: parseFloat(c.r) });
                    const parsePt = (p: any) => ({ x: parseFloat(p.x), y: parseFloat(p.y) });

                    if (advOp === 'line_intersect') res = await geometryApi.lineIntersection(parseLine(l1), parseLine(l2));
                    else if (advOp === 'line_circle') res = await geometryApi.lineCircleIntersection(parseLine(l1), parseCirc(c1));
                    else if (advOp === 'circle_circle') res = await geometryApi.circleIntersection(parseCirc(c1), parseCirc(c2));
                    else if (advOp === 'tangent') res = await geometryApi.tangentFromPoint(parseCirc(c1), parsePt(tanPt));
                    else throw new Error("Unknown advanced operation");
                    break;
                case 'transform':
                    const tp = { x: parseFloat(transPt.x), y: parseFloat(transPt.y) };
                    const tParams: Record<string, number> = {};
                    if (transOp === 'rotate') { tParams.cx = parseFloat(transParams.cx); tParams.cy = parseFloat(transParams.cy); tParams.angle = parseFloat(transParams.angle); }
                    else if (transOp === 'reflect') { tParams.a = parseFloat(transParams.a); tParams.b = parseFloat(transParams.b); tParams.c = parseFloat(transParams.c); }
                    else if (transOp === 'translate') { tParams.dx = parseFloat(transParams.dx); tParams.dy = parseFloat(transParams.dy); }
                    else if (transOp === 'scale') { tParams.cx = parseFloat(transParams.cx); tParams.cy = parseFloat(transParams.cy); tParams.factor = parseFloat(transParams.factor); }

                    res = await geometryApi.transform2D(tp, transOp, tParams);
                    break;
                case 'vector':
                    res = await geometryApi.vectorOperate(
                        parseVec(v1),
                        vectorOp === 'properties' ? null : parseVec(v2),
                        vectorOp
                    );
                    break;
                case 'line3d':
                    res = await geometryApi.line3D(parseVec(p1), parseVec(p2));
                    break;
                case 'plane3d':
                    res = await geometryApi.plane3D(parseVec(p1), parseVec(p2), parseVec(p3));
                    break;
                case 'conic':
                    const coeffs = Object.fromEntries(
                        Object.entries(conicCoeffs).map(([k, v]) => [k, parseFloat(v) || 0])
                    );
                    res = await geometryApi.analyzeConic(coeffs);
                    break;
                case 'conicoid3d':
                    const cp: Record<string, number> = {};
                    cp.cx = parseFloat(conicoidParams.cx); cp.cy = parseFloat(conicoidParams.cy); cp.cz = parseFloat(conicoidParams.cz);
                    if (conicoidShape === 'sphere') cp.r = parseFloat(conicoidParams.r);
                    else if (conicoidShape === 'cone' || conicoidShape === 'cylinder') { cp.r = parseFloat(conicoidParams.r); cp.h = parseFloat(conicoidParams.h); }
                    else if (conicoidShape === 'paraboloid') { cp.a = parseFloat(conicoidParams.a); cp.b = parseFloat(conicoidParams.b); }
                    else { cp.a = parseFloat(conicoidParams.a); cp.b = parseFloat(conicoidParams.b); cp.c = parseFloat(conicoidParams.c); }
                    res = await geometryApi.conicoid(conicoidShape, cp);
                    break;
                case 'mensuration':
                    if (mensOp === 'heron') {
                        res = await geometryApi.mensurationHeron(
                            parseFloat(heron.a), parseFloat(heron.b), parseFloat(heron.c)
                        );
                    } else {
                        // Filter params based on shape
                        const params: Record<string, number> = {};
                        if (solidShape === 'cube') params.side = parseFloat(solidParams.side);
                        else if (solidShape === 'cuboid') { params.l = parseFloat(solidParams.l); params.b = parseFloat(solidParams.b); params.h = parseFloat(solidParams.h); }
                        else if (solidShape === 'cylinder' || solidShape === 'cone') { params.r = parseFloat(solidParams.r); params.h = parseFloat(solidParams.h); }
                        else if (solidShape === 'sphere') { params.r = parseFloat(solidParams.r); }

                        res = await geometryApi.mensurationSolid(solidShape, params);
                    }
                    break;
                default:
                    throw new Error("Invalid tab");
            }
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-2 justify-center">
                {[
                    { id: 'basic', label: '2D Basics' },
                    { id: 'triangle', label: 'Triangles' },
                    { id: 'quad', label: 'Quadrilaterals' },
                    { id: 'advanced2d', label: 'Intersections' },
                    { id: 'transform', label: 'Transformations' },
                    { id: 'vector', label: '3D Vectors' },
                    { id: 'line3d', label: '3D Lines' },
                    { id: 'plane3d', label: '3D Planes' },
                    { id: 'conic', label: 'Conic Sections' },
                    { id: 'conicoid3d', label: '3D Conicoids' },
                    { id: 'mensuration', label: 'Mensuration' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as Tab); setResult(null); setError(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent text-muted-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <motion.div
                    className="lg:col-span-1 bg-card rounded-xl border border-border p-6 h-fit"
                >
                    <h2 className="text-lg font-semibold mb-4">Input</h2>

                    <div className="space-y-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-4">
                                <select value={basicOp} onChange={(e) => setBasicOp(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm">
                                    <option value="distance">Distance</option>
                                    <option value="midpoint">Midpoint</option>
                                    <option value="section">Section Formula</option>
                                    <option value="line">Line Equation</option>
                                </select>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-xs">Point 1 (x,y)</label>
                                        <div className="flex gap-1"><input type="number" value={p1Basic.x} onChange={e => setP1Basic({ ...p1Basic, x: parseFloat(e.target.value) || 0 })} className="w-full p-1 border rounded text-sm" /><input type="number" value={p1Basic.y} onChange={e => setP1Basic({ ...p1Basic, y: parseFloat(e.target.value) || 0 })} className="w-full p-1 border rounded text-sm" /></div>
                                    </div>
                                    <div><label className="text-xs">Point 2 (x,y)</label>
                                        <div className="flex gap-1"><input type="number" value={p2Basic.x} onChange={e => setP2Basic({ ...p2Basic, x: parseFloat(e.target.value) || 0 })} className="w-full p-1 border rounded text-sm" /><input type="number" value={p2Basic.y} onChange={e => setP2Basic({ ...p2Basic, y: parseFloat(e.target.value) || 0 })} className="w-full p-1 border rounded text-sm" /></div>
                                    </div>
                                </div>
                                {basicOp === 'section' && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">Ratio m</label><input type="number" value={sectionRatio.m} onChange={e => setSectionRatio({ ...sectionRatio, m: e.target.value })} className="w-full p-1 border rounded text-sm" /></div>
                                        <div><label className="text-xs">Ratio n</label><input type="number" value={sectionRatio.n} onChange={e => setSectionRatio({ ...sectionRatio, n: e.target.value })} className="w-full p-1 border rounded text-sm" /></div>
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'triangle' && (
                            <div className="space-y-4">
                                <p className="text-sm font-medium">Triangle Vertices</p>
                                <PointInput label="Vertex A" point={tP1} onChange={setTP1} />
                                <PointInput label="Vertex B" point={tP2} onChange={setTP2} />
                                <PointInput label="Vertex C" point={tP3} onChange={setTP3} />
                            </div>
                        )}

                        {activeTab === 'quad' && (
                            <div className="space-y-4">
                                <p className="text-sm font-medium">Quadrilateral Vertices (in order)</p>
                                {[qP1, qP2, qP3, qP4].map((p, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <label className="text-xs w-4">P{i + 1}</label>
                                        <input value={p.x} onChange={e => [setQP1, setQP2, setQP3, setQP4][i]({ ...p, x: e.target.value })} className="w-full p-1 border rounded text-sm" placeholder="x" />
                                        <input value={p.y} onChange={e => [setQP1, setQP2, setQP3, setQP4][i]({ ...p, y: e.target.value })} className="w-full p-1 border rounded text-sm" placeholder="y" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'advanced2d' && (
                            <div className="space-y-4">
                                <select value={advOp} onChange={(e) => setAdvOp(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm">
                                    <option value="line_intersect">Line-Line Intersection</option>
                                    <option value="line_circle">Line-Circle Intersection</option>
                                    <option value="circle_circle">Circle-Circle Intersection</option>
                                    <option value="tangent">Tangents from Point</option>
                                </select>

                                {advOp === 'line_intersect' && (
                                    <>
                                        <LineInput label="Line 1 (Ax+By+C=0)" params={l1} onChange={setL1} />
                                        <LineInput label="Line 2 (Ax+By+C=0)" params={l2} onChange={setL2} />
                                    </>
                                )}
                                {advOp === 'line_circle' && (
                                    <>
                                        <LineInput label="Line" params={l1} onChange={setL1} />
                                        <CircleInput label="Circle" params={c1} onChange={setC1} />
                                    </>
                                )}
                                {advOp === 'circle_circle' && (
                                    <>
                                        <CircleInput label="Circle 1" params={c1} onChange={setC1} />
                                        <CircleInput label="Circle 2" params={c2} onChange={setC2} />
                                    </>
                                )}
                                {advOp === 'tangent' && (
                                    <>
                                        <CircleInput label="Circle" params={c1} onChange={setC1} />
                                        <PointInputStr label="Point P" point={tanPt} onChange={setTanPt} />
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'transform' && (
                            <div className="space-y-4">
                                <PointInputStr label="Point to Transform" point={transPt} onChange={setTransPt} />

                                <select value={transOp} onChange={(e) => setTransOp(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm">
                                    <option value="rotate">Rotate</option>
                                    <option value="reflect">Reflect</option>
                                    <option value="translate">Translate</option>
                                    <option value="scale">Scale</option>
                                </select>

                                {transOp === 'rotate' && (
                                    <>
                                        <div><label className="text-xs">Angle (deg)</label><input value={transParams.angle} onChange={e => setTransParams({ ...transParams, angle: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div className="flex gap-2">
                                            <div><label className="text-xs">Center X</label><input value={transParams.cx} onChange={e => setTransParams({ ...transParams, cx: e.target.value })} className="w-full p-2 border rounded" /></div>
                                            <div><label className="text-xs">Center Y</label><input value={transParams.cy} onChange={e => setTransParams({ ...transParams, cy: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        </div>
                                    </>
                                )}
                                {transOp === 'reflect' && (
                                    <LineInput label="Reflection Line" params={{ A: transParams.a, B: transParams.b, C: transParams.c }} onChange={p => setTransParams({ ...transParams, a: p.A, b: p.B, c: p.C })} />
                                )}
                                {transOp === 'translate' && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">Delta X</label><input value={transParams.dx} onChange={e => setTransParams({ ...transParams, dx: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">Delta Y</label><input value={transParams.dy} onChange={e => setTransParams({ ...transParams, dy: e.target.value })} className="w-full p-2 border rounded" /></div>
                                    </div>
                                )}
                                {transOp === 'scale' && (
                                    <>
                                        <div><label className="text-xs">Factor k</label><input value={transParams.factor} onChange={e => setTransParams({ ...transParams, factor: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div className="flex gap-2">
                                            <div><label className="text-xs">Center X</label><input value={transParams.cx} onChange={e => setTransParams({ ...transParams, cx: e.target.value })} className="w-full p-2 border rounded" /></div>
                                            <div><label className="text-xs">Center Y</label><input value={transParams.cy} onChange={e => setTransParams({ ...transParams, cy: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'vector' && (
                            <div className="space-y-4">
                                <select
                                    value={vectorOp}
                                    onChange={(e) => setVectorOp(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="properties">Vector Properties</option>
                                    <option value="dot">Dot Product</option>
                                    <option value="cross">Cross Product</option>
                                    <option value="angle">Angle Between</option>
                                    <option value="projection">Projection</option>
                                </select>

                                <VectorInput label="Vector 1" values={v1} onChange={setV1} />
                                {vectorOp !== 'properties' && (
                                    <VectorInput label="Vector 2" values={v2} onChange={setV2} />
                                )}
                            </div>
                        )}

                        {activeTab === 'mensuration' && (
                            <div className="space-y-4">
                                <select
                                    value={mensOp}
                                    onChange={(e) => setMensOp(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                >
                                    <option value="heron">Heron&apos;s Formula (Triangle Area)</option>
                                    <option value="solid">Surface Area & Volume</option>
                                </select>

                                {mensOp === 'heron' && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Triangle Sides</p>
                                        <div className="flex gap-2">
                                            <input type="number" value={heron.a} onChange={e => setHeron({ ...heron, a: e.target.value })} className="w-full p-2 border rounded" placeholder="a" />
                                            <input type="number" value={heron.b} onChange={e => setHeron({ ...heron, b: e.target.value })} className="w-full p-2 border rounded" placeholder="b" />
                                            <input type="number" value={heron.c} onChange={e => setHeron({ ...heron, c: e.target.value })} className="w-full p-2 border rounded" placeholder="c" />
                                        </div>
                                    </div>
                                )}

                                {mensOp === 'solid' && (
                                    <div className="space-y-4">
                                        <select
                                            value={solidShape}
                                            onChange={(e) => setSolidShape(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                        >
                                            <option value="cube">Cube</option>
                                            <option value="cuboid">Cuboid</option>
                                            <option value="cylinder">Cylinder</option>
                                            <option value="cone">Cone</option>
                                            <option value="sphere">Sphere</option>
                                        </select>

                                        <div className="grid grid-cols-2 gap-4">
                                            {solidShape === 'cube' && (
                                                <div><label className="text-xs">Side</label><input type="number" value={solidParams.side} onChange={e => setSolidParams({ ...solidParams, side: e.target.value })} className="w-full p-2 border rounded" /></div>
                                            )}
                                            {solidShape === 'cuboid' && (
                                                <>
                                                    <div><label className="text-xs">Length</label><input type="number" value={solidParams.l} onChange={e => setSolidParams({ ...solidParams, l: e.target.value })} className="w-full p-2 border rounded" /></div>
                                                    <div><label className="text-xs">Breadth</label><input type="number" value={solidParams.b} onChange={e => setSolidParams({ ...solidParams, b: e.target.value })} className="w-full p-2 border rounded" /></div>
                                                    <div><label className="text-xs">Height</label><input type="number" value={solidParams.h} onChange={e => setSolidParams({ ...solidParams, h: e.target.value })} className="w-full p-2 border rounded" /></div>
                                                </>
                                            )}
                                            {(solidShape === 'cylinder' || solidShape === 'cone') && (
                                                <>
                                                    <div><label className="text-xs">Radius</label><input type="number" value={solidParams.r} onChange={e => setSolidParams({ ...solidParams, r: e.target.value })} className="w-full p-2 border rounded" /></div>
                                                    <div><label className="text-xs">Height</label><input type="number" value={solidParams.h} onChange={e => setSolidParams({ ...solidParams, h: e.target.value })} className="w-full p-2 border rounded" /></div>
                                                </>
                                            )}
                                            {solidShape === 'sphere' && (
                                                <div><label className="text-xs">Radius</label><input type="number" value={solidParams.r} onChange={e => setSolidParams({ ...solidParams, r: e.target.value })} className="w-full p-2 border rounded" /></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'line3d' && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Line passing through two points:</p>
                                <VectorInput label="Point P1" values={p1} onChange={setP1} labels={['x', 'y', 'z']} />
                                <VectorInput label="Point P2" values={p2} onChange={setP2} labels={['x', 'y', 'z']} />
                            </div>
                        )}

                        {activeTab === 'plane3d' && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Plane passing through three points:</p>
                                <VectorInput label="Point P1" values={p1} onChange={setP1} labels={['x', 'y', 'z']} />
                                <VectorInput label="Point P2" values={p2} onChange={setP2} labels={['x', 'y', 'z']} />
                                <VectorInput label="Point P3" values={p3} onChange={setP3} labels={['x', 'y', 'z']} />
                            </div>
                        )}

                        {activeTab === 'conic' && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground font-mono text-center mb-4">
                                    Ax² + Bxy + Cy² + Dx + Ey + F = 0
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(conicCoeffs).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <label className="font-mono text-sm w-4">{key}</label>
                                            <input
                                                value={val}
                                                onChange={(e) => setConicCoeffs(c => ({ ...c, [key]: e.target.value }))}
                                                className="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'conicoid3d' && (
                            <div className="space-y-4">
                                <select value={conicoidShape} onChange={(e) => setConicoidShape(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm">
                                    <option value="sphere">Sphere</option>
                                    <option value="ellipsoid">Ellipsoid</option>
                                    <option value="cone">Cone</option>
                                    <option value="cylinder">Cylinder</option>
                                    <option value="hyperboloid1">Hyperboloid (1 Sheet)</option>
                                    <option value="hyperboloid2">Hyperboloid (2 Sheets)</option>
                                    <option value="paraboloid">Elliptic Paraboloid</option>
                                </select>

                                <div className="space-y-2 border p-3 rounded-md">
                                    <p className="text-xs font-medium text-muted-foreground">Center</p>
                                    <div className="flex gap-2">
                                        <input value={conicoidParams.cx} onChange={e => setConicoidParams({ ...conicoidParams, cx: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="cx" />
                                        <input value={conicoidParams.cy} onChange={e => setConicoidParams({ ...conicoidParams, cy: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="cy" />
                                        <input value={conicoidParams.cz} onChange={e => setConicoidParams({ ...conicoidParams, cz: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="cz" />
                                    </div>
                                </div>

                                {conicoidShape === 'sphere' && (
                                    <div><label className="text-xs">Radius</label><input value={conicoidParams.r} onChange={e => setConicoidParams({ ...conicoidParams, r: e.target.value })} className="w-full p-2 border rounded" /></div>
                                )}
                                {conicoidShape === 'ellipsoid' && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">a (x-axis)</label><input value={conicoidParams.a} onChange={e => setConicoidParams({ ...conicoidParams, a: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">b (y-axis)</label><input value={conicoidParams.b} onChange={e => setConicoidParams({ ...conicoidParams, b: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">c (z-axis)</label><input value={conicoidParams.c} onChange={e => setConicoidParams({ ...conicoidParams, c: e.target.value })} className="w-full p-2 border rounded" /></div>
                                    </div>
                                )}
                                {(conicoidShape === 'hyperboloid1' || conicoidShape === 'hyperboloid2') && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">a</label><input value={conicoidParams.a} onChange={e => setConicoidParams({ ...conicoidParams, a: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">b</label><input value={conicoidParams.b} onChange={e => setConicoidParams({ ...conicoidParams, b: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">c</label><input value={conicoidParams.c} onChange={e => setConicoidParams({ ...conicoidParams, c: e.target.value })} className="w-full p-2 border rounded" /></div>
                                    </div>
                                )}
                                {(conicoidShape === 'cone' || conicoidShape === 'cylinder') && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">Radius r</label><input value={conicoidParams.r} onChange={e => setConicoidParams({ ...conicoidParams, r: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">Height h</label><input value={conicoidParams.h} onChange={e => setConicoidParams({ ...conicoidParams, h: e.target.value })} className="w-full p-2 border rounded" /></div>
                                    </div>
                                )}
                                {conicoidShape === 'paraboloid' && (
                                    <div className="flex gap-2">
                                        <div><label className="text-xs">a</label><input value={conicoidParams.a} onChange={e => setConicoidParams({ ...conicoidParams, a: e.target.value })} className="w-full p-2 border rounded" /></div>
                                        <div><label className="text-xs">b</label><input value={conicoidParams.b} onChange={e => setConicoidParams({ ...conicoidParams, b: e.target.value })} className="w-full p-2 border rounded" /></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleCompute}
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Calculate'}
                        </button>

                        {error && (
                            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                                {error}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                >
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* LaTeX Results */}
                                {Object.keys(result.latex).length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4">Results</h3>
                                        <div className="grid gap-4">
                                            {Object.entries(result.latex).map(([key, val]) => (
                                                <div key={key} className="p-4 bg-accent/30 rounded-lg">
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</div>
                                                    <MathBlock>{val}</MathBlock>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Graphs */}
                                {result.plot_elements.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6 h-[500px]">
                                        <h3 className="text-lg font-semibold mb-4">Visualization</h3>
                                        <PlotlyGraph elements={result.plot_elements} height={400} />
                                    </div>
                                )}

                                {/* Steps */}
                                {result.steps.length > 0 && (
                                    <div className="bg-card rounded-xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4">Step-by-Step Solution</h3>
                                        <div className="space-y-3">
                                            {result.steps.map((step, i) => (
                                                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div className="text-sm pt-0.5">
                                                        <MathBlock>{step}</MathBlock>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border p-12">
                                <p>Select an operation and click Calculate to see results</p>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

const VectorInput = memo(function VectorInput({ label, values, onChange, labels = ['x', 'y', 'z'] }: {
    label: string,
    values: string[],
    onChange: (v: string[]) => void,
    labels?: string[]
}) {
    const update = (idx: number, val: string) => {
        const newV = [...values];
        newV[idx] = val;
        onChange(newV);
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex gap-2">
                {values.map((v, i) => (
                    <div key={i} className="relative flex-1">
                        <input
                            value={v}
                            onChange={(e) => update(i, e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 text-sm rounded-md border border-input bg-background"
                            placeholder="0"
                        />
                        <span className="absolute left-2 top-1.5 text-xs text-muted-foreground font-mono">
                            {labels[i]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});

const PointInput = memo(function PointInput({ label, point, onChange }: { label: string, point: { x: number, y: number }, onChange: (p: { x: number, y: number }) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="flex gap-2">
                <input type="number" value={point.x} onChange={e => onChange({ ...point, x: parseFloat(e.target.value) })} className="w-full p-2 border rounded text-sm" placeholder="x" />
                <input type="number" value={point.y} onChange={e => onChange({ ...point, y: parseFloat(e.target.value) })} className="w-full p-2 border rounded text-sm" placeholder="y" />
            </div>
        </div>
    )
});

const PointInputStr = memo(function PointInputStr({ label, point, onChange }: { label: string, point: { x: string, y: string }, onChange: (p: { x: string, y: string }) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="flex gap-2">
                <input type="number" value={point.x} onChange={e => onChange({ ...point, x: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="x" />
                <input type="number" value={point.y} onChange={e => onChange({ ...point, y: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="y" />
            </div>
        </div>
    )
});

const LineInput = memo(function LineInput({ label, params, onChange }: { label: string, params: any, onChange: (p: any) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="flex gap-2 items-center">
                <input value={params.A} onChange={e => onChange({ ...params, A: e.target.value })} className="w-16 p-2 border rounded text-sm" placeholder="A" /><span className="text-xs">x +</span>
                <input value={params.B} onChange={e => onChange({ ...params, B: e.target.value })} className="w-16 p-2 border rounded text-sm" placeholder="B" /><span className="text-xs">y +</span>
                <input value={params.C} onChange={e => onChange({ ...params, C: e.target.value })} className="w-16 p-2 border rounded text-sm" placeholder="C" /><span className="text-xs">= 0</span>
            </div>
        </div>
    )
});

const CircleInput = memo(function CircleInput({ label, params, onChange }: { label: string, params: any, onChange: (p: any) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="flex gap-2 items-center">
                <div className="flex flex-col"><span className="text-[10px] text-muted-foreground">Center X</span><input value={params.x} onChange={e => onChange({ ...params, x: e.target.value })} className="w-16 p-2 border rounded text-sm" /></div>
                <div className="flex flex-col"><span className="text-[10px] text-muted-foreground">Center Y</span><input value={params.y} onChange={e => onChange({ ...params, y: e.target.value })} className="w-16 p-2 border rounded text-sm" /></div>
                <div className="flex flex-col"><span className="text-[10px] text-muted-foreground">Radius</span><input value={params.r} onChange={e => onChange({ ...params, r: e.target.value })} className="w-16 p-2 border rounded text-sm" /></div>
            </div>
        </div>
    )
});
