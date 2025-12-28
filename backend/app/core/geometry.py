
"""
Geometry Core Module.
Handles 2D and 3D Euclidean geometry, Vectors, and Conic Sections.
"""

from dataclasses import dataclass
from typing import List, Tuple, Optional, Union, Any, Dict
import math
from sympy import (
    Symbol, symbols, sympify, simplify, N, solve, Eq, pi, sqrt, acos,
    Matrix, det, latex
)
from sympy.geometry import (
    Point2D, Point3D, Line2D, Line3D, Plane
)
from app.core.utils import ComputationResult, PlotElement, create_error_result, format_latex_number

# --- 2D Primitives (Legacy/Basic Support) ---

@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0

@dataclass
class Line:
    # ax + by + c = 0
    a: float
    b: float
    c: float

@dataclass
class Circle:
    center: Point
    radius: float

def _safe_float(val: Any) -> float:
    try:
        if val is None or val == "":
            return 0.0
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def compute_distance(p1: Union[Dict, Point], p2: Union[Dict, Point]) -> ComputationResult:
    try:
        x1 = _safe_float(p1['x']) if isinstance(p1, dict) else _safe_float(p1.x)
        y1 = _safe_float(p1['y']) if isinstance(p1, dict) else _safe_float(p1.y)
        z1 = _safe_float(p1.get('z', 0)) if isinstance(p1, dict) else _safe_float(p1.z)
        
        x2 = _safe_float(p2['x']) if isinstance(p2, dict) else _safe_float(p2.x)
        y2 = _safe_float(p2['y']) if isinstance(p2, dict) else _safe_float(p2.y)
        z2 = _safe_float(p2.get('z', 0)) if isinstance(p2, dict) else _safe_float(p2.z)

        dist = sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)
        
        steps = [
            f"Formula: d = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²) ",
            f"Substitute: √(({x2}-{x1})² + ({y2}-{y1})² + ({z2}-{z1})²)",
            f"Result: {dist}",
            f"Approx: {float(dist):.4f}"
        ]
        
        return ComputationResult(
            status="ok",
            operation="distance",
            payload={"distance": float(dist), "symbolic": str(dist)},
            steps=steps,
            latex={"formula": r"d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}", "result": str(dist)}
        )
    except Exception as e:
        return create_error_result("distance", str(e))

def compute_midpoint(p1: Union[Dict, Point], p2: Union[Dict, Point]) -> ComputationResult:
    try:
        x1 = _safe_float(p1['x']) if isinstance(p1, dict) else _safe_float(p1.x)
        y1 = _safe_float(p1['y']) if isinstance(p1, dict) else _safe_float(p1.y)
        z1 = _safe_float(p1.get('z', 0)) if isinstance(p1, dict) else _safe_float(p1.z)
        
        x2 = _safe_float(p2['x']) if isinstance(p2, dict) else _safe_float(p2.x)
        y2 = _safe_float(p2['y']) if isinstance(p2, dict) else _safe_float(p2.y)
        z2 = _safe_float(p2.get('z', 0)) if isinstance(p2, dict) else _safe_float(p2.z)

        mx, my, mz = (x1 + x2)/2, (y1 + y2)/2, (z1 + z2)/2
        
        steps = [
            f"Formula: M = ((x₁+x₂)/2, (y₁+y₂)/2, (z₁+z₂)/2)",
            f"Substitute: (({x1}+{x2})/2, ({y1}+{y2})/2, ({z1}+{z2})/2)",
            f"Result: ({mx}, {my}, {mz})"
        ]
        
        return ComputationResult(
            status="ok",
            operation="midpoint",
            payload={"midpoint": {"x": float(mx), "y": float(my), "z": float(mz)}},
            steps=steps,
            latex={"formula": r"M = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}, \frac{z_1+z_2}{2}\right)", "result": f"M({mx}, {my}, {mz})"}
        )
    except Exception as e:
        return create_error_result("midpoint", str(e))

def compute_section_point(p1: Union[Dict, Point], p2: Union[Dict, Point], m: float, n: float) -> ComputationResult:
    """
    Computes the point P that divides the segment connecting p1 and p2 in the ratio m:n.
    P = (m*x2 + n*x1) / (m + n), ...
    """
    try:
        x1 = _safe_float(p1['x']) if isinstance(p1, dict) else _safe_float(p1.x)
        y1 = _safe_float(p1['y']) if isinstance(p1, dict) else _safe_float(p1.y)
        z1 = _safe_float(p1.get('z', 0)) if isinstance(p1, dict) else _safe_float(p1.z)
        
        x2 = _safe_float(p2['x']) if isinstance(p2, dict) else _safe_float(p2.x)
        y2 = _safe_float(p2['y']) if isinstance(p2, dict) else _safe_float(p2.y)
        z2 = _safe_float(p2.get('z', 0)) if isinstance(p2, dict) else _safe_float(p2.z)

        denom = m + n
        if denom == 0:
            return create_error_result("section_point", "Division by zero (m + n = 0)")

        px = (m * x2 + n * x1) / denom
        py = (m * y2 + n * y1) / denom
        pz = (m * z2 + n * z1) / denom

        steps = [
            f"Point P divides AB in ratio {m}:{n}",
            f"Formula: P = ( (mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n) )",
            f"x = ({m}*{x2} + {n}*{x1}) / ({m}+{n}) = {px:.4f}",
            f"y = ({m}*{y2} + {n}*{y1}) / ({m}+{n}) = {py:.4f}"
        ]
        if z1 != 0 or z2 != 0:
            steps.append(f"z = ({m}*{z2} + {n}*{z1}) / ({m}+{n}) = {pz:.4f}")

        payload = {"point": {"x": px, "y": py, "z": pz}}
        latex = {
            "Formula": r"P = \left(\frac{mx_2+nx_1}{m+n}, \frac{my_2+ny_1}{m+n}\right)",
            "Result": f"P({format_latex_number(px)}, {format_latex_number(py)})"
        }
        
        return ComputationResult("ok", "section_point", payload, steps, [], latex)
    except Exception as e:
        return create_error_result("section_point", str(e))

def line_from_points(p1, p2) -> ComputationResult:
    # 2D Line
    try:
        x1, y1 = _safe_float(p1['x']), _safe_float(p1['y'])
        x2, y2 = _safe_float(p2['x']), _safe_float(p2['y'])
        
        # y - y1 = m(x - x1)
        if x2 - x1 == 0:
            return ComputationResult(status="ok", operation="line_eq", payload={}, steps=["Vertical Line"], latex={"equation": f"x = {x1}"})
        
        m = (y2 - y1) / (x2 - x1)
        c = y1 - m * x1
        
        # ax + by + c = 0 form: mx - y + c = 0
        
        return ComputationResult(
            status="ok", 
            operation="line_eq", 
            payload={"m": float(m), "c": float(c)}, 
            steps=[f"Slope m = ({y2}-{y1})/({x2}-{x1}) = {m}", f"Equation: y = {m}x + {c}"],
            latex={"equation": f"y = {m}x + {c}"}
        )
    except Exception as e:
        return create_error_result("line_from_points", str(e))

