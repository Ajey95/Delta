"""Add Funding Table

Revision ID: 47594c984ef7
Revises: 51c44fb66fd4
Create Date: 2024-12-30 04:07:07.911987

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47594c984ef7'
down_revision = '51c44fb66fd4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('funding',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('category', sa.String(length=100), nullable=False),
    sa.Column('project_title', sa.String(length=200), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('funding')
    # ### end Alembic commands ###
