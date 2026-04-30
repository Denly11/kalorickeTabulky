// učím se s tím ok???!!!
//let days = {};//objekt pro uložení dat v jednotlivých dnech, bude pojmenovám klíčem(datumem)
//let když to je global ale když to je vyloženě ve funkci stačí const


let days = {};
let date = loadCurrentDay();
let total = 0;
let editIndex = null;

const API_BASE = "http://localhost:5000";
const USER_ID = 1;

// DOM prvky, které budeme používat častěji
const foodSelect = document.getElementById("foodSelect");
const gramsInput = document.getElementById("grams");
const addButton = document.getElementById("addButton");
const btnPrevDay = document.getElementById("btnPrevDay");
const btnNextDay = document.getElementById("btnNextDay");
const listElement = document.getElementById("list");
const totalElement = document.getElementById("total");
const currentDayElement = document.getElementById("currentDay");

// Připojení funkcí k tlačítkům
addButton.addEventListener("click", addFood);
btnPrevDay.addEventListener("click", () => dayShift(-1));
btnNextDay.addEventListener("click", () => dayShift(1));

// Spuštění aplikace
init();

async function addFood() {
    const isEditing = editIndex !== null;
    const grams = Number(gramsInput.value);

    if (grams <= 0) {
        alert("Prosím, zadejte platné množství gramů.");
        return;
    }

    let url;
    let method;
    let payload;

    if (isEditing) {
        // Režim úprav: měníme pouze gramy existujícího záznamu
        const foodToEdit = days[date].foods[editIndex];
        url = `${API_BASE}/foods/${foodToEdit.id}`;
        method = "PUT";
        payload = { grams: grams };
    } else {
        // Režim přidávání: bereme data z dropdownu
        const selectedOption = foodSelect.options[foodSelect.selectedIndex];
        const foodData = JSON.parse(selectedOption.value); // Zpracujeme JSON z 'value'

        url = `${API_BASE}/foods`;
        method = "POST";
        payload = {
            user_id: USER_ID,
            date: date,
            name: foodData.name,
            kcal_per_100grams: foodData.kcal_per_100grams,
            grams: grams,
        };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert(`Chyba: ${errorData.error || response.statusText}`);
            return;
        }

        resetForm(); // Vyčistíme formulář
        await loadFoodsForDate(date); // Znovu načteme data pro aktuální den
        renderDay(); // Překreslíme seznam

    } catch (error) {
        console.error("Chyba při komunikaci se serverem:", error);
        alert("Nastala chyba při odesílání dat na server.");
    }
}

function renderDay() {
    listElement.innerHTML = "";
    total = 0;

    if (days[date] && days[date].foods.length > 0) {
        days[date].foods.forEach((food, index) => {
            const li = document.createElement("li");
            li.textContent = `${food.name} (${food.grams}g) - ${food.kcal} kcal`;
            total += food.kcal;

            const btnRemove = document.createElement("button");
            btnRemove.textContent = "Smazat";
            btnRemove.onclick = () => removeFood(food.id);

            const btnEdit = document.createElement("button");
            btnEdit.textContent = "Upravit";
            btnEdit.onclick = () => editFood(food.id, index);

            li.appendChild(btnEdit);
            li.appendChild(btnRemove);
            listElement.appendChild(li);
        });
    }
    totalElement.textContent = total;
}

async function removeFood(foodId) {
    if (!confirm("Opravdu chcete smazat toto jídlo?")) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/foods/${foodId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            alert("Chyba při mazání jídla.");
            return;
        }

        await loadFoodsForDate(date);
        renderDay();

    } catch (error) {
        console.error("Chyba při mazání jídla:", error);
        alert("Nastala chyba při komunikaci se serverem.");
    }
}

