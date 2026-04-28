// učím se s tím ok???!!!
//let days = {};//objekt pro uložení dat v jednotlivých dnech, bude pojmenovám klíčem(datumem)
//let když to je global ale když to je vyloženě ve funkci stačí const

let days = {};

//let date = loadCurrentDay(); //načte aktuální den z localStorage nebo použije dnešní datum
let date = loadCurrentDay();



let total = 0;

let editIndex = null; //proměnná pro sledování indexu jídla, které se upravuje

/*
updateDateDisplay();
loadDays();
renderDay();
*/
//  tohle vše dohromady 
//  v

API_BASE = "http://localhost:5000"
USER_ID = 1

init();
//eventy
addButton.addEventListener("click", addFood);
btnPrevDay.addEventListener("click", () => dayShift(-1));
btnNextDay.addEventListener("click", () => dayShift(1));



async function addFood() 
{
  const name = document.getElementById("food").value.trim();//trim odstraní mezery na začátku a konci
  const kcal = Number(document.getElementById("kcal").value);

  if (!name || kcal <= 0)
    {
      alert("nesprávný název nebo hodnota jídla")
      return;
    }    
  

  /*  --objekt days už tak uplně nebude "tady" na local
  if (!days[date]) //pokud neexistuje den v objektu days
    {
      days[date] = { foods: [] }; //vytvoří se nový den s prázdným polem foods
    } 
 */

  const isEditing = editIndex !== null;//udělám pr. isEditing ve které je editIndex který má hodnotu null[JE PRÁZDNÝ] takže isEditing je False, POKUD ALE najednou nějakou hodnotu má, is editing je True => pokud v edit indexu něco je isEditing je tru, vlasně to z nekonečna stavů editIndex dělá binární stav(T/F)
  const foodToEdit = isEditing ? days[date].foods[editIndex] : null;//v days z proměné date vem foods a z toho položku na pozici inddex
  //když tam něco je a má to shodný index tak to jde editovat..., index je index v v objektu days, v dys se vytváří objekty dle datumů, a v každém datumu(objektu) jsou položky(jádla) 0 až ...9999999

  const url = isEditing
    ? `${API_BASE}/foods/${foodToEdit.id}` //payload bude editovat již ex.
    : `${API_BASE}/foods`;//payload bude nová položka
    //pokud se needituje tak je to null => False => url je 

    const method = isEditing ? "PUT" : "POST";//pokud je isEditing True tak method = PUT, PUT je v app.py edit že jo ooooooo

    const payload = isEditing ? {name, kcal, date} : {user_id: USER_ID, name, kcal, date}//pokud to něexistuje tak to musíme připsat k uživately

/*
  if (editIndex !== null) //pokud je editIndex nastavený, upravíme existující jídlo
  {
    days[date].foods[editIndex] = { name, kcal };
    editIndex = null; //resetujeme editIndex po úpravě
  }
  else //jinak přidáme nové jídlo
  {
    days[date].foods.push({ name, kcal });
  }*/

    const response = await fetch(url, {method, headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)});

    if (!response.ok)
    {
      alert("Nepovedlo se uložot jídlo.")
      return;
    }

  // saveDays();
  // renderDay();

  editIndex = null;
  document.getElementById("food").value = "";//čístí input boxy
  document.getElementById("kcal").value = "";

  await loadFoodsForDate(date);
  renderDay();
}



function renderDay()
{

  const list = document.getElementById("list");//celej ten list, výpis toho
  list.innerHTML = "";//vyčistí se
  total = 0;

  if (days[date] && days[date].foods.length > 0) //pokud existuje den a má aspoň jedno jídlo
  { 
    days[date].foods.forEach((food, index) => //pro každý prvek v poli foods které připadá každému dni, díky index je kařdému jídlu přiřazen index
        { 
          const li = document.createElement("li");//nový html element li
          li.textContent = `${food.name} - ${food.kcal} kcal`;
          
          const btnRemove = document.createElement("button");//tlačítko pro smazání
          btnRemove.textContent = "delete";
          btnRemove.onclick = function()
           {
            removeFood(food.id);
           }

          const btnEdit = document.createElement("button");//tlačítko pro úpravu
          btnEdit.textContent = "edit";
          btnEdit.onclick = function()
           {
            editFood(food.id);//*** s tím se zvolí PUT a jedem-
           }

          li.appendChild(btnEdit);//přidá tlačítko do li
          li.appendChild(btnRemove);//přidá tlačítko do li
          list.appendChild(li);
          total += food.kcal;
        }
      );
  }
  document.getElementById("total").textContent = total;
}

