const app = document.getElementById("app");

app.innerHTML = `
    <div class="header_main">
    <table style="background-color:white;" id="datatable">
        <tr>
            <th><input type="checkbox" name="checkbox" id="select"></th>
            <th> Document names </th>
            <th> Status </th>
            <th> Last Modified </th>
            <th> </th>
            <th></th>
        </tr>
    </table>
</div>
`;
const searchfun = () => {
  const filter = document.getElementById("searchinput").value.toUpperCase();
  const tr = datatable.getElementsByTagName("tr");
  for (var i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      let textvalue = td.textContent || td.innerHTML;
      if (textvalue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

const modal = document.getElementById("myModal");
const addbtn = document.getElementById("addbtn");
const close = document.getElementById("close");
const datatable = document.getElementById("datatable");

addbtn.onclick = function () {
  modal.style.display = "block";
};

close.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

const form = document.getElementById("form");

// submit function
form.onsubmit = function (event) {
  event.preventDefault();

  const tr = document.createElement("tr");

  const tdcheck = document.createElement("td");
  const check = document.createElement("input");
  check.type = "checkbox";
  tdcheck.appendChild(check);
  tr.appendChild(tdcheck);

  const tddata = document.createElement("td");
  let fileInput = document.getElementById("doctitle");
  let fileName =
    fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";
  tddata.textContent = fileName;
  tr.appendChild(tddata);
  fileInput.value = "";

  const tdstatus = document.createElement("td");
  const status = form.status;
  const div = document.createElement("div");

  if (status.value === "Pending") div.className = "pending";
  else if (status.value === "Need Signing") div.className = "need_sign";
  else if (status.value === "Completed") div.className = "completed";

  div.textContent = status.value.trim();
  tdstatus.appendChild(div);
  tr.appendChild(tdstatus);

  const tddate = document.createElement("td");
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleString("en-In", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  let formattedTime = currentDate.toLocaleString("en-In", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  tddate.innerHTML = `${formattedDate}<br>${formattedTime}`;
  tr.appendChild(tddate);

  const tdaction = document.createElement("td");
  const button = document.createElement("button");

  if (status.value === "Pending") button.innerText = "Preview";
  else if (status.value === "Need Signing") button.innerText = "Sign Now";
  else if (status.value === "Completed") button.innerText = "Download PDF";
  button.className = "actionbtn";
  tdaction.append(button);
  tr.appendChild(tdaction);

  const tddel = document.createElement("td");
  const delbtn = document.createElement("button");
  delbtn.className = "delbtn";
  delbtn.innerHTML = `<img src="logo/delete.png" style="height: 15px;width: 15px">`;
  delbtn.classList.add("delete-btn");
  tddel.appendChild(delbtn);
  tr.appendChild(tddel);

  tr.setAttribute("data-id", currentDate.getTime());
  tr.addEventListener("click", delfun);

  datatable.append(tr);

  // Local storage upload data
  const rowData = {
    id: currentDate.getTime(),
    fileName: fileName,
    status: status.value,
    date: `${formattedDate} ${formattedTime}`,
    action: button.innerText,
  };
  saveToLocalStorage(rowData);
  modal.style.display = "none";
};

function delfun(event) {
  if (event.target.closest(".delete-btn")) {
    const row = event.target.closest("tr");
    row.remove();
    removeFromLocalStorage(row);
  }
}

function saveToLocalStorage(data) {
  let documents = JSON.parse(localStorage.getItem("documents")) || [];
  documents.push(data);
  localStorage.setItem("documents", JSON.stringify(documents));
}

// delte funtion 
function removeFromLocalStorage(rowElement) {
  let documents = JSON.parse(localStorage.getItem("documents")) || [];
  const rowId = rowElement.getAttribute("data-id");
  documents = documents.filter((doc) => doc.id !== parseInt(rowId));
  localStorage.setItem("documents", JSON.stringify(documents));
}

//load fro mthe storage
function loadDataFromLocalStorage() {
  let documents = JSON.parse(localStorage.getItem("documents")) || [];
  documents.forEach((doc) => {
    const tr = document.createElement("tr");

    const tdcheck = document.createElement("td");
    const check = document.createElement("input");
    check.type = "checkbox";
    tdcheck.appendChild(check);
    tr.appendChild(tdcheck);

    const tddata = document.createElement("td");
    tddata.textContent = doc.fileName;
    tr.appendChild(tddata);

    const tdstatus = document.createElement("td");
    const div = document.createElement("div");
    div.textContent = doc.status;

    if (doc.status === "Pending") div.className = "pending";
    else if (doc.status === "Need Signing") div.className = "need_sign";
    else if (doc.status === "Completed") div.className = "completed";

    tdstatus.appendChild(div);
    tr.appendChild(tdstatus);

    const tddate = document.createElement("td");

    const date = doc.date.slice(0, 9);
    const time = doc.date.slice(10);

    tddate.innerHTML = `${date}<br>${time}`;
    tr.appendChild(tddate);

    const tdaction = document.createElement("td");
    const button = document.createElement("button");
    button.innerText = doc.action;
    button.className = "actionbtn";
    tdaction.append(button);
    tr.appendChild(tdaction);

    const tddel = document.createElement("td");
    const delbtn = document.createElement("button");
    delbtn.className = "delbtn";
    delbtn.innerHTML = `<img src="logo/delete.png" style="height: 15px;width: 15px">`;
    delbtn.classList.add("delete-btn");
    tddel.appendChild(delbtn);
    tr.appendChild(tddel);
    delbtn.addEventListener("click", delfun);

    tr.setAttribute("data-id", doc.id);
    datatable.append(tr);
  });
}

window.onload = loadDataFromLocalStorage;
