"""
Algebra Module - Matrices, Linear Systems, Polynomials, and Complex Numbers.

Provides comprehensive algebra functionality with step-by-step explanations.
"""

from typing import Dict, List, Optional, Tuple, Union, Any
import numpy as np
from sympy import (
    Matrix, Symbol, symbols, solve, roots, factor, expand, 
    eye, I, re, im, arg, Abs, exp, lambdify,
    latex, sympify, simplify, N
)
from sympy.abc import x, y, z
from sympy.core.sympify import SympifyError

from app.core.utils import ComputationResult, PlotElement, create_error_result, format_latex_number

def safe_sympify(expression: str) -> Any:
    """Safely convert string to sympy expression."""
    try:
        return sympify(expression)
    except Exception as e:
        raise ValueError(f"Invalid expression: {expression} ({str(e)})")

class MatrixCalculator:
    """
    Handles matrix operations including determinant, inverse, rank, and eigenvalues.
    Expects input as list of lists.
    """
    @staticmethod
    def compute_properties(matrix_data: List[List[Any]]) -> ComputationResult:
        try:
            # Check if matrix is fully numeric
            is_numeric = True
            for row in matrix_data:
                for x in row:
                    if not isinstance(x, (int, float)) and not (isinstance(x, str) and x.replace('.','',1).isdigit()):
                        is_numeric = False
                        break
                if not is_numeric: break
            
            payload = {}
            steps = []
            latex_res = {}
            
            if is_numeric:
                # --- NumPy Optimization ---
                import numpy as np
                A = np.array(matrix_data, dtype=float)
                rows, cols = A.shape
                
                payload["shape"] = (int(rows), int(cols))
                payload["is_square"] = (rows == cols)
                
                # Format Matrix for LaTeX/Steps
                # Use SymPy only for nice LaTeX printing of the input
                M_sym = Matrix(matrix_data) 
                latex_res["matrix"] = latex(M_sym)
                steps.append(f"Input Matrix (Numeric Mode): A = {latex(M_sym)}")
                
                # Determinant
                if rows == cols:
                    det_val = float(np.linalg.det(A))
                    # Clean up floating point noise
                    if abs(det_val) < 1e-10: det_val = 0.0
                    if abs(det_val - round(det_val)) < 1e-10: det_val = float(round(det_val))
                    
                    payload["determinant"] = str(det_val)
                    latex_res["determinant"] = f"\\det(A) \\approx {format_latex_number(det_val)}"
                    steps.append(f"Determinant: {det_val}")
                    
                    if abs(det_val) > 1e-10:
                        inv_A = np.linalg.inv(A)
                        payload["inverse"] = [[str(format_latex_number(el)) for el in row] for row in inv_A.tolist()]
                        M_inv_sym = Matrix(inv_A) # Conversion for Latex
                        latex_res["inverse"] = f"A^{{-1}} = {latex(M_inv_sym)}"
                        steps.append("Inverse exists.")
                    else:
                        steps.append("Matrix is singular (det=0). No inverse.")
                
                # Rank
                rank_val = int(np.linalg.matrix_rank(A))
                payload["rank"] = rank_val
                latex_res["rank"] = f"\\text{{rank}}(A) = {rank_val}"
                steps.append(f"Rank: {rank_val}")
                
                # Eigenvalues
                if rows == cols:
                    try:
                        evals, _ = np.linalg.eig(A)
                        eigen_list = []
                        evals_payload = {}
                        
                        # Process eigenvalues (group by value approx)
                        from collections import Counter
                        # Round to avoid float diffs
                        rounded_evals = [complex(round(e.real, 4), round(e.imag, 4)) for e in evals]
                        # Remove imag part if 0
                        clean_evals = []
                        for e in rounded_evals:
                            val = e.real if abs(e.imag) < 1e-9 else e
                            clean_evals.append(val)
                            
                        counts = Counter(clean_evals)
                        
                        for val, count in counts.items():
                            val_str = format_latex_number(val) if isinstance(val, float) else str(val).replace('j', 'i')
                            eigen_list.append(f"\\lambda = {val_str} (mult: {count})")
                            evals_payload[str(val)] = count
                            
                        payload["eigenvalues"] = evals_payload
                        latex_res["eigenvalues"] = ", ".join(eigen_list)
                        steps.append(f"Eigenvalues: {', '.join(eigen_list)}")
                    except Exception as e:
                        steps.append(f"Could not compute numeric eigenvalues: {str(e)}")
                        
            else:
                # --- SymPy Fallback (Symbolic) ---
                M = Matrix(matrix_data)
                rows, cols = M.shape
                steps.append(f"Input Matrix: A = {latex(M)}")
                
                payload["shape"] = (rows, cols)
                payload["is_square"] = rows == cols
                latex_res["matrix"] = latex(M)
                
                if rows == cols:
                    det_val = M.det()
                    payload["determinant"] = str(det_val)
                    latex_res["determinant"] = f"\\det(A) = {latex(det_val)}"
                    steps.append(f"Determinant: \\det(A) = {latex(det_val)}")
                    
                    if det_val != 0:
                        inv_M = M.inv()
                        payload["inverse"] = [[str(el) for el in row] for row in inv_M.tolist()]
                        latex_res["inverse"] = f"A^{{-1}} = {latex(inv_M)}"
                        steps.append("Inverse exists.")
                    else:
                        steps.append("Matrix is singular.")
                
                rank_val = M.rank()
                payload["rank"] = int(rank_val)
                latex_res["rank"] = f"\\text{{rank}}(A) = {rank_val}"
                steps.append(f"Rank: {rank_val}")
                
                if rows == cols:
                    try:
                        eigenvals = M.eigenvals()
                        eigen_list = [f"\\lambda = {latex(val)} (mult: {mult})" for val, mult in eigenvals.items()]
                        if eigen_list:
                            payload["eigenvalues"] = {str(k): v for k, v in eigenvals.items()}
                            latex_res["eigenvalues"] = ", ".join(eigen_list)
                            steps.append(f"Eigenvalues: {', '.join(eigen_list)}")
                    except Exception:
                        steps.append("Symbolic eigenvalues too complex.")

            return ComputationResult(
                status="ok",
                operation="matrix_properties",
                payload=payload,
                steps=steps,
                latex=latex_res,
                plot_elements=[]
            )

        except Exception as e:
            return create_error_result("matrix_properties", f"Matrix Error: {str(e)}")

    @staticmethod
    def operate(matrix_a: List[List[Any]], matrix_b: List[List[Any]], operation: str) -> ComputationResult:
        try:
            A = Matrix(matrix_a)
            B = Matrix(matrix_b)
            
            result = None
            op_latex = ""
            op_name = ""
            
            if operation == "add":
                if A.shape != B.shape:
                    raise ValueError("Matrices must have same dimensions for addition.")
                result = A + B
                op_latex = "A + B"
                op_name = "Addition"
            elif operation == "subtract":
                if A.shape != B.shape:
                    raise ValueError("Matrices must have same dimensions for subtraction.")
                result = A - B
                op_latex = "A - B"
                op_name = "Subtraction"
            elif operation == "multiply":
                if A.shape[1] != B.shape[0]:
                    raise ValueError(f"Column count of A ({A.shape[1]}) must match row count of B ({B.shape[0]}).")
                result = A * B
                op_latex = "A \\times B"
                op_name = "Multiplication"
            else:
                raise ValueError(f"Unknown operation: {operation}")
            
            steps = [
                f"Matrix A: {latex(A)}",
                f"Matrix B: {latex(B)}",
                f"Performing {op_name}:",
                f"{op_latex} = {latex(result)}"
            ]
            
            return ComputationResult(
                status="ok",
                operation=f"matrix_{operation}",
                payload={
                    "result": [[str(el) for el in row] for row in result.tolist()]
                },
                steps=steps,
                latex={
                    "result": f"{op_latex} = {latex(result)}"
                },
                plot_elements=[]
            )
            
        except Exception as e:
            return create_error_result("matrix_operation", str(e))