async function removeFood(foodId)
{
  if (!confirm("Opravdu chcete smazat toto jídlo?")) {
    return; //kontrola že user chce fakt smazat položku, pokud to je že ne(false) tak se vykoná return a nic se nestane obv...
  }
  try {
      
      const response = await fetch(`${API_BASE}/foods/${foodId}`, {
        method: "DELETE",//dekoratoy jsem upravoval delete, put apodobně takže tay jen říkám co z toho vybrat
      });

   
      if (!response.ok) {
        
        alert("Nepovedlo se smazat jídlo.");
        return;
      }

      // 4. Pokud bylo smazání úspěšné, synchronizujeme frontend
      // Znovu načteme aktuální data pro daný den z backendu...
      await loadFoodsForDate(date);
      // ...a překreslíme zobrazení
      renderDay();

    } catch (error) {
      // 5. Zachytíme případné chyby sítě
      console.error("Chyba při mazání jídla:", error);
      alert("Nastala chyba při komunikaci se serverem.");
    }

}


function editFood(foodId)//tady je index z toho konkrétného buttonu pro to konkrétní jídlo v tom konkrétním dnu OOHHHH označeno ***
{
  const food = days[date].foods.find(food => food.id === foodId);//je food.id v foos z toho dne = tomu co je ve funkci, pokud jo máme to jídlo
  const foundFoodId = days[date].foods.findIndex(food => food.id === foodId)

  if (!food) {
    alert("Chyba: Jídlo pro úpravu nebylo nalezeno.");
    return;
  }

  document.getElementById("food").value = food.name;//to v index má hodnoty odtud
  document.getElementById("kcal").value = food.kcal;

  editIndex = foundFoodId;
}


function getToday()
{
  return new Date().toISOString().split("T")[0];
}



function updateDateDisplay() 
{
  document.getElementById("currentDay").textContent = date;
}


/*    --- OLD, na LOCALu ---
function dayShift(offset) 
{
  const dateShift = new Date(date);
  dateShift.setDate(dateShift.getDate() + offset);
  date = dateShift.toISOString().split("T")[0];

  editIndex = null; //resetuje editIndex při změně dne
  document.getElementById("food").value = "";
  document.getElementById("kcal").value = "";

  updateDateDisplay(); //nastaví hodnotu datumu na dnešní datum
  renderDay();
  saveCurrentDay();
}*/

function saveCurrentDay()
{
  sessionStorage.setItem("currentDay", date);
}

function loadCurrentDay()
{
  const saved = sessionStorage.getItem("currentDay");
  return saved ? saved : getToday();
}

/*
function saveDays()
{
  localStorage.setItem("days", JSON.stringify(days));
}
*/

/*function loadDays()
{
  const saved = localStorage.getItem("days");
  if (saved)
  {
    days = JSON.parse(saved);
  }
}*/


async function loadFoodsForDate(targetDate)//vrací jídla pro daný den; async protože aplikace se už nespouští synchroně(load...() vše najednou)
{
  const response = await fetch(//počká než dostane fetch od backendu
    `${API_BASE}/foods?date=${targetDate}&user_id=${USER_ID}`
  );

  if (!response.ok)
  {
    throw new Error("Nepovedlo se načíst jídla z API");
  }

  const data = await response.json();

  days[targetDate] = {
    foods: data.foods
  };
}

/*
async function loadDays()
{
  await loadFoodsForDate(date); 
}
*/
async function dayShift(offset) 
{
  const dateShift = new Date(date);
  dateShift.setDate(dateShift.getDate() + offset);
  date = dateShift.toISOString().split("T")[0];

  editIndex = null;
  document.getElementById("food").value = "";
  document.getElementById("kcal").value = "";

  updateDateDisplay();
  await loadFoodsForDate(date);//čekám na samotný datum...obv
  renderDay();
  saveCurrentDay();
}


async function init()
{
  try
  {
    updateDateDisplay();
    await loadFoodsForDate(date);
    renderDay();
  }
  catch (error)
  {
    console.error(error);
    alert("Nepovedlo se nacist jidla z BE")
  }
}