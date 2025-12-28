'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathBlock } from '@/components/math/MathDisplay';

type Operation =
    | 'union'
    | 'intersection'
    | 'difference'
    | 'complement'
    | 'cartesian'
    | 'power_set'
    | 'relation_analysis';

const operations = [
    { id: 'union', label: 'Union (A ∪ B)' },
    { id: 'intersection', label: 'Intersection (A ∩ B)' },
    { id: 'difference', label: 'Difference (A - B)' },
    { id: 'complement', label: "Complement (A')" },
    { id: 'cartesian', label: 'Cartesian Product (A × B)' },
    { id: 'power_set', label: 'Power Set P(A)' },
    { id: 'relation_analysis', label: 'Relation Analysis' },
];

export function SetsSolver() {
    const [operation, setOperation] = useState<Operation>('union');
    const [setAStr, setSetAStr] = useState('1, 2, 3');
    const [setBStr, setSetBStr] = useState('3, 4, 5');
    const [univStr, setUnivStr] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
    const [relationStr, setRelationStr] = useState('(1,1), (2,2), (3,3), (1,2)');
    const [results, setResults] = useState<any[] | null>(null);

    // Helper to parse set string
    const parseSet = (str: string): any[] => {
        return str
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => {
                const num = parseFloat(s);
                return isNaN(num) ? s : num;
            });
    };

    // Helper to parse relation string "(1,1), (1,2)" -> [[1,1], [1,2]]
    const parseRelation = (str: string): [any, any][] => {
        if (!str) return [];
        const regex = /\(([^,]+),([^)]+)\)/g;
        const pairs: [any, any][] = [];
        let m: RegExpExecArray | null;
        while ((m = regex.exec(str)) !== null) {
            const a = m[1].trim();
            const b = m[2].trim();
            const na = parseFloat(a);
            const nb = parseFloat(b);
            pairs.push([isNaN(na) ? a : na, isNaN(nb) ? b : nb]);
        }
        return pairs;
    };

    const numericalSort = (arr: any[]) => {
        return arr.slice().sort((a, b) =>
            typeof a === 'number' && typeof b === 'number'
                ? a - b
                : String(a).localeCompare(String(b))
        );
    };

    const calculate = useCallback(() => {
        const A = parseSet(setAStr);
        const B = parseSet(setBStr);
        const U = parseSet(univStr);
        const res: any[] = [];
        const formatSet = (s: any[]) => `\\{ ${s.join(', ')} \\}`;

        if (operation === 'relation_analysis') {
            const R = parseRelation(relationStr);
            res.push({ label: 'Set A', value: formatSet(A) });
            const rStr = R.map(p => `(${p[0]},${p[1]})`).join(', ');
            res.push({ label: 'Relation R', value: `\\{ ${rStr} \\}` });

            // Checks
            const R_set = new Set(R.map(p => `${p[0]},${p[1]}`)); // string key for easy lookup

            // Reflexive: for all a in A, (a,a) in R
            const missingRef = A.filter(a => !R_set.has(`${a},${a}`)).map(a => `(${a},${a})`);
            const isReflexive = missingRef.length === 0;
            res.push({
                label: 'Reflexive',
                value: isReflexive
                    ? '\\text{Yes}'
                    : `\\text{No (Missing: ${missingRef.join(', ')})}`,
            });

            // Symmetric: if (a,b) in R -> (b,a) in R
            const missingSym: string[] = [];
            for (const [a, b] of R) {
                if (!R_set.has(`${b},${a}`)) {
                    missingSym.push(`(${b},${a})`);
                }
            }
            const missingSymUnique = Array.from(new Set(missingSym));
            const isSymmetric = missingSymUnique.length === 0;
            res.push({
                label: 'Symmetric',
                value: isSymmetric ? '\\text{Yes}' : `\\text{No (Missing: ${missingSymUnique.join(', ')})}`,
            });

            // Transitive: if (a,b) and (b,c) -> (a,c)
            const missingTrans: string[] = [];
            for (const [a, b] of R) {
                for (const [c, d] of R) {
                    if (c === b) {
                        if (!R_set.has(`${a},${d}`)) {
                            missingTrans.push(`(${a},${d})`);
                        }
                    }
                }
            }
            const missingTransUnique = Array.from(new Set(missingTrans));
            const isTransitive = missingTransUnique.length === 0;
            res.push({
                label: 'Transitive',
                value: isTransitive
                    ? '\\text{Yes}'
                    : `\\text{No (Missing: ${missingTransUnique.slice(0, 5).join(', ')}...)}`,
            });

            // Equivalence
            const isEquivalence = isReflexive && isSymmetric && isTransitive;
            res.push({ label: 'Equivalence Relation', value: isEquivalence ? '\\text{Yes}' : '\\text{No}' });

            setResults(res);
            return;
        }

        const setA = new Set(A);
        const setB = new Set(B);

        res.push({ label: 'Set A', value: formatSet(A) });
        if (operation !== 'power_set' && operation !== 'complement') {
            res.push({ label: 'Set B', value: formatSet(B) });
        }
        if (operation === 'complement') {
            res.push({ label: 'Universal Set U', value: formatSet(U) });
        }

        switch (operation) {
            case 'union': {
                const union = numericalSort(Array.from(new Set([...A, ...B])));
                res.push({ label: 'Formula', value: 'A \\cup B = \\{ x : x \\in A \\lor x \\in B \\}' });
                res.push({ label: 'A ∪ B', value: formatSet(union) });
                break;
            }
            case 'intersection': {
                const intersection = numericalSort(A.filter(x => setB.has(x)));
                res.push({ label: 'Formula', value: 'A \\cap B = \\{ x : x \\in A \\land x \\in B \\}' });
                res.push({ label: 'A ∩ B', value: formatSet(intersection) });
                break;
            }
            case 'difference': {
                const diff = numericalSort(A.filter(x => !setB.has(x)));
                const diffBA = numericalSort(B.filter(x => !setA.has(x)));
                res.push({ label: 'Formula', value: 'A - B = \\{ x : x \\in A \\land x \\notin B \\}' });
                res.push({ label: 'A - B', value: formatSet(diff) });
                res.push({ label: 'B - A', value: formatSet(diffBA) });
                break;
            }
            case 'complement': {
                const comp = numericalSort(U.filter(x => !setA.has(x)));
                res.push({ label: 'Formula', value: "A' = U - A" });
                res.push({ label: "A'", value: formatSet(comp) });
                break;
            }
            case 'cartesian': {
                const product: string[] = [];
                for (const a of A) {
                    for (const b of B) {
                        product.push(`(${a}, ${b})`);
                    }
                }
                res.push({ label: 'Formula', value: 'A \\times B = \\{ (a,b) : a \\in A, b \\in B \\}' });
                const display = product.length > 20 ? product.slice(0, 20).join(', ') + '...' : product.join(', ');
                res.push({ label: 'A × B', value: `\\{ ${display} \\}` });
                res.push({ label: 'Cardinality', value: `|A \\times B| = |A| \\cdot |B| = ${A.length} \\cdot ${B.length} = ${product.length}` });
                break;
            }
            case 'power_set': {
                const getAllSubsets = (theArray: any[]) =>
                    theArray.reduce((subsets, value) =>
                        subsets.concat(subsets.map((set: any) => [value, ...set])),
                        [[]]
                    );
                const subsets = getAllSubsets(A);
                subsets.sort((a: any[], b: any[]) => a.length - b.length || String(a).localeCompare(String(b)));
                const formattedSubsets = subsets.map((s: any[]) => `\\{${numericalSort(s).join(',')}\\}`).join(', ');
                res.push({ label: 'Formula', value: 'P(A) = \\text{Set of all subsets of A}' });
                res.push({ label: 'Number of Subsets', value: `2^{|A|} = 2^{${A.length}} = ${subsets.length}` });
                res.push({ label: 'P(A)', value: `\\{ ${formattedSubsets} \\}` });
                break;
            }
        }
        setResults(res);
    }, [operation, setAStr, setBStr, univStr, relationStr]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Set Theory Solver
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Perform operations on sets including Union, Intersection, and Power Sets.
                    </p>
                </div>
            </div>

            {/* Controls */}
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Set A (comma separated)</label>
                        <input
                            type="text"
                            value={setAStr}
                            onChange={(e) => setSetAStr(e.target.value)}
                            className="w-full p-2 rounded-md bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                            placeholder="e.g., 1, 2, 3"
                        />
                    </div>

                    {operation !== 'power_set' && operation !== 'complement' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Set B (comma separated)</label>
                            <input
                                type="text"
                                value={setBStr}
                                onChange={(e) => setSetBStr(e.target.value)}
                                className="w-full p-2 rounded-md bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                                placeholder="e.g., 3, 4, 5"
                            />
                        </div>
                    )}
                    {operation === 'complement' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Universal Set U</label>
                            <input
                                type="text"
                                value={univStr}
                                onChange={(e) => setUnivStr(e.target.value)}
                                className="w-full p-2 rounded-md bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                                placeholder="e.g., 1, 2, 3..."
                            />
                        </div>
                    )}

                    {operation === 'relation_analysis' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Relation R (pairs)</label>
                            <input
                                type="text"
                                value={relationStr}
                                onChange={(e) => setRelationStr(e.target.value)}
                                className="w-full p-2 rounded-md bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                                placeholder="e.g., (1,1), (1,2)"
                            />
                            <p className="text-xs text-muted-foreground">Format: (a,b), (c,d)...</p>
                        </div>
                    )}

                    <button
                        onClick={calculate}
                        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        Calculate
                    </button>
                </div>

                {/* Results - now wider */}
                <div className="md:col-span-2 space-y-6">
                    {/* Visualizer (Venn Diagram) */}
                    {(operation === 'union' || operation === 'intersection' || operation === 'difference') && (
                        <div className="p-6 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center">
                            <VennDiagram operation={operation} />
                        </div>
                    )}

                    {results && (
                        <div className="grid gap-4">
                            <AnimatePresence>
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
                                            {/* ensure we pass a string to MathBlock */}
                                            <MathBlock>{String(res.value)}</MathBlock>
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

// Simple Venn Diagram Component
function VennDiagram({ operation }: { operation: Operation }) {
    // Circle centers and radius
    const r = 80;
    const c1 = { x: 120, y: 150 };
    const c2 = { x: 220, y: 150 };

    // Colors
    const activeColor = "rgba(59, 130, 246, 0.6)";
    const inactiveColor = "rgba(100, 116, 139, 0.1)";
    const borderColor = "currentColor";

    let colorA = inactiveColor;
    let colorB = inactiveColor;
    let colorInt = inactiveColor;

    if (operation === 'union') {
        colorA = activeColor;
        colorB = activeColor;
        colorInt = activeColor;
    } else if (operation === 'intersection') {
        colorInt = activeColor;
    } else if (operation === 'difference') {
        colorA = activeColor;
    }

    return (
        <svg width="340" height="300" viewBox="0 0 340 300" className="opacity-90">
            <defs>
                <clipPath id="circleA">
                    <circle cx={c1.x} cy={c1.y} r={r} />
                </clipPath>
                <clipPath id="circleB">
                    <circle cx={c2.x} cy={c2.y} r={r} />
                </clipPath>
            </defs>

            {/* Region A (Left Crescent) */}
            <path
                d={`M 170 87.55 A ${r} ${r} 0 1 0 170 212.45 A ${r} ${r} 0 0 1 170 87.55`}
                fill={colorA}
                stroke={borderColor} strokeWidth="2"
            />

            {/* Region B (Right Crescent) */}
            <path
                d={`M 170 87.55 A ${r} ${r} 0 0 0 170 212.45 A ${r} ${r} 0 1 1 170 87.55`}
                fill={colorB}
                stroke={borderColor} strokeWidth="2"
            />

            {/* Intersection (Lens) */}
            <path
                d={`M 170 87.55 A ${r} ${r} 0 0 1 170 212.45 A ${r} ${r} 0 0 1 170 87.55`}
                fill={colorInt}
                stroke={borderColor} strokeWidth="2"
            />

            {/* Labels */}
            <text x={c1.x - 30} y={c1.y} textAnchor="middle" fill="currentColor" fontSize={18} fontWeight={700}>A</text>
            <text x={c2.x + 30} y={c2.y} textAnchor="middle" fill="currentColor" fontSize={18} fontWeight={700}>B</text>
        </svg>
    );
}
