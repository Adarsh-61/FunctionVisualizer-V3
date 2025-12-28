
"""
Geometry API Endpoints

Provides REST API for coordinate geometry operations including
points, lines, circles, 3D vectors, planes, and conic sections.
"""

from typing import Tuple, List, Optional, Dict

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.geometry import (
    Point, Line, Circle,
    compute_distance,
    compute_midpoint,
    compute_section_point,
    line_from_points,
    line_intersection,
    line_circle_intersection,
    circle_circle_intersection,
    tangent_from_point,
    VectorCalculator,
    AnalyticGeometry3D,
    ConicAnalyzer,
    Mensuration,
    TriangleProperties,
    GeometricTransformer,
    Conicoid3D,
    QuadrilateralProperties
)

router = APIRouter(tags=["Geometry"])


# --- Legacy / 2D Models ---

class PointModel(BaseModel):
    """Point with coordinates and optional label."""
    x: float
    y: float
    label: str = ""

class LineModel(BaseModel):
    """Line in general form Ax + By + C = 0."""
    A: float
    B: float
    C: float

class CircleModel(BaseModel):
    """Circle with center and radius."""
    center_x: float
    center_y: float
    radius: float

class DistanceRequest(BaseModel):
    p1: PointModel
    p2: PointModel

class MidpointRequest(BaseModel):
    p1: PointModel
    p2: PointModel

class SectionRequest(BaseModel):
    p1: PointModel
    p2: PointModel
    m: float
    n: float
    external: bool = False

class LineFromPointsRequest(BaseModel):
    p1: PointModel
    p2: PointModel

class LineIntersectionRequest(BaseModel):
    line1: LineModel
    line2: LineModel

class LineCircleRequest(BaseModel):
    circle: CircleModel
    line: LineModel

class CircleCircleRequest(BaseModel):
    circle1: CircleModel
    circle2: CircleModel

class TangentRequest(BaseModel):
    circle: CircleModel
    point: PointModel

# --- Advanced / 3D Models ---

class VectorRequest(BaseModel):
    """Request for vector operations."""
    v1: List[float] = Field(..., description="Components of first vector [x, y, z]")
    v2: Optional[List[float]] = Field(None, description="Components of second vector [x, y, z]")
    operation: str = Field("properties", description="properties, dot, cross, angle, projection")

class Line3DRequest(BaseModel):
    """Request for 3D line analysis."""
    p1: List[float] = Field(..., description="First point [x, y, z]")
    p2: List[float] = Field(..., description="Second point [x, y, z]")

class PlaneRequest(BaseModel):
    """Request for 3D plane analysis."""
    p1: List[float] = Field(..., description="First point [x, y, z]")
    p2: List[float] = Field(..., description="Second point [x, y, z]")
    p3: List[float] = Field(..., description="Third point [x, y, z]")

class ConicRequest(BaseModel):
    """
    Request for conic analysis.
    Equation: Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0
    """
    coeffs: Dict[str, float] = Field(..., description="Coefficients A, B, C, D, E, F")


# --- Converters ---
def _to_point(pm: PointModel) -> Dict:
    return {"x": pm.x, "y": pm.y}
def _to_line(lm: LineModel) -> Dict:
    return {"a": lm.A, "b": lm.B, "c": lm.C} # Note case change A->a
def _to_circle(cm: CircleModel) -> Dict:
    return {"x": cm.center_x, "y": cm.center_y, "r": cm.radius, "h": cm.center_x, "k": cm.center_y}


# --- Endpoints ---

@router.post("/distance")
async def distance(request: DistanceRequest):
    result = compute_distance(_to_point(request.p1), _to_point(request.p2))
    return result.to_dict()

@router.post("/midpoint")
async def midpoint(request: MidpointRequest):
    result = compute_midpoint(_to_point(request.p1), _to_point(request.p2))
    return result.to_dict()

@router.post("/section")
async def section(request: SectionRequest):
    result = compute_section_point(_to_point(request.p1), _to_point(request.p2), request.m, request.n)
    return result.to_dict()

@router.post("/line-from-points")
async def line_points(request: LineFromPointsRequest):
    result = line_from_points(_to_point(request.p1), _to_point(request.p2))
    return result.to_dict()

@router.post("/line-intersection")
async def line_intersect(request: LineIntersectionRequest):
    result = line_intersection(_to_line(request.line1), _to_line(request.line2))
    return result.to_dict()

