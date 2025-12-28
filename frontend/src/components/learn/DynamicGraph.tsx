'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export interface GraphFunction {
    expression: string;
    color?: string;
    label?: string;
}

export interface GraphConfig {
    title?: string;
    functions: GraphFunction[];
    xRange: [number, number];
    yRange: [number, number];
}

interface DynamicGraphProps {
    config: GraphConfig;
}

export function DynamicGraph({ config }: DynamicGraphProps) {
    const { title, functions, xRange, yRange } = config;

    const data = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const traces: any[] = [];
        const [xMin, xMax] = xRange;
        const step = (xMax - xMin) / 200; // Resolution

        functions.forEach((func) => {
            const xValues: number[] = [];
            const yValues: number[] = [];

            for (let x = xMin; x <= xMax; x += step) {
                try {
                    // Safe-ish evaluation with Math context
                    // Replace standard operators
                    const jsExpression = func.expression.replace(/\^/g, '**');
                    // Create function with Math environment
                    const evaluate = new Function('x', `
                        const { sin, cos, tan, asin, acos, atan, sqrt, abs, pow, log, log10, PI, E, exp } = Math;
                        return ${jsExpression};
                    `);
                    const y = evaluate(x);

                    if (isFinite(y)) {
                        xValues.push(x);
                        yValues.push(y);
                    }
                } catch (e) {
                    console.error(`Error evaluating expression: ${func.expression}`, e);
                }
            }

            traces.push({
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                name: func.label || func.expression,
                line: { color: func.color || '#3b82f6', width: 2 },
            });
        });

        return traces;
    }, [functions, xRange]);

    return (
        <div className="w-full h-[400px] bg-card rounded-lg border border-border p-2">
            <Plot
                data={data}
                layout={{
                    title: {
                        text: title || 'Graph',
                        font: { color: '#e2e8f0' } // text-foreground
                    },
                    autosize: true,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    xaxis: {
                        range: xRange,
                        gridcolor: '#334155', // slate-700
                        zerolinecolor: '#94a3b8', // slate-400
                        color: '#cbd5e1', // slate-300
                    },
                    yaxis: {
                        range: yRange,
                        gridcolor: '#334155',
                        zerolinecolor: '#94a3b8',
                        color: '#cbd5e1',
                    },
                    legend: {
                        font: { color: '#e2e8f0' }
                    },
                    margin: { t: 40, r: 20, l: 40, b: 40 }
                }}
                useResizeHandler={true}
                className="w-full h-full"
                config={{ responsive: true, displayModeBar: false }}
            />
        </div>
    );
}
