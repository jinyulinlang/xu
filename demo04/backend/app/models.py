from sqlalchemy import Column, Integer, String, Boolean, DateTime, text
from .database import Base


class Todo(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, nullable=False, server_default=text('0'))
    created_at = Column(DateTime, server_default=text("(datetime('now'))"))
    updated_at = Column(DateTime, server_default=text("(datetime('now'))"))