function editFood(foodId, index) {
    const foodToEdit = days[date].foods.find(food => food.id === foodId);
    if (!foodToEdit) return;

    // Najdeme odpovídající položku v selectu podle jména
    const optionToSelect = Array.from(foodSelect.options).find(opt => {
        const foodData = JSON.parse(opt.value);
        return foodData.name === foodToEdit.name;
    });

    if (optionToSelect) {
        foodSelect.value = optionToSelect.value;
    }
    
    gramsInput.value = foodToEdit.grams;
    
    foodSelect.disabled = true; // Zamkneme výběr jídla, měnit jdou jen gramy
    
    editIndex = index; // Nastavíme režim úprav
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function updateDateDisplay() {
    currentDayElement.textContent = date;
}

function saveCurrentDay() {
    sessionStorage.setItem("currentDay", date);
}

function loadCurrentDay() {
    const saved = sessionStorage.getItem("currentDay");
    return saved ? saved : getToday();
}

async function loadFoodsForDate(targetDate) {
    try {
        const response = await fetch(`${API_BASE}/foods?date=${targetDate}&user_id=${USER_ID}`);
        if (!response.ok) {
            throw new Error("Nepovedlo se načíst jídla z API");
        }
        const data = await response.json();
        days[targetDate] = { foods: data.foods };
    } catch (error) {
        console.error(error);
        days[targetDate] = { foods: [] }; // V případě chyby zobrazíme prázdný den
    }
}

async function dayShift(offset) {
    const dateShift = new Date(date);
    dateShift.setDate(dateShift.getDate() + offset);
    date = dateShift.toISOString().split("T")[0];

    resetForm();
    updateDateDisplay();
    await loadFoodsForDate(date);
    renderDay();
    saveCurrentDay();
}

function resetForm() {
    editIndex = null;
    gramsInput.value = "";
    foodSelect.selectedIndex = 0; // Vrátí výběr na první položku
    foodSelect.disabled = false; // Odemkneme dropdown
}

async function init() {
    try {
        updateDateDisplay();
        await loadFoodsForDate(date);
        renderDay();
    } catch (error) {
        console.error(error);
        alert("Nepovedlo se načíst data ze serveru při startu aplikace.");
    }
}

//tohle budu potřebovat pozdeji ted budu mít hala bala kod aby to fungovalo s přednastavenýma hodnotama
// let days = {};

// //let date = loadCurrentDay(); //načte aktuální den z localStorage nebo použije dnešní datum
// let date = loadCurrentDay();



// let total = 0;

// let editIndex = null; //proměnná pro sledování indexu jídla, které se upravuje

// /*
// updateDateDisplay();
// loadDays();
// renderDay();
// */
// //  tohle vše dohromady 
// //  v

// API_BASE = "http://localhost:5000"
// USER_ID = 1

// init();
// //eventy
// addButton.addEventListener("click", addFood);
// btnPrevDay.addEventListener("click", () => dayShift(-1));
// btnNextDay.addEventListener("click", () => dayShift(1));



// async function addFood() 
// {
//  const isEditing = editIndex !== null;

  
//     const name = document.getElementById("foodName").value.trim();
//     const kcal_per_100g = Number(document.getElementById("kcalPer100g").value);
//     const grams = Number(document.getElementById("grams").value);

//     if (!name || grams <= 0) {
//         alert("Prosím, vyplňte název a gramy.");
//         return;
//     }
//     if (!isEditing && kcal_per_100g <= 0) {
//         alert("Při přidávání nového jídla musíte zadat kcal/100g.");
//         return;
//     }

//     let url;
//     let method;
//     let payload;

//     if (isEditing) {
     
//         const foodToEdit = days[date].foods[editIndex];
//         url = `${API_BASE}/foods/${foodToEdit.id}`;
//         method = "PUT";
//         payload = { grams: grams }; 

//     } else {
//         url = `${API_BASE}/foods`;
//         method = "POST";
//         payload = {
//             user_id: USER_ID,
//             date: date,
//             name: name,
//             kcal_per_100g: kcal_per_100g,
//             grams: grams,
//         };
//     }

   
//     try {
//         const response = await fetch(url, {
//             method: method,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             alert(`Chyba: ${errorData.error || response.statusText}`);
//             return;
//         }

//         // 5. Úspěch - reset stavu a formuláře
//         editIndex = null;
//         document.getElementById("foodName").value = "";
//         document.getElementById("kcalPer100g").value = "";
//         document.getElementById("grams").value = "";
//         document.getElementById("kcalPer100g").disabled = false; // Znovu zpřístupníme pole

//         await loadFoodsForDate(date);
//         renderDay();

//     } catch (error) {
//         console.error("Chyba při komunikaci se serverem:", error);
//         alert("Nastala chyba při odesílání dat na server.");
//     }   
// }

//   /*  --objekt days už tak uplně nebude "tady" na local
//   if (!days[date]) //pokud neexistuje den v objektu days
//     {
//       days[date] = { foods: [] }; //vytvoří se nový den s prázdným polem foods
//     } 
//  */

// //   const isEditing = editIndex !== null;//udělám pr. isEditing ve které je editIndex který má hodnotu null[JE PRÁZDNÝ] takže isEditing je False, POKUD ALE najednou nějakou hodnotu má, is editing je True => pokud v edit indexu něco je isEditing je tru, vlasně to z nekonečna stavů editIndex dělá binární stav(T/F)
// //   const foodToEdit = isEditing ? days[date].foods[editIndex] : null;//v days z proměné date vem foods a z toho položku na pozici inddex
// //   //když tam něco je a má to shodný index tak to jde editovat..., index je index v v objektu days, v dys se vytváří objekty dle datumů, a v každém datumu(objektu) jsou položky(jádla) 0 až ...9999999

// //   const url = isEditing
// //     ? `${API_BASE}/foods/${foodToEdit.id}` //payload bude editovat již ex.
// //     : `${API_BASE}/foods`;//payload bude nová položka
// //     //pokud se needituje tak je to null => False => url je 

// //     const method = isEditing ? "PUT" : "POST";//pokud je isEditing True tak method = PUT, PUT je v app.py edit že jo ooooooo

// //     const payload = isEditing ? {name, kcal, date} : {user_id: USER_ID, name, kcal, date}//pokud to něexistuje tak to musíme připsat k uživately

// // /*
// //   if (editIndex !== null) //pokud je editIndex nastavený, upravíme existující jídlo
// //   {
// //     days[date].foods[editIndex] = { name, kcal };
// //     editIndex = null; //resetujeme editIndex po úpravě
// //   }
// //   else //jinak přidáme nové jídlo
// //   {
// //     days[date].foods.push({ name, kcal });
// //   }*/

// //     const response = await fetch(url, {method, headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)});

// //     if (!response.ok)
// //     {
// //       alert("Nepovedlo se uložot jídlo.")
// //       return;
// //     }

// //   // saveDays();
// //   // renderDay();

// //   editIndex = null;
// //   document.getElementById("food").value = "";//čístí input boxy
// //   document.getElementById("kcal").value = "";

// //   await loadFoodsForDate(date);
// //   renderDay();



// function renderDay()
// {

//   const list = document.getElementById("list");//celej ten list, výpis toho
//   list.innerHTML = "";//vyčistí se
//   total = 0;

//   if (days[date] && days[date].foods.length > 0) //pokud existuje den a má aspoň jedno jídlo
//   { 
//     days[date].foods.forEach((food, index) => //pro každý prvek v poli foods které připadá každému dni, díky index je kařdému jídlu přiřazen index
//         { 
//           const li = document.createElement("li");//nový html element li
//           li.textContent = `${food.name} - ${food.kcal} kcal`;
          
//           const btnRemove = document.createElement("button");//tlačítko pro smazání
//           btnRemove.textContent = "delete";
//           btnRemove.onclick = function()
//            {
//             removeFood(food.id);
//            }

//           const btnEdit = document.createElement("button");//tlačítko pro úpravu
//           btnEdit.textContent = "edit";
//           btnEdit.onclick = function()
//            {
//             editFood(food.id);//*** s tím se zvolí PUT a jedem-
//            }

//           li.appendChild(btnEdit);//přidá tlačítko do li
//           li.appendChild(btnRemove);//přidá tlačítko do li
//           list.appendChild(li);
//           total += food.kcal;
//         }
//       );
//   }
//   document.getElementById("total").textContent = total;
// }

// async function removeFood(foodId)
// {
//   if (!confirm("Opravdu chcete smazat toto jídlo?")) {
//     return; //kontrola že user chce fakt smazat položku, pokud to je že ne(false) tak se vykoná return a nic se nestane obv...
//   }
//   try {
      
//       const response = await fetch(`${API_BASE}/foods/${foodId}`, {
//         method: "DELETE",//dekoratoy jsem upravoval delete, put apodobně takže tay jen říkám co z toho vybrat
//       });

   
//       if (!response.ok) {
//          const errorData = await response.json().catch(() => ({}));//počká jestli server pošle legit vysvětlení co se stalo
//          alert(`Nepovedlo se smazat jídlo: ${errorData.error || response.statusText}`);//pokud tam není error tak se pošle status
//         return;
//       }


//       await loadFoodsForDate(date);

//       renderDay();

//     } catch (error) {

//       console.error("Chyba při mazání jídla:", error);
//       alert("Nastala chyba při komunikaci se serverem.");
//     }

// }


// function editFood(foodId)
// {
//   const foodToEdit = days[date].foods.find(food => food.id === foodId);
//     const foodIndex = days[date].foods.findIndex(food => food.id === foodId);

//     if (!foodToEdit) {
//         alert("Chyba: Jídlo pro úpravu nebylo nalezeno.");
//         return;
//     }

//     const originalKcalPer100g = Math.round((foodToEdit.kcal / foodToEdit.grams) * 100);

//     document.getElementById("foodName").value = foodToEdit.name;
//     document.getElementById("kcalPer100g").value = originalKcalPer100g;
//     document.getElementById("grams").value = foodToEdit.grams;

//     document.getElementById("foodName").disabled = true;
//     document.getElementById("kcalPer100g").disabled = true;

   
//     editIndex = foodIndex;
// }


// function getToday()
// {
//   return new Date().toISOString().split("T")[0];
// }



// function updateDateDisplay() 
// {
//   document.getElementById("currentDay").textContent = date;
// }


// /*    --- OLD, na LOCALu ---
// function dayShift(offset) 
// {
//   const dateShift = new Date(date);
//   dateShift.setDate(dateShift.getDate() + offset);
//   date = dateShift.toISOString().split("T")[0];

//   editIndex = null; //resetuje editIndex při změně dne
//   document.getElementById("food").value = "";
//   document.getElementById("kcal").value = "";

//   updateDateDisplay(); //nastaví hodnotu datumu na dnešní datum
//   renderDay();
//   saveCurrentDay();
// }*/

// function saveCurrentDay()
// {
//   sessionStorage.setItem("currentDay", date);
// }

// function loadCurrentDay()
// {
//   const saved = sessionStorage.getItem("currentDay");
//   return saved ? saved : getToday();
// }

// /*
// function saveDays()
// {
//   localStorage.setItem("days", JSON.stringify(days));
// }
// */

// /*function loadDays()
// {
//   const saved = localStorage.getItem("days");
//   if (saved)
//   {
//     days = JSON.parse(saved);
//   }
// }*/


// async function loadFoodsForDate(targetDate)//vrací jídla pro daný den; async protože aplikace se už nespouští synchroně(load...() vše najednou)
// {
//   const response = await fetch(//počká než dostane fetch od backendu
//     `${API_BASE}/foods?date=${targetDate}&user_id=${USER_ID}`
//   );

//   if (!response.ok)
//   {
//     throw new Error("Nepovedlo se načíst jídla z API");
//   }

//   const data = await response.json();

//   days[targetDate] = {
//     foods: data.foods
//   };
// }

// /*
// async function loadDays()
// {
//   await loadFoodsForDate(date); 
// }
// */
// async function dayShift(offset) 
// {
//   const dateShift = new Date(date);
//   dateShift.setDate(dateShift.getDate() + offset);
//   date = dateShift.toISOString().split("T")[0];

//   editIndex = null;
// z
//     document.getElementById("foodName").value = "";
//     document.getElementById("kcalPer100g").value = "";
//     document.getElementById("grams").value = "";
//     document.getElementById("foodName").disabled = false;
//     document.getElementById("kcalPer100g").disabled = false;

//   updateDateDisplay();
//   await loadFoodsForDate(date);//čekám na samotný datum...obv
//   renderDay();
//   saveCurrentDay();
// }


// async function init()
// {
//   try
//   {
//     updateDateDisplay();
//     await loadFoodsForDate(date);
//     renderDay();
//   }
//   catch (error)
//   {
//     console.error(error);
//     alert("Nepovedlo se nacist jidla z BE")
//   }
// }
