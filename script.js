let days = {};//objekt pro uložení dat v jednotlivých dnech, bude pojmenovám klíčem(datumem)

loadDays();

let total = 0;

function addFood() 
{
  const name = document.getElementById("food").value;
  const kcal = Number(document.getElementById("kcal").value);

  if (!name || kcal <= 0)
    {
      alert("nesprávný název nebo hodnota jídla")
      return;
    }    
  

  if (!days[date]) //pokud neexistuje den v objektu days
    {
      days[date] = { foods: [] }; //vytvoří se nový den s prázdným polem foods
    } 
  days[date].foods.push({ name, kcal });

  saveDays();
  renderDay();

  document.getElementById("food").value = "";//čístí input boxy
  document.getElementById("kcal").value = "";
  
}

function renderDay()
{
  const list = document.getElementById("list");//celej ten list, výpis toho
  list.innerHTML = "";//vyčistí se

  total = 0;

  if (days[date] && days[date].foods.length > 0) { //pokud existuje den a má aspoň jedno jídlo
  days[date].foods.forEach(food => //pro každý prvek v poli foods které připadá každému dni
        { const li = document.createElement("li");//nový html element li
        li.textContent = `${food.name} - ${food.kcal} kcal`;
        list.appendChild(li);
        total += food.kcal;
        }
      );

  }
  document.getElementById("total").textContent = total;
}



function getToday()
{
  return new Date().toISOString().split("T")[0];
}

let date = getToday(); //v date je uložen dnešní datum ve formátu RRRR-MM-DD

updateDateDisplay();
renderDay();

function updateDateDisplay() 
{
  document.getElementById("curentDay").textContent = date;
}

updateDateDisplay(); //nastaví hodnotu datumu na dnešní datum

function dayShift(offset) 
{
  const dateShift = new Date(date);
  dateShift.setDate(dateShift.getDate() + offset);
  date = dateShift.toISOString().split("T")[0];
  updateDateDisplay();
  renderDay();
}

function saveDays()
{
  localStorage.setItem("days", JSON.stringify(days));
}
 
function loadDays()
{
  const saved = localStorage.getItem("days");
  if (saved)
  {
    days = JSON.parse(saved);
  }
}