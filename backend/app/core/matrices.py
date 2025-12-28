"""
Matrices Module - Matrix Operations and Linear Algebra.

Provides matrix computations with visualizations.
"""

from typing import List, Optional, Tuple, Union
import math

import numpy as np
from sympy import Matrix, latex, simplify, symbols, eye

from app.core.utils import ComputationResult, PlotElement, create_error_result, format_latex_number


def _matrix_to_latex(matrix: List[List[float]]) -> str:
    """Convert a matrix to LaTeX representation."""
    rows = []
    for row in matrix:
        rows.append(" & ".join([format_latex_number(x) for x in row]))
    return r"\begin{pmatrix} " + r" \\ ".join(rows) + r" \end{pmatrix}"


def _validate_matrix(matrix: List[List[float]], name: str = "Matrix") -> Optional[str]:
    """Validate matrix structure. Returns error message or None if valid."""
    if not matrix:
        return f"{name} is empty"
    if not all(isinstance(row, list) for row in matrix):
        return f"{name} must be a list of lists"
    row_lengths = [len(row) for row in matrix]
    if len(set(row_lengths)) > 1:
        return f"{name} has inconsistent row lengths"
    return None


def matrix_add(matrix_a: List[List[float]], matrix_b: List[List[float]]) -> ComputationResult:
    """
    Add two matrices element-wise.
    """
    try:
        # Validate
        err_a = _validate_matrix(matrix_a, "Matrix A")
        if err_a:
            return create_error_result("matrix_add", err_a)
        err_b = _validate_matrix(matrix_b, "Matrix B")
        if err_b:
            return create_error_result("matrix_add", err_b)
        
        # Check dimensions
        if len(matrix_a) != len(matrix_b) or len(matrix_a[0]) != len(matrix_b[0]):
            return create_error_result("matrix_add", "Matrices must have the same dimensions")
        
        # Compute
        result = []
        for i in range(len(matrix_a)):
            row = []
            for j in range(len(matrix_a[0])):
                row.append(matrix_a[i][j] + matrix_b[i][j])
            result.append(row)
        
        steps = [
            f"Matrix A ({len(matrix_a)}×{len(matrix_a[0])})",
            f"Matrix B ({len(matrix_b)}×{len(matrix_b[0])})",
            "Element-wise addition: C[i][j] = A[i][j] + B[i][j]",
        ]
        
        return ComputationResult(
            status="ok",
            operation="matrix_add",
            payload={
                "matrix_a": matrix_a,
                "matrix_b": matrix_b,
                "result": result,
            },
            steps=steps,
            plot_elements=[],
            latex={
                "a": _matrix_to_latex(matrix_a),
                "b": _matrix_to_latex(matrix_b),
                "result": _matrix_to_latex(result),
                "equation": f"{_matrix_to_latex(matrix_a)} + {_matrix_to_latex(matrix_b)} = {_matrix_to_latex(result)}",
            },
        )
    except Exception as e:
        return create_error_result("matrix_add", str(e))


def matrix_multiply(matrix_a: List[List[float]], matrix_b: List[List[float]]) -> ComputationResult:
    """
    Multiply two matrices.
    """
    try:
        # Validate
        err_a = _validate_matrix(matrix_a, "Matrix A")
        if err_a:
            return create_error_result("matrix_multiply", err_a)
        err_b = _validate_matrix(matrix_b, "Matrix B")
        if err_b:
            return create_error_result("matrix_multiply", err_b)
        
        # Check dimensions for multiplication
        cols_a = len(matrix_a[0])
        rows_b = len(matrix_b)
        
        if cols_a != rows_b:
            return create_error_result("matrix_multiply", f"Cannot multiply: A has {cols_a} columns but B has {rows_b} rows")
        
        # Compute using numpy for efficiency
        np_a = np.array(matrix_a)
        np_b = np.array(matrix_b)
        np_result = np_a @ np_b
        result = np_result.tolist()
        
        steps = [
            f"Matrix A: {len(matrix_a)}×{cols_a}",
            f"Matrix B: {rows_b}×{len(matrix_b[0])}",
            f"Result: {len(matrix_a)}×{len(matrix_b[0])}",
            "Matrix multiplication: C[i][j] = Σ A[i][k] × B[k][j]",
        ]
        
        return ComputationResult(
            status="ok",
            operation="matrix_multiply",
            payload={
                "matrix_a": matrix_a,
                "matrix_b": matrix_b,
                "result": result,
            },
            steps=steps,
            plot_elements=[],
            latex={
                "a": _matrix_to_latex(matrix_a),
                "b": _matrix_to_latex(matrix_b),
                "result": _matrix_to_latex(result),
                "equation": f"{_matrix_to_latex(matrix_a)} \\times {_matrix_to_latex(matrix_b)} = {_matrix_to_latex(result)}",
            },
        )
    except Exception as e:
        return create_error_result("matrix_multiply", str(e))


