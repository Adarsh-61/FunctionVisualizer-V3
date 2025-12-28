'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { CalculusSolver } from './CalculusSolver';
import { AlgebraSolver } from './AlgebraSolver';
import { MensurationSolver } from './MensurationSolver';
import { StatisticsSolver } from './StatisticsSolver';
import { NumberSystemsSolver } from './NumberSystemsSolver';
import { PolynomialsSolver } from './PolynomialsSolver';
import { CoordinateGeometrySolver } from './CoordinateGeometrySolver';
import { TrigonometrySolver } from './TrigonometrySolver';
import { ProbabilitySolver } from './ProbabilitySolver';
import { LinearEquationSolver } from './LinearEquationSolver';
import { GeometrySolver } from './GeometrySolver';
import { QuadrilateralSolver } from './QuadrilateralSolver';
import { CircleSolver } from './CircleSolver';
import { SetsSolver } from './SetsSolver';
import { VectorSolver } from './VectorSolver';
import { ThreeDGeometrySolver } from './ThreeDGeometrySolver';

interface DynamicFormulaSolverProps {
    solverId: string;
}

export function DynamicFormulaSolver({ solverId }: DynamicFormulaSolverProps) {
    const renderSolver = () => {
        switch (solverId) {
            case 'solver_calculus':
                return <CalculusSolver />;
            case 'solver_algebra':
                return <AlgebraSolver />;
            case 'solver_matrices':
                // Matrix operations are now part of AlgebraSolver
                return <AlgebraSolver />;
            case 'solver_mensuration':
                return <MensurationSolver />;
            case 'solver_statistics':
                return <StatisticsSolver />;
            case 'solver_number_systems':
                return <NumberSystemsSolver />;
            case 'solver_polynomials':
                return <PolynomialsSolver />;
            case 'solver_coordinate_geometry':
                return <CoordinateGeometrySolver />;
            case 'solver_trigonometry':
                return <TrigonometrySolver />;
            case 'solver_probability':
                return <ProbabilitySolver />;
            case 'solver_linear_equations':
                return <LinearEquationSolver />;
            case 'solver_geometry':
                return <GeometrySolver />;
            case 'solver_quadrilaterals':
                return <QuadrilateralSolver />;
            case 'solver_circles':
                return <CircleSolver />;
            case 'solver_sets':
                return <SetsSolver />;
            case 'solver_vectors':
                return <VectorSolver />;
            case 'solver_3d_geometry':
                return <ThreeDGeometrySolver />;
            default:
                // Handle sub-operations
                if (solverId.startsWith('solver_algebra_')) {
                    return <AlgebraSolver />;
                }
                if (solverId.startsWith('solver_calculus_')) {
                    const op = solverId.replace('solver_calculus_', '');
                    return <CalculusSolver initialOperation={op as any} />;
                }
                return (
                    <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        Unknown solver configuration: {solverId}
                    </div>
                );
        }
    };

    return (
        <div className="mt-8 border-t border-border pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 rounded-full bg-primary"></span>
                Interactive Solver
            </h3>
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            }>
                {renderSolver()}
            </Suspense>
        </div>
    );
}

