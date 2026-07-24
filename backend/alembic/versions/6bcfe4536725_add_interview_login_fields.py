"""add interview login fields

Revision ID: 6bcfe4536725
Revises: 2c71df2c3002
Create Date: 2026-07-20 18:28:44.766775
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "6bcfe4536725"
down_revision: Union[str, Sequence[str], None] = "2c71df2c3002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        "interviews",
        sa.Column(
            "interview_code",
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        "interviews",
        sa.Column(
            "candidate_password",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "interviews",
        sa.Column(
            "is_started",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False
        )
    )

    op.add_column(
        "interviews",
        sa.Column(
            "is_completed",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False
        )
    )

    op.add_column(
        "interviews",
        sa.Column(
            "started_at",
            sa.DateTime(),
            nullable=True
        )
    )

    op.add_column(
        "interviews",
        sa.Column(
            "ended_at",
            sa.DateTime(),
            nullable=True
        )
    )

    op.create_unique_constraint(
        "uq_interviews_interview_code",
        "interviews",
        ["interview_code"]
    )

    # remove only if column exists in DB
    # comment this if upgrade fails
    # op.drop_column("interviews", "final_report")


def downgrade() -> None:

    op.drop_constraint(
        "uq_interviews_interview_code",
        "interviews",
        type_="unique"
    )

    op.drop_column("interviews", "ended_at")
    op.drop_column("interviews", "started_at")
    op.drop_column("interviews", "is_completed")
    op.drop_column("interviews", "is_started")
    op.drop_column("interviews", "candidate_password")
    op.drop_column("interviews", "interview_code")