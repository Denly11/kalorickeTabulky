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

def get_food_by_Id(db: Session, food_id: int):
    db_food = db.query(models.Food).filter(models.Food.id == food_id)
    if db_food:
        db.delete(db_food)
        db.comit()
        return db_food
    return None