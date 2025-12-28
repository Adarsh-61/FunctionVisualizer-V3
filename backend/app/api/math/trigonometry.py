
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.core.trigonometry import trig_core
from app.core.utils import ComputationResult

router = APIRouter()

# --- input Models ---

class BasicValuesRequest(BaseModel):
    angle: str  # e.g., "30", "pi/4"

class UnitCircleRequest(BaseModel):
    angle_deg: float

class GraphRequest(BaseModel):
    func: str
    params: Dict[str, float] = {}  # A, B, C, D

class IdentityRequest(BaseModel):
    lhs: str
    rhs: str

class EquationRequest(BaseModel):
    equation: str

class CompoundAngleRequest(BaseModel):
    op_type: str # sin_add, cos_diff, etc
    A: str
    B: str

class HeightDistanceRequest(BaseModel):
    param_type: str # find_height, find_dist
    d: float
    angle_deg: float
    h: float = 0.0

# --- Endpoints ---

@router.post("/values", response_model=ComputationResult)
async def get_basic_values(request: BasicValuesRequest):
    return trig_core.basic_values(request.angle)

@router.post("/unit-circle", response_model=ComputationResult)
async def get_unit_circle(request: UnitCircleRequest):
    return trig_core.unit_circle_interaction(request.angle_deg)

@router.post("/graph", response_model=ComputationResult)
async def get_graph_data(request: GraphRequest):
    return trig_core.generate_graph(request.func, request.params)

@router.post("/identity", response_model=ComputationResult)
async def verify_identity(request: IdentityRequest):
    return trig_core.prove_identity(request.lhs, request.rhs)

@router.post("/equation", response_model=ComputationResult)
async def solve_equation(request: EquationRequest):
    return trig_core.solve_equation(request.equation)

@router.post("/compound", response_model=ComputationResult)
async def compound_angle(request: CompoundAngleRequest):
    return trig_core.compound_angle(request.op_type, request.A, request.B)

@router.post("/heights", response_model=ComputationResult)
async def solve_height_distance(request: HeightDistanceRequest):
    return trig_core.heights_distances(request.param_type, request.d, request.angle_deg, request.h)
