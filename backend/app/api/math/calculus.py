"""
Calculus API Endpoints

Provides REST API for calculus operations including function analysis,
derivatives, integrals, critical points, and Taylor series.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

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

router = APIRouter()


class AnalyzeRequest(BaseModel):
    """Request model for function analysis."""
    expression: str = Field(..., description="Mathematical expression in x, e.g., 'x**2 * sin(x)'")
    domain_start: float = Field(-5.0, description="Start of domain")
    domain_end: float = Field(5.0, description="End of domain")
    resolution: int = Field(500, ge=50, le=2000, description="Number of points for plotting")


class DerivativeRequest(BaseModel):
    """Request model for derivative computation."""
    expression: str = Field(..., description="Mathematical expression in x")
    at_point: float = Field(..., description="Point at which to evaluate derivative")


class IntegralRequest(BaseModel):
    """Request model for definite integration."""
    expression: str = Field(..., description="Mathematical expression in x")
    lower_limit: float = Field(..., description="Lower limit of integration")
    upper_limit: float = Field(..., description="Upper limit of integration")


class CriticalPointsRequest(BaseModel):
    """Request model for finding critical points."""
    expression: str = Field(..., description="Mathematical expression in x")
    domain_start: Optional[float] = Field(None, description="Optional domain start")
    domain_end: Optional[float] = Field(None, description="Optional domain end")


class TaylorRequest(BaseModel):
    """Request model for Taylor series."""
    expression: str = Field(..., description="Mathematical expression in x")
    center: float = Field(0.0, description="Center point for expansion")
    order: int = Field(5, ge=1, le=20, description="Order of Taylor polynomial")


class LimitRequest(BaseModel):
    """Request model for limits."""
    expression: str
    point: float
    direction: str = Field("+/-", description="Direction: +, -, or +/-")


class IndefiniteIntegralRequest(BaseModel):
    """Request model for indefinite integration."""
    expression: str


class ODERequest(BaseModel):
    """Request model for ODEs."""
    equation: str = Field(..., description="Equation string, e.g. y' + y = x")


class PartialDerivativeRequest(BaseModel):
    """Request model for partial derivatives."""
    expression: str
    variable: str = Field(..., description="Variable to differentiate, e.g., x, y, z")


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    """
    Analyze a function: plot it along with its derivative.
    
    Returns visualization data and computed properties.
    """
    result = analyze_function(
        request.expression,
        (request.domain_start, request.domain_end),
        request.resolution
    )
    return result.to_dict()


@router.post("/derivative")
async def derivative(request: DerivativeRequest):
    """
    Compute derivative at a specific point.
    
    Returns slope, tangent line equation, and visualization.
    """
    result = compute_derivative(request.expression, request.at_point)
    return result.to_dict()


@router.post("/integrate")
async def integrate(request: IntegralRequest):
    """
    Compute definite integral.
    
    Returns the integral value, antiderivative, and area visualization.
    """
    result = compute_integral(
        request.expression,
        request.lower_limit,
        request.upper_limit
    )
    return result.to_dict()


@router.post("/critical-points")
async def critical_points(request: CriticalPointsRequest):
    """
    Find and classify critical points of a function.
    
    Uses the second derivative test to classify as local min/max/inflection.
    """
    domain = None
    if request.domain_start is not None and request.domain_end is not None:
        domain = (request.domain_start, request.domain_end)
    
    result = find_critical_points(request.expression, domain)
    return result.to_dict()


@router.post("/taylor")
async def taylor(request: TaylorRequest):
    """
    Compute Taylor series expansion.
    
    Returns the polynomial approximation and comparison plot.
    """
    result = compute_taylor(request.expression, request.center, request.order)
    return result.to_dict()


@router.post("/limit")
async def limit_endpoint(request: LimitRequest):
    """
    Compute the limit of an expression.
    """
    result = compute_limit(request.expression, request.point, request.direction)
    return result.to_dict()


@router.post("/integrate/indefinite")
async def indefinite_integral(request: IndefiniteIntegralRequest):
    """
    Compute the indefinite integral.
    """
    result = compute_indefinite_integral(request.expression)
    return result.to_dict()


@router.post("/differential-equations")
async def ode(request: ODERequest):
    """
    Solve a first-order ODE.
    """
    result = solve_ode(request.equation)
    return result.to_dict()


@router.post("/derivative/partial")
async def partial_derivative(request: PartialDerivativeRequest):
    """
    Compute partial derivative.
    """
    result = compute_partial_derivative(request.expression, request.variable)
    return result.to_dict()
