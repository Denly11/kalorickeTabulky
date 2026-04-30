Kalorické tafulky

Webová aplikace pro sledování kalorického příjmu. Umožňuje zaznamenávat jídla s kaloriemi pro každý den, procházet historii a spravovat záznamy. Celý projekt má sloužit pro naučení se práce s pythonem a daty + databází a tvorby webu.

## Co si od toho slibuji

- pochopení pythonu
- zkušenost s prácí s databázemi
- zkušenost s tvozbou a prácí s API
- vytvořit něco co má smysl
- zlepšení logiky
- pochopení devops

Funkce

- Navigace mezi dny
- Přidávání jídel k vybranému dni
- Zobrazení celkového kalorického příjmu a maker za den
- Editace a mazání záznamů
- Statiky pomocí pythonu


## Tech stack

| Vrstva    | Aktuálně              | Plánováno                        |
|-----------|-----------------------|----------------------------------|
| Frontend  | Vanilla JS + HTML/CSS | React + Vite                     |
| Backend   | Python a Flask        |                                  |
| Databáze  | PostgreSQL (lokálně)  | PostgreSQL (Docker / Cloud)      |
| ORM       | SQLAlchemy(sync)      | SQLAlchemy(async)                |
| Deploy    | Localhost             | Linux server + Docker            |


## Struktura projektu

```
kalorickeTabulky/
├── index.html                        # Frontend — hlavní stránka
├── script.js                         # Frontend logika (komunikace s API)
├── style.css                         # Vzhled
└── kaloricke_tabulky_backend/
    ├── app.py                        # Flask server, HTTP endpointy
    ├── crud.py                       # Business logika (operace nad databází)
    ├── database.py                   # Připojení k databázi a správa session
    └── models.py                     # ORM modely (definice tabulek a vztahů)
```

### Frontend
Otevřít `index.html` přímo v prohlížeči (ideálně přes Live Server). Frontend komunikuje s backend API.

### Backend

- Python 3.10+
- PostgreSQL

1.  Vytvořit databázi v PostgreSQL:
    ```sql
    CREATE DATABASE kaloricke_tabulky;
    ```

2.  Spustit Flask server:
    ```bash
    cd kaloricke_tabulky_backend
    # Doporučeno smazat starou DB pro čistý start s novým schématem
    # rm kaloricke_tabulky.db 
    python app.py
    ```

Server běží na `http://localhost:5000`. Databázové tabulky se vytvoří automaticky při prvním spuštění.

## Konfigurace databáze

V souboru `kaloricke_tabulky_backend/database.py`:

```python
# Příklad pro lokální PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/kaloricke_tabulky"

# Pro jednoduchý lokální vývoj lze použít i SQLite
# DATABASE_URL = "sqlite:///kaloricke_tabulky.db"
```

## API endpointy

| Metoda | Cesta | Popis |
|---|---|---|
| GET | `/` | Health check — vrátí `{"status": "ok"}` |
| POST | `/foods` | Přidá nový záznam o snědeném jídle |
| GET | `/foods/<user_id>/<date>` | Získá všechny záznamy pro uživatele a den |
| GET | `/food-library` | Získá kompletní knihovnu jídel |

### POST `/foods` — tělo požadavku (JSON)

Přidá záznam o konzumaci jídla. Očekává ID z knihovny jídel.

```json
{
  "user_id": 1,
  "food_id": 2,
  "date": "2026-04-30",
  "grams": 150
}
```

**Odpověď:**
```json
{ "status": "ok", "food_id": 5 }
```

### Plánované endpointy
- DELETE `/foods/<id>` — smazání záznamu
- PUT `/foods/<id>` — úprava záznamu


## Databázové schéma

**Tabulka `users`**

| Sloupec | Typ | Omezení | Popis |
|---|---|---|---|
| id | INTEGER | Primary key | Unikátní ID uživatele |
| username | VARCHAR | Unique, not null | Jméno uživatele |
| email | VARCHAR | Unique, not null | Email uživatele |

**Tabulka `food_library` (Slovník jídel)**

| Sloupec | Typ | Omezení | Popis |
|---|---|---|---|
| id | INTEGER | Primary key | Unikátní ID jídla |
| name | VARCHAR | Not null | Název jídla (např. "Kuřecí prso") |
| kcal_per_100grams | INTEGER | Not null | Kalorie na 100 gramů |
| owner_id | INTEGER | FK → `users.id` | Kdo jídlo vytvořil (pro budoucí sdílení) |

**Tabulka `foods` (Záznamy o konzumaci)**

| Sloupec | Typ | Omezení | Popis |
|---|---|---|---|
| id | INTEGER | Primary key | Unikátní ID záznamu |
| user_id | INTEGER | FK → `users.id`, not null | Který uživatel jídlo snědl |
| food_id | INTEGER | FK → `food_library.id`, not null | Odkaz na jídlo ze slovníku |
| date | DATE | Not null | Datum konzumace |
| grams | INTEGER | Not null | Snědené množství v gramech |

## Roadmap

- [x] Základní Frontend s `localStorage`
- [x] Základní Flask backend s připojením na PostgreSQL
- [x] **Normalizace databáze:** Oddělení slovníku jídel (`food_library`) od záznamů (`foods`).
- [x] **Refaktoring Backendu:** Úprava `models.py`, `crud.py` a `app.py` pro nové schéma.
- [x] **Refaktoring Frontendu:** Přechod z textového inputu na `<select>` a napojení na API.
- [x] POST endpoint pro přidání jídla (`/foods`)
- [x] GET endpoint pro načtení jídel (`/foods/<user_id>/<date>`)
- [x] GET endpoint pro načtení knihovny jídel (`/food-library`)
- [ ] DELETE / PUT endpointy
- [ ] Přechod na React + Vite
- [ ] Přechod na async SQLAlchemy
- [ ] Nasazení na Linux server

