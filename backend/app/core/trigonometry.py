
import math
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from sympy import (
    symbols, sympify, simplify, solve, Eq, 
    sin, cos, tan, cot, sec, csc, 
    asin, acos, atan, acot, asec, acsc,
    pi, degree, rad, expand_trig, latex
)
from sympy.parsing.sympy_parser import (
    parse_expr, 
    standard_transformations, 
    implicit_multiplication_application
)
from app.core.utils import (
    ComputationResult, 
    PlotElement, 
    create_error_result, 
    format_latex_number
)

class TrigonometryCore:
    def __init__(self):
        self.x = symbols('x')
        self.transformations = (standard_transformations + (implicit_multiplication_application,))

    def _parse_input(self, expr_str: str):
        """Safely parse user input string to SymPy expression."""
        try:
            # Handle common replacements
            expr_str = expr_str.replace('^', '**')
            # Handle common functions case-insensitivity
            # But sympy is case sensitive, generally users type sin, cos...
            return parse_expr(expr_str, transformations=self.transformations)
        except Exception as e:
            raise ValueError(f"Invalid expression: {str(e)}")

    def basic_values(self, angle_str: str) -> ComputationResult:
        """
        Calculate all 6 trigonometric ratios for a given angle.
        Supports degrees (default if number) or radians (if pi is present).
        """
        try:
            angle_str = angle_str.strip().lower()
            is_radians = 'pi' in angle_str or 'π' in angle_str
            
            # Parse angle
            if is_radians:
                angle_str = angle_str.replace('π', 'pi')
                angle_sym = self._parse_input(angle_str)
                angle_rad = angle_sym
                angle_deg = degree(angle_sym)
            else:
                angle_sym = self._parse_input(angle_str)
                angle_deg = angle_sym
                angle_rad = rad(angle_sym)

            # Compute values
            ratios = {}
            steps = [f"Angle: {angle_deg}° = {angle_rad} rad"]
            latex_res = {"Angle": f"{latex(angle_deg)}^\\circ"}
            
            funcs = {
                'sin': sin, 'cos': cos, 'tan': tan,
                'cot': cot, 'sec': sec, 'csc': csc
            }

            for name, func in funcs.items():
                try:
                    val_exact = func(angle_rad)
                    val_exact = simplify(val_exact)
                    
                    if val_exact.is_infinite:
                        val_str = "Undefined"
                        val_approx = None
                    else:
                        val_str = latex(val_exact)
                        val_approx = float(val_exact)

                    ratios[name] = {
                        "exact": val_str,
                        "approx": val_approx
                    }
                except:
                    ratios[name] = {"exact": "Undefined", "approx": None}

            payload = {
                "angle_deg": float(angle_deg),
                "angle_rad": str(angle_rad),
                "ratios": ratios
            }
            
            # Create a basic visual of the angle on unit circle
            import math
            theta = float(angle_rad)
            px = math.cos(theta)
            py = math.sin(theta)
            
            plot_elements = [
                PlotElement(
                    type="circle",
                    data={"center": [0,0], "radius": 1, "label": "Unit Circle"},
                    style={"line": {"color": "#3b82f6"}}
                ),
                PlotElement(
                    type="line",
                    data={"from": [0,0], "to": [px, py], "label": "Angle"},
                    style={"color": "#ef4444", "width": 2}
                ),
                PlotElement(
                    type="point",
                    data={"coords": [px, py], "label": "P"},
                    style={"color": "#ef4444", "size": 6}
                )
            ]

            return ComputationResult(
                status="ok",
                operation="basic_values",
                payload=payload,
                steps=steps,
                plot_elements=plot_elements,
                latex=latex_res
            )
        except Exception as e:
            return create_error_result("basic_values", str(e))

    def unit_circle_interaction(self, angle_deg_val: float) -> ComputationResult:
        """
        Generate detailed unit circle data for visualization.
        """
        try:
            theta_rad = math.radians(angle_deg_val)
            px = math.cos(theta_rad)
            py = math.sin(theta_rad)
            
            # Generate circle points for smooth rendering
            t = np.linspace(0, 2*np.pi, 100)
            cx = np.cos(t)
            cy = np.sin(t)
            circle_points = list(zip(cx.tolist(), cy.tolist()))
            
            elements = []
            
            # 1. The Circle
            elements.append(PlotElement(
                type="scatter", 
                data={"points": circle_points, "label": "Unit Circle"},
                style={"color": "#e5e7eb"}
            ))
            
            # 2. The Ray/Radius
            elements.append(PlotElement(
                type="line",
                data={"from": [0, 0], "to": [px, py], "label": "Angle"},
                style={"color": "#3b82f6", "width": 3}
            ))

            # 3. Projections (Cos and Sin)
            elements.append(PlotElement(
                type="line",
                data={"from": [px, 0], "to": [px, py], "label": "sin(θ)"},
                style={"color": "#ef4444", "dash": "dash"}
            ))
            elements.append(PlotElement(
                type="line",
                data={"from": [0, 0], "to": [px, 0], "label": "cos(θ)"},
                style={"color": "#10b981", "dash": "dash"}
            ))

            # 4. Tangent line
            if abs(math.cos(theta_rad)) > 0.01:
                tan_val = math.tan(theta_rad)
                if abs(tan_val) < 5: 
                    elements.append(PlotElement(
                        type="line",
                        data={"from": [1, 0], "to": [1, tan_val], "label": "tan(θ)"},
                        style={"color": "#f59e0b"}
                    ))
                    elements.append(PlotElement(
                        type="line",
                        data={"from": [0, 0], "to": [1, tan_val], "label": "sec(θ)"},
                        style={"color": "#8b5cf6", "dash": "dot"}
                    ))

            steps = [
                f"Angle θ = {angle_deg_val}°",
                f"Coordinates P(x, y) = (cos θ, sin θ)",
                f"P = ({px:.4f}, {py:.4f})"
            ]

            payload = {
                "angle_rad": theta_rad,
                "coordinates": f"({px:.2f}, {py:.2f})",
                "ratios": {
                    "sin": py,
                    "cos": px,
                    "tan": math.tan(theta_rad) if abs(px) > 1e-9 else None
                }
            }

            return ComputationResult(
                status="ok",
                operation="unit_circle",
                payload=payload,
                steps=steps,
                plot_elements=elements,
                latex={"Coordinates": f"(\\cos{angle_deg_val}^\\circ, \\sin{angle_deg_val}^\\circ)"}
            )
            
        except Exception as e:
            return create_error_result("unit_circle", str(e))

    def generate_graph(self, func_type: str, params: Dict[str, float]) -> ComputationResult:
        """
        Generate graph data for A*func(Bx - C) + D
        """
        try:
            A = params.get('A', 1.0)
            B = params.get('B', 1.0)
            C = params.get('C', 0.0)
            D = params.get('D', 0.0)
            
            # --- Stage 1: Determine Domain (x) ---
            if func_type in ['asin', 'acos', 'atan']:
                # Inverse functions with special domains
                if func_type == 'atan':
                    center = C / B if B != 0 else 0
                    width = 10 / abs(B) if B != 0 else 10
                    x_min, x_max = center - width/2, center + width/2
                else:
                    # arcsin/arccos defined for [-1, 1]
                    if B == 0: 
                         x_min, x_max = -1, 1
                    else:
                        limit1 = (C - 1) / B
                        limit2 = (C + 1) / B
                        x_min, x_max = min(limit1, limit2), max(limit1, limit2)
                
                num_points = 500
                x = np.linspace(x_min, x_max, num_points)
            else:
                # Standard trigonometric functions
                x_min, x_max = -2*np.pi, 2*np.pi
                num_points = 500
                x = np.linspace(x_min, x_max, num_points)

            # --- Stage 2: Calculate Function (y) ---
            if func_type == 'sin':
                y = A * np.sin(B*x - C) + D
            elif func_type == 'cos':
                y = A * np.cos(B*x - C) + D
            elif func_type == 'tan':
                y = A * np.tan(B*x - C) + D
            elif func_type == 'cot':
                with np.errstate(divide='ignore'):
                    denom = np.tan(B*x - C)
                    y = A * (1/denom) + D
                    y[np.abs(denom) < 1e-9] = np.nan
            elif func_type == 'sec':
                 with np.errstate(divide='ignore'):
                    denom = np.cos(B*x - C)
                    y = A * (1/denom) + D
            elif func_type == 'csc':
                 with np.errstate(divide='ignore'):
                    denom = np.sin(B*x - C)
                    y = A * (1/denom) + D
            elif func_type == 'asin':
                y = A * np.arcsin(B*x - C) + D
            elif func_type == 'acos':
                y = A * np.arccos(B*x - C) + D
            elif func_type == 'atan':
                y = A * np.arctan(B*x - C) + D
            else:
                return create_error_result("graph", f"Unknown function {func_type}")

            # --- Stage 3: Post-Processing (Asymptotes) ---
            if func_type in ['tan', 'cot', 'sec', 'csc']:
                # Filter out extreme values
                y[np.abs(y) > 20] = np.nan
                
                # Detect and mask asymptote lines
                threshold = 10.0 
                dy = np.diff(y)
                # If jump is large, insert NaNs
                jump_indices = np.where(np.abs(dy) > threshold)[0]
                y[jump_indices] = np.nan
                y[jump_indices + 1] = np.nan

            latex_func_inner = f"{B}x"
            if C != 0: latex_func_inner += f" - {C}"
            str_func = f"y = {A} \\{func_type}({latex_func_inner}) + {D}"
            str_func = str_func.replace("1.0 \\", "\\").replace("+ 0.0", "").replace("- 0.0", "")
            
            # Zip x and y for frontend contract
            # Loop-based serialization (Verified faster for N=500)
            valid_mask = ~np.isnan(y)
            graph_points = list(zip(x[valid_mask].tolist(), y[valid_mask].tolist()))
            
            elements = [PlotElement(
                type="scatter",
                data={"points": graph_points, "label": func_type},
                style={"color": "#8b5cf6"}
            )]

            return ComputationResult(
                status="ok",
                operation="graph",
                payload={"func_latex": str_func},
                steps=[],
                plot_elements=elements,
                latex={"Function": str_func}
            )
        except Exception as e:
            return create_error_result("graph", str(e))

    def prove_identity(self, lhs_str: str, rhs_str: str) -> ComputationResult:
        try:
            lhs = self._parse_input(lhs_str)
            rhs = self._parse_input(rhs_str)
            
            diff = simplify(lhs - rhs)
            proven = (diff == 0)
            
            steps = [
                f"LHS = {latex(lhs)}",
                f"RHS = {latex(rhs)}",
                f"LHS - RHS = {latex(lhs - rhs)}",
                f"Simplified Difference = {latex(diff)}"
            ]
            
            if proven:
                steps.append("Since difference is 0, Identity is PROVEN.")
                status_msg = "Proven"
            else:
                steps.append("Difference is not 0. Identity NOT Proven (or requires more assumptions).")
                status_msg = "Not Proven"

            return ComputationResult(
                status="ok",
                operation="identity",
                payload={"proven": proven},
                steps=steps,
                latex={"Result": f"\\text{{{status_msg}}}"}
            )
        except Exception as e:
            return create_error_result("identity", str(e))
            
    def solve_equation(self, eqn_str: str) -> ComputationResult:
        try:
            # Parse equation
            if '=' in eqn_str:
                parts = eqn_str.split('=')
                eqn = Eq(self._parse_input(parts[0]), self._parse_input(parts[1]))
            else:
                eqn = Eq(self._parse_input(eqn_str), 0)
            
            solutions = solve(eqn, self.x)
            
            sol_latex = []
            steps = [f"Equation: {latex(eqn)}"]
            
            for s in solutions:
                sol_latex.append(latex(s))
            
            sol_str = ", ".join(sol_latex)
            latex_res = {"Solutions": sol_str if sol_str else "\\text{No solution found}"}
            
            return ComputationResult(
                status="ok",
                operation="solve",
                payload={"solutions": [str(s) for s in solutions], "equation_latex": latex(eqn)},
                steps=steps,
                latex=latex_res
            )
        except Exception as e:
             return create_error_result("solve_equation", str(e))

    def compound_angle(self, op_type: str, A_val: str, B_val: str) -> ComputationResult:
        """
        Verify or Expand Compound Angle Formulas.
        op_type: 'sin_add' (sin(A+B)), 'cos_diff' (cos(A-B)), etc.
        """
        try:
            A = self._parse_input(A_val)
            B = self._parse_input(B_val)
            
            steps = []
            latex_res = {}
            payload = {}
            
            if op_type == 'sin_add':
                # sin(A+B) = sinA cosB + cosA sinB
                expr = sin(A + B)
                expanded = expand_trig(expr)
                latex_res["Formula"] = r"\sin(A+B) = \sin A \cos B + \cos A \sin B"
                steps.append(f"Expand sin({A} + {B})")
            elif op_type == 'sin_diff':
                expr = sin(A - B)
                expanded = expand_trig(expr)
                latex_res["Formula"] = r"\sin(A-B) = \sin A \cos B - \cos A \sin B"
            elif op_type == 'cos_add':
                expr = cos(A + B)
                expanded = expand_trig(expr)
                latex_res["Formula"] = r"\cos(A+B) = \cos A \cos B - \sin A \sin B"
            elif op_type == 'cos_diff':
                expr = cos(A - B)
                expanded = expand_trig(expr)
                latex_res["Formula"] = r"\cos(A-B) = \cos A \cos B + \sin A \sin B"
            elif op_type == 'tan_add':
                expr = tan(A + B)
                expanded = expand_trig(expr)
                latex_res["Formula"] = r"\tan(A+B) = \frac{\tan A + \tan B}{1 - \tan A \tan B}"
            else:
                return create_error_result("compound_angle", "Unknown operation")

            steps.append(f"Result: {latex(expanded)}")
            latex_res["Expansion"] = latex(expanded)
            
            # If A and B are numbers, compute value
            try:
                val = float(expr)
                latex_res["Value"] = f"{val:.4f}"
            except:
                pass

            return ComputationResult("ok", "compound_angle", payload, steps, [], latex_res)
        except Exception as e:
            return create_error_result("compound_angle", str(e))

    def heights_distances(self, param_type: str, d: float, angle_deg: float, h: float = 0) -> ComputationResult:
        """
        Solve Height & Distance problems for right triangles.
        param_type: 'find_height' (given dist, angle), 'find_dist' (given height, angle)
        """
        try:
            angle_rad = math.radians(angle_deg)
            steps = []
            latex_res = {}
             
            # Standard setup: Observer at A, Object at B (top). C is base of object.
            # tan(theta) = Height / Distance
            
            if param_type == 'find_height':
                # h = d * tan(theta)
                cal_h = d * math.tan(angle_rad)
                total_h = cal_h + h # Add observer height if any
                
                steps.append(f"Given: Distance d = {d}, Angle θ = {angle_deg}°")
                if h > 0: steps.append(f"Observer Height = {h}")
                steps.append(f"Formula: Height = d * tan(θ)")
                steps.append(f"Height = {d} * tan({angle_deg}°) = {cal_h:.4f}")
                if h > 0: steps.append(f"Total Height = {cal_h:.4f} + {h} = {total_h:.4f}")
                
                res_val = total_h
                latex_res["Height"] = f"{res_val:.4f}"
                
                # Visual - Polygon
                plot_elements = [
                    PlotElement("polygon", {"vertices": [[0,0], [d,0], [d, cal_h]], "label": "Triangle"}, {"fillcolor": "rgba(59, 130, 246, 0.2)"}),
                    PlotElement("point", {"coords": [d/2, -1], "label": f"d={d}"}, {}),
                    PlotElement("point", {"coords": [d+1, cal_h/2], "label": f"h={cal_h:.2f}"}, {})
                ]
                
            elif param_type == 'find_dist':
                # d = h / tan(theta)
                # Here input 'd' argument is actually height 'H' of object
                height_obj = d 
                cal_d = height_obj / math.tan(angle_rad)
                
                steps.append(f"Given: Height = {height_obj}, Angle θ = {angle_deg}°")
                steps.append(f"Formula: Distance = Height / tan(θ)")
                steps.append(f"Distance = {height_obj} / {math.tan(angle_rad):.4f} = {cal_d:.4f}")
                
                res_val = cal_d
                latex_res["Distance"] = f"{res_val:.4f}"
                
                plot_elements = [
                    PlotElement("polygon", {"vertices": [[0,0], [cal_d, 0], [cal_d, height_obj]], "label": "Triangle"}, {"fillcolor": "rgba(34, 197, 94, 0.2)"})
                ]
            else:
                 return create_error_result("heights_distances", "Unknown type")

            return ComputationResult("ok", "heights_distances", {"result": res_val}, steps, plot_elements, latex_res)

        except Exception as e:
            return create_error_result("heights_distances", str(e))

trig_core = TrigonometryCore()

