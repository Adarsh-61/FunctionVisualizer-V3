"""
Core Math Utilities - Shared data structures and helpers.

Defines PlotElement, ComputationResult, and common calculation utilities.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple, Union


@dataclass
class PlotElement:
    """
    Represents a single visual element for plotting.
    
    Attributes:
        type: Element type (point, line, curve, circle, polygon, area, etc.)
        data: Element-specific data (coordinates, expression, etc.)
        style: Visual styling (color, size, dash, etc.)
    """
    type: str
    data: Dict[str, Any]
    style: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "type": self.type,
            "data": self.data,
            "style": self.style,
        }


@dataclass
class ComputationResult:
    """
    Standard result structure for all math computations.
    
    Attributes:
        status: "ok" or "error"
        operation: Name of the operation performed
        payload: Computed values and results
        steps: Step-by-step explanation for educational purposes
        plot_elements: Visual elements for graphing
        latex: LaTeX representation of key results
    """
    status: str
    operation: str
    payload: Dict[str, Any] = field(default_factory=dict)
    steps: List[str] = field(default_factory=list)
    plot_elements: List[PlotElement] = field(default_factory=list)
    latex: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON response."""
        return {
            "status": self.status,
            "operation": self.operation,
            "payload": self.payload,
            "steps": self.steps,
            "plot_elements": [el.to_dict() for el in self.plot_elements],
            "latex": self.latex,
        }


def safe_float(value: Any) -> Optional[float]:
    """Safely convert a value to float, handling sympy types."""
    try:
        if hasattr(value, 'evalf'):
            return float(value.evalf())
        return float(value)
    except (TypeError, ValueError):
        return None


def format_latex_number(num: float, precision: int = 4) -> str:
    """Format a number for LaTeX display."""
    if num == int(num):
        return str(int(num))
    return f"{num:.{precision}g}"


def create_error_result(operation: str, message: str) -> ComputationResult:
    """Create a standardized error result."""
    return ComputationResult(
        status="error",
        operation=operation,
        payload={"error": message},
        steps=[f"Error: {message}"],
    )
