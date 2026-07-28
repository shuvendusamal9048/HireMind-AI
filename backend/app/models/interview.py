import uuid
from datetime import datetime

from sqlalchemy import (
    String,
    Float,
    ForeignKey,
    Boolean,
    DateTime
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base
from app.models.base_model import (
    UUIDMixin,
    TimestampMixin
)


class Interview(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "interviews"

    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "candidate_applications.id"
        ),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="PENDING"
    )

    # NEW FIELDS
    interview_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=True
    )

    candidate_password: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

    is_started: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True
    )

    ended_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True
    )

    technical_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    communication_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    confidence_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    overall_score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    recommendation: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

    report: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    proctoring_video_url: Mapped[str] = mapped_column(
        String,
        nullable=True
    )

    questions = relationship(
        "InterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan"
    )

    application = relationship(
        "CandidateApplication",
        back_populates="interviews"
    )

    events = relationship(
    "InterviewEvent",
    back_populates="interview",
    cascade="all, delete-orphan"
)