from datetime import date
from sqlalchemy import Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base#z toho souboru

#tabulka uživatelů
class User(Base): # User dědí z Base → SQLAlchemy ví, že je to tabulka
    __tablename__ = "users" # → konkrétní jméno tabulky v PostgreSQL

    id: Mapped[int] = mapped_column(Integer, primary_key=True) # mapped_column referuje na charakterizaci v databázi, Mapped je pro python
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    #vztah s foods
    food_logs: Mapped[list["Food"]] = relationship(back_populates="user")# záznamy jídel co si celkově uživatel zapsal
    food_library_items: Mapped[list["FoodLibrary"]] = relationship(back_populates="owner")
# tabulka jidel
class FoodLibrary(Base):
    __tablename__="food_library"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    kcal_per_100grams: Mapped[int] = mapped_column(Integer, nullable=False)

    owner_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    owner: Mapped["User"] = relationship(back_populates="food_library_items")
    logs: Mapped[list["Food"]] = relationship(back_populates="food_item")# zaznam v logu: user; datum; množství list objektů z Food 
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
   

#tabulka jídla
class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    food_library_id: Mapped[int] = mapped_column(ForeignKey("food_library.id"), nullable=False) 
    grams: Mapped[int] = mapped_column(Integer, nullable=False)
    user: Mapped["User"] = relationship(back_populates="food_logs") #oboustranný vztah
    food_item: Mapped["FoodLibrary"] = relationship(back_populates="logs")

#   Integer – číselný typ, v PostgreSQL INTEGER
#   String – textový typ, v PostgreSQL VARCHAR/TEXT
#   SQLAlchemy má ještě Date, Boolean, ...
#   primary_key=True – sloupec je primární klíč.
#   Každý řádek v tabulce musí mít jedinečnou nenulovou hodnotu v tomto sloupci
#   unique=True –  na sloupec se vytvoří unikátní index, takže databáze odmítne vložit dva #   řádky se stejnou hodnotou (např. email).
#   nullable=False – hodnota nesmí být NULL. 