class LinearSystemSolver:
    """
    Solves systems of linear equations.
    """
    @staticmethod
    def solve_system(equations: List[str]) -> ComputationResult:
        try:
            # Identify variables (x, y, z, etc.) automatically or parse user inputs
            # We assume user inputs symbolic equations like "2*x + y = 5"
            eqs_sympy = []
            all_symbols = set()
            
            for eq_str in equations:
                if "=" in eq_str:
                    lhs, rhs = eq_str.split("=")
                    expr = safe_sympify(lhs) - safe_sympify(rhs)
                else:
                    expr = safe_sympify(eq_str) # Assume = 0 if no '='
                
                eqs_sympy.append(expr)
                all_symbols.update(expr.free_symbols)
            
            sorted_symbols = sorted(list(all_symbols), key=lambda s: s.name)
            
            solution = solve(eqs_sympy, sorted_symbols)
            
            steps = [
                "System of Equations:",
            ]
            for eq in eqs_sympy:
                steps.append(f"  {latex(eq)} = 0")
            
            latex_res = {}
            payload_sol = {}
            
            if isinstance(solution, dict):
                steps.append("Solution found:")
                sol_parts = []
                for sym, val in solution.items():
                    steps.append(f"  {latex(sym)} = {latex(val)}")
                    sol_parts.append(f"{latex(sym)} = {latex(val)}")
                    payload_sol[str(sym)] = str(val)
                latex_res["solution"] = ", ".join(sol_parts)
            elif isinstance(solution, list):
                # Could be multiple solutions or list of tuples
                steps.append("Solutions found:")
                sol_strs = []
                for sol in solution:
                    sol_strs.append(str(sol))
                payload_sol["solutions"] = sol_strs
                latex_res["solution"] = latex(solution)
            else:
                steps.append("No unique solution found or system is inconsistent.")
                latex_res["solution"] = "\\text{No unique solution}"

            return ComputationResult(
                status="ok",
                operation="solve_system",
                payload={
                    "equations": equations,
                    "solution": payload_sol
                },
                steps=steps,
                latex=latex_res,
                plot_elements=[]
            )

        except Exception as e:
            return create_error_result("solve_system", str(e))