def line_intersection(l1_params: Dict[str, float], l2_params: Dict[str, float]) -> ComputationResult:
    """
    Find intersection of two lines: a1x + b1y + c1 = 0 and a2x + b2y + c2 = 0
    """
    try:
        a1, b1, c1 = _safe_float(l1_params.get('a')), _safe_float(l1_params.get('b')), _safe_float(l1_params.get('c'))
        a2, b2, c2 = _safe_float(l2_params.get('a')), _safe_float(l2_params.get('b')), _safe_float(l2_params.get('c'))
        
        # Determinant
        det = a1*b2 - a2*b1
        
        steps = [
            f"Line 1: {a1}x + {b1}y + {c1} = 0",
            f"Line 2: {a2}x + {b2}y + {c2} = 0",
            f"Determinant D = a1*b2 - a2*b1 = ({a1})*({b2}) - ({a2})*({b1}) = {det}"
        ]
        eqn_latex = f"\\begin{{cases}} {a1}x + {b1}y + {c1} = 0 \\\\ {a2}x + {b2}y + {c2} = 0 \\end{{cases}}"
        
        if abs(det) < 1e-9:
            status = "parallel"
            # Check if coincident
            # If parallel, checking ratios c1/c2 vs a1/a2 (careful with zeroes)
            dist = abs(c2 - c1) / math.sqrt(a1**2 + b1**2) if (a1**2 + b1**2) > 0 else 0
            if dist < 1e-9: 
                status = "coincident"
                steps.append("Lines are Coincident (Infinite intersections)")
            else:
                steps.append("Lines are Parallel (No intersection)")
                
            return ComputationResult("ok", "line_intersection", {"status": status}, steps, [], {"System": eqn_latex, "Result": f"\\text{{{status.title()}}}"})
            
        x = (b1*c2 - b2*c1) / det
        y = (c1*a2 - c2*a1) / det
        
        steps.append(f"x = (b1*c2 - b2*c1)/D = {x:.4f}")
        steps.append(f"y = (c1*a2 - c2*a1)/D = {y:.4f}")
        steps.append(f"Intersection: ({x:.4f}, {y:.4f})")
        
        latex = {
            "System": eqn_latex,
            "Solution": f"(x, y) = \\left({format_latex_number(x)}, {format_latex_number(y)}\\right)"
        }
        
        return ComputationResult("ok", "line_intersection", {"status": "intersecting", "point": {"x": x, "y": y}}, steps, [], latex)
        
    except Exception as e:
        return create_error_result("line_intersection", str(e))

def line_circle_intersection(line_params: Dict[str, float], circle_params: Dict[str, float]) -> ComputationResult:
    """
    Intersection of Line ax+by+c=0 and Circle (x-h)^2 + (y-k)^2 = r^2
    """
    try:
        a, b, c = _safe_float(line_params.get('a')), _safe_float(line_params.get('b')), _safe_float(line_params.get('c'))
        h = _safe_float(circle_params.get('h')) if 'h' in circle_params else _safe_float(circle_params.get('x', 0))
        k = _safe_float(circle_params.get('k')) if 'k' in circle_params else _safe_float(circle_params.get('y', 0))
        r = _safe_float(circle_params.get('r'))
        
        # Distance from center to line
        numer = abs(a*h + b*k + c)
        denom = math.sqrt(a**2 + b**2)
        dist = numer / denom if denom != 0 else 0
        
        steps = [
            f"Line: {a}x + {b}y + {c} = 0",
            f"Circle Center: ({h}, {k}), Radius: {r}",
            f"Perpendicular Distance d from Center to Line: {dist:.4f}"
        ]
        
        points = []
        status = "no_intersection"
        
        if abs(dist - r) < 1e-9:
            status = "tangent"
            steps.append(f"d ≈ r ({dist:.4f} ≈ {r}), Line is Tangent")
            # Find the single point
            # Projection of (h,k) onto line
            x0 = (b*(b*h - a*k) - a*c) / (a**2 + b**2)
            y0 = (a*(-b*h + a*k) - b*c) / (a**2 + b**2)
            points.append({"x": x0, "y": y0})
            
        elif dist < r:
            status = "secant"
            steps.append(f"d < r ({dist:.4f} < {r}), Line is Secant (2 points)")
            # Projection point
            x0 = (b*(b*h - a*k) - a*c) / (a**2 + b**2)
            y0 = (a*(-b*h + a*k) - b*c) / (a**2 + b**2)
            
            # Offset distance along line
            d_chord = math.sqrt(r**2 - dist**2)
            dx = (-b * d_chord) / denom
            dy = (a * d_chord) / denom
            
            points.append({"x": x0 + dx, "y": y0 + dy})
            points.append({"x": x0 - dx, "y": y0 - dy})
        else:
             steps.append(f"d > r ({dist:.4f} > {r}), No Intersection")

        latex = {
            "Distance": f"d = \\frac{{|{a}({h}) + {b}({k}) + {c}|}}{{\\sqrt{{{a}^2 + {b}^2}}}} = {format_latex_number(dist)}",
            "Conclusion": f"\\text{{{status.title()}}}"
        }
        
        payload = {"status": status, "points": points, "distance": dist}
        return ComputationResult("ok", "line_circle_intersection", payload, steps, [], latex)
        
    except Exception as e:
        return create_error_result("line_circle_intersection", str(e))

