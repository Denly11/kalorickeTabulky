from datetime import date
from sqlalchemy.orm import Session, joinedload
from . import models

def get_or_create_food_library_item(db: Session, name: str, kcal_per_100grams: int, owner_id: int | None = None) -> models.FoodLibrary:#výchozí hodnota je Null; funkce vždy vrátí objekt, který je instancí třídy FoodLibrary, je to pro vs code aby věděl že je to objekt v foodlibrary
  db_item = db.query(models.FoodLibrary).filter(models.FoodLibrary.name.ilike(name)).first()
    
  if not db_item:
        db_item = models.FoodLibrary(
            name=name,
            kcal_per_100grams=kcal_per_100grams,
            owner_user_id=owner_id
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)    
  return db_item


def search_food_library(db: Session, query: str):
    return db.query(models.FoodLibrary).filter(models.FoodLibrary.name.ilike(f"{query}%")).all()

def create_food_log(db: Session, user_id: int, food_library_id: int, grams: int, target_date: date) -> models.Food:
   
    db_log = models.Food(
        user_id=user_id,
        food_library_id=food_library_id,
        grams=grams,
        date=target_date
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_food_logs_by_date(db: Session, user_id: int, target_date: date):
    
    return (
        db.query(models.Food)
        .options(joinedload(models.Food.food_item)) # <-- Důležité pro efektivitu!
        .filter(
            models.Food.user_id == user_id,
            models.Food.date == target_date
        )
        .order_by(models.Food.id.asc())
        .all()
    )

def delete_food_log(db: Session, food_log_id: int, user_id: int):
   
    db_log = db.query(models.Food).filter(
        models.Food.id == food_log_id,
        models.Food.user_id == user_id
    ).first()
    
    if db_log:
        db.delete(db_log)
        db.commit()
        return db_log
    return None

def update_food_log(db: Session, food_log_id: int, user_id: int, grams: int):
   
    db_log = db.query(models.Food).filter(
        models.Food.id == food_log_id,
        models.Food.user_id == user_id
    ).first()

    if db_log:
        db_log.grams = grams
        db.commit()
        db.refresh(db_log)
        return db_log
    return None

#před datovou normalizací
#
# def get_foods_by_date_and_user(db: Session, user_id: int, target_date: date):
#     return (
#         db.query(models.Food)
#         .filter(
#             models.Food.user_id == user_id,
#             models.Food.date == target_date,
#         )
#         .order_by(models.Food.id.asc())
#         .all()
#     )

# def delete_food_by_Id(db: Session, food_id: int):
#     db_food = db.query(models.Food).filter(models.Food.id == food_id).first() 
#     if db_food:
#         db.delete(db_food)
#         db.commit()
#         return db_food
#     return None

# def create_food(db: Session, user_id: int, name: str, kcal: int, target_date: date):
#     db_food = models.Food(user_id=user_id, name=name, kcal=kcal, date=target_date)
#     db.add(db_food)
#     db.commit()
#     db.refresh(db_food)
#     return db_food

# def edit_food_by_Id(db: Session, food_id: int, name: str, kcal: int, target_date: date):
#     db_food = db.query(models.Food).filter(models.Food.id == food_id).first() 
#     if db_food:
#         db_food.name = name
#         db_food.kcal = kcal
#         db_food.date = target_date
#         db.commit()
#         db.refresh(db_food)
#         return db_food
#     return None # pokud false... cry emoji X5
