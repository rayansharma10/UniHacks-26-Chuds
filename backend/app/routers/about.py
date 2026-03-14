from fastapi import APIRouter

router = APIRouter()


@router.get("/about")
def get_about():
    return {
        "name": "Parallel",
        "description": "Community Decision Intelligence platform.",
        "version": "1.0.0",
    }