from functools import lru_cache

# ... (Previous imports) ...

# Global cache size
MATH_CACHE_SIZE = 128

@lru_cache(maxsize=MATH_CACHE_SIZE)
def _solve_quadratic(a: float, b: float, c: float) -> Tuple[Dict, List[str], Dict, List[PlotElement]]:
    """Cached worker for quadratic solving."""
    # ... logic from QuadraticSolver.solve ...
    # Calculate discriminant
    D = b**2 - 4*a*c
    
    x1 = (-b + simplify(D)**0.5) / (2*a)
    x2 = (-b - simplify(D)**0.5) / (2*a)
    
    steps = [
        f"Equation: {a}x^2 + {b}x + {c} = 0",
        f"Discriminant (D) = b^2 - 4ac = ({b})^2 - 4({a})({c}) = {D}",
    ]
    
    payload_sol = {}
    latex_res = {}
    
    if D > 0:
        steps.append("D > 0, so there are two distinct real roots.")
        payload_sol = {"roots": [str(x1), str(x2)], "type": "real_distinct"}
    elif D == 0:
        steps.append("D = 0, so there is one repeated real root.")
        payload_sol = {"roots": [str(x1)], "type": "real_repeated"}
    else:
        steps.append("D < 0, so there are two complex conjugate roots.")
        payload_sol = {"roots": [str(x1), str(x2)], "type": "complex"}
    
    steps.append(f"Root 1: x = {latex(x1)}")
    steps.append(f"Root 2: x = {latex(x2)}")
    
    latex_res["roots"] = f"x_1 = {latex(x1)}, \\quad x_2 = {latex(x2)}"

    # Plotting
    plot_elements = []
    try:
        # Vertex
        vx = -b / (2*a)
        
        # Range
        padding = 5
        if D >= 0:
             roots_real = [float(re(x1)), float(re(x2))]
             min_x, max_x = min(roots_real), max(roots_real)
             padding = max(2.0, (max_x - min_x))
             domain = (min_x - padding, max_x + padding)
        else:
             domain = (vx - 5, vx + 5)
        
        xs = np.linspace(domain[0], domain[1], 200)
        ys = a*xs**2 + b*xs + c
        
        plot_elements.append(
            PlotElement(
                type="curve",
                data={"points": list(zip(xs.tolist(), ys.tolist())), "label": "f(x)"},
                style={"color": "#3b82f6", "width": 2}
            )
        )
        
        # Plot Roots if real
        if D >= 0:
            plot_elements.append(
                PlotElement(
                    type="point",
                    data={"coords": (float(re(x1)), 0), "label": f"x1"},
                    style={"color": "#ef4444", "size": 10}
                )
            )
            if D > 0:
                plot_elements.append(
                    PlotElement(
                        type="point",
                        data={"coords": (float(re(x2)), 0), "label": f"x2"},
                        style={"color": "#ef4444", "size": 10}
                    )
                )
        
    except Exception:
        pass

    return payload_sol, steps, latex_res, plot_elements

