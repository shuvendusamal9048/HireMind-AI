import uuid

from sqlalchemy import (
    String,
    Float,
    ForeignKey,
    Text
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


class InterviewQuestion(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "interview_questions"

    interview_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interviews.id")
    )

    question: Mapped[str] = mapped_column(
        Text
    )

    answer: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=True
    )

    feedback: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )
    interview = relationship(
    "Interview",
    back_populates="questions"
    )