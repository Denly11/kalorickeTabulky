from sqlalchemy import create_engine#nativní spojení s databází
from sqlalchemy.orm import sessionmaker, DeclarativeBase#sessionmaker pro CRUD operace, DeclarativeBase pro definici tabulek

DATABASE_URL = "postgresql://postgres:psswd123@localhost:5432/kaloricke_tabulky"
#

class Base(DeclarativeBase):
    pass # třída pro definici tabulek, dědí z declarativeBase, ale zatím není potřeba nic přidávat

engine = create_engine(
    DATABASE_URL,
    echo=True #vypíše sql req do konsole
)

SessionLocal = sessionmaker(bind=engine)#pomocí SessionLocal() budu potom dělat session, použij engine pro spojení s databází
