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

*   [x] Základní HTML/CSS/JS frontend (původně s `localStorage`).
*   [x] Základní Flask backend + PostgreSQL připojení.
*   [x] **Architektura: Normalizace databáze a kompletní refaktoring.**
    *   **Cíl splněn:** Databáze byla úspěšně normalizována. Místo jednoho velkého záznamu nyní máme oddělený slovník jídel (`food_library`) a deník konzumace (`foods`), což eliminuje redundanci dat.
    *   **Backend:** Kompletně přepsány `models.py`, `crud.py` a `app.py` pro práci s novým schématem. Vytvořeny nové API endpointy.
    *   **Frontend:** Kompletně přepsán `script.js`. Aplikace nyní komunikuje výhradně přes API, načítá data z backendu a dynamicky generuje UI. Původní `localStorage` logika byla zcela odstraněna.
    *   **UI:** Textové pole pro jídlo bylo nahrazeno `<select>` prvkem, který se plní daty z `food_library`.

*   [ ] **Další kroky:**
    *   Implementace zbývajících CRUD operací (DELETE, PUT).
    *   Vylepšení UI/UX (např. lepší feedback pro uživatele, správa chyb).
    *   Zvážení přechodu na React/Vite pro frontend.
    *   Zvážení přechodu na FastAPI pro backend.
    *   Nasazení aplikace (Docker, Linux server).