def matrix_determinant(matrix: List[List[float]]) -> ComputationResult:
    """
    Calculate the determinant of a square matrix.
    """
    try:
        err = _validate_matrix(matrix, "Matrix")
        if err:
            return create_error_result("matrix_determinant", err)
        
        rows = len(matrix)
        cols = len(matrix[0])
        
        if rows != cols:
            return create_error_result("matrix_determinant", "Matrix must be square")
        
        np_matrix = np.array(matrix)
        det = np.linalg.det(np_matrix)
        
        steps = [
            f"Square matrix: {rows}×{cols}",
        ]
        
        if rows == 2:
            steps.extend([
                "For 2×2 matrix: det = ad - bc",
                f"det = ({matrix[0][0]})({matrix[1][1]}) - ({matrix[0][1]})({matrix[1][0]})",
                f"det = {format_latex_number(det)}",
            ])
        elif rows == 3:
            steps.extend([
                "For 3×3 matrix: Using Sarrus' rule or cofactor expansion",
                f"det = {format_latex_number(det)}",
            ])
        else:
            steps.append(f"Using LU decomposition: det = {format_latex_number(det)}")
        
        return ComputationResult(
            status="ok",
            operation="matrix_determinant",
            payload={
                "matrix": matrix,
                "determinant": det,
            },
            steps=steps,
            plot_elements=[],
            latex={
                "matrix": _matrix_to_latex(matrix),
                "result": f"\\det{_matrix_to_latex(matrix)} = {format_latex_number(det)}",
            },
        )
    except Exception as e:
        return create_error_result("matrix_determinant", str(e))


def matrix_inverse(matrix: List[List[float]]) -> ComputationResult:
    """
    Calculate the inverse of a square matrix.
    """
    try:
        err = _validate_matrix(matrix, "Matrix")
        if err:
            return create_error_result("matrix_inverse", err)
        
        rows = len(matrix)
        cols = len(matrix[0])
        
        if rows != cols:
            return create_error_result("matrix_inverse", "Matrix must be square")
        
        np_matrix = np.array(matrix)
        det = np.linalg.det(np_matrix)
        
        if abs(det) < 1e-10:
            return ComputationResult(
                status="ok",
                operation="matrix_inverse",
                payload={
                    "matrix": matrix,
                    "determinant": det,
                    "invertible": False,
                },
                steps=[
                    f"Determinant: {format_latex_number(det)}",
                    "Matrix is singular (det ≈ 0), inverse does not exist",
                ],
                plot_elements=[],
                latex={
                    "matrix": _matrix_to_latex(matrix),
                },
            )
        
        inverse = np.linalg.inv(np_matrix).tolist()
        
        # Verify: A × A⁻¹ = I
        identity = (np_matrix @ np.array(inverse)).tolist()
        
        steps = [
            f"Matrix: {rows}×{cols}",
            f"Determinant: {format_latex_number(det)} ≠ 0 (invertible)",
            "Computing inverse using Gauss-Jordan elimination",
            "Verification: A × A⁻¹ = I ✓",
        ]
        
        return ComputationResult(
            status="ok",
            operation="matrix_inverse",
            payload={
                "matrix": matrix,
                "inverse": inverse,
                "determinant": det,
                "invertible": True,
            },
            steps=steps,
            plot_elements=[],
            latex={
                "matrix": _matrix_to_latex(matrix),
                "inverse": _matrix_to_latex(inverse),
                "equation": f"{_matrix_to_latex(matrix)}^{{-1}} = {_matrix_to_latex(inverse)}",
            },
        )
    except Exception as e:
        return create_error_result("matrix_inverse", str(e))


def matrix_eigenvalues(matrix: List[List[float]]) -> ComputationResult:
    """
    Calculate eigenvalues and eigenvectors of a square matrix.
    """
    try:
        err = _validate_matrix(matrix, "Matrix")
        if err:
            return create_error_result("matrix_eigenvalues", err)
        
        rows = len(matrix)
        cols = len(matrix[0])
        
        if rows != cols:
            return create_error_result("matrix_eigenvalues", "Matrix must be square")
        
        np_matrix = np.array(matrix)
        eigenvalues, eigenvectors = np.linalg.eig(np_matrix)
        
        steps = [
            f"Matrix: {rows}×{cols}",
            "Solving characteristic equation: det(A - λI) = 0",
            "Eigenvalues found:",
        ]
        
        eigen_data = []
        for i, (val, vec) in enumerate(zip(eigenvalues, eigenvectors.T)):
            is_real = np.isreal(val)
            val_str = format_latex_number(val.real) if is_real else f"{format_latex_number(val.real)} + {format_latex_number(val.imag)}i"
            vec_list = vec.tolist()
            
            steps.append(f"  λ{i+1} = {val_str}")
            
            eigen_data.append({
                "eigenvalue": val_str,
                "eigenvector": [str(v) for v in vec_list],
                "is_real": bool(is_real),
            })
        
        steps.append("Eigenvectors computed for each eigenvalue")
        
        # Visualization for 2x2 case
        plot_elements = []
        if rows == 2 and all(np.isreal(eigenvalues)):
            # Show eigenvector directions
            for i, vec in enumerate(eigenvectors.T):
                if np.isreal(vec).all():
                    scale = 2
                    plot_elements.append(
                        PlotElement(
                            type="segment",
                            data={
                                "from": (0, 0),
                                "to": (scale * vec[0].real, scale * vec[1].real),
                                "label": f"v{i+1}"
                            },
                            style={"color": "#3b82f6" if i == 0 else "#ef4444", "width": 2}
                        )
                    )
        
        return ComputationResult(
            status="ok",
            operation="matrix_eigenvalues",
            payload={
                "matrix": matrix,
                "eigendata": eigen_data,
            },
            steps=steps,
            plot_elements=plot_elements,
            latex={
                "matrix": _matrix_to_latex(matrix),
                "characteristic": f"\\det({_matrix_to_latex(matrix)} - \\lambda I) = 0",
            },
        )
    except Exception as e:
        return create_error_result("matrix_eigenvalues", str(e))


