const UNCOMPLETE_READ   = "uncomplete-read";
const COMPLETE_READ     = "complete-read";
const LIST_ITEM_ID      = "itemId";

// Generate ID
function unikid(length) {
    let result           = '';
    let characters       = '0123456789abcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


// Added List
function addList () {

    // Element ID
    const uncompleteRead    = document.getElementById(UNCOMPLETE_READ);
    const listComplete      = document.getElementById(COMPLETE_READ);

    // Element Input
    const bookTitle         = document.getElementById("judul_buku").value;
    const bookWriter        = document.getElementById("penulis_buku").value;
    const publicationYear   = document.getElementById("tahun_terbit").value;

    // Element
    const checkbox          = document.getElementById("isComplete");

    const rak = {
        id         : unikid(10),
        title      : bookTitle,
        author     : bookWriter,
        year       : publicationYear,
        isComplete : checkbox.checked
    };

    console.log(rak);
    console.log("id             : " + rak.id);
    console.log("Judul          : " + rak.title);
    console.log("Penulis Buku   : " + rak.author);
    console.log("Tahun Terbit   : " + rak.year);
    console.log("isComplete     : " + rak.isComplete);

    if (checkbox.checked) {
        const list       = createList(rak.id, rak.title, rak.author, rak.year, rak.isComplete);
        const listObject = composeListObject(rak.id, rak.title, rak.author, rak.year, rak.isComplete);

        list[LIST_ITEM_ID] = listObject.id;
        listData.push(listObject);

        checkbox.checked = true;
        listComplete.append(list);
    }else{
        const list       = createList(rak.id, rak.title, rak.author, rak.year, rak.isComplete);
        const listObject = composeListObject(rak.id, rak.title, rak.author, rak.year, rak.isComplete);

        list[LIST_ITEM_ID] = listObject.id;
        listData.push(listObject);

        checkbox.checked = false;
        uncompleteRead.append(list);
    }

    updateDataToStorage();
}


// Make List
function createList (idBuku, judulBuku, penulisBuku, tahunTerbit, isComplete){

    const judul         = document.createElement("h1");
    judul.classList.add("rak-buku-judul");
    judul.innerText     = judulBuku;

    const idBook        = document.createElement("h4");
    idBook.innerText    = idBuku;

    const penulis       = document.createElement("h5");
    penulis.innerText   = penulisBuku;
 
    const tahun         = document.createElement("h6");
    tahun.innerText     = tahunTerbit;

    const kotak         = document.createElement("div");
    kotak.classList.add("rak-buku", "p-1");
    kotak.append(judul, idBook, penulis, tahun);

    if(isComplete){
        kotak.append(createButtonUndo(), createButtonDelete());
    }else {
        kotak.append(createButtonComplete(), createButtonDelete());
    }

    return kotak;
}


// Make Button Complete Read
function createButtonComplete () {
    return createButton("btn-success", "Selesai Baca", function(event){
        addToCompleteRead(event.target.parentElement);
    });
}


// Make Button Undo Read
function createButtonUndo () {
    return createButton("btn-success", "Belum Selesai Baca", function(event){
        undoCompleteRead(event.target.parentElement);
    });
}


// Make Button Delete
function createButtonDelete () {
    return createButton("btn-danger", "Hapus Buku", function(event){
        removeBook(event.target.parentElement);
    });
}


// Make All This Button
function createButton(buttonTypeClass, valueButton, eventListener) {
    const button     = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = valueButton;
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}


// The Complete List Read
function addToCompleteRead (bookElement) {
    const listComplete  = document.getElementById(COMPLETE_READ);
    const judul         = bookElement.querySelector(".rak-buku > h1").innerText;
    const id            = bookElement.querySelector(".rak-buku > h4").innerText;
    const penulis       = bookElement.querySelector(".rak-buku > h5").innerText;
    const tahun         = bookElement.querySelector(".rak-buku > h6").innerText;

    const newList       = createList(id, judul, penulis, tahun, true);

    const todo            = findTodo(bookElement[LIST_ITEM_ID]);
    todo.isComplete       = true;
    newList[LIST_ITEM_ID] = todo.id;

    listComplete.append(newList);
    bookElement.remove();

    updateDataToStorage();
}


// Undo Complete List Read
function undoCompleteRead (bookElement) {
    const listUnComplete = document.getElementById(UNCOMPLETE_READ);
    const judul          = bookElement.querySelector(".rak-buku > h1").innerText;
    const id             = bookElement.querySelector(".rak-buku > h4").innerText;
    const penulis        = bookElement.querySelector(".rak-buku > h5").innerText;
    const tahun          = bookElement.querySelector(".rak-buku > h6").innerText;

    const newList        = createList(id, judul, penulis, tahun, false);

    const todo            = findTodo(bookElement[LIST_ITEM_ID]);
    todo.isComplete       = false;
    newList[LIST_ITEM_ID] = todo.id;

    listUnComplete.append(newList);
    bookElement.remove();

    updateDataToStorage();
}


// Remove List
function removeBook(bookElement) {

    let alert = confirm("Apakah Anda Yakin Ingin Menghapus Data Ini?");

    if (alert == true) {
        bookElement.remove();

        const todoPosition = findTodoIndex(bookElement[LIST_ITEM_ID]);
        listData.splice(todoPosition, 1);

        updateDataToStorage();
    }
}