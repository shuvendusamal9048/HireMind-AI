from typing import List

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.base_model import UUIDMixin, TimestampMixin
from sqlalchemy.orm import relationship

class Company(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "companies"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    company_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    gst_number: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )

    approval_status: Mapped[str] = mapped_column(
        String(20),
        default="PENDING"
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    users: Mapped[List["User"]] = relationship(
        back_populates="company"
    )

    jobs = relationship(
        "Job",
        back_populates="company"
    )

    applications = relationship(
    "CandidateApplication",
    backref="company"
)