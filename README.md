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
├── script.js                         # Frontend logika (localStorage)
├── style.css                         # Styly
└── kaloricke_tabulky_backend/
    ├── app.py                        # Flask server, HTTP endpointy
    ├── database.py                   # Připojení k databázi
    └── models.py                     # ORM modely
```

### Frontend
Otevřít index přímo v prohlížeči. Frontend momentálně pracuje nezávisle na backendu (používá localStorage).

### Backend

- Python 3.10+
- PostgreSQL

1. Vytvořit databázi v PostgreSQL:
   sql
   CREATE DATABASE kaloricke_tabulky;
   

2. Spustit Flask server:
   bash
   cd kaloricke_tabulky_backend
   python app.py
   

Server běží na http://localhost:5000, tabulky se vytvoří automaticky při prvním spuštění.

## Konfigurace databáze

V souboru kaloricke_tabulky_backend/database.py:

postgresql://...


## API endpointy

| Metoda | Cesta     | Popis                              |
|--------|-----------|------------------------------------|
| GET    | `/`       | Health check — vrátí `{"status": "ok"}` |
| POST   | `/foods`  | Přidá nový záznam jídla            |

### POST `/foods` — tělo požadavku (JSON)

```json
{
  "user_id": 12,
  "name": "Kuřecí prso",
  "kcal": 165,
  "date": "2026-03-09"
}
```

**Odpověď:**
```json
{ "status": "ok", "food_id": 1 }
```

### Plánované endpointy
- GET /foods — seznam jídel pro daný den
- DELETE /foods/<id> — smazání záznamu
- PUT /foods/<id> — úprava záznamu


## Databázové schéma

**Tabulka `users`**

| Sloupec | Typ     | Omezení          |
|---------|---------|------------------|
| id      | INTEGER | Primary key      |
| email   | VARCHAR | Unique, not null |

**Tabulka `foods`**

| Sloupec  | Typ     | Omezení                  |
|----------|---------|--------------------------|
| id       | INTEGER | Primary key              |
| user_id  | INTEGER | FK → `users.id`, not null |
| date     | DATE    | Not null                 |
| name     | VARCHAR | Not null                 |
| kcal     | INTEGER | Not null                 |

Další rozšíření rozšíření: sloupce pro bílkoviny, tuky a sacharidy.


## Roadmap

- [done] Frontend s localStorage (navigace dnů, CRUD, součet kalorií)
- [done] Flask backend s připojením na PostgreSQL
- [doen] POST endpoint pro přidání jídla
- [ ] GET / DELETE / PUT endpointy
- [ ] Napojení frontendu na backend API (nahrazení localStorage za `fetch()`)
- [ ] Přechod na React + Vite
- [ ] Přechod na async SQLAlchemy
- [ ] Nasazení na Linux server

