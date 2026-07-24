import uuid

from sqlalchemy import (
    String,
    Text,
    ForeignKey
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


class InterviewEvent(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "interview_events"

    interview_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interviews.id"
        ),
        nullable=False
    )

    event_type: Mapped[str] = mapped_column(
        String(100)
    )

    details: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    interview = relationship(
        "Interview",
        back_populates="events"
    )