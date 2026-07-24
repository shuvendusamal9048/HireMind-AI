import uuid

from sqlalchemy import (
    String,
    Text,
    Integer,
    ForeignKey,
    Enum
)

from sqlalchemy.dialects.postgresql import (
    UUID,
    ARRAY
)

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

from app.constants.job_constants import (
    JobStatus,
    EmploymentType
)

from sqlalchemy.orm import relationship

class Job(
    Base,
    UUIDMixin,
    TimestampMixin
):
    __tablename__ = "jobs"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    experience: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    location: Mapped[str] = mapped_column(
        String(255)
    )

    employment_type: Mapped[
        EmploymentType
    ] = mapped_column(
        Enum(EmploymentType),
        default=EmploymentType.FULL_TIME
    )

    salary_min: Mapped[int] = mapped_column(
        Integer,
        nullable=True
    )

    salary_max: Mapped[int] = mapped_column(
        Integer,
        nullable=True
    )

    skills: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=[]
    )

    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus),
        default=JobStatus.OPEN
    )

    application_code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True
    )
    company = relationship(
        "Company",
        back_populates="jobs"
    )
    applications = relationship(
        "CandidateApplication",
        back_populates="job"
    )