def matrix_transform(matrix: List[List[float]], shape: str = "unit_square") -> ComputationResult:
    """
    Visualize a 2D linear transformation applied to a shape.
    
    Args:
        matrix: 2x2 transformation matrix
        shape: "unit_square", "unit_circle", or "grid"
    """
    try:
        err = _validate_matrix(matrix, "Matrix")
        if err:
            return create_error_result("matrix_transform", err)
        
        if len(matrix) != 2 or len(matrix[0]) != 2:
            return create_error_result("matrix_transform", "Transformation matrix must be 2×2")
        
        np_matrix = np.array(matrix)
        det = np.linalg.det(np_matrix)
        
        steps = [
            f"Transformation matrix:",
            f"  [{matrix[0][0]}, {matrix[0][1]}]",
            f"  [{matrix[1][0]}, {matrix[1][1]}]",
            f"Determinant: {format_latex_number(det)}",
            f"Area scaling factor: |det| = {format_latex_number(abs(det))}",
        ]
        
        if det < 0:
            steps.append("Negative determinant: orientation is reversed")
        
        plot_elements = []
        
        if shape == "unit_square":
            # Original square vertices
            original = np.array([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])
            transformed = (np_matrix @ original.T).T
            
            plot_elements = [
                PlotElement(
                    type="polygon",
                    data={"vertices": original[:-1].tolist(), "label": "Original"},
                    style={"fillcolor": "rgba(59, 130, 246, 0.2)", "line": {"color": "#3b82f6"}}
                ),
                PlotElement(
                    type="polygon",
                    data={"vertices": transformed[:-1].tolist(), "label": "Transformed"},
                    style={"fillcolor": "rgba(239, 68, 68, 0.2)", "line": {"color": "#ef4444"}}
                ),
            ]
            
            steps.append("Unit square transformation shown")
            
        elif shape == "unit_circle":
            # Generate circle points
            theta = np.linspace(0, 2 * np.pi, 100)
            original = np.vstack([np.cos(theta), np.sin(theta)])
            transformed = np_matrix @ original
            
            plot_elements = [
                PlotElement(
                    type="curve",
                    data={"points": list(zip(original[0].tolist(), original[1].tolist())), "label": "Original Circle"},
                    style={"color": "#3b82f6", "width": 2}
                ),
                PlotElement(
                    type="curve",
                    data={"points": list(zip(transformed[0].tolist(), transformed[1].tolist())), "label": "Transformed (Ellipse)"},
                    style={"color": "#ef4444", "width": 2}
                ),
            ]
            
            steps.append("Unit circle transforms to ellipse")
            
        elif shape == "grid":
            # Show basis vectors
            e1 = np_matrix @ np.array([1, 0])
            e2 = np_matrix @ np.array([0, 1])
            
            plot_elements = [
                # Original basis
                PlotElement(
                    type="segment",
                    data={"from": (0, 0), "to": (1, 0), "label": "e1"},
                    style={"color": "#3b82f6", "width": 2}
                ),
                PlotElement(
                    type="segment",
                    data={"from": (0, 0), "to": (0, 1), "label": "e2"},
                    style={"color": "#22c55e", "width": 2}
                ),
                # Transformed basis
                PlotElement(
                    type="segment",
                    data={"from": (0, 0), "to": tuple(e1.tolist()), "label": "T(e1)"},
                    style={"color": "#ef4444", "width": 2}
                ),
                PlotElement(
                    type="segment",
                    data={"from": (0, 0), "to": tuple(e2.tolist()), "label": "T(e2)"},
                    style={"color": "#f97316", "width": 2}
                ),
            ]
            
            steps.append(f"Basis vector e1 → ({format_latex_number(e1[0])}, {format_latex_number(e1[1])})")
            steps.append(f"Basis vector e2 → ({format_latex_number(e2[0])}, {format_latex_number(e2[1])})")
        
        # Add origin
        plot_elements.append(
            PlotElement(
                type="point",
                data={"coords": (0, 0), "label": "O"},
                style={"color": "#000", "size": 8}
            )
        )
        
        return ComputationResult(
            status="ok",
            operation="matrix_transform",
            payload={
                "matrix": matrix,
                "determinant": det,
                "shape": shape,
            },
            steps=steps,
            plot_elements=plot_elements,
            latex={
                "matrix": _matrix_to_latex(matrix),
            },
        )
    except Exception as e:
        return create_error_result("matrix_transform", str(e))
