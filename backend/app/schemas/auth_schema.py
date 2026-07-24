from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    company_name: str
    admin_name: str
    email: EmailStr
    password: str
    gst_number: str = ""
    website: str = ""
    industry: str = ""
    company_size: str = ""



class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"