'use client';

import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';

// Dynamic import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="animate-pulse text-muted-foreground">Loading graph...</div>
        </div>
    ),
});

interface PlotElement {
    type: string;
    data: Record<string, any>;
    style?: Record<string, any>;
}

interface PlotlyGraphProps {
    elements: PlotElement[];
    title?: string;
    className?: string;
    height?: number;
}

/**
 * PlotlyGraph component that renders plot elements from the backend.
 */
export const PlotlyGraph = memo(function PlotlyGraph({
    elements,
    title = '',
    className = '',
    height = 500
}: PlotlyGraphProps) {
    const { traces, layout } = useMemo(() => {
        // ... same logic
        const traces: any[] = [];
        let is3D = false;

        for (const element of elements) {
            const trace = elementToTrace(element);
            if (trace) {
                if (Array.isArray(trace)) {
                    traces.push(...trace);
                    if (trace.some(t => t.type === 'surface' || t.type === 'scatter3d')) is3D = true;
                } else {
                    traces.push(trace);
                    if (trace.type === 'surface' || trace.type === 'scatter3d') is3D = true;
                }
            }
        }

        const baseLayout: any = {
            title: title ? { text: title, font: { size: 16 } } : undefined,
            showlegend: true,
            legend: {
                orientation: 'h',
                yanchor: 'bottom',
                y: 1.02,
                xanchor: 'right',
                x: 1,
            },
            margin: { l: 50, r: 30, t: 50, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            hovermode: 'closest',
        };

        if (is3D) {
            baseLayout.scene = {
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                zaxis: { title: 'Z' },
                aspectmode: 'cube',
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            };
            // Remove 2D axes for 3D plots
            delete baseLayout.xaxis;
            delete baseLayout.yaxis;
        } else {
            baseLayout.xaxis = {
                zeroline: true,
                showgrid: true,
                gridcolor: 'rgba(128, 128, 128, 0.2)',
                zerolinecolor: 'rgba(128, 128, 128, 0.5)',
            };
            baseLayout.yaxis = {
                zeroline: true,
                showgrid: true,
                gridcolor: 'rgba(128, 128, 128, 0.2)',
                zerolinecolor: 'rgba(128, 128, 128, 0.5)',
                scaleanchor: 'x',
                scaleratio: 1,
            };
        }

        return { traces, layout: baseLayout };
    }, [elements, title]);

    if (elements.length === 0) {
        return (
            <div className={`w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`} style={{ height }}>
                <p className="text-muted-foreground">No data to display</p>
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            <Plot
                data={traces}
                layout={layout}
                config={{
                    responsive: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                }}
                style={{ width: '100%', height }}
                useResizeHandler
            />
        </div>
    );
});

/**
 * Convert a plot element to a Plotly trace.
 */
function elementToTrace(element: PlotElement): any {
    const { type, data, style = {} } = element;

    switch (type) {
        case 'curve':
        case 'scatter':
            return {
                x: data.points?.map((p: number[]) => p[0]) || [],
                y: data.points?.map((p: number[]) => p[1]) || [],
                type: 'scatter',
                mode: style.mode || 'lines',
                name: data.label || '',
                line: {
                    color: style.color || '#3b82f6',
                    width: style.width || 2,
                    dash: style.dash,
                },
                marker: {
                    color: style.color || '#3b82f6',
                    size: style.size || 8,
                },
            };

        case 'point':
            return {
                x: [data.coords[0]],
                y: [data.coords[1]],
                type: 'scatter',
                mode: 'markers+text',
                name: data.label || 'point',
                text: [data.label || ''],
                textposition: 'top right',
                marker: {
                    color: style.color || '#ef4444',
                    size: style.size || 10,
                },
            };

        case 'points':
            return {
                x: data.coords?.map((p: number[]) => p[0]) || [],
                y: data.coords?.map((p: number[]) => p[1]) || [],
                type: 'scatter',
                mode: 'markers+text',
                name: data.label || 'points',
                text: data.labels || [],
                textposition: 'top center',
                marker: {
                    color: style.color || '#22c55e',
                    size: style.size || 10,
                },
            };

        case 'line':
        case 'segment':
            return {
                x: [data.from[0], data.to[0]],
                y: [data.from[1], data.to[1]],
                type: 'scatter',
                mode: 'lines',
                name: data.label || '',
                line: {
                    color: style.color || '#3b82f6',
                    width: style.width || 2,
                    dash: style.dash,
                },
            };

        case 'circle':
            const theta = Array.from({ length: 100 }, (_, i) => (i / 99) * 2 * Math.PI);
            return {
                x: theta.map(t => data.center[0] + data.radius * Math.cos(t)),
                y: theta.map(t => data.center[1] + data.radius * Math.sin(t)),
                type: 'scatter',
                mode: 'lines',
                name: data.label || 'circle',
                line: {
                    color: style.line?.color || '#3b82f6',
                    width: 2,
                },
            };

        case 'area':
            return {
                x: data.points?.map((p: number[]) => p[0]) || [],
                y: data.points?.map((p: number[]) => p[1]) || [],
                type: 'scatter',
                mode: 'lines',
                fill: 'tozeroy',
                fillcolor: style.color || 'rgba(59, 130, 246, 0.3)',
                line: { color: style.color || 'rgba(59, 130, 246, 0.8)' },
                name: 'area',
            };

        case 'polygon':
            const vertices = data.vertices || [];
            return {
                x: [...vertices.map((v: number[]) => v[0]), vertices[0]?.[0]],
                y: [...vertices.map((v: number[]) => v[1]), vertices[0]?.[1]],
                type: 'scatter',
                mode: 'lines',
                fill: 'toself',
                fillcolor: style.fillcolor || 'rgba(59, 130, 246, 0.2)',
                line: {
                    color: style.line?.color || '#3b82f6',
                },
                name: data.label || 'polygon',
            };

        // --- 3D Elements ---

        case 'surface':
            return {
                type: 'surface',
                x: data.x,
                y: data.y,
                z: data.z,
                colorscale: data.colorscale || 'Viridis',
                opacity: data.opacity || 0.8,
                name: style.title || '3D Surface',
                showscale: false
            };

        case 'vector_3d':
            return {
                type: 'scatter3d',
                mode: 'lines+markers',
                x: [data.start[0], data.end[0]],
                y: [data.start[1], data.end[1]],
                z: [data.start[2], data.end[2]],
                line: {
                    width: 6,
                    color: style.color || 'blue'
                },
                marker: {
                    size: 4,
                    color: style.color || 'blue'
                },
                name: data.label || 'Vector'
            };

        default:
            console.warn(`Unknown plot element type: ${type}`);
            return null;
    }
}
