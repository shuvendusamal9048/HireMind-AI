"""add interview final report

Revision ID: 2c71df2c3002
Revises: ee493ed70c3f
Create Date: 2026-07-20
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "2c71df2c3002"
down_revision: Union[str, Sequence[str], None] = "ee493ed70c3f"
branch_labels = None
depends_on = None


def upgrade():

    op.add_column(
        "interviews",
        sa.Column(
            "final_report",
            sa.Text(),
            nullable=True
        )
    )


def downgrade():

    op.drop_column(
        "interviews",
        "final_report"
    )