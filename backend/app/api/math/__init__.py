"""Math API Router - Aggregates all math-related endpoints."""

from fastapi import APIRouter

from app.api.math.calculus import router as calculus_router
from app.api.math.algebra import router as algebra_router
from app.api.math.geometry import router as geometry_router
from app.api.math.trigonometry import router as trigonometry_router
from app.api.math.matrices import router as matrices_router

router = APIRouter()

# Include all math sub-routers
router.include_router(calculus_router, prefix="/calculus", tags=["Calculus"])
router.include_router(algebra_router, prefix="/algebra", tags=["Algebra"])
router.include_router(geometry_router, prefix="/geometry", tags=["Geometry"])
router.include_router(trigonometry_router, prefix="/trig", tags=["Trigonometry"])
router.include_router(matrices_router, prefix="/matrices", tags=["Matrices"])
