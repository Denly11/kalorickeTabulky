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

def delete_food_by_Id(db: Session, food_id: int):
    db_food = db.query(models.Food).filter(models.Food.id == food_id)
    if db_food:
        db.delete(db_food)
        db.comit()
        return db_food
    return None

def create_food(db: Session, user_id: int, name: str, kcal: int, target_date: date):
    db_food = models.Food(user_id=user_id, name=name, kcal=kcal, date=target_date)
    db.add(db_food)
    db.commit()
    return db_food

def edit_food_by_Id(db: Session, food_id: int, user_id: int, name: str, kcal: int, target_date: date):
    db_food = db.query(models.Food).filter(models.Food.id == food_id)
    if db_food:
        db_food.name = name
        db_food.kcal = kcal
        db_food.date = target_date
        db.commit()
        return db_food
    return None # pokud false... cry emoji X5