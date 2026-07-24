import uuid
from sqlalchemy import Text
from sqlalchemy import (
    String,
    ForeignKey,
    Boolean,
    Float,
    Enum
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.db.base_class import Base
from app.models.base_model import (
    UUIDMixin,
    TimestampMixin
)

from app.constants.application_constants import (
    ApplicationStatus
)

from sqlalchemy import DateTime
from datetime import datetime


class CandidateApplication(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "candidate_applications"

    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id"),
        nullable=False
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id"),
        nullable=False
    )

    candidate_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    resume_filename: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    resume_url: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus),
        default=ApplicationStatus.APPLIED
    )

    resume_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    ai_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    is_shortlisted: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )
    parsed_resume_text: Mapped[str] = mapped_column(
    Text,
    nullable=True
    )

    ai_feedback: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    screening_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    interview_date: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=True
    )

    interview_link: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    interviewer_name: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )
    interviews = relationship(
        "Interview",
        back_populates="application"
    )

    job = relationship(
        "Job",
        back_populates="applications"
    )