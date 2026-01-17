"""
Calculus Module - Derivatives, Integrals, and Function Analysis.

Provides comprehensive calculus functionality with step-by-step explanations.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Union

import numpy as np
from sympy import (
    Derivative, Integral, Symbol, diff, integrate, lambdify, 
    latex, limit, oo, series, simplify, solve, solveset, sympify,
    Function, dsolve, Eq, symbols
)
from sympy.abc import x, y, z, t
from sympy.core.sympify import SympifyError

from app.core.utils import ComputationResult, PlotElement, create_error_result, format_latex_number


@dataclass
class FunctionAnalyzer:
    """
    Comprehensive function analysis tool.
    
    Provides derivative computation, integration, plotting,
    critical points analysis, and Taylor series expansion.
    """
    expression: str
    
    def __post_init__(self) -> None:
        """Parse and prepare the expression for analysis."""
        try:
            self.sympy_expr = sympify(self.expression)
            self.numeric = lambdify(x, self.sympy_expr, modules=["numpy", "sympy"])
            self.derivative_expr = diff(self.sympy_expr, x)
            self.derivative_numeric = lambdify(x, self.derivative_expr, modules=["numpy", "sympy"])
            self.second_derivative_expr = diff(self.derivative_expr, x)
            self.second_derivative_numeric = lambdify(x, self.second_derivative_expr, modules=["numpy", "sympy"])
            self._valid = True
        except (SympifyError, Exception) as e:
            self._valid = False
            self._error = str(e)
    
    @property
    def is_valid(self) -> bool:
        """Check if the expression was parsed successfully."""
        return self._valid
    
    @property
    def error_message(self) -> str:
        """Get error message if expression is invalid."""
        return getattr(self, '_error', '')
    
    def analyze(self, domain: Tuple[float, float], resolution: int = 500) -> ComputationResult:
        """
        Comprehensive function analysis.
        
        Returns plot of function, derivative, and key properties.
        """
        if not self._valid:
            return create_error_result("analyze", self._error)
        
        try:
            start, end = domain
            xs = np.linspace(start, end, resolution)
            
            # Compute function values safely
            ys = self._safe_compute(self.numeric, xs)
            dy = self._safe_compute(self.derivative_numeric, xs)
            
            # Filter out invalid points
            valid_mask = np.isfinite(ys)
            
            plot_elements = [
                PlotElement(
                    type="curve",
                    data={
                        "points": list(zip(xs[valid_mask].tolist(), ys[valid_mask].tolist())),
                        "label": "f(x)"
                    },
                    style={"color": "#3b82f6", "width": 2}
                ),
                PlotElement(
                    type="curve",
                    data={
                        "points": list(zip(xs[np.isfinite(dy)].tolist(), dy[np.isfinite(dy)].tolist())),
                        "label": "f'(x)"
                    },
                    style={"color": "#f97316", "width": 2, "dash": "dash"}
                ),
            ]
            
            steps = [
                f"Function: f(x) = {self.expression}",
                f"Derivative: f'(x) = {latex(self.derivative_expr)}",
                f"Second derivative: f''(x) = {latex(self.second_derivative_expr)}",
                f"Domain analyzed: [{start}, {end}]",
            ]
            
            return ComputationResult(
                status="ok",
                operation="analyze",
                payload={
                    "expression": self.expression,
                    "derivative": str(self.derivative_expr),
                    "second_derivative": str(self.second_derivative_expr),
                    "domain": [start, end],
                },
                steps=steps,
                plot_elements=plot_elements,
                latex={
                    "function": f"f(x) = {latex(self.sympy_expr)}",
                    "derivative": f"f'(x) = {latex(self.derivative_expr)}",
                    "second_derivative": f"f''(x) = {latex(self.second_derivative_expr)}",
                },
            )
        except Exception as e:
            return create_error_result("analyze", str(e))
    
    def derivative_at(self, x0: float) -> ComputationResult:
        """
        Compute derivative and tangent line at a specific point.
        """
        if not self._valid:
            return create_error_result("derivative_at", self._error)
        
        try:
            # Compute values at point
            y0 = float(self.sympy_expr.subs(x, x0).evalf())
            slope = float(self.derivative_expr.subs(x, x0).evalf())
            
            # Tangent line points
            tangent_extent = 2.0
            tangent_start = (x0 - tangent_extent, y0 - slope * tangent_extent)
            tangent_end = (x0 + tangent_extent, y0 + slope * tangent_extent)
            
            plot_elements = [
                PlotElement(
                    type="point",
                    data={"coords": (x0, y0), "label": f"P({format_latex_number(x0)}, {format_latex_number(y0)})"},
                    style={"color": "#ef4444", "size": 12}
                ),
                PlotElement(
                    type="line",
                    data={"from": tangent_start, "to": tangent_end, "label": "Tangent"},
                    style={"color": "#f97316", "width": 2, "dash": "dash"}
                ),
            ]
            
            steps = [
                f"Given: f(x) = {self.expression}",
                f"f'(x) = {latex(self.derivative_expr)}",
                f"At x = {x0}: f({x0}) = {format_latex_number(y0)}",
                f"Slope: f'({x0}) = {format_latex_number(slope)}",
                f"Tangent line: y - {format_latex_number(y0)} = {format_latex_number(slope)}(x - {x0})",
            ]
            
            return ComputationResult(
                status="ok",
                operation="derivative_at",
                payload={
                    "x": x0,
                    "y": y0,
                    "slope": slope,
                    "tangent_equation": f"y = {format_latex_number(slope)}(x - {x0}) + {format_latex_number(y0)}",
                },
                steps=steps,
                plot_elements=plot_elements,
                latex={
                    "derivative": f"f'({x0}) = {format_latex_number(slope)}",
                    "tangent": f"y = {format_latex_number(slope)}(x - {x0}) + {format_latex_number(y0)}",
                },
            )
        except Exception as e:
            return create_error_result("derivative_at", str(e))
    
    def definite_integral(self, a: float, b: float) -> ComputationResult:
        """
        Compute definite integral with area visualization.
        """
        if not self._valid:
            return create_error_result("definite_integral", self._error)
        
        try:
            # Symbolic integration
            antiderivative = integrate(self.sympy_expr, x)
            definite_value = integrate(self.sympy_expr, (x, a, b))
            result = float(definite_value.evalf())
            
            # Area visualization points
            xs = np.linspace(a, b, 200)
            ys = self._safe_compute(self.numeric, xs)
            area_points = list(zip(xs.tolist(), ys.tolist()))
            
            plot_elements = [
                PlotElement(
                    type="area",
                    data={"points": area_points, "baseline": 0},
                    style={"color": "rgba(59, 130, 246, 0.3)"}
                ),
                PlotElement(
                    type="curve",
                    data={"points": area_points, "label": "f(x)"},
                    style={"color": "#3b82f6", "width": 2}
                ),
            ]
            
            steps = [
                f"Given: f(x) = {self.expression}",
                f"Antiderivative: F(x) = {latex(antiderivative)} + C",
                f"Definite integral: ∫_{{{a}}}^{{{b}}} f(x) dx",
                f"= F({b}) - F({a})",
                f"= {format_latex_number(result)}",
            ]
            
            return ComputationResult(
                status="ok",
                operation="definite_integral",
                payload={
                    "lower_limit": a,
                    "upper_limit": b,
                    "antiderivative": str(antiderivative),
                    "result": result,
                },
                steps=steps,
                plot_elements=plot_elements,
                latex={
                    "integral": f"\\int_{{{a}}}^{{{b}}} {latex(self.sympy_expr)} \\, dx = {format_latex_number(result)}",
                    "antiderivative": f"F(x) = {latex(antiderivative)}",
                },
            )
        except Exception as e:
            return create_error_result("definite_integral", str(e))
    
    def critical_points(self, domain: Optional[Tuple[float, float]] = None) -> ComputationResult:
        """
        Find and classify critical points of the function.
        """
        if not self._valid:
            return create_error_result("critical_points", self._error)
        
        try:
            # Find where derivative equals zero
            # Prefer real solutions to avoid complex ConditionSets
            try:
                from sympy import S
                critical_x = solveset(self.derivative_expr, x, domain=S.Reals)
            except Exception:
                critical_x = solveset(self.derivative_expr, x)
            
            points = []
            plot_points = []
            
            # Handle non-iterable solution sets (e.g., ConditionSet)
            if not hasattr(critical_x, "__iter__"):
                steps = [
                    f"Given: f(x) = {self.expression}",
                    f"f'(x) = {latex(self.derivative_expr)}",
                    "Could not enumerate critical points from the solution set.",
                ]
                return ComputationResult(
                    status="ok",
                    operation="critical_points",
                    payload={"points": []},
                    steps=steps,
                    plot_elements=[],
                    latex={
                        "derivative_zero": f"f'(x) = {latex(self.derivative_expr)} = 0",
                    },
                )

            for cx in critical_x:
                try:
                    if not cx.is_real:
                        continue
                    
                    cx_val = float(cx.evalf())
                    
                    # Check domain if specified
                    if domain and (cx_val < domain[0] or cx_val > domain[1]):
                        continue
                    
                    cy_val = float(self.sympy_expr.subs(x, cx).evalf())
                    second_deriv_val = float(self.second_derivative_expr.subs(x, cx).evalf())
                    
                    # Classify using second derivative test
                    if second_deriv_val > 0:
                        classification = "local minimum"
                        color = "#22c55e"
                    elif second_deriv_val < 0:
                        classification = "local maximum"
                        color = "#ef4444"
                    else:
                        classification = "inflection point"
                        color = "#eab308"
                    
                    points.append({
                        "x": cx_val,
                        "y": cy_val,
                        "type": classification,
                        "second_derivative": second_deriv_val,
                    })
                    
                    plot_points.append({
                        "coords": (cx_val, cy_val),
                        "label": f"{classification}\n({format_latex_number(cx_val)}, {format_latex_number(cy_val)})",
                        "color": color,
                    })
                    
                except Exception:
                    continue
            
            plot_elements = [
                PlotElement(
                    type="points",
                    data={
                        "coords": [(p["coords"][0], p["coords"][1]) for p in plot_points],
                        "labels": [p["label"] for p in plot_points],
                    },
                    style={"size": 12, "color": "#ef4444"}
                )
            ] if plot_points else []
            
            steps = [
                f"Given: f(x) = {self.expression}",
                f"f'(x) = {latex(self.derivative_expr)}",
                f"Setting f'(x) = 0:",
                f"Found {len(points)} critical point(s)",
            ]
            
            for p in points:
                steps.append(f"  • x = {format_latex_number(p['x'])}: {p['type']} at y = {format_latex_number(p['y'])}")
            
            return ComputationResult(
                status="ok",
                operation="critical_points",
                payload={"points": points},
                steps=steps,
                plot_elements=plot_elements,
                latex={
                    "derivative_zero": f"f'(x) = {latex(self.derivative_expr)} = 0",
                },
            )
        except Exception as e:
            return create_error_result("critical_points", str(e))
    
    def taylor_series(self, center: float = 0, order: int = 5, domain: Tuple[float, float] = (-5, 5)) -> ComputationResult:
        """
        Compute Taylor series expansion.
        """
        if not self._valid:
            return create_error_result("taylor_series", self._error)
        
        try:
            # Compute Taylor series
            taylor = series(self.sympy_expr, x, center, order + 1).removeO()
            taylor_numeric = lambdify(x, taylor, modules=["numpy", "sympy"])
            
            # Generate comparison plot
            xs = np.linspace(domain[0], domain[1], 400)
            ys_original = self._safe_compute(self.numeric, xs)
            ys_taylor = self._safe_compute(taylor_numeric, xs)
            
            plot_elements = [
                PlotElement(
                    type="curve",
                    data={
                        "points": list(zip(xs[np.isfinite(ys_original)].tolist(), 
                                          ys_original[np.isfinite(ys_original)].tolist())),
                        "label": "f(x)"
                    },
                    style={"color": "#3b82f6", "width": 2}
                ),
                PlotElement(
                    type="curve",
                    data={
                        "points": list(zip(xs[np.isfinite(ys_taylor)].tolist(),
                                          ys_taylor[np.isfinite(ys_taylor)].tolist())),
                        "label": f"Taylor (order {order})"
                    },
                    style={"color": "#f97316", "width": 2, "dash": "dash"}
                ),
                PlotElement(
                    type="point",
                    data={"coords": (center, float(self.sympy_expr.subs(x, center).evalf())), "label": "Center"},
                    style={"color": "#ef4444", "size": 10}
                ),
            ]
            
            steps = [
                f"Function: f(x) = {self.expression}",
                f"Taylor series about x = {center}, order {order}:",
                f"T(x) = {latex(taylor)}",
            ]
            
            return ComputationResult(
                status="ok",
                operation="taylor_series",
                payload={
                    "center": center,
                    "order": order,
                    "series": str(taylor),
                },
                steps=steps,
                plot_elements=plot_elements,
                latex={
                    "taylor": f"T(x) = {latex(taylor)}",
                },
            )
        except Exception as e:
            return create_error_result("taylor_series", str(e))
    
    def _safe_compute(self, func, xs: np.ndarray) -> np.ndarray:
        """Safely compute function values, handling errors."""
        try:
            result = func(xs)
            if isinstance(result, (int, float)):
                result = np.full_like(xs, result)
            return np.array(result, dtype=float)
        except Exception:
            return np.full_like(xs, np.nan)


from functools import lru_cache

# ... (Previous imports) ...

# Global cache size for math operations
MATH_CACHE_SIZE = 128

@lru_cache(maxsize=MATH_CACHE_SIZE)
def analyze_function(expression: str, domain: Tuple[float, float], resolution: int = 500) -> ComputationResult:
    """Convenience function for function analysis."""
    analyzer = FunctionAnalyzer(expression)
    if not analyzer.is_valid:
        return create_error_result("analyze", analyzer.error_message)
    return analyzer.analyze(domain, resolution)


@lru_cache(maxsize=MATH_CACHE_SIZE)
def compute_derivative(expression: str, at_point: float) -> ComputationResult:
    """Convenience function for derivative at a point."""
    analyzer = FunctionAnalyzer(expression)
    if not analyzer.is_valid:
        return create_error_result("derivative", analyzer.error_message)
    return analyzer.derivative_at(at_point)


@lru_cache(maxsize=MATH_CACHE_SIZE)
def compute_integral(expression: str, lower: float, upper: float) -> ComputationResult:
    """Convenience function for definite integration."""
    analyzer = FunctionAnalyzer(expression)
    if not analyzer.is_valid:
        return create_error_result("integral", analyzer.error_message)
    return analyzer.definite_integral(lower, upper)


@lru_cache(maxsize=MATH_CACHE_SIZE)
def find_critical_points(expression: str, domain: Optional[Tuple[float, float]] = None) -> ComputationResult:
    """Convenience function for critical points."""
    analyzer = FunctionAnalyzer(expression)
    if not analyzer.is_valid:
        return create_error_result("critical_points", analyzer.error_message)
    return analyzer.critical_points(domain)


@lru_cache(maxsize=MATH_CACHE_SIZE)
def compute_taylor(expression: str, center: float = 0, order: int = 5) -> ComputationResult:
    """Convenience function for Taylor series."""
    analyzer = FunctionAnalyzer(expression)
    if not analyzer.is_valid:
        return create_error_result("taylor", analyzer.error_message)
    return analyzer.taylor_series(center, order)


@lru_cache(maxsize=MATH_CACHE_SIZE)
def compute_limit(expression: str, point: float, direction: str = "+/-") -> ComputationResult:
    """
    Compute the limit of an expression as x approaches a point.
    """
    try:
        expr = sympify(expression)
        
        # Determine direction for sympy limit
        dir_sym = '+' if direction == '+' else ('-' if direction == '-' else '+-')
        
        # Compute limit
        lim_val = limit(expr, x, point, dir=dir_sym)
        
        steps = [
            f"Limit expression: \\lim_{{x \\to {point}}} ({latex(expr)})",
            f"Evaluated limit: {latex(lim_val)}"
        ]
        
        return ComputationResult(
            status="ok",
            operation="limit",
            payload={
                "expression": expression,
                "point": point,
                "direction": direction,
                "result": str(lim_val)
            },
            steps=steps,
            plot_elements=[],
            latex={
                "limit": f"\\lim_{{x \\to {point}}} {latex(expr)} = {latex(lim_val)}"
            }
        )
    except SympifyError:
        return create_error_result("limit", f"Invalid expression: {expression}")
    except Exception as e:
        return create_error_result("limit", f"Computation error: {str(e)}")


def compute_indefinite_integral(expression: str) -> ComputationResult:
    """
    Compute the indefinite integral of an expression.
    """
    try:
        expr = sympify(expression)
        integral_expr = integrate(expr, x)
        
        steps = [
            f"Integral expression: \\int ({latex(expr)}) \\, dx",
            f"Computed antiderivative: {latex(integral_expr)} + C"
        ]
        
        return ComputationResult(
            status="ok",
            operation="indefinite_integral",
            payload={
                "expression": expression,
                "result": str(integral_expr)
            },
            steps=steps,
            plot_elements=[],
            latex={
                "integral": f"\\int {latex(expr)} \\, dx = {latex(integral_expr)} + C"
            }
        )
    except SympifyError:
        return create_error_result("indefinite_integral", f"Invalid expression: {expression}")
    except Exception as e:
        return create_error_result("indefinite_integral", f"Computation error: {str(e)}")


def solve_ode(equation: str) -> ComputationResult:
    """
    Solve a first-order ordinary differential equation.
    Assumes dependent variable y(x).
    Equation given as string, e.g., "y' + y = 0" or simple form.
    For this parser, input should be an equation set to 0, 
    or we can parse typical "diff(y,x) + y" forms.
    But to support user input like "y' + y = x", we need a bit of parsing logic.
    """
    try:
        # Define y as a function of x
        y_func = Function('y')(x)
        
        # Simple string replacement to make it sympy-compatible
        # Replace y' with diff(y(x), x) and y with y(x)
        # Note: This is a basic parser. Complex inputs might need better handling.
        # We assume the user inputs something like "y' + y - x" (implicitly = 0 in dsolve default if passed as expr)
        # OR "Eq(y' + y, x)"
        
        # Let's try to parse "y'" as diff(y(x), x)
        # And "y" (standalone) as y(x), but be careful not to replace in "y'"
        # A safer regex or substitution might be needed, but let's try a direct approach for now.
        
        # Strategy: Let user input sympy syntax or close to it?
        # Better: let user input "y' + y = x".
        # We split by '=' to form Eq if present.
        
        lhs_str = equation
        rhs_str = "0"
        if "=" in equation:
            lhs_str, rhs_str = equation.split("=")
        
        # Pre-process strings
        def preprocess(s):
            s = s.replace("y'", "diff(y(x), x)").replace("y", "y(x)")
            return sympify(s, locals={'y': y_func, 'x': x})

        # However, simple replace "y" -> "y(x)" might break "diff(y(x)...)" -> "diff(y(x)(x)...)"
        # So we should rely on specific symbols.
        
        # Alternative: Ask user to use valid sympy or we handle standard math notation carefully.
        # Let's assume standard input: "Derivative(y, x) + y"
        pass
        
        # Refined Parser for basic cases:
        # User input: "y' + y = x"
        formatted_eq = equation.replace("y'", "Derivative(y, x)")
        # Now convert 'y' to a Symbol temporarily to parse, then swap to Function? 
        # Actually dsolve expects y(x). 
        
        # Let's try standard sympify with locals
        local_dict = {'y': y_func, 'x': x}
        # We still need to help sympify understand y' usually.
        # Check standard replacements
        formatted_eq = formatted_eq.replace("y'", "diff(y, x)")
        
        if "=" in formatted_eq:
            parts = formatted_eq.split("=")
            lhs = sympify(parts[0], locals=local_dict)
            rhs = sympify(parts[1], locals=local_dict)
            ode = Eq(lhs, rhs)
        else:
            # Assume expression = 0
            ode = sympify(formatted_eq, locals=local_dict)
            
        sol = dsolve(ode, y_func)
        
        steps = [
            f"Differential Equation: {latex(ode)}",
            f"General Solution: {latex(sol)}"
        ]
        
        return ComputationResult(
            status="ok",
            operation="ode",
            payload={
                "equation": equation,
                "solution": str(sol)
            },
            steps=steps,
            plot_elements=[],
            latex={
                "solution": latex(sol)
            }
        )
    except SympifyError:
        return create_error_result("ode", f"Invalid equation format. Use y' + y = x format.")
    except Exception as e:
        return create_error_result("ode", f"Could not solve ODE: {str(e)}")


def compute_partial_derivative(expression: str, variable: str) -> ComputationResult:
    """
    Compute partial derivative of an expression with respect to a variable.
    """
    try:
        # We need to support multi-variables. 
        # Let's ensure x, y, z are available symbols.
        local_dict = {'x': x, 'y': y, 'z': z}
        expr = sympify(expression, locals=local_dict)
        var_sym = local_dict.get(variable)
        
        if not var_sym:
            raise ValueError(f"Unknown variable: {variable}. Use x, y, or z.")
            
        deriv = diff(expr, var_sym)
        
        steps = [
            f"Function: f({variable}, ...) = {latex(expr)}",
            f"Partial derivative w.r.t {variable}: \\frac{{\\partial}}{{\\partial {variable}}} ({latex(expr)})",
            f"Result: {latex(deriv)}"
        ]
        
        return ComputationResult(
            status="ok",
            operation="partial_derivative",
            payload={
                "expression": expression,
                "variable": variable,
                "result": str(deriv)
            },
            steps=steps,
            plot_elements=[],
            latex={
                "derivative": f"\\frac{{\\partial}}{{\\partial {variable}}} {latex(expr)} = {latex(deriv)}"
            }
        )
    except SympifyError:
        return create_error_result("partial_derivative", f"Invalid expression: {expression}")
    except ValueError as e:
        return create_error_result("partial_derivative", str(e))
    except Exception as e:
        return create_error_result("partial_derivative", f"Computation error: {str(e)}")
