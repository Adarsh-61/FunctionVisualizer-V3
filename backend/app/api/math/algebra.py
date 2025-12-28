"""
Algebra API Endpoints.

Provides REST API for advanced algebra operations including matrices,
linear systems, polynomials, and complex numbers.
"""

from typing import List, Optional, Union, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.algebra import (
    MatrixCalculator,
    LinearSystemSolver,
    PolynomialSolver,
    ComplexNumberCalculator,
    QuadraticSolver,
    ProgressionSolver
)

router = APIRouter(tags=["Algebra"])

# --- Request Models ---

class MatrixPropertiesRequest(BaseModel):
    """Request for computing matrix properties."""
    matrix: List[List[Union[float, int, str]]] = Field(..., description="2D list representing the matrix.")

class MatrixOperationRequest(BaseModel):
    """Request for binary matrix operations."""
    matrix_a: List[List[Union[float, int, str]]] = Field(..., description="First matrix.")
    matrix_b: List[List[Union[float, int, str]]] = Field(..., description="Second matrix.")
    operation: str = Field(..., description="Operation: add, subtract, multiply")

class LinearSystemRequest(BaseModel):
    """Request for solving linear systems."""
    equations: List[str] = Field(..., description="List of equations, e.g., ['2*x + y = 5', 'x - y = 1']")

class PolynomialRequest(BaseModel):
    """Request for polynomial analysis."""
    expression: str = Field(..., description="Polynomial expression in x.")

class ComplexRequest(BaseModel):
    """Request for complex number analysis."""
    expression: str = Field(..., description="Complex number expression, e.g., '3 + 4*I'")

class QuadraticRequest(BaseModel):
    """Request for quadratic equation."""
    a: float
    b: float
    c: float

class ProgressionRequest(BaseModel):
    """Request for AP/GP."""
    first_term: float
    common_val: float # difference or ratio
    n_terms: int

# --- Endpoints ---

@router.post("/matrix/properties")
async def matrix_properties(request: MatrixPropertiesRequest):
    """Compute properties of a single matrix."""
    result = MatrixCalculator.compute_properties(request.matrix)
    return result.to_dict()

@router.post("/matrix/operate")
async def matrix_operate(request: MatrixOperationRequest):
    """Perform operations on two matrices."""
    result = MatrixCalculator.operate(request.matrix_a, request.matrix_b, request.operation)
    return result.to_dict()

@router.post("/system/solve")
async def solve_system(request: LinearSystemRequest):
    """Solve system of linear equations."""
    result = LinearSystemSolver.solve_system(request.equations)
    return result.to_dict()

@router.post("/polynomial/analyze")
async def analyze_polynomial(request: PolynomialRequest):
    """Analyze a polynomial."""
    result = PolynomialSolver.analyze(request.expression)
    return result.to_dict()

@router.post("/complex/analyze")
async def analyze_complex(request: ComplexRequest):
    """Analyze a complex number."""
    result = ComplexNumberCalculator.calculate(request.expression)
    return result.to_dict()

@router.post("/quadratic")
async def solve_quadratic(request: QuadraticRequest):
    """Solve quadratic equation ax^2 + bx + c = 0."""
    return QuadraticSolver.solve(request.a, request.b, request.c).to_dict()

@router.post("/progression/arithmetic")
async def arithmetic_progression(request: ProgressionRequest):
    """Calculate Arithmetic Progression properties."""
    return ProgressionSolver.arithmetic(request.first_term, request.common_val, request.n_terms).to_dict()

@router.post("/progression/geometric")
async def geometric_progression(request: ProgressionRequest):
    """Calculate Geometric Progression properties."""
    return ProgressionSolver.geometric(request.first_term, request.common_val, request.n_terms).to_dict()
