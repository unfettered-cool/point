const searchForm = document.querySelector("form");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const errorBtn = document.querySelector(".modal-close");
const errorModal = document.getElementById("errorModal");
const searchInput = document.getElementById("mainSearch");
const searchKeyword = document.getElementById("keyword");

function checkValidation(event) {  
  event.preventDefault();
  const searchKey = document.getElementById("mainSearch");
  if(searchKey.value === "" || searchKey.value === undefined || searchKey === null) {
	  raiseError();
	  searchKey.focus();
  } else { 
    fetch( `/search?skey=${searchKey.value}`
    ).then(function(response) {
      return response.json();
    }).then(function(json) {
      searchKey.value = "";
      getResult(json);
    });
  }
}

function getResult(resData) {
  // Init result section
  result.innerText = '';
  // 추후 페이징이 들어갈 경우를 대비
  let tmpData = resData.resultSet;
  const cnt = tmpData.count;
  const data = tmpData.data;
  searchKeyword.innerText = ""
  let titleTag = document.createElement("span");
  titleTag.innerHTML = '검색어 : '
  let keyTag = document.createElement("b");
  keyTag.innerText = tmpData.keyword
  searchKeyword.appendChild(titleTag);
  searchKeyword.appendChild(keyTag);
  if(data.length > 0) {
    data.forEach(function(item){
      let rows = document.createElement("div");
      let cont = document.createElement("div");
      let ans = document.createElement("div");
      rows.className = "columns is-variable is-2"
      cont.innerHTML = item.contents;
      cont.className = "column is-three-quarters contents";
      ans.innerText = item.answer;
      ans.className = "column answer has-text-centered";
      rows.appendChild(cont);
      rows.appendChild(ans);
      result.appendChild(rows);    
    });
  } else {
      let rows = document.createElement("div");
      rows.className = "columns is-centered";
      rows.innerText = "No Result";
      result.appendChild(rows);    
  }
}

function raiseError() {
  errorModal.classList.add("is-active");
}

function closeError() {
  errorModal.classList.remove("is-active");
}

function initSearchForm() {
  document.getElementById("mainSearch").value = "";
}

searchForm.addEventListener("submit",checkValidation)
searchInput.addEventListener("focus",initSearchForm)
searchBtn.addEventListener("click",checkValidation)
errorBtn.addEventListener("click",closeError)
