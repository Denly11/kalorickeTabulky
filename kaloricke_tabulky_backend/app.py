from flask import Flask, request, jsonify
from flask_cors import CORS
from database import engine, SessionLocal
from models import Base, Food, User
from datetime import datetime
from . import crud

app = Flask(__name__)#instance celé aplikace, name je promenná pro referenci na nazev programu co zrovna spouštíš(main/"název")
CORS(app)#browser má same‑origin policy - může si číst odpovědi jen z téhle stejné trojice "věcí" idk, Origin = protokol + host + port(http://localhost:3000), CORS umožňuje nastavit, že i z jiného originu(http://localhost:5173) může přistupovat k API, prostě skupina důvěryhodných zdrojů, porty jsou kamarádi a felí spolu

Base.metadata.create_all(engine)# v metadata jsou náčrty tříd ze kterých se dělají tabulky, respektivety třídy všechny ddědí z base a to je vše v metadata zapsáno a tohle se postará o to aby to bylo v databazy a pokud ne tak aby se to tam zapsalo a to pomocí "engine"

@app.get("/")#, jedná se o endpoint/routu(".../")když příjde http požadavek get( to lomítko) spustí se tahle funkcem, JEDNÁ se o DEKORÁTOR
def health_check():
    return {"status": "ok"}

# na http://localhost:5000/ by bylo: {"status:": "ok"}, / je samo o sobě prázdné


@app.get("/foods")
def get_foods():
   
    date_str = request.args.get("date")#zatím se musí zadat do url, ve formě textu
    user_id_str = request.args.get("user_id", "1")#zatím je to 1 protože nemám auth vrstvu

   
    if not date_str:
        return jsonify({"error": "Missing date query param"}), 400
   
    try:
        user_id = int(user_id_str)
    except ValueError:
        return jsonify({"error": "user_id must be integer"}), 400

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()#datum ve formě datumu, už ne textu
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400

    session = SessionLocal()
    try:
        foods = crud.get_foods_by_date_and_user(
            db=session,
            user_id=user_id,
            target_date=target_date
        )
    finally:
            session.close()
           
            #předtím v tom try bylo tohle a i to foods_json
        # foods = (#list
            # session.query(Food)#v session query na databazi a vrátí mi to Food objekty + filtry
            # .filter(Food.user_id == user_id, Food.date == target_date)# Food user id ==...,datum ==...
            # .order_by(Food.id.asc())# seřad od nejmenšího id po nejvyšší
            # .all()#spust a vykonej
        #)SQLAlchemy objekt, python list vytvořený z db dat
      

    foods_json =[#list pole, tady vezmu data z foods a udělám z nich json friendly formát
                {
                    "id": food.id,#vytvoření klíče
                    "user_id": food.user_id,
                    "name": food.name,
                    "kcal": food.kcal,
                    "date": food.date.isoformat(),
                }
                for food in foods
    ]   
            #bere z toho foods ty položky a přvadí jejich infa do jsonu
            #každý prvek ve foods je food, pro každou položku ve foods, každéé food je jedno jídlo...

        #odpověd
    return jsonify({"foods": foods_json, "count": len(foods_json)}), 200




@app.delete("/foods/<int:food_id>")
def delete_food(food_id):
    session = SessionLocal()
    try:
        food = session.get(Food, food_id)#hledání v Food podle primárního klíče; pk lookup
    
        if not food:#pokud není, nenašlo se
            return jsonify({"error": "Food not found"}), 404

        session.delete(food)
        session.commit()

        return jsonify({"status": "ok", "deleted_food_id": food_id}), 200

    except Exception:#obecná třída chyb, ne že by ses něco něnašlo, ale něco se rozhodně pokazilo
        session.rollback()
        return jsonify({"error": "Failed to delete food"}), 500

    finally:
        session.close()


@app.put("/foods/<int:food_id>")  #edit
def edit_food(food_id):
    data = request.json or {}
    name = data.get("name")
    kcal = data.get("kcal")
    date_str = data.get("date")

    if not name or not kcal or not date_str:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400

    session = SessionLocal()
    try:
        food = session.get(Food, food_id)   #sqlalchemy request na db

        if not food:
            return jsonify({"error": "Food not found"}), 404

        food.name = name
        food.kcal = kcal
        food.date = target_date
        session.commit()

        return jsonify({"status": "ok", "food_id": food.id}), 200

    except Exception:
        session.rollback()
        return jsonify({"error": "Failed to update food"}), 500

    finally:
        session.close()


@app.post("/foods")
def add_food():
    data = request.json or {} # pokud tam nic nění dej to empty; bere to data z toh orequestu...překvapivě
    user_id = data.get("user_id", 1)#pokud není, hodnota je 
    name = data.get("name")
    kcal = data.get("kcal")
    date_str = data.get("date")

    if not name or not kcal or not date_str:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()#text datumu převeden do .date
    except ValueError:
        return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400

    session = SessionLocal()
    try:
        food = Food(user_id=user_id, name=name, kcal=kcal, date=target_date)
        session.add(food)
        session.commit()
        return jsonify({"status": "ok", "food_id": food.id}), 201
    except Exception:
        session.rollback()
        return jsonify({"error": "Failed to create food"}), 500
    finally:
        session.close()

    



