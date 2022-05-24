const STORAGE_KEY = "BOOKSHELF_APPS";
let listData      = [];

function isStorageExist() /* boolean */ {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }

    return true;
}
  
function saveData() {
    const parsed = JSON.stringify(listData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}
  
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data             = JSON.parse(serializedData);
    
    if(data !== null)
        listData = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
}
  
function updateDataToStorage() {
    if(isStorageExist())
        saveData();
}
  
function composeListObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}
  
function findTodo(listId) {
    for(listItem of listData){
        if(listItem.id === listId)
            return listItem;
    }

    return null;
}
  
  
function findTodoIndex(listId) {
    let index = 0
    for (listItem of listData) {
        if(listItem.id === listId)
            return index;
  
        index++;
    }
  
    return -1;
}

function filter() {
    let title, book, i;

    title   = document.getElementById("filter").value.toLowerCase();
    book    = document.getElementsByClassName("rak-buku");

    for(i = 0; i < book.length; i++){
        bookTitle = book[i].getElementsByClassName("rak-buku-judul");

        if (bookTitle[0].innerHTML.toLowerCase().indexOf(title) > -1) {
            book[i].style.display = "block";
        }else{
            book[i].style.display = "none";
        }
    }
}

function refreshDataFromTodos() {
     const listUncomplete = document.getElementById(UNCOMPLETE_READ);
     let   listComplete   = document.getElementById(COMPLETE_READ);
  
     for(listItem of listData){
        const newTodo            = createList(listItem.id, listItem.title, listItem.author, listItem.year, listItem.isComplete);

        newTodo[LIST_ITEM_ID] = listItem.id;
  
        if(listItem.isComplete){
            listComplete.append(newTodo);
        } else {
            listUncomplete.append(newTodo);
        }
    }
}