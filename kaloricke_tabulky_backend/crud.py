from datetime import date
from sqlalchemy.orm import Session
from . import models


def get_foods_by_date_and_user(db: Session, user_id: int, target_date: date):
    return (
        db.query(models.Food)
        .filter(
            models.Food.user_id == user_id,
            models.Food.date == target_date,
        )
        .order_by(models.Food.id.asc())
        .all()
    )