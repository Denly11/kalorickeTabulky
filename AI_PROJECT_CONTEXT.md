# PROJEKT: Kalorické Tabulky - AI Context & Guidelines

Tento soubor slouží jako **hlavní kontext pro AI asistenty**. Při každé nové konverzaci si tento soubor přečti, abys pochopil mou úroveň, cíle a aktuální stav projektu.

## 🎯 Hlavní Cíle Projektu (The "Why")

1.  **Hluboké technické porozumění:** Nejde jen o to "aby to fungovalo". Cílem je pochopit **backendovou architekturu**, práci s databází, návrhové vzory a HTTP komunikaci.
2.  **Přechod na profesionální vývoj:** Posun od "lepení kódu" k **návrhu softwaru** (Separation of Concerns, vrstvená architektura).
3.  **Full-stack kompetence:** Pochopení celého toku dat: Databáze -> Backend API -> Frontend (JS fetch) -> DOM.

## 🛠 Tech Stack

| Vrstva | Aktuální Stav | Cílový Stav (Future) |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JS + HTML/CSS | React + Vite |
| **Backend** | Flask | FastAPI (Async, Pydantic) |
| **Database** | PostgreSQL (Local) | PostgreSQL (Docker/Cloud) |
| **ORM** | SQLAlchemy (Sync) | SQLAlchemy (Async) |
| **Deploy** | Localhost | Linux Server (Docker, Nextcloud) |

## 🏗 Architektonické Principy (Strict Rules)

Při návrhu řešení vždy dodržuj tuto strukturu:

1.  **Databázová vrstva (`database.py`):**
    *   Správa spojení (`create_engine`).
    *   Správa sessions (`SessionLocal`).
    *   Definice `Base`.
2.  **ORM Modely (`models.py`):**
    *   Dědí z `Base`.
    *   Reprezentují tabulky (User, Food).
    *   Definují vztahy (`relationship`, `ForeignKey`).
3.  **CRUD Logika (Business Logic):**
    *   Oddělená od API rout (ideálně v budoucnu `cru.py` nebo services).
    *   Zodpovídá za operace nad DB (Add, Get, Update, Delete).
4.  **API Vrstva (`app.py`):**
    *   Příjímá HTTP requesty (JSON).
    *   Validuje vstupy.
    *   Volá CRUD logiku.
    *   Vrací HTTP response (JSON + Status kód).

**Důležité:** Vždy vysvětluj *proč* něco děláme (např. proč uzavírat session, proč commitovat).

## 🧠 Filozofie Učení

*   **Pochopení > Memorování:** Vysvětluj principy, ne jen syntaxi.
*   **Minimalismus:** Kód by měl být stručný a účelný.
*   **Praxe:** Teorie je k ničemu bez implementace. Vše si chci vyzkoušet "rukama".
*   **Pair Programming:** Nechci hotová řešení na kopírovaní. Chci, abychom to psali "spolu" a já rozuměl každému řádku.

## 📍 Aktuální Fáze Vývoje (Status)

*   [x] Základní HTML/CSS/JS frontend (localStorage).
*   [x] Základní Flask backend + PostgreSQL connection.
*   [x] **Refactoring: Přechod z localStorage na API**.
    *   Backend: Implementace GET, DELETE, PUT endpointů.
    *   Frontend: Implementace `fetch()` volání místo přímé manipulace pole `days`.
*   [ ] **Architektura: Normalizace databáze (Škálovatelnost) — Aktuální priorita:**
    *   Oddělit "slovník jídel" od "záznamů o konzumaci". Místo ukládání názvu a kalorií pro každý záznam znovu a znovu, vytvořit dvě tabulky:
        1.  `foods_dictionary`: Unikátní jídla (název, kcal).
        2.  `food_logs`: Záznamy, které odkazují na `user_id` a `food_id` ze slovníku, a obsahují specifika jako datum a gramáž.
    *   **Roadmapa normalizace (konkrétně):**
        1.  `models.py` — přidat `FoodDefinition`, upravit `Food` na log a vazby.
        2.  `crud.py` — nové CRUD pro definice, upravit dotazy logů.
        3.  `app.py` — nové endpointy/payloady, výpočet kcal v odpovědi.
        4.  `script.js` — nové API volání pro slovník, gramy a tok přidání logu.
        5.  `index.html` + `style.css` — UI pro výběr/autocomplete + gramy.
        6.  Data: staré záznamy smazat a jet čistě na novém modelu.
        7.  `README.md` + `AI_PROJECT_CONTEXT.md` — update dokumentace.