@lru_cache(maxsize=MATH_CACHE_SIZE)
def _analyze_polynomial_cached(expression: str) -> Tuple[Dict, List[str], Dict, List[PlotElement]]:
    """Cached worker for polynomial analysis."""
    poly_expr = safe_sympify(expression)
    
    # Factorization
    factored = factor(poly_expr)
    
    # Roots
    poly_roots = roots(poly_expr)
    
    steps = [
        f"Polynomial: P(x) = {latex(poly_expr)}",
        f"Factored Form: {latex(factored)}"
    ]
    
    roots_latex = []
    roots_payload = []
    
    if poly_roots:
        steps.append("Roots:")
        for r, mult in poly_roots.items():
            steps.append(f"  x = {latex(r)} (multiplicity {mult})")
            roots_latex.append(f"x = {latex(r)}")
            roots_payload.append({"value": str(r), "multiplicity": mult})
    else:
        steps.append("Could not find symbolic roots directly.")
    
    # Plotting (Real roots visualization)
    plot_elements = []
    try:
        func = lambdify(x, poly_expr, modules=['numpy'])
        # Determine range
        real_roots = []
        for r in poly_roots:
            if r.is_real:
                try:
                    real_roots.append(float(r))
                except:
                    pass
        
        if real_roots:
            min_r, max_r = min(real_roots), max(real_roots)
            padding = max(1.0, (max_r - min_r) * 0.5)
            domain = (min_r - padding, max_r + padding)
        else:
            domain = (-5, 5)
        
        xs = np.linspace(domain[0], domain[1], 400)
        ys = func(xs)
        if np.isscalar(ys):
            ys = np.full_like(xs, ys)
            
        plot_elements.append(
           PlotElement(
                type="curve",
                data={"points": list(zip(xs.tolist(), ys.tolist())), "label": "P(x)"},
                style={"color": "#3b82f6", "width": 2}
            )
        )
        # Add root points
        for r_val in real_roots:
             plot_elements.append(
                PlotElement(
                    type="point",
                    data={"coords": (r_val, 0), "label": f"Root: {format_latex_number(r_val)}"},
                    style={"color": "#ef4444", "size": 10}
                )
            )
    except Exception:
        pass
    
    payload = {
        "expression": expression,
        "factored": str(factored),
        "roots": roots_payload
    }
    latex_res = {
        "polynomial": latex(poly_expr),
        "factored": latex(factored),
        "roots": ", ".join(roots_latex)
    }
    
    return payload, steps, latex_res, plot_elements


@lru_cache(maxsize=MATH_CACHE_SIZE)
def _calculate_complex(expression: str) -> Tuple[Dict, List[str], Dict, List[PlotElement]]:
    """Cached worker for complex number calc."""
    z_val = safe_sympify(expression)
    
    # Ensure it evaluates to a number (no free symbols)
    if z_val.free_symbols:
            raise ValueError("Expression must be a numeric complex number, not symbolic.")
    
    # Standard form a + bi
    real_part = re(z_val)
    imag_part = im(z_val)
    
    # Polar form r * exp(i*theta)
    r_val = Abs(z_val)
    theta_val = arg(z_val)
    
    polar_form = r_val * exp(I * theta_val)
    
    steps = [
        f"Input: z = {latex(z_val)}",
        f"Standard Form: {latex(real_part)} + {latex(imag_part)}i",
        f"Modulus (r): |z| = {latex(r_val)}",
        f"Argument (\\theta): \\arg(z) = {latex(theta_val)}",
        f"Polar Form: {latex(polar_form)}"
    ]
    
    # Visualization on Complex Plane
    plot_elements = []
    try:
        re_f = float(real_part)
        im_f = float(imag_part)
        
        # Vector from origin
        plot_elements.append(
            PlotElement(
                type="arrow",
                data={"from": (0, 0), "to": (re_f, im_f), "label": "z"},
                style={"color": "#8b5cf6", "width": 3}
            )
        )
        plot_elements.append(
            PlotElement(
                type="point",
                data={"coords": (re_f, im_f), "label": f"({format_latex_number(re_f)}, {format_latex_number(im_f)})"},
                style={"color": "#8b5cf6", "size": 12}
            )
        )
    except Exception:
        pass # Can't plot if not strictly numeric
    
    payload = {
        "expression": expression,
        "real": str(real_part),
        "imaginary": str(imag_part),
        "modulus": str(r_val),
        "argument": str(theta_val)
    }
    latex_res = {
        "standard": f"{latex(real_part)} + {latex(imag_part)}i",
        "polar": latex(polar_form)
    }
    
    return payload, steps, latex_res, plot_elements


