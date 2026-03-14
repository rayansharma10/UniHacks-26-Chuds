from fastapi import APIRouter

router = APIRouter(prefix="/communities", tags=["communities"])

# Placeholder — communities will be DB-backed in a future sprint
COMMUNITIES = [
    {"id": 1, "slug": "fitzroy",      "name": "Fitzroy",      "type": "suburb", "members": 1240, "icon": "🏘️"},
    {"id": 2, "slug": "unimelb",      "name": "UniMelb",      "type": "school", "members": 8300, "icon": "🎓"},
    {"id": 3, "slug": "acme-corp",    "name": "Acme Corp",    "type": "work",   "members":  430, "icon": "💼"},
    {"id": 4, "slug": "northside-fc", "name": "Northside FC", "type": "club",   "members":  180, "icon": "⚽"},
    {"id": 5, "slug": "inner-north",  "name": "Inner North",  "type": "suburb", "members": 3100, "icon": "🏙️"},
]

@router.get("")
def list_communities():
    return COMMUNITIES
