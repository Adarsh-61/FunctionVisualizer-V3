/**
 * API Client for Function Visualiser backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic API request handler with error handling.
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// Types
export interface ComputationResult {
    status: string;
    operation: string;
    payload: Record<string, any>;
    steps: string[];
    plot_elements: PlotElement[];
    latex: Record<string, string>;
}

export interface PlotElement {
    type: string;
    data: Record<string, any>;
    style: Record<string, any>;
}

// Calculus API
export const calculusApi = {
    analyze: (expression: string, domainStart: number, domainEnd: number, resolution = 500) =>
        apiRequest<ComputationResult>('/api/math/calculus/analyze', {
            method: 'POST',
            body: JSON.stringify({
                expression,
                domain_start: domainStart,
                domain_end: domainEnd,
                resolution,
            }),
        }),

    derivative: (expression: string, atPoint: number) =>
        apiRequest<ComputationResult>('/api/math/calculus/derivative', {
            method: 'POST',
            body: JSON.stringify({ expression, at_point: atPoint }),
        }),

    integrate: (expression: string, lowerLimit: number, upperLimit: number) =>
        apiRequest<ComputationResult>('/api/math/calculus/integrate', {
            method: 'POST',
            body: JSON.stringify({
                expression,
                lower_limit: lowerLimit,
                upper_limit: upperLimit,
            }),
        }),

    criticalPoints: (expression: string, domainStart?: number, domainEnd?: number) =>
        apiRequest<ComputationResult>('/api/math/calculus/critical-points', {
            method: 'POST',
            body: JSON.stringify({
                expression,
                domain_start: domainStart,
                domain_end: domainEnd,
            }),
        }),

    taylor: (expression: string, center: number, order: number) =>
        apiRequest<ComputationResult>('/api/math/calculus/taylor', {
            method: 'POST',
            body: JSON.stringify({ expression, center, order }),
        }),

    limit: (expression: string, point: number, direction: string) =>
        apiRequest<ComputationResult>('/api/math/calculus/limit', {
            method: 'POST',
            body: JSON.stringify({ expression, point, direction }),
        }),

    indefiniteIntegral: (expression: string) =>
        apiRequest<ComputationResult>('/api/math/calculus/integrate/indefinite', {
            method: 'POST',
            body: JSON.stringify({ expression }),
        }),

    ode: (equation: string) =>
        apiRequest<ComputationResult>('/api/math/calculus/differential-equations', {
            method: 'POST',
            body: JSON.stringify({ equation }),
        }),

    partialDerivative: (expression: string, variable: string) =>
        apiRequest<ComputationResult>('/api/math/calculus/derivative/partial', {
            method: 'POST',
            body: JSON.stringify({ expression, variable }),
        }),
};

// Algebra API
// Algebra API
export const algebraApi = {
    // Legacy / Basic Algebra
    quadratic: (a: number, b: number, c: number) =>
        apiRequest<ComputationResult>('/api/math/algebra/quadratic', {
            method: 'POST',
            body: JSON.stringify({ a, b, c }),
        }),

    // New Advanced Algebra
    matrixProperties: (matrix: (number | string)[][]) =>
        apiRequest<ComputationResult>('/api/math/algebra/matrix/properties', {
            method: 'POST',
            body: JSON.stringify({ matrix }),
        }),

    matrixOperate: (matrixA: (number | string)[][], matrixB: (number | string)[][], operation: string) =>
        apiRequest<ComputationResult>('/api/math/algebra/matrix/operate', {
            method: 'POST',
            body: JSON.stringify({ matrix_a: matrixA, matrix_b: matrixB, operation }),
        }),

    solveSystem: (equations: string[]) =>
        apiRequest<ComputationResult>('/api/math/algebra/system/solve', {
            method: 'POST',
            body: JSON.stringify({ equations }),
        }),

    analyzePolynomial: (expression: string) =>
        apiRequest<ComputationResult>('/api/math/algebra/polynomial/analyze', {
            method: 'POST',
            body: JSON.stringify({ expression }),
        }),

    analyzeComplex: (expression: string) =>
        apiRequest<ComputationResult>('/api/math/algebra/complex/analyze', {
            method: 'POST',
            body: JSON.stringify({ expression }),
        }),



    arithmeticProgression: (firstTerm: number, commonDiff: number, nTerms: number) =>
        apiRequest<ComputationResult>('/api/math/algebra/progression/arithmetic', {
            method: 'POST',
            body: JSON.stringify({ first_term: firstTerm, common_val: commonDiff, n_terms: nTerms })
        }),

    geometricProgression: (firstTerm: number, commonRatio: number, nTerms: number) =>
        apiRequest<ComputationResult>('/api/math/algebra/progression/geometric', {
            method: 'POST',
            body: JSON.stringify({ first_term: firstTerm, common_val: commonRatio, n_terms: nTerms })
        }),
};

// Geometry API
export const geometryApi = {
    distance: (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
        apiRequest<ComputationResult>('/api/math/geometry/distance', {
            method: 'POST',
            body: JSON.stringify({ p1, p2 }),
        }),

    midpoint: (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
        apiRequest<ComputationResult>('/api/math/geometry/midpoint', {
            method: 'POST',
            body: JSON.stringify({ p1, p2 }),
        }),

    section: (p1: { x: number; y: number }, p2: { x: number; y: number }, m: number, n: number) =>
        apiRequest<ComputationResult>('/api/math/geometry/section', {
            method: 'POST',
            body: JSON.stringify({ p1, p2, m, n }),
        }),

    lineFromPoints: (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
        apiRequest<ComputationResult>('/api/math/geometry/line-from-points', {
            method: 'POST',
            body: JSON.stringify({ p1, p2 }),
        }),

    lineIntersection: (
        line1: { A: number; B: number; C: number },
        line2: { A: number; B: number; C: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/line-intersection', {
            method: 'POST',
            body: JSON.stringify({ line1, line2 }),
        }),

    lineCircleIntersection: (
        line: { A: number; B: number; C: number },
        circle: { center_x: number; center_y: number; radius: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/line-circle', {
            method: 'POST',
            body: JSON.stringify({ line, circle }),
        }),

    circleIntersection: (
        circle1: { center_x: number; center_y: number; radius: number },
        circle2: { center_x: number; center_y: number; radius: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/circle-circle', {
            method: 'POST',
            body: JSON.stringify({ circle1, circle2 }),
        }),

    tangentFromPoint: (
        circle: { center_x: number; center_y: number; radius: number },
        point: { x: number; y: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/tangent', {
            method: 'POST',
            body: JSON.stringify({ circle, point }),
        }),

    triangleAnalyze: (
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/triangle/analyze', {
            method: 'POST',
            body: JSON.stringify({ p1, p2, p3 }),
        }),

    quadrilateral: (
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        p4: { x: number; y: number }
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/quadrilateral/analyze', {
            method: 'POST',
            body: JSON.stringify({ p1, p2, p3, p4 }),
        }),

    transform2D: (
        point: { x: number; y: number },
        operation: string,
        params: Record<string, number>
    ) =>
        apiRequest<ComputationResult>('/api/math/geometry/transform/2d', {
            method: 'POST',
            body: JSON.stringify({ point, operation, params }),
        }),

    conicoid: (shape: string, params: Record<string, number>) =>
        apiRequest<ComputationResult>('/api/math/geometry/conicoid', {
            method: 'POST',
            body: JSON.stringify({ shape, params }),
        }),

    // --- Advanced Geometry ---
    vectorOperate: (v1: number[], v2: number[] | null, operation: string) =>
        apiRequest<ComputationResult>('/api/math/geometry/vector/operate', {
            method: 'POST',
            body: JSON.stringify({ v1, v2, operation }),
        }),

    line3D: (p1: number[], p2: number[]) =>
        apiRequest<ComputationResult>('/api/math/geometry/3d/line', {
            method: 'POST',
            body: JSON.stringify({ p1, p2 }),
        }),

    plane3D: (p1: number[], p2: number[], p3: number[]) =>
        apiRequest<ComputationResult>('/api/math/geometry/3d/plane', {
            method: 'POST',
            body: JSON.stringify({ p1, p2, p3 }),
        }),

    analyzeConic: (coeffs: Record<string, number>) =>
        apiRequest<ComputationResult>('/api/math/geometry/conic/analyze', {
            method: 'POST',
            body: JSON.stringify({ coeffs }),
        }),

    // --- Mensuration ---
    mensurationHeron: (a: number, b: number, c: number) =>
        apiRequest<ComputationResult>('/api/math/geometry/mensuration/heron', {
            method: 'POST',
            body: JSON.stringify({ a, b, c }),
        }),

    mensurationSolid: (shape: string, params: Record<string, number>) =>
        apiRequest<ComputationResult>('/api/math/geometry/mensuration/solid', {
            method: 'POST',
            body: JSON.stringify({ shape, params }),
        }),
};

// Trigonometry API
// Trigonometry API
export const trigApi = {
    // Basic Values (Exact & Approx)
    basicValues: (angle: string) =>
        apiRequest<ComputationResult>('/api/math/trig/values', {
            method: 'POST',
            body: JSON.stringify({ angle }),
        }),

    // Unit Circle Visualization
    unitCircle: (angleDeg: number) =>
        apiRequest<ComputationResult>('/api/math/trig/unit-circle', {
            method: 'POST',
            body: JSON.stringify({ angle_deg: angleDeg }),
        }),

    // Dynamic Graphing (Standard & Transformed)
    graph: (func: string, params: Record<string, number> = {}) =>
        apiRequest<ComputationResult>('/api/math/trig/graph', {
            method: 'POST',
            body: JSON.stringify({ func, params }),
        }),

    // Identity Verification (Proves LHS = RHS)
    verifyIdentity: (lhs: string, rhs: string) =>
        apiRequest<ComputationResult>('/api/math/trig/identity', {
            method: 'POST',
            body: JSON.stringify({ lhs, rhs }),
        }),

    // Equation Solver (General Solutions)
    solveEquation: (equation: string) =>
        apiRequest<ComputationResult>('/api/math/trig/equation', {
            method: 'POST',
            body: JSON.stringify({ equation }),
        }),

    // Compound Angles (Expand/Verify)
    compoundAngle: (op_type: string, A: string, B: string) =>
        apiRequest<ComputationResult>('/api/math/trig/compound', {
            method: 'POST',
            body: JSON.stringify({ op_type, A, B }),
        }),

    // Heights and Distances (Solver)
    heightsDistances: (param_type: string, d: number, angle_deg: number, h: number = 0) =>
        apiRequest<ComputationResult>('/api/math/trig/heights', {
            method: 'POST',
            body: JSON.stringify({ param_type, d, angle_deg, h }),
        }),
};

// Matrices API
export const matricesApi = {
    add: (matrixA: number[][], matrixB: number[][]) =>
        apiRequest<ComputationResult>('/api/math/matrices/add', {
            method: 'POST',
            body: JSON.stringify({ matrix_a: matrixA, matrix_b: matrixB }),
        }),

    multiply: (matrixA: number[][], matrixB: number[][]) =>
        apiRequest<ComputationResult>('/api/math/matrices/multiply', {
            method: 'POST',
            body: JSON.stringify({ matrix_a: matrixA, matrix_b: matrixB }),
        }),

    determinant: (matrix: number[][]) =>
        apiRequest<ComputationResult>('/api/math/matrices/determinant', {
            method: 'POST',
            body: JSON.stringify({ matrix }),
        }),

    inverse: (matrix: number[][]) =>
        apiRequest<ComputationResult>('/api/math/matrices/inverse', {
            method: 'POST',
            body: JSON.stringify({ matrix }),
        }),

    eigenvalues: (matrix: number[][]) =>
        apiRequest<ComputationResult>('/api/math/matrices/eigenvalues', {
            method: 'POST',
            body: JSON.stringify({ matrix }),
        }),

    transform: (matrix: number[][], shape: string) =>
        apiRequest<ComputationResult>('/api/math/matrices/transform', {
            method: 'POST',
            body: JSON.stringify({ matrix, shape }),
        }),
};

// AI Chat API
export const aiApi = {
    sendMessage: (messages: { role: string; content: string }[], systemPrompt?: string) =>
        apiRequest<{ content: string; provider: string; status: string }>('/api/ai/chat/message', {
            method: 'POST',
            body: JSON.stringify({ messages, system_prompt: systemPrompt }),
        }),

    solveProblem: (problem: string) =>
        apiRequest<{ status: string; problem: string; solution: string; provider: string }>(
            `/api/ai/chat/solve?problem=${encodeURIComponent(problem)}`,
            { method: 'POST' }
        ),

    getStatus: () =>
        apiRequest<{
            mode: string;
            current_provider: string;
            openrouter: { available: boolean; model: string | null };
            ollama: { available: boolean; model: string | null };
        }>('/api/ai/chat/status'),
};

// Health check
export const healthCheck = () =>
    apiRequest<{ status: string; app: string; version: string }>('/health');
