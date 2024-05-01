const table = document.querySelector(".table");
const api = "https://restcountries.com/v3.1/all";
const input = document.getElementById("search");
const pagination = document.querySelector(".buttons");
const prevBtn = document.getElementById("prev__button");
const nextBtn = document.getElementById("next__button");
const input2 = document.getElementById("page");
const thead = document.querySelector(".thead");
const exportExcel = document.getElementById("export");
let pages = [];
let dataPerPage = 10;
let datas = [];
let paginatedPage = [];
let currentPage = 1;
let lastDataIndex = currentPage * dataPerPage;
let firstDataIndex = lastDataIndex - dataPerPage;

exportExcel.addEventListener("click", () => {
  exportTable(table, "my-file.xls");
});

function exportTable(table, filename = "excel-file.xls") {
  const tableHTML = table.outerHTML.replace(/\s/g, "%20");

  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  const dataType = "application/vnd.ms-excel";

  if (navigator.msSaveOrOpenBlob) {
    const blob = new Blob(["\ufeff", tableHTML], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    downloadLink.href = `data:${dataType}, ${tableHTML}`;
    downloadLink.download = filename;
    downloadLink.click();
  }
}
function setPage() {
  dataPerPage = input2.value;
  lastDataIndex = currentPage * dataPerPage;
  firstDataIndex = lastDataIndex - dataPerPage;
  paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
  for (let i = 0; i < Math.ceil(datas.length / dataPerPage); i++) {
    pages.push(i);
  }
  renderUI(paginatedPage);
}

function get() {
  fetch(`${api}`)
    .then((res) => res.json())
    .then((item) => {
      for (let i = 0; i < item.length; i++) {
        datas.push(item[i]);
        paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
      }
      for (let i = 0; i < Math.ceil(datas.length / dataPerPage); i++) {
        pages.push(i);
      }
      renderUI(paginatedPage);
    });
}
get();

function renderUI(item) {
  let innerText = "";
  for (let i = 0; i < item.length; i++) {
    innerText += `
    <tbody>
    <tr>
    <th scope="row" id="row">${i + 1}</th>
    <td>${item[i].name.common}</td>
    <td>${item[i].name.official}</td>
    <td>${item[i].capital}</td>
    </tr>
    </tbody>
    `;
    thead.innerHTML = innerText;
  }
  let innerHTML = "";
  for (let index = 0; index < pages.length + 1; index++) {
    currentPage == index;
    if (paginatedPage.length == 4) {
      innerHTML += `
      
      <button id="button" class="button selected" onclick="setCurrentPage(this)">${currentPage}</button>
      <button id="button" class="button" onclick="setCurrentPage(this)">${
        parseInt(currentPage) + 1
      }</button>...
      <button id="button" class="button" onclick="setCurrentPage(this)">${parseInt(
        pages[pages.length - 1] + 1
      )}</button>
        `;
      pagination.innerHTML = innerHTML;
      return true;
    }
    if (currentPage == pages[0] + 1) {
      innerHTML += `
      
      <button id="button" class="button selected" onclick="setCurrentPage(this)">${currentPage}</button>
      <button id="button" class="button" onclick="setCurrentPage(this)">${
        parseInt(currentPage) + 1
      }</button>...
      <button id="button" class="button" onclick="setCurrentPage(this)">${parseInt(
        pages[pages.length - 1] + 1
      )}</button>
        `;
      pagination.innerHTML = innerHTML;
      return true;
    } else if (currentPage == pages[1] + 1) {
      innerHTML += `
        
        <button id="button" class="button" onclick="setCurrentPage(this)">${
          parseInt(currentPage) - 1
        }</button>
        <button id="button" class="button selected" onclic1k="setCurrentPage(this)">${currentPage}</button>
        <button id="button" class="button" onclick="setCurrentPage(this)">${
          parseInt(currentPage) + 1
        }</button>...
        <button id="button" class="button" onclick="setCurrentPage(this)">
        ${parseInt(pages[pages.length - 1] + 1)}
        </button>
        `;
      pagination.innerHTML = innerHTML;
      return true;
    } else if (
      currentPage > pages[0] + 1 &&
      currentPage < parseInt(pages[pages.length - 1])
    ) {
      innerHTML += `
          
          <button id="button" class="button" onclick="firstPage()">${
            pages[0] + 1
          }</button>    ...
          <button id="button" class="button" onclick="setCurrentPage(this)">${
            parseInt(currentPage) - 1
          }</button>
          <button id="button" class="button selected" onclick="setCurrentPage(this)">${currentPage}</button>
          
          <button id="button" class="button" onclick="setCurrentPage(this);">${
            parseInt(currentPage) + 1
          }</button>
          ...
          <button id="button" class="button" onclick="setCurrentPage(this)">${parseInt(
            pages[pages.length - 1] + 1
          )}</button>
            `;
      pagination.innerHTML = innerHTML;
      return true;
    } else if (currentPage === parseInt(pages[pages.length - 1])) {
      innerHTML += `
            
            <button id="button" class="button" onclick="firstPage()">${
              pages[0] + 1
            }</button>
            ...
            <button id="button" class="button selected" onclick="setCurrentPage(this)">${currentPage}</button>
            <button id="button" class="button" onclick="setCurrentPage(this)">${parseInt(
              pages[pages.length - 1] + 1
            )}</button>
              `;
      pagination.innerHTML = innerHTML;
      return true;
    } else if ((currentPage = parseInt(pages[pages.length - 1] + 1))) {
      innerHTML += `
              <button id="button" class="button" onclick="firstPage()">${
                pages[0] + 1
              }</button>
              ...
              <button id="button" class="button" onclick="setCurrentPage(this)">${parseInt(
                pages[pages.length - 1]
              )}</button>
                <button id="button" class="button selected" onclick="setCurrentPage()">${parseInt(
                  pages[pages.length - 1] + 1
                )}</button>
                  `;
      pagination.innerHTML = innerHTML;
      return true;
    } else {
      return false;
    }
  }
  pagination.innerHTML = innerHTML;
}

nextBtn.addEventListener("click", (e) => {
  if (currentPage == parseInt(pages.length)) {
    console.log(parseInt(pages.length));
    console.log("a");
    return false;
  } else {
    currentPage++;
    lastDataIndex = currentPage * dataPerPage;
    firstDataIndex = lastDataIndex - dataPerPage;
    paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
    renderUI(paginatedPage);
    return true;
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage == 1) {
    return false;
  } else {
    currentPage--;
    lastDataIndex = currentPage * dataPerPage;
    firstDataIndex = lastDataIndex - dataPerPage;
    paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
    console.log(currentPage);
    renderUI(paginatedPage);
    return true;
  }
});
function setCurrentPage(x) {
  currentPage = parseInt(x.innerHTML);
  lastDataIndex = currentPage * dataPerPage;
  firstDataIndex = lastDataIndex - dataPerPage;
  paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
  console.log(currentPage);
  renderUI(paginatedPage);
}
function firstPage() {
  currentPage = 1;
  lastDataIndex = currentPage * dataPerPage;
  firstDataIndex = lastDataIndex - dataPerPage;
  paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
  renderUI(paginatedPage);
  console.log(currentPage);
}
function lastPage() {
  currentPage = pages[pages.length];
  lastDataIndex = currentPage * dataPerPage;
  firstDataIndex = lastDataIndex - dataPerPage;
  paginatedPage = datas.slice(firstDataIndex, lastDataIndex);
  renderUI(paginatedPage);
  console.log(parseInt(pages[pages.length - 1] + 1));
  console.log(currentPage);
}
input.addEventListener("keydown", (e) => {
  let search = e.target.value;
  fetch(`${api}`)
    .then((res) => res.json())
    .then((data) => {
      let searched = data.filter((item) =>
        item.name.common
          .toLowerCase()
          .trim()
          .includes(search.toLowerCase().trim())
      );
      thead.innerHTML = "";
      renderUI(searched);
    });
});