def circle_circle_intersection(c1_params: Dict[str, float], c2_params: Dict[str, float]) -> ComputationResult:
    try:
        h1, k1, r1 = _safe_float(c1_params.get('x',0)), _safe_float(c1_params.get('y',0)), _safe_float(c1_params.get('r'))
        h2, k2, r2 = _safe_float(c2_params.get('x',0)), _safe_float(c2_params.get('y',0)), _safe_float(c2_params.get('r'))
        
        d_sq = (h2 - h1)**2 + (k2 - k1)**2
        d = math.sqrt(d_sq)
        
        steps = [
            f"Circle 1: Center ({h1}, {k1}), Radius {r1}",
            f"Circle 2: Center ({h2}, {k2}), Radius {r2}",
            f"Distance between centers d = {d:.4f}"
        ]
        
        status = ""
        points = []
        
        if d > r1 + r2:
            status = "disjoint_outside"
            steps.append("d > r1 + r2 (Separate circles)")
        elif d < abs(r1 - r2):
            status = "disjoint_inside"
            steps.append("d < |r1 - r2| (One inside other)")
        elif d == 0 and r1 == r2:
            status = "coincident"
            steps.append("Identical circles")
        else:
            # Intersecting or Tangent
            a = (r1**2 - r2**2 + d**2) / (2*d)
            h_val = math.sqrt(max(0, r1**2 - a**2)) # Renamed h to h_val to avoid conflict with h1, h2
            
            # P2 = P1 + a ( P2 - P1 ) / d
            x2 = h1 + a * (h2 - h1) / d
            y2 = k1 + a * (k2 - k1) / d
            
            x3_1 = x2 + h_val * (k2 - k1) / d
            y3_1 = y2 - h_val * (h2 - h1) / d
            x3_2 = x2 - h_val * (k2 - k1) / d
            y3_2 = y2 + h_val * (h2 - h1) / d
            
            if abs(d - (r1+r2)) < 1e-9 or abs(d - abs(r1-r2)) < 1e-9:
                status = "tangent"
                steps.append("Circles touch at one point")
                points.append({"x": x3_1, "y": y3_1})
            else:
                status = "intersecting"
                steps.append("Circles intersect at two points")
                points.append({"x": x3_1, "y": y3_1})
                points.append({"x": x3_2, "y": y3_2})

        payload = {"status": status, "points": points, "distance": d}
        latex = {"Distance": f"d = {format_latex_number(d)}", "Status": f"\\text{{{status.replace('_', ' ').title()}}}"}
        
        return ComputationResult("ok", "circle_circle_intersection", payload, steps, [], latex)
        
    except Exception as e:
         return create_error_result("circle_circle_intersection", str(e))

def tangent_from_point(p_params: Dict[str, float], c_params: Dict[str, float]) -> ComputationResult:
    """
    Find tangents from point (px, py) to Circle (x-h)^2 + (y-k)^2 = r^2
    """
    try:
        px, py = _safe_float(p_params.get('x')), _safe_float(p_params.get('y'))
        h, k = _safe_float(c_params.get('h', 0)), _safe_float(c_params.get('k', 0))
        r = _safe_float(c_params.get('r'))
        
        dist_sq = (px - h)**2 + (py - k)**2
        dist = math.sqrt(dist_sq)
        
        steps = [
            f"Point P: ({px}, {py})",
            f"Circle Center C: ({h}, {k}), Radius: {r}",
            f"Distance PC = {dist:.4f}"
        ]
        
        tangents = []
        status = ""
        
        if dist < r:
            status = "inside"
            steps.append("Point is inside the circle. No real tangents.")
        elif abs(dist - r) < 1e-9:
            status = "on_circle"
            steps.append("Point is on the circle. One tangent.")
            # Tangent at point on circle: (x-h)(x1-h) + (y-k)(y1-k) = r^2
            # (x1-h)x + (y1-k)y - (x1-h)h - (y1-k)k - r^2 = 0
            A = px - h
            B = py - k
            C_const = -A*h - B*k - r**2 # Using C_const to avoid internal conflict
            tangents.append({"a": A, "b": B, "c": C_const})
            steps.append(f"Equation: {A:.2f}x + {B:.2f}y + {C_const:.2f} = 0")
        else:
            status = "outside"
            steps.append("Point is outside. Two tangents.")
            # Angle between PC and tangent is alpha
            # sin(alpha) = r / dist
            
            # Using rotation of the vector CP? Or polar coordinates?
            # Or general line y - py = m(x - px) and dist to center = r
            
            # Let's use the Geometric construction method
            # Tangent points T1, T2 are intersections of the original circle 
            # and the circle with diameter PC.
            
            # Or standard formula for pair of tangents: SS1 = T^2 (Polynomial form)
            # Let's use slope method for explicit line eq: y = mx + c
            # Distance from (h,k) to mx - y + (py - m*px) = 0 is r
            # |mh - k + py - m*px| / sqrt(m^2+1) = r
            # (m(h-px) + (py-k))^2 = r^2(m^2+1)
            # A m^2 + B m + C = 0
            
            dx = h - px
            dy = py - k
            
            # (m*dx + dy)^2 = r^2(m^2 + 1)
            # m^2 dx^2 + dy^2 + 2 m dx dy = r^2 m^2 + r^2
            # m^2 (dx^2 - r^2) + m (2 dx dy) + (dy^2 - r^2) = 0
            
            quad_a = dx**2 - r**2
            quad_b = 2 * dx * dy
            quad_c = dy**2 - r**2
            
            # Solve quadratic for m
            D_quad = quad_b**2 - 4 * quad_a * quad_c
            
            ms = []
            
            if abs(quad_a) < 1e-9:
                # Linear equation 2 dx dy m + dy^2 - r^2 = 0 => m = ...
                # If vertical line?
                if abs(quad_b) > 1e-9:
                    m = -quad_c / quad_b
                    ms.append(m)
                    # Vertical tangent check is implicit?
                else: 
                     # Should check for vertical tangent manually
                     pass
            else:
                 if D_quad >= 0:
                    m1 = (-quad_b + math.sqrt(D_quad)) / (2*quad_a)
                    m2 = (-quad_b - math.sqrt(D_quad)) / (2*quad_a)
                    ms.append(m1)
                    ms.append(m2)
            
            # If we found fewer than 2 distinct m's, one might be vertical (infinite slope)
            # Check vertical line x = px
            # Dist from (h,k) to x - px = 0 is |h - px|. If == r, then vertical tangent exists.
            if abs(abs(h - px) - r) < 1e-9 and len(ms) < 2: # Only add if we don't have 2 slopes yet and it's valid
                 # Add vertical tangent x - px = 0 => 1*x + 0*y - px = 0
                 tangents.append({"a": 1, "b": 0, "c": -px, "desc": "Vertical"})
                 steps.append(f"Vertical Tangent: x = {px}")

            for m in ms:
                 # y - py = m(x - px) => mx - y + (py - m*px) = 0
                 c_val = py - m*px
                 tangents.append({"a": m, "b": -1, "c": c_val, "m": m})
                 steps.append(f"Slope m ≈ {m:.4f}, Eq: y = {m:.4f}x + {c_val:.4f}")

        payload = {"status": status, "tangents": tangents}
        latex = {"Status": f"\\text{{{status}}}", "Count": str(len(tangents))}
        
        return ComputationResult("ok", "tangent_from_point", payload, steps, [], latex)

    except Exception as e:
         return create_error_result("tangent_from_point", str(e))


