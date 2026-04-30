from flask import Flask, request, jsonify
from flask_cors import CORS
from .database import engine, SessionLocal
from .models import Base, Food, User
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
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user_id or date format"}), 400

    session = SessionLocal()
    try:
        # Voláme novou funkci, která vrací seznam záznamů (logů)
        food_logs = crud.get_food_logs_by_date(
            db=session,
            user_id=user_id,
            target_date=target_date
        )
            #session.close() tady tu session nezavíram protože to předtím byla nahoda že to pořád odkazovalo(food.x), 
            # ted potřebuju něco řemu se říká sdílený atribut, 
            # což je to definovaná pomocí relationshit() a 

           
            #předtím v tom try bylo tohle a i to foods_json
        # foods = (#list
            # session.query(Food)#v session query na databazi a vrátí mi to Food objekty + filtry
            # .filter(Food.user_id == user_id, Food.date == target_date)# Food user id ==...,datum ==...
            # .order_by(Food.id.asc())# seřad od nejmenšího id po nejvyšší
            # .all()#spust a vykonej
        #)SQLAlchemy objekt, python list vytvořený z db dat
      

        foods_json =[]#list pole, tady vezmu data z foods a udělám z nich json friendly formát
        for log in food_logs:
            # Pro každý záznam (log) dopočítáme kalorie
            calculated_kcal = round((log.food_item.kcal_per_100grams / 100) * log.grams)
            
            foods_json.append({
                "id": log.id, # ID samotného záznamu (pro mazání/úpravy)
                "date": log.date.isoformat(),
                "grams": log.grams,
                "name": log.food_item.name, # Jméno bereme z připojeného slovníku
                "kcal": calculated_kcal, # Posíláme dopočítané kalorie
                "food_library_id": log.food_library_id
            })
            
        return jsonify({"foods": foods_json, "count": len(foods_json)}), 200

    finally:
        session.close()


@app.delete("/foods/<int:food_log_id>")
def delete_food(food_log_id):

    user_id = 1# zatím není hotové přihlášení takže

    session = SessionLocal()
    try:
        # Voláme novou CRUD funkci pro mazání záznamu
        deleted_log = crud.delete_food_log(
            db=session,
            food_log_id=food_log_id,
            user_id=user_id # Předáváme ID uživatele pro bezpečnostní kontrolu
        )

        if not deleted_log:
            return jsonify({"error": "Food log not found or you don't have permission to delete it"}), 404

        return jsonify({"status": "ok", "deleted_food_id": food_log_id}), 200

    except Exception as e:#do e ulož ten fail(pak ho vypíšu) je obecná třída chyb, ne že by ses něco něnašlo, ale něco se rozhodně pokazilo
        session.rollback()#protějšk .commit nepotvrdí změnu
        print(f"Error deleting food: {e}")
        return jsonify({"error": "Failed to delete food"}), 500

    finally:
        session.close()


@app.put("/foods/<int:food_log_id>")  #edit

def edit_food(food_log_id):
    data = request.get_json()

    #NECHÁM TO TU KVŮLI VYSVĚTLENÍ SYNTAXE TÝHLE VĚCI
    #
    # if not data or not all(k in data for k in ["name", "kcal", "date"]):#k in data for k in je(generovaná notace) vlasně to vždy pod ka vezmě jeden z těch prvku pole a zkontroluje jestli je ten prvek v datech a když se tam najde jde na další(name, kcal, ...) a když to vše vrátí True... 
    

    user_id = 1 # Opět napevno, dokud nebude přihlašování

    # 1. Validace: Očekáváme z frontendu pouze novou gramáž
    if not data or "grams" not in data:
        return jsonify({"error": "Missing 'grams' in request body"}), 400

    try:
        grams = int(data["grams"])
        if grams <= 0:
            raise ValueError("Grams must be a positive number")
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data type or value for 'grams'"}), 400

    # 2. Práce s databází
    session = SessionLocal()
    try:
        # Voláme novou CRUD funkci pro úpravu záznamu
        updated_log = crud.update_food_log(
            db=session,
            food_log_id=food_log_id,
            user_id=user_id,
            grams=grams
        )

        if not updated_log:
            return jsonify({"error": "Food log not found or you don't have permission to edit it"}), 404

        # 3. Odeslání úspěšné odpovědi
        return jsonify({"status": "ok", "updated_food_log_id": updated_log.id}), 200
    
    except Exception as e:
        session.rollback()
        print(f"Error editing food: {e}")
        return jsonify({"error": "Failed to update food"}), 500

    finally:
        session.close()


@app.post("/foods")
def add_food():
    data = request.get_json()#když to tam není dá do proměnné NULL

    
    # 1. Validace vstupních dat z frontendu
    required_keys = ["user_id", "date", "name", "kcal_per_100grams", "grams"]
    if not data or not all(k in data for k in required_keys):
        return jsonify({"error": f"Missing data, required keys are: {required_keys}"}), 400

    try:
        user_id = int(data["user_id"])
        kcal_per_100grams = int(data["kcal_per_100grams"])
        grams = int(data["grams"])
        target_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data type for user_id, kcal, grams or date"}), 400

    # 2. Práce s databází
    session = SessionLocal()
    try:
        # Krok 2a: Získáme položku ze slovníku (nebo ji vytvoříme)
        food_item = crud.get_or_create_food_library_item(
            db=session,
            name=data["name"],
            kcal_per_100grams=kcal_per_100grams,
            owner_id=user_id  # Propojíme s uživatelem, který jídlo vytvořil
        )

        # Krok 2b: Vytvoříme samotný záznam o konzumaci
        new_log = crud.create_food_log(
            db=session,
            user_id=user_id,
            food_library_id=food_item.id,  # Použijeme ID z kroku 2a
            grams=grams,
            target_date=target_date
        )
        
        # 3. Odeslání úspěšné odpovědi
        return jsonify({"status": "ok", "food_log_id": new_log.id}), 201

    except Exception as e:
        session.rollback()
        print(f"Error creating food log: {e}")
        return jsonify({"error": "Failed to create food log"}), 500
    finally:
        session.close()
    



