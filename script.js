let total = 0;

function addFood() {
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
}



function getToday()
{
  return new Date().toISOString().split("T")[0];  //"2026-01-19T13:37:12.345Z".split("T") >>
                                                  //"2026-01-19",
                                                  //"13:37:12.345Z"
                                                  //[0] = 1. položka z pole(datum)

}
let todaysDate = getToday();
document.getElementById("todaysDate").textContent =todaysDate;