class QuadrilateralProperties:
    @staticmethod
    def analyze(p1: Dict[str, float], p2: Dict[str, float], p3: Dict[str, float], p4: Dict[str, float]) -> ComputationResult:
        """
        Analyze Quadrilateral properties: Area, Classification (Square, Rect, etc.)
        Points assumed in order.
        """
        try:
            pts = [_safe_float(p.get('x')) for p in [p1,p2,p3,p4]]
            ys = [_safe_float(p.get('y')) for p in [p1,p2,p3,p4]]
            
            # Distance func
            def d(i, j):
                return math.sqrt((pts[i]-pts[j])**2 + (ys[i]-ys[j])**2)
            
            # Sides
            s1 = d(0, 1) # AB
            s2 = d(1, 2) # BC
            s3 = d(2, 3) # CD
            s4 = d(3, 0) # DA
            
            # Diagonals
            d1 = d(0, 2) # AC
            d2 = d(1, 3) # BD
            
            # Area (Shoelace)
            # 0.5 * |(x1y2 + x2y3 + x3y4 + x4y1) - (y1x2 + y2x3 + y3x4 + y4x1)|
            area = 0.5 * abs(
                (pts[0]*ys[1] + pts[1]*ys[2] + pts[2]*ys[3] + pts[3]*ys[0]) - 
                (ys[0]*pts[1] + ys[1]*pts[2] + ys[2]*pts[3] + ys[3]*pts[0])
            )
            
            steps = [
                f"Sides: AB={s1:.2f}, BC={s2:.2f}, CD={s3:.2f}, DA={s4:.2f}",
                f"Diagonals: AC={d1:.2f}, BD={d2:.2f}",
                f"Area = {area:.4f}"
            ]
            
            # Classification
            qtype = "Quadrilateral"
            # Tolerance
            tol = 1e-5
            
            equal_sides = abs(s1-s2)<tol and abs(s2-s3)<tol and abs(s3-s4)<tol
            opp_sides_equal = abs(s1-s3)<tol and abs(s2-s4)<tol
            diags_equal = abs(d1-d2)<tol
            
            # Check for right angle? (Pythagoras on triangle ABC: AC^2 = AB^2 + BC^2 ?)
            rect_corner = abs(d1**2 - (s1**2 + s2**2)) < tol
            
            if equal_sides:
                if diags_equal or rect_corner:
                    qtype = "Square"
                else:
                    qtype = "Rhombus"
            elif opp_sides_equal:
                if diags_equal or rect_corner:
                    qtype = "Rectangle"
                else:
                    qtype = "Parallelogram"
            
            steps.append(f"Classification: {qtype}")
            
            payload = {
                "area": area, 
                "sides": [s1, s2, s3, s4], 
                "diagonals": [d1, d2],
                "type": qtype
            }
            latex = {
                "Area": f"{format_latex_number(area)}",
                "Type": f"\\text{{{qtype}}}"
            }
            
            return ComputationResult("ok", "quadrilateral_analyze", payload, steps, [], latex)
            
        except Exception as e:
            return create_error_result("quadrilateral_analyze", str(e))

# --- Triangle Properties (Phase 1) ---
class TriangleProperties:
    @staticmethod
    def analyze(p1_in: Dict[str, float], p2_in: Dict[str, float], p3_in: Dict[str, float]) -> ComputationResult:
        """
        Analyze triangle formed by P1, P2, P3.
        Computes Area, Centroid, Orthocenter, Circumcenter, Incenter.
        """
        try:
            x1, y1 = _safe_float(p1_in.get('x')), _safe_float(p1_in.get('y'))
            x2, y2 = _safe_float(p2_in.get('x')), _safe_float(p2_in.get('y'))
            x3, y3 = _safe_float(p3_in.get('x')), _safe_float(p3_in.get('y'))
            
            # Side lengths
            a = math.sqrt((x2-x3)**2 + (y2-y3)**2) # Side opposite P1
            b = math.sqrt((x1-x3)**2 + (y1-y3)**2) # Side opposite P2
            c = math.sqrt((x1-x2)**2 + (y1-y2)**2) # Side opposite P3
            
            # Area (Shoelace)
            area = 0.5 * abs(x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2))
            
            steps = [
                f"Vertices: A({x1}, {y1}), B({x2}, {y2}), C({x3}, {y3})",
                f"Side lengths: a={a:.4f}, b={b:.4f}, c={c:.4f}",
                f"Area = 0.5 * |x1(y2-y3) + ...| = {area:.4f}"
            ]
            latex = {"Area": f"{format_latex_number(area)}"}
            payload = {"area": area, "sides": {"a": a, "b": b, "c": c}}
            
            if area < 1e-9:
                return create_error_result("triangle_analyze", "Points are collinear (Area=0)")

            # Centroid (G) = (x1+x2+x3)/3
            gx, gy = (x1+x2+x3)/3, (y1+y2+y3)/3
            payload["centroid"] = {"x": gx, "y": gy}
            steps.append(f"Centroid G = ({gx:.4f}, {gy:.4f})")
            
            # Incenter (I) = (ax1+bx2+cx3)/perim
            perim = a + b + c
            ix = (a*x1 + b*x2 + c*x3) / perim
            iy = (a*y1 + b*y2 + c*y3) / perim
            payload["incenter"] = {"x": ix, "y": iy}
            steps.append(f"Incenter I = ({ix:.4f}, {iy:.4f})")
            
            # Circumcenter (O)
            # Intersection of perpendicular bisectors
            # D = 2(x1(y2-y3) + x2(y3-y1) + x3(y1-y2))
            D = 2 * (x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2))
            # If D is small, collinear check above should catch it
            ox = ((x1**2 + y1**2)*(y2 - y3) + (x2**2 + y2**2)*(y3 - y1) + (x3**2 + y3**2)*(y1 - y2)) / D
            oy = ((x1**2 + y1**2)*(x3 - x2) + (x2**2 + y2**2)*(x1 - x3) + (x3**2 + y3**2)*(x2 - x1)) / D
            payload["circumcenter"] = {"x": ox, "y": oy}
            steps.append(f"Circumcenter O = ({ox:.4f}, {oy:.4f})")
            
            # Orthocenter (H)
            # Relationship: O, G, H are collinear (Euler Line) usually HG = 2GO or something similar
            # Or use formula: xH = x1 + x2 + x3 - 2xO
            hx = x1 + x2 + x3 - 2*ox
            hy = y1 + y2 + y3 - 2*oy
            payload["orthocenter"] = {"x": hx, "y": hy}
            steps.append(f"Orthocenter H = ({hx:.4f}, {hy:.4f})")
            
            latex["Centroid"] = f"G({format_latex_number(gx)}, {format_latex_number(gy)})"
            
            return ComputationResult("ok", "triangle_analyze", payload, steps, [], latex)
            
        except Exception as e:
            return create_error_result("triangle_analyze", str(e))