@router.post("/line-circle")
async def line_circle_intersect(request: LineCircleRequest):
    result = line_circle_intersection(_to_line(request.line), _to_circle(request.circle))
    return result.to_dict()

@router.post("/circle-circle")
async def circle_circle_intersect(request: CircleCircleRequest):
    result = circle_circle_intersection(_to_circle(request.circle1), _to_circle(request.circle2))
    return result.to_dict()

@router.post("/tangent")
async def tangent(request: TangentRequest):
    result = tangent_from_point(_to_point(request.point), _to_circle(request.circle))
    return result.to_dict()

class TriangleRequest(BaseModel):
    p1: PointModel
    p2: PointModel
    p3: PointModel

class QuadrilateralRequest(BaseModel):
    p1: PointModel
    p2: PointModel
    p3: PointModel
    p4: PointModel

@router.post("/triangle/analyze")
async def triangle_analyze(request: TriangleRequest):
    """Analyze triangle properties (Area, Centers)."""
    result = TriangleProperties.analyze(_to_point(request.p1), _to_point(request.p2), _to_point(request.p3))
    return result.to_dict()

@router.post("/quadrilateral")
async def quadrilateral_properties(request: QuadrilateralRequest):
    """Analyze quadrilateral properties."""
    result = QuadrilateralProperties.analyze(_to_point(request.p1), _to_point(request.p2), _to_point(request.p3), _to_point(request.p4))
    return result.to_dict()

# --- Advanced Endpoints ---

@router.post("/vector/operate")
async def vector_operate(request: VectorRequest):
    """Perform 3D vector operations."""
    result = VectorCalculator.analyze(request.v1, request.v2, request.operation)
    return result.to_dict()

@router.post("/3d/line")
async def line_3d(request: Line3DRequest):
    """Analyze a line in 3D space defined by two points."""
    result = AnalyticGeometry3D.analyze_line(request.p1, request.p2)
    return result.to_dict()

@router.post("/3d/plane")
async def plane_3d(request: PlaneRequest):
    """Analyze a plane in 3D space defined by three points."""
    result = AnalyticGeometry3D.analyze_plane(request.p1, request.p2, request.p3)
    return result.to_dict()

@router.post("/conic/analyze")
async def conic_analyze(request: ConicRequest):
    result = ConicAnalyzer.analyze(request.coeffs)
    return result.to_dict()

class TransformRequest(BaseModel):
    point: PointModel
    operation: str = Field(..., description="rotate, reflect, translate, scale")
    params: Dict[str, float] = Field(..., description="Parameters for operation (angle, cx, cy, dx, etc)")

@router.post("/transform/2d")
async def transform_2d(request: TransformRequest):
    """Apply 2D affine transformation."""
    result = GeometricTransformer.transform_2d(_to_point(request.point), request.operation, request.params)
    return result.to_dict()

class ConicoidRequest(BaseModel):
    shape: str = Field(..., description="sphere, ellipsoid")
    params: Dict[str, float] = Field(..., description="cx, cy, cz, r, a, b, c")

@router.post("/conicoid")
async def conicoid_analyze(request: ConicoidRequest):
    """Analyze and plot 3D Conicoids."""
    result = Conicoid3D.analyze(request.shape, request.params)
    return result.to_dict()

class LinePlaneIntRequest(BaseModel):
    line_p1: List[float]
    line_p2: List[float]
    plane_p1: List[float]
    plane_p2: List[float]
    plane_p3: List[float]

@router.post("/intersection/line_plane")
async def intersection_line_plane(request: LinePlaneIntRequest):
    """Intersection of Line and Plane in 3D."""
    result = AnalyticGeometry3D.intersection_line_plane(
        request.line_p1, request.line_p2, 
        request.plane_p1, request.plane_p2, request.plane_p3
    )
    return result.to_dict()


# --- Mensuration Endpoints ---

class HeronRequest(BaseModel):
    a: float
    b: float
    c: float

class SolidRequest(BaseModel):
    shape: str = Field(..., description="cube, cuboid, cylinder, cone, sphere")
    params: Dict[str, float] = Field(..., description="Parameters like side, r, h, l, b")

@router.post("/mensuration/heron")
async def mensuration_heron(request: HeronRequest):
    """Calculate area of triangle using Heron's Formula."""
    result = Mensuration.herons_formula(request.a, request.b, request.c)
    return result.to_dict()

@router.post("/mensuration/solid")
async def mensuration_solid(request: SolidRequest):
    """Calculate properties of 3D solids."""
    result = Mensuration.solidity(request.shape, request.params)
    return result.to_dict()
