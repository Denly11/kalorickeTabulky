from flask import Flask, request, jsonify
from flask_cors import CORS
from database import engine, SessionLocal
from models import Base, Food, User
from datetime import datetime

app = Flask(__name__)#instance celé aplikace, name je promenná pro referenci na nazev programu co zrovna spouštíš(main/"název")
CORS(app)#browser má same‑origin policy - může si číst odpovědi jen z téhle stejné trojice "věcí" idk, Origin = protokol + host + port(http://localhost:3000), CORS umožňuje nastavit, že i z jiného originu(http://localhost:5173) může přistupovat k API, prostě skupina důvěryhodných zdrojů, porty jsou kamarádi a felí spolu

Base.metadata.create_all(engine)# v metadata jsou náčrty tříd ze kterých se dělají tabulky, respektivety třídy všechny ddědí z base a to je vše v metadata zapsáno a tohle se postará o to aby to bylo v databazy a pokud ne tak aby se to tam zapsalo a to pomocí "engine"

@app.get("/")#, jedná se o endpoint/routu(".../")když příjde http požadavek get( to lomítko) spustí se tahle funkce
def health_check():
    return {"status:": "ok"}

# na http://localhost:5000/ by bylo: {"status:": "ok"}, / je samo o sobě prázdné



@app.post("/foods")
def create_food():#funkce volaná při volání post

    data = request.json
    user_id = data.get("user_id", 1)
    name = data.get("name")
    kcal = data.get("kcal")
    date_str = data.get("date")

    if not name or not kcal or not date_str:
        return jsonify({"error": "Missing required fields"}), 400
    
    date = datetime.strptime(date_str, "%Y-%m-%d").date()

    food = Food(user_id=user_id, name=name, kcal=kcal, date=date)#instance třídy food
    session = SessionLocal()#uděláme session s databází
    session.add(food)
    session.commit()
    session.close()
    #sessionmaker pod pokličkou vrací třídu, která dědí ze SQLAlchemy Session. A Session má ty metody zabudované přímo v sobě – jsou součástí SQLAlchemy knihovny

    return jsonify({"status": "ok", "food_id": food.id})