class PolynomialSolver:
    """
    Handles polynomial operations: roots, factorization.
    """
    @staticmethod
    def analyze(expression: str) -> ComputationResult:
        try:
            payload, steps, latex_res, plot_elements = _analyze_polynomial_cached(expression)
            return ComputationResult(
                status="ok",
                operation="polynomial_analysis",
                payload=payload,
                steps=steps,
                latex=latex_res,
                plot_elements=plot_elements
            )
        except Exception as e:
            return create_error_result("polynomial_analysis", str(e))


class ComplexNumberCalculator:
    """
    Handles complex number operations.
    """
    @staticmethod
    def calculate(expression: str) -> ComputationResult:
        try:
            payload, steps, latex_res, plot_elements = _calculate_complex(expression)
            return ComputationResult(
                status="ok",
                operation="complex_analysis",
                payload=payload,
                steps=steps,
                latex=latex_res,
                plot_elements=plot_elements
            )
        except Exception as e:
            return create_error_result("complex_analysis", str(e))
class QuadraticSolver:
    """
    Solves quadratic equations ax^2 + bx + c = 0.
    """
    @staticmethod
    def solve(a: float, b: float, c: float) -> ComputationResult:
        try:
            payload, steps, latex_res, plot_elements = _solve_quadratic(a, b, c)
            return ComputationResult(
                status="ok",
                operation="quadratic_solve",
                payload=payload,
                steps=steps,
                latex=latex_res,
                plot_elements=plot_elements
            )
        except Exception as e:
            return create_error_result("quadratic_solve", str(e))


class ProgressionSolver:
    """
    Handles Arithmetic and Geometric Progressions.
    """
    @staticmethod
    def arithmetic(a: float, d: float, n: int) -> ComputationResult:
        try:
            # Formula: an = a + (n-1)d
            # Sum: Sn = n/2 * (2a + (n-1)d)
            
            an = a + (n - 1) * d
            Sn = (n / 2) * (2 * a + (n - 1) * d)
            
            series_list = [a + i*d for i in range(min(n, 10))]
            # series_str = ", ".join([str(x) for x in series_list]) + ("..." if n > 10 else "")
            
            steps = [
                f"First term (a) = {a}",
                f"Common difference (d) = {d}",
                f"Number of terms (n) = {n}",
                f"nth term formula: a_n = a + (n-1)d",
                f"a_{{{n}}} = {a} + ({n}-1)({d}) = {an}",
                f"Sum formula: S_n = \\frac{{n}}{{2}}(2a + (n-1)d)",
                f"S_{{{n}}} = {Sn}"
            ]
            
            return ComputationResult(
                status="ok",
                operation="arithmetic_progression",
                payload={
                    "nth_term": an,
                    "sum": Sn,
                    "series_preview": series_list
                },
                steps=steps,
                latex={
                    "nth_term": f"a_{{{n}}} = {an}",
                    "sum": f"S_{{{n}}} = {Sn}"
                },
                plot_elements=[]
            )
        except Exception as e:
            return create_error_result("arithmetic_progression", str(e))

    @staticmethod
    def geometric(a: float, r: float, n: int) -> ComputationResult:
        try:
            # Formula: an = a * r^(n-1)
            # Sum: Sn = a(r^n - 1) / (r - 1) if r != 1
            
            an = a * (r ** (n - 1))
            
            if r == 1:
                Sn = a * n
            else:
                Sn = a * (r**n - 1) / (r - 1)
            
            series_list = [a * (r**i) for i in range(min(n, 10))]
            
            steps = [
                f"First term (a) = {a}",
                f"Common ratio (r) = {r}",
                f"Number of terms (n) = {n}",
                f"nth term formula: a_n = a \\cdot r^{{n-1}}",
                f"a_{{{n}}} = {an}",
                f"Sum formula: S_n = a\\frac{{r^n - 1}}{{r - 1}}",
                f"S_{{{n}}} = {Sn}"
            ]
            
            return ComputationResult(
                status="ok",
                operation="geometric_progression",
                payload={
                    "nth_term": an,
                    "sum": Sn,
                    "series_preview": series_list
                },
                steps=steps,
                latex={
                    "nth_term": f"a_{{{n}}} = {an}",
                    "sum": f"S_{{{n}}} = {Sn}"
                },
                plot_elements=[]
            )
        except Exception as e:
            return create_error_result("geometric_progression", str(e))