# --- Advanced Geometry (Phase 4.3) ---

class VectorCalculator:
    @staticmethod
    def analyze(v1_comps: List[float], v2_comps: Optional[List[float]] = None, operation: str = "properties") -> ComputationResult:
        try:
            steps = []
            latex = {}
            payload = {}
            
            # SymPy Vectors? Or just Matrices for simplicity
            # Let's use Matrix for vector ops
            v1 = Matrix(v1_comps)
            
            if operation == "properties":
                mag = v1.norm()
                unit = v1 / mag if mag != 0 else v1
                
                steps.append(f"Vector v = {v1_comps}")
                steps.append(f"Magnitude |v| = √({' + '.join([f'{c}^2' for c in v1_comps])}) = {mag}")
                steps.append(f"Unit Vector = v / |v| = {unit}")
                
                payload = {
                    "magnitude": float(mag),
                    "unit_vector": [float(x) for x in unit]
                }
                latex["Magnitude"] = f"|\\mathbf{{v}}| = {latex_print(mag)}"
                latex["Unit Vector"] = f"\\hat{{n}} = {latex_print(unit)}"
                
                # Plot: Vector from origin
                origin = [0]*len(v1_comps)
                plot_data = PlotElement(
                    type="vector_3d" if len(v1_comps)==3 else "vector_2d",
                    data={"start": origin, "end": v1_comps, "label": "v"},
                    style={"color": "blue"}
                )
                return ComputationResult("ok", "vector_properties", payload, steps, [plot_data], latex)

            if v2_comps:
                v2 = Matrix(v2_comps)
                
                if operation == "dot":
                    res = v1.dot(v2)
                    steps.append(f"v1 · v2 = ({v1[0]}*{v2[0]}) + ... = {res}")
                    latex["Dot Product"] = f"\\mathbf{{a}} \\cdot \\mathbf{{b}} = {res}"
                    payload["result"] = float(res)
                    
                elif operation == "cross":
                    if len(v1_comps) != 3 or len(v2_comps) != 3:
                        raise ValueError("Cross product requires 3D vectors")
                    res = v1.cross(v2)
                    steps.append(f"v1 x v2 = Determinant method = {res}")
                    latex["Cross Product"] = f"\\mathbf{{a}} \\times \\mathbf{{b}} = {latex_print(res)}"
                    payload["result"] = [float(x) for x in res]
                    
                elif operation == "angle":
                    mag1 = v1.norm()
                    mag2 = v2.norm()
                    dot_prod = v1.dot(v2)
                    angle_rad = acos(dot_prod / (mag1 * mag2))
                    angle_deg = angle_rad * 180 / pi
                    
                    steps.append(f"cos(θ) = (v1 · v2) / (|v1| |v2|)")
                    steps.append(f"cos(θ) = {dot_prod} / ({mag1} * {mag2})")
                    steps.append(f"θ = {angle_deg}°")
                    
                    latex["Angle"] = f"\\theta = {latex_print(angle_deg)}^\\circ"
                    payload["degrees"] = float(angle_deg)
                
                elif operation == "projection":
                    # Proj v1 on v2
                    mag2_sq = v2.dot(v2)
                    proj = (v1.dot(v2) / mag2_sq) * v2
                    steps.append(f"Proj_v2(v1) = ((v1·v2)/|v2|²) * v2")
                    steps.append(f"Result: {proj}")
                    latex["Projection"] = f"\\text{{proj}}_{{\\mathbf{{b}}}}\\mathbf{{a}} = {latex_print(proj)}"
                    payload["result"] = [float(x) for x in proj]
            
            return ComputationResult("ok", "vector_operation", payload, steps, [], latex)

        except Exception as e:
            return create_error_result("vector_calc", str(e))

class AnalyticGeometry3D:
    @staticmethod
    def analyze_line(p1: List[float], p2: List[float]) -> ComputationResult:
        try:
            # 3D Line from two points
            A = Point3D(p1)
            B = Point3D(p2)
            L = Line3D(A, B)
            
            # Direction ratios
            d = L.direction
            # Equation form
            eq_param = f"x = {p1[0]} + {d[0]}t, y = {p1[1]} + {d[1]}t, z = {p1[2]} + {d[2]}t"
            
            latex = {
                "Parametric Equation": f"\\begin{{cases}} x = {p1[0]} + {d[0]}t \\\\ y = {p1[1]} + {d[1]}t \\\\ z = {p1[2]} + {d[2]}t \\end{{cases}}",
                "Symmetric Equation": f"\\frac{{x - {p1[0]}}}{{{d[0]}}} = \\frac{{y - {p1[1]}}}{{{d[1]}}} = \\frac{{z - {p1[2]}}}{{{d[2]}}}"
            }
            
            steps = [
                f"Direction Vector: B - A = {d}",
                f"Using Point A({p1})",
                f"Parametric Form: {eq_param}"
            ]
            
            return ComputationResult("ok", "line_3d", {}, steps, [], latex)
        except Exception as e:
            return create_error_result("line_3d", str(e))

    @staticmethod
    def analyze_plane(p1: List[float], p2: List[float], p3: List[float]) -> ComputationResult:
        try:
            A, B, C = Point3D(p1), Point3D(p2), Point3D(p3)
            Pl = Plane(A, B, C)
            normal = Pl.normal_vector
            eqn = Pl.equation() # defaults to ax + by + cz + d = 0?? Check sympy docs
            
            steps = [
                f"Normal Vector n = (B-A) x (C-A) = {normal}",
                f"Equation: {eqn} = 0"
            ]
            latex = {"Plane Equation": f"{latex_print(eqn)} = 0"}
            
            return ComputationResult("ok", "plane_3d", {"normal": [float(x) for x in normal]}, steps, [], latex)
        except Exception as e:
             return create_error_result("plane_3d", str(e))

    @staticmethod
    def intersection_line_plane(line_p1: List[float], line_p2: List[float], plane_p1: List[float], plane_p2: List[float], plane_p3: List[float]) -> ComputationResult:
        try:
             L = Line3D(Point3D(line_p1), Point3D(line_p2))
             Pl = Plane(Point3D(plane_p1), Point3D(plane_p2), Point3D(plane_p3))
             
             inter = Pl.intersection(L)
             steps = ["Line L defined by P1, P2", "Plane P defined by A, B, C"]
             payload = {}
             latex = {}
             
             if not inter:
                 steps.append("No intersection (Parallel)")
                 status = "parallel"
             elif isinstance(inter[0], Line3D):
                 steps.append("Line lies on the Plane")
                 status = "coincident"
             else:
                 pt = inter[0]
                 steps.append(f"Intersection Point: {pt}")
                 status = "intersecting"
                 payload["point"] = [float(c) for c in pt.coordinates]
                 latex["Point"] = f"P({format_latex_number(float(pt.x))}, {format_latex_number(float(pt.y))}, {format_latex_number(float(pt.z))})"
             
             return ComputationResult("ok", "line_plane_intersection", payload, steps, [], latex)
        except Exception as e:
            return create_error_result("line_plane_intersection", str(e))


