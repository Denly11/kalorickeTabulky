let days = {};

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
  total += kcal;

  const li = document.createElement("li");
  li.textContent = name + " - " + kcal + " kcal";

  document.getElementById("list").appendChild(li);
  document.getElementById("total").textContent = total;

  document.getElementById("food").value = "";
  document.getElementById("kcal").value = "";
}



function getToday()
{
  return new Date().toISOString().split("T")[0];
}

let date = getToday(); //v date je uložen dnešní datum ve formátu RRRR-MM-DD

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
}


 
 