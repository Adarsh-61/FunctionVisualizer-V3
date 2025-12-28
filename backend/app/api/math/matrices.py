"""
Matrices API Endpoints

Provides REST API for matrix operations including arithmetic,
determinant, inverse, eigenvalues, and transformations.
"""

from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.matrices import (
    matrix_add,
    matrix_multiply,
    matrix_determinant,
    matrix_inverse,
    matrix_eigenvalues,
    matrix_transform,
)

router = APIRouter()


class MatrixModel(BaseModel):
    """Matrix as 2D list."""
    data: List[List[float]] = Field(..., description="Matrix as list of rows")


class TwoMatricesRequest(BaseModel):
    """Request with two matrices."""
    matrix_a: List[List[float]]
    matrix_b: List[List[float]]


class SingleMatrixRequest(BaseModel):
    """Request with one matrix."""
    matrix: List[List[float]]


class TransformRequest(BaseModel):
    """Request for matrix transformation visualization."""
    matrix: List[List[float]] = Field(..., description="2x2 transformation matrix")
    shape: str = Field("unit_square", description="Shape to transform: unit_square, unit_circle, grid")


@router.post("/add")
async def add(request: TwoMatricesRequest):
    """
    Add two matrices element-wise.
    """
    result = matrix_add(request.matrix_a, request.matrix_b)
    return result.to_dict()


@router.post("/multiply")
async def multiply(request: TwoMatricesRequest):
    """
    Multiply two matrices.
    """
    result = matrix_multiply(request.matrix_a, request.matrix_b)
    return result.to_dict()


@router.post("/determinant")
async def determinant(request: SingleMatrixRequest):
    """
    Calculate determinant of a square matrix.
    """
    result = matrix_determinant(request.matrix)
    return result.to_dict()


@router.post("/inverse")
async def inverse(request: SingleMatrixRequest):
    """
    Calculate inverse of a square matrix.
    """
    result = matrix_inverse(request.matrix)
    return result.to_dict()


@router.post("/eigenvalues")
async def eigenvalues(request: SingleMatrixRequest):
    """
    Calculate eigenvalues and eigenvectors.
    """
    result = matrix_eigenvalues(request.matrix)
    return result.to_dict()


@router.post("/transform")
async def transform(request: TransformRequest):
    """
    Visualize a 2D linear transformation.
    """
    result = matrix_transform(request.matrix, request.shape)
    return result.to_dict()