from functools import lru_cache

# Cache size
GEO_CACHE_SIZE = 128

@lru_cache(maxsize=GEO_CACHE_SIZE)
def _analyze_conic_cached(A: float, B: float, C: float, D: float, E: float, F: float) -> Tuple[str, str, Dict, List[str]]:
    """Cached worker for conic analysis."""
    x, y = symbols('x y')
    expr = A*x**2 + B*x*y + C*y**2 + D*x + E*y + F
    
    # Invariants
    a, b, c_const = A, C, F
    h, g, f_const = B/2, D/2, E/2
    
    M3 = Matrix([[a, h, g], [h, b, f_const], [g, f_const, c_const]])
    Delta = M3.det()
    
    Disc = h**2 - a*b 
    
    conic_type = "Unknown"
    if Delta == 0:
        conic_type = "Degenerate Conic (Pair of Lines, Point, etc.)"
    else:
        if Disc > 0:
            conic_type = "Hyperbola"
        elif Disc == 0:
            conic_type = "Parabola"
        else:
            conic_type = "Ellipse"
            if a == b and h == 0:
                conic_type = "Circle"
                
    steps = [
        f"Equation: {latex(expr)} = 0",
        f"Determinant Δ = {Delta}",
        f"Discriminant h²-ab = {Disc}",
        f"Classification: {conic_type}"
    ]
    
    latex_res = {
        "Equation": f"{latex(expr)} = 0",
        "Type": f"\\text{{{conic_type}}}"
    }
    
    return conic_type, latex(expr), latex_res, steps


class ConicAnalyzer:
    @staticmethod
    def analyze(coeffs: Dict[str, float]) -> ComputationResult:
        """
        General Equation: Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0
        Coeffs keys: A, B, C, D, E, F
        """
        try:
            A = _safe_float(coeffs.get('A'))
            B = _safe_float(coeffs.get('B'))
            C = _safe_float(coeffs.get('C'))
            D = _safe_float(coeffs.get('D'))
            E = _safe_float(coeffs.get('E'))
            F = _safe_float(coeffs.get('F'))
            
            conic_type, expr_latex, latex_res, steps = _analyze_conic_cached(A, B, C, D, E, F)
            
            # Simple plot if possible (e.g. circle)
            # Not implemented for generic conic yet
            
            return ComputationResult(
                status="ok",
                operation="conic_analyze",
                payload={"type": conic_type, "determinant": "...", "discriminant": "..."},
                steps=steps,
                plot_elements=[],
                latex=latex_res
            )
            
        except Exception as e:
            return create_error_result("conic_analyze", str(e))
            

def latex_print(expr):
    from sympy import latex
    return latex(expr)

class Mensuration:
    """
    Handles Class 9/10 Mensuration: Area, Surface Area, Volumes.
    """
    
    @staticmethod
    def herons_formula(a: float, b: float, c: float) -> ComputationResult:
        try:
            s_val = (a + b + c) / 2.0
            area_sq = s_val * (s_val - a) * (s_val - b) * (s_val - c)
            
            if area_sq < 0:
                raise ValueError("The given sides do not form a valid triangle (triangle inequality violated).")
            
            area = math.sqrt(area_sq)
            
            # Formatting steps
            s_fmt = f"{s_val:.4g}" if s_val % 1 else f"{int(s_val)}"
            a_fmt = f"{a:.4g}" if a % 1 else f"{int(a)}"
            b_fmt = f"{b:.4g}" if b % 1 else f"{int(b)}"
            c_fmt = f"{c:.4g}" if c % 1 else f"{int(c)}"
            area_fmt = f"{area:.4g}"
            
            steps = [
                f"Sides: a = {a_fmt}, b = {b_fmt}, c = {c_fmt}",
                f"Semi-perimeter s = (a + b + c) / 2 = {s_fmt}",
                f"Area = √[s(s-a)(s-b)(s-c)]",
                f"Area = √[{s_fmt}({s_fmt}-{a_fmt})({s_fmt}-{b_fmt})({s_fmt}-{c_fmt})]",
                f"Area = √[{area_sq:.4g}] = {area_fmt}"
            ]
            
            return ComputationResult(
                "ok", 
                "mensuration_heron", 
                {"area": area, "s": s_val}, 
                steps, 
                [], 
                {"Formula": r"\text{Area} = \sqrt{s(s-a)(s-b)(s-c)}", "Result": f"{format_latex_number(area)}"}
            )
        except Exception as e:
            return create_error_result("heron", str(e))

    @staticmethod
    def solidity(shape: str, params: Dict[str, float]) -> ComputationResult:
        """
        Calculate Volume and Surface Area for 3D shapes.
        Shapes: cube, cuboid, cylinder, cone, sphere, hemisphere
        """
        try:
            steps = []
            latex = {}
            payload = {}
            
            if shape == "cube":
                a = params.get('side', 0)
                vol = a**3
                tsa = 6 * a**2
                lsa = 4 * a**2
                steps = [
                    f"Side a = {a}",
                    f"Volume = a³ = {vol}",
                    f"Total Surface Area = 6a² = {tsa}",
                    f"Lateral Surface Area = 4a² = {lsa}"
                ]
                latex = {
                    "Volume": f"V = a^3 = {format_latex_number(vol)}",
                    "TSA": f"A_{{total}} = 6a^2 = {format_latex_number(tsa)}"
                }
                payload = {"volume": vol, "tsa": tsa, "lsa": lsa}
                
            elif shape == "cuboid":
                l, b, h = params.get('l', 0), params.get('b', 0), params.get('h', 0)
                vol = l * b * h
                tsa = 2 * (l*b + b*h + h*l)
                lsa = 2 * h * (l + b)
                steps = [
                    f"Dimensions: l={l}, b={b}, h={h}",
                    f"Volume = lbh = {vol}",
                    f"TSA = 2(lb + bh + hl) = {tsa}",
                    f"LSA = 2h(l + b) = {lsa}"
                ]
                latex = {
                    "Volume": f"V = lbh = {format_latex_number(vol)}",
                    "TSA": f"A_{{total}} = 2(lb+bh+hl) = {format_latex_number(tsa)}"
                }
                payload = {"volume": vol, "tsa": tsa, "lsa": lsa}
                
            elif shape == "cylinder":
                r, h = params.get('r', 0), params.get('h', 0)
                vol = math.pi * r**2 * h
                csa = 2 * math.pi * r * h
                tsa = 2 * math.pi * r * (r + h)
                steps = [
                    f"Radius r={r}, Height h={h}",
                    f"Volume = πr²h ≈ {vol:.4f}",
                    f"Curved SA = 2πrh ≈ {csa:.4f}",
                    f"Total SA = 2πr(r+h) ≈ {tsa:.4f}"
                ]
                latex = {
                    "Volume": r"V = \pi r^2 h \approx " + format_latex_number(vol),
                    "TSA": r"A_{total} = 2\pi r(r+h) \approx " + format_latex_number(tsa)
                }
                payload = {"volume": vol, "csa": csa, "tsa": tsa}
            
            elif shape == "cone":
                r, h = params.get('r', 0), params.get('h', 0)
                l = math.sqrt(r**2 + h**2)
                vol = (1/3) * math.pi * r**2 * h
                csa = math.pi * r * l
                tsa = math.pi * r * (r + l)
                steps = [
                    f"Radius r={r}, Height h={h}",
                    f"Slant Height l = √(r² + h²) = {l:.4f}",
                    f"Volume = (1/3)πr²h ≈ {vol:.4f}",
                    f"Curved SA = πrl ≈ {csa:.4f}",
                    f"Total SA = πr(r+l) ≈ {tsa:.4f}"
                ]
                latex = {
                    "Volume": r"V = \frac{1}{3}\pi r^2 h \approx " + format_latex_number(vol),
                    "TSA": r"A_{total} = \pi r(r+l) \approx " + format_latex_number(tsa)
                }
                payload = {"volume": vol, "csa": csa, "tsa": tsa}

            elif shape == "sphere":
                r = params.get('r', 0)
                vol = (4/3) * math.pi * r**3
                tsa = 4 * math.pi * r**2
                steps = [
                    f"Radius r={r}",
                    f"Volume = (4/3)πr³ ≈ {vol:.4f}",
                    f"Surface Area = 4πr² ≈ {tsa:.4f}"
                ]
                latex = {
                    "Volume": r"V = \frac{4}{3}\pi r^3 \approx " + format_latex_number(vol),
                    "TSA": r"A = 4\pi r^2 \approx " + format_latex_number(tsa)
                }
                payload = {"volume": vol, "tsa": tsa}

            else:
                raise ValueError(f"Unknown shape: {shape}")
                
            return ComputationResult("ok", "mensuration_solid", payload, steps, [], latex)
            
        except Exception as e:
            return create_error_result("mensuration", str(e))

