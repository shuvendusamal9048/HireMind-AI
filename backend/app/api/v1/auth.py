from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.db.session import get_db
from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest
)
from app.services.auth_service import (
    AuthService
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


from app.api.v1.dependencies.current_user import (
    get_current_user
)



from app.models.user import User


@router.get("/me")
async def me(
    current_user: User = Depends(
        get_current_user
    )
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "company_id":
            current_user.company_id
    }

@router.post("/register")
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):

    return await (
        AuthService.register_company(
            db=db,
            company_name=request.company_name,
            admin_name=request.admin_name,
            email=request.email,
            password=request.password,
            gst_number=request.gst_number
        )
    )

@router.post("/login")
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db)
):

    return await (
        AuthService.login(
            db=db,
            email=request.email,
            password=request.password
        )
    )