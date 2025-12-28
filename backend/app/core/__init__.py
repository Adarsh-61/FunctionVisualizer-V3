"""Core math engine package."""

from app.core.utils import PlotElement, ComputationResult, create_error_result
from app.core.calculus import (
    FunctionAnalyzer,
    analyze_function,
    compute_derivative,
    compute_integral,
    find_critical_points,
    compute_taylor,
    compute_limit,
    compute_indefinite_integral,
    solve_ode,
    compute_partial_derivative,
)
from app.core.algebra import (
    MatrixCalculator,
    LinearSystemSolver,
    PolynomialSolver,
    ComplexNumberCalculator,
)
from app.core.geometry import (
    Point,
    Line,
    Circle,
    compute_distance,
    compute_midpoint,
    compute_section_point,
    line_from_points,
    line_intersection,
    line_circle_intersection,
    circle_circle_intersection,
    tangent_from_point,
    Mensuration,
)
from app.core.trigonometry import trig_core
# Retain old matrix exports if needed, or rely on new MatrixCalculator
from app.core.matrices import (
    matrix_add,
    matrix_multiply,
    matrix_determinant,
    matrix_inverse,
    matrix_eigenvalues,
    matrix_transform,
)

__all__ = [
    # Utils
    "PlotElement",
    "ComputationResult",
    "create_error_result",
    # Calculus
    "FunctionAnalyzer",
    "analyze_function",
    "compute_derivative",
    "compute_integral",
    "find_critical_points",
    "compute_taylor",
    "compute_limit",
    "compute_indefinite_integral",
    "solve_ode",
    "compute_partial_derivative",
    # Algebra
    "MatrixCalculator",
    "LinearSystemSolver",
    "PolynomialSolver",
    "ComplexNumberCalculator",
    # Geometry
    "Point",
    "Line",
    "Circle",
    "compute_distance",
    "compute_midpoint",
    "compute_section_point",
    "line_from_points",
    "line_intersection",
    "line_circle_intersection",
    "circle_circle_intersection",
    "tangent_from_point",
    # Trigonometry
    "trig_core",
    # Matrices (Legacy)
    "matrix_add",
    "matrix_multiply",
    "matrix_determinant",
    "matrix_inverse",
    "matrix_eigenvalues",
    "matrix_transform",
]