# --- Transformations (Phase 2) ---

class GeometricTransformer:
    @staticmethod
    def transform_2d(
        point: Dict[str, float], 
        operation: str, 
        params: Dict[str, float]
    ) -> ComputationResult:
        """
        Apply 2D geometric transformation to a point.
        Operations: rotate, reflect, translate, scale
        """
        try:
            px, py = _safe_float(point.get('x')), _safe_float(point.get('y'))
            
            steps = [f"Original Point P: ({px}, {py})"]
            new_x, new_y = px, py
            latex = {}
            
            if operation == "rotate":
                # Rotate around center (cx, cy) by angle (deg)
                cx = _safe_float(params.get('cx', 0))
                cy = _safe_float(params.get('cy', 0))
                angle_deg = _safe_float(params.get('angle', 0))
                angle_rad = math.radians(angle_deg)
                
                s, c = math.sin(angle_rad), math.cos(angle_rad)
                
                # Translation to origin
                tx, ty = px - cx, py - cy
                
                # Rotation
                rx = tx * c - ty * s
                ry = tx * s + ty * c
                
                # Translation back
                new_x = rx + cx
                new_y = ry + cy
                
                steps.append(f"Center of Rotation C: ({cx}, {cy})")
                steps.append(f"Angle: {angle_deg}°")
                steps.append(r"Formula: $x' = (x-cx)\cos\theta - (y-cy)\sin\theta + cx$")
                steps.append(r"Formula: $y' = (x-cx)\sin\theta + (y-cy)\cos\theta + cy$")
                
            elif operation == "reflect":
                # Reflect across line ax + by + c = 0
                a = _safe_float(params.get('a'))
                b = _safe_float(params.get('b'))
                c = _safe_float(params.get('c'))
                
                denom = a**2 + b**2
                if denom == 0:
                    return create_error_result("transform_2d", "Invalid line (a=b=0)")
                    
                factor = (a*px + b*py + c) / denom
                new_x = px - 2 * a * factor
                new_y = py - 2 * b * factor
                
                steps.append(f"Line of Reflection: {a}x + {b}y + {c} = 0")
                steps.append(r"Formula: $\frac{x'-x}{a} = \frac{y'-y}{b} = -2\frac{ax+by+c}{a^2+b^2}$")
                
            elif operation == "translate":
                dx = _safe_float(params.get('dx', 0))
                dy = _safe_float(params.get('dy', 0))
                new_x = px + dx
                new_y = py + dy
                steps.append(f"Vector: <{dx}, {dy}>")
                
            elif operation == "scale":
                cx = _safe_float(params.get('cx', 0))
                cy = _safe_float(params.get('cy', 0))
                k = _safe_float(params.get('factor', 1))
                
                new_x = cx + k * (px - cx)
                new_y = cy + k * (py - cy)
                steps.append(f"Center: ({cx}, {cy}), Factor k={k}")
                steps.append(r"Formula: $P' = C + k(P-C)$")
                
            else:
                 return create_error_result("transform_2d", f"Unknown operation: {operation}")
                 
            steps.append(f"Transformed Point P': ({new_x:.4f}, {new_y:.4f})")
            payload = {"point": {"x": new_x, "y": new_y}}
            latex["Result"] = f"({format_latex_number(new_x)}, {format_latex_number(new_y)})"
            
            return ComputationResult("ok", "transform_2d", payload, steps, [], latex)
            
        except Exception as e:
            return create_error_result("transform_2d", str(e))

# --- Conicoids (Phase 2.2) ---

