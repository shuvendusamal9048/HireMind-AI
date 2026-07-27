from pydantic import BaseModel, EmailStr, Field, AliasChoices


class RegisterRequest(BaseModel):
    company_name: str = Field(..., validation_alias=AliasChoices('company_name', 'companyName'))
    admin_name: str = Field(..., validation_alias=AliasChoices('admin_name', 'adminName'))
    email: EmailStr
    password: str
    gst_number: str = Field("", validation_alias=AliasChoices('gst_number', 'gstNumber'))
    website: str = ""
    industry: str = ""
    company_size: str = Field("", validation_alias=AliasChoices('company_size', 'companySize'))



class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"