class Conicoid3D:
    @staticmethod
    def analyze(shape: str, params: Dict[str, float]) -> ComputationResult:
        """
        Analyze and generate mesh for 3D Conicoids.
        Shapes: sphere, ellipsoid
        """
        try:
            steps = []
            latex = {}
            payload = {}
            plot_elements = []
            
            import numpy as np # Need numpy for mesh generation
            
            if shape == "sphere":
                cx, cy, cz = _safe_float(params.get('cx', 0)), _safe_float(params.get('cy', 0)), _safe_float(params.get('cz', 0))
                r = _safe_float(params.get('r', 1))
                
                steps.append(f"Center C: ({cx}, {cy}, {cz})")
                steps.append(f"Radius r: {r}")
                steps.append(f"Equation: (x-{cx})² + (y-{cy})² + (z-{cz})² = {r}²")
                
                latex["Equation"] = f"(x-{cx})^2 + (y-{cy})^2 + (z-{cz})^2 = {r}^2"
                
                # Mesh Generation
                theta = np.linspace(0, 2*np.pi, 20)
                phi = np.linspace(0, np.pi, 20)
                THETA, PHI = np.meshgrid(theta, phi)
                
                X = cx + r * np.sin(PHI) * np.cos(THETA)
                Y = cy + r * np.sin(PHI) * np.sin(THETA)
                Z = cz + r * np.cos(PHI)
                
                plot_elements.append(PlotElement(
                    type="surface",
                    data={
                        "x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(),
                        "colorscale": "Viridis",
                        "opacity": 0.8
                    },
                    style={"title": "Sphere"}
                ))
                
            elif shape == "ellipsoid":
                cx, cy, cz = _safe_float(params.get('cx', 0)), _safe_float(params.get('cy', 0)), _safe_float(params.get('cz', 0))
                a, b, c = _safe_float(params.get('a', 1)), _safe_float(params.get('b', 1)), _safe_float(params.get('c', 1))
                
                steps.append(f"Center C: ({cx}, {cy}, {cz})")
                steps.append(f"Semi-axes: a={a}, b={b}, c={c}")
                steps.append(f"Equation: (x-{cx})²/{a}² + (y-{cy})²/{b}² + (z-{cz})²/{c}² = 1")
                
                latex["Equation"] = f"\\frac{{(x-{cx})^2}}{{{a}^2}} + \\frac{{(y-{cy})^2}}{{{b}^2}} + \\frac{{(z-{cz})^2}}{{{c}^2}} = 1"
                
                # Mesh Generation
                theta = np.linspace(0, 2*np.pi, 20)
                phi = np.linspace(0, np.pi, 20)
                THETA, PHI = np.meshgrid(theta, phi)
                
                X = cx + a * np.sin(PHI) * np.cos(THETA)
                Y = cy + b * np.sin(PHI) * np.sin(THETA)
                Z = cz + c * np.cos(PHI)
                
                plot_elements.append(PlotElement(
                    type="surface",
                    data={
                        "x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(),
                        "colorscale": "Plasma",
                        "opacity": 0.8
                    },
                    style={"title": "Ellipsoid"}
                ))
            
            elif shape == "cone":
                r, h = _safe_float(params.get('r', 1)), _safe_float(params.get('h', 1))
                steps.append(f"Cone: r={r}, h={h}")
                latex["Equation"] = f"x^2 + y^2 = \\frac{{z^2}}{{{h}^2}}{r}^2"
                
                u = np.linspace(0, 2*np.pi, 20)
                v = np.linspace(0, h, 20)
                U, V = np.meshgrid(u, v)
                X = (r/h) * V * np.cos(U)
                Y = (r/h) * V * np.sin(U)
                Z = V
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(), "colorscale": "Reds", "opacity": 0.8}, style={"title": "Cone"}))

            elif shape == "cylinder":
                r, h = _safe_float(params.get('r', 1)), _safe_float(params.get('h', 5))
                steps.append(f"Cylinder: r={r}, h={h}")
                latex["Equation"] = f"x^2 + y^2 = {r}^2"
                
                u = np.linspace(0, 2*np.pi, 20)
                v = np.linspace(0, h, 20)
                U, V = np.meshgrid(u, v)
                X = r * np.cos(U)
                Y = r * np.sin(U)
                Z = V
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(), "colorscale": "Blues", "opacity": 0.8}, style={"title": "Cylinder"}))

            elif shape == "hyperboloid1":
                a, b, c = _safe_float(params.get('a', 1)), _safe_float(params.get('b', 1)), _safe_float(params.get('c', 1))
                steps.append("Hyperboloid of One Sheet")
                latex["Equation"] = f"\\frac{{x^2}}{{{a}^2}} + \\frac{{y^2}}{{{b}^2}} - \\frac{{z^2}}{{{c}^2}} = 1"
                
                u = np.linspace(0, 2*np.pi, 20)
                v = np.linspace(-2, 2, 20)
                U, V = np.meshgrid(u, v)
                X = a * np.cosh(V) * np.cos(U)
                Y = b * np.cosh(V) * np.sin(U)
                Z = c * np.sinh(V)
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(), "colorscale": "Electric", "opacity": 0.8}, style={"title": "Hyperboloid (1 Sheet)"}))

            elif shape == "hyperboloid2":
                a, b, c = _safe_float(params.get('a', 1)), _safe_float(params.get('b', 1)), _safe_float(params.get('c', 1))
                steps.append("Hyperboloid of Two Sheets")
                latex["Equation"] = f"-\\frac{{x^2}}{{{a}^2}} - \\frac{{y^2}}{{{b}^2}} + \\frac{{z^2}}{{{c}^2}} = 1"
                
                u = np.linspace(0, 2*np.pi, 20)
                v = np.linspace(0, 2, 20) # Top sheet
                U, V = np.meshgrid(u, v)
                X = a * np.sinh(V) * np.cos(U)
                Y = b * np.sinh(V) * np.sin(U)
                Z = c * np.cosh(V)
                
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(), "colorscale": "Electric"}, style={"title": "Top Sheet"}))
                # Bottom sheet? just flip Z
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": (-Z).tolist(), "colorscale": "Electric"}, style={"title": "Bottom Sheet"}))

            elif shape == "paraboloid":
                a, b = _safe_float(params.get('a', 1)), _safe_float(params.get('b', 1))
                steps.append("Elliptic Paraboloid")
                latex["Equation"] = f"\\frac{{x^2}}{{{a}^2}} + \\frac{{y^2}}{{{b}^2}} = z"
                
                u = np.linspace(0, 2*np.pi, 20)
                v = np.linspace(0, 2, 20)
                U, V = np.meshgrid(u, v)
                X = a * V * np.cos(U)
                Y = b * V * np.sin(U)
                Z = V**2
                plot_elements.append(PlotElement(type="surface", data={"x": X.tolist(), "y": Y.tolist(), "z": Z.tolist(), "colorscale": "Viridis", "opacity": 0.8}, style={"title": "Paraboloid"}))
            
            else:
                 return create_error_result("conicoid", f"Unknown shape: {shape}")

            return ComputationResult("ok", "conicoid_analysis", payload, steps, plot_elements, latex)
            
        except Exception as e:
            return create_error_result("conicoid", str(e))
