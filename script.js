document.addEventListener("DOMContentLoaded", function () {
  let titleInput = document.querySelector("#title");
  let authorInput = document.querySelector("#author");
  let genreInput = document.querySelector("#genre");
  let yearInput = document.querySelector("#year");
  let statusInput = document.querySelector("#status");

  let searchTitleInput = document.querySelector("#searchTitle");
  let searchAuthorInput = document.querySelector("#searchAuthor");
  let searchGenreInput = document.querySelector("#searchGenre");
  let searchYearInput = document.querySelector("#searchYear");
  let searchStatusInput = document.querySelector("#searchStatus");

  let addBookBtn = document.querySelector("#addBookBtn");
  let searchBtn = document.querySelector("#searchBtn");
  let allBooks = document.querySelector("#allBooks");
  let deletedBooksSection = document.querySelector("#deletedBooks");
  let readBooksSection = document.querySelector("#readBooks");
  let viewReadBooksBtn = document.querySelector("#viewReadBooksBtn");
  let viewDeletedBooksBtn = document.querySelector("#viewDeletedBooksBtn");
  let refreshBtn = document.querySelector("#refreshBtn");
  let clearAllBtn = document.querySelector("#clearAllBtn");

  let addBookMainInput = document.querySelector("#addBookMainInput");
  let searchBookMainInput = document.querySelector("#searchBookMainInput");
  let addBookNestedInputs = document.querySelector("#addBookNestedInputs");
  let searchBookNestedInputs = document.querySelector(
    "#searchBookNestedInputs"
  );

  let wholeList = {
    newBooks: [],
    readBooks: [],
    deletedBooks: [],
  };

  addBookMainInput.addEventListener("click", () => {
    addBookNestedInputs.style.display =
      addBookNestedInputs.style.display === "flex" ? "none" : "flex";
    searchBookNestedInputs.style.display = "none";
  });

  searchBookMainInput.addEventListener("click", () => {
    searchBookNestedInputs.style.display =
      searchBookNestedInputs.style.display === "flex" ? "none" : "flex";
    addBookNestedInputs.style.display = "none";
  });

  addBookBtn.addEventListener("click", () => {
    addNewBook();
    closeInputFields();
    scrollToLastBook();
  });
  searchBtn.addEventListener("click", () => {
    searchBooks();
    closeInputFields();
  });
  viewReadBooksBtn.addEventListener("click", () => { 
    clearPage();
    toggleReadBooks();
  
  });
  viewDeletedBooksBtn.addEventListener("click", () => { 
    clearPage();
    toggleDeletedBooks();
  });
  refreshBtn.addEventListener("click", refreshBooks);
  clearAllBtn.addEventListener("click", clearAllBooks);

  loadBooksFromLocalStorage();

  function addNewBook() {
    const bookData = {
      title: titleInput.value.trim(),
      author: authorInput.value.trim(),
      genre: genreInput.value.trim(),
      year: yearInput.value.trim(),
      status: statusInput.value === "read" ? true : false,
    };

    if (bookData.title || bookData.author || bookData.genre || bookData.year) {
      const newBookElm = createBookElement(bookData);
      wholeList.newBooks.push(bookData);

      titleInput.value = "";
      authorInput.value = "";
      genreInput.value = "";
      yearInput.value = "";
      statusInput.value = "unread";

      allBooks.appendChild(newBookElm);
      saveBooksToLocalStorage();
      updateBookCount();
    } else {
      alert("Заполните хотя бы одно поле для добавления книги!");
    }
  }

  function createBookElement(bookData) {
    const bookContainer = document.createElement("div");
    bookContainer.className = "book";
    if (bookData.status) {
      bookContainer.classList.add("read");
    }

    const titleLabel = document.createElement("div");
    titleLabel.className = "label";
    titleLabel.textContent = "Название";
    const title = document.createElement("input");
    title.className = "booktext";
    title.type = "text";
    title.value = bookData.title;
    title.readOnly = true;

    const authorLabel = document.createElement("div");
    authorLabel.className = "label";
    authorLabel.textContent = "Автор";
    const author = document.createElement("input");
    author.className = "booktext";
    author.type = "text";
    author.value = bookData.author;
    author.readOnly = true;

    const genreLabel = document.createElement("div");
    genreLabel.className = "label";
    genreLabel.textContent = "Жанр";
    const genre = document.createElement("input");
    genre.className = "booktext";
    genre.type = "text";
    genre.value = bookData.genre;
    genre.readOnly = true;

    const yearLabel = document.createElement("div");
    yearLabel.className = "label";
    yearLabel.textContent = "Год издания";
    const year = document.createElement("input");
    year.className = "booktext";
    year.type = "number";
    year.value = bookData.year;
    year.readOnly = true;

    const statusLabel = document.createElement("div");
    statusLabel.className = "label";
    statusLabel.textContent = "Статус";
    const status = document.createElement("input");
    status.className = "booktext";
    status.type = "text";
    status.value = bookData.status ? "Прочитано" : "Не прочитано";
    status.readOnly = true;

    const editBtn = document.createElement("button");
    editBtn.className = "bookbtn";
    editBtn.textContent = "Редактировать";
    editBtn.addEventListener("click", () =>
      handleEditBook(bookContainer, bookData)
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "bookbtn";
    deleteBtn.textContent = "Удалить";
    deleteBtn.addEventListener("click", () =>
      handleDeleteBook(bookContainer, bookData)
    );

    const statusBtn = document.createElement("button");
    statusBtn.className = "bookbtn";
    statusBtn.textContent = bookData.status ? "Не прочитано" : "Прочитано";
    statusBtn.addEventListener("click", () =>
      handleStatusChange(bookContainer, bookData, statusBtn, status)
    );

    bookContainer.append(
      titleLabel,
      title,
      authorLabel,
      author,
      genreLabel,
      genre,
      yearLabel,
      year,
      statusLabel,
      status,
      editBtn,
      deleteBtn,
      statusBtn
    );
    return bookContainer;
  }

  function searchBooks() {
    const searchTitle = searchTitleInput.value.toLowerCase();
    const searchAuthor = searchAuthorInput.value.toLowerCase();
    const searchGenre = searchGenreInput.value.toLowerCase();
    const searchYear = searchYearInput.value;
    const searchStatus = searchStatusInput.value.toLowerCase();

    const filteredBooks = wholeList.newBooks.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(searchTitle);
      const authorMatch = book.author.toLowerCase().includes(searchAuthor);
      const genreMatch = book.genre.toLowerCase().includes(searchGenre);
      const yearMatch = searchYear === "" || book.year === searchYear;
      const statusMatch =
        searchStatus === "" ||
        (searchStatus === "read" && book.status) ||
        (searchStatus === "unread" && !book.status);

      return (
        titleMatch && authorMatch && genreMatch && yearMatch && statusMatch
      );
    });

    allBooks.innerHTML = "";
    filteredBooks.forEach((book) =>
      allBooks.appendChild(createBookElement(book))
    );
  }

  function handleEditBook(container, bookData) {
    const inputs = container.querySelectorAll(".booktext");
    const isEditable = inputs[0].readOnly;

    inputs.forEach((input) => (input.readOnly = !isEditable));

    const editBtn = Array.from(container.querySelectorAll(".bookbtn")).find(
      (btn) =>
        btn.textContent === "Редактировать" || btn.textContent === "Сохранить"
    );
    editBtn.textContent = isEditable ? "Сохранить" : "Редактировать";

    if (!isEditable) {
      bookData.title = inputs[0].value;
      bookData.author = inputs[1].value;
      bookData.genre = inputs[2].value;
      bookData.year = inputs[3].value;
      saveBooksToLocalStorage();
    }
  }

  function handleDeleteBook(container, bookData) {
    wholeList.newBooks = wholeList.newBooks.filter(
      (book) => book.title !== bookData.title
    );
    wholeList.deletedBooks.push(bookData);
    container.remove();
    saveBooksToLocalStorage();
    updateBookCount();
  }

  function handleStatusChange(container, bookData, statusBtn, status) {
    bookData.status = !bookData.status;
    status.value = bookData.status ? "Прочитано" : "Не прочитано";
    statusBtn.textContent = bookData.status ? "Не прочитано" : "Прочитано";
    container.classList.toggle("read");
    saveBooksToLocalStorage();
  }

  function loadBooksFromLocalStorage() {
    const storedList = JSON.parse(localStorage.getItem("libraryBooks"));
    if (storedList && typeof storedList === "object" && storedList.newBooks) {
      wholeList = storedList;
      refreshBooks();
    }
  }

  function saveBooksToLocalStorage() {
    localStorage.setItem("libraryBooks", JSON.stringify(wholeList));
  }

  function refreshBooks() {
    allBooks.innerHTML = "";
    if (wholeList.newBooks.length === 0) {
      allBooks.innerHTML = "";
    } else {
      wholeList.newBooks.forEach((book) =>
        allBooks.appendChild(createBookElement(book))
      );
    }
    readBooksSection.style.display = "none";
    deletedBooksSection.style.display = "none";
    allBooks.style.display = "flex";
    updateBookCount();
  }

  function clearAllBooks() {
    wholeList.newBooks = [];
    wholeList.readBooks = [];
    wholeList.deletedBooks = [];
    allBooks.innerHTML = "";
    readBooksSection.innerHTML = "";
    deletedBooksSection.innerHTML = "";
    saveBooksToLocalStorage();
    updateBookCount();
  }

  function toggleReadBooks() {
    allBooks.innerHTML = "";
    readBooksSection.innerHTML = "";
    const readBooks = wholeList.newBooks.filter((book) => book.status);
    readBooks.forEach((book) =>
      readBooksSection.appendChild(createBookElement(book))
    );
    readBooksSection.style.display = "flex";
    allBooks.style.display = "none";
  }

  function toggleDeletedBooks() {
    allBooks.innerHTML = "";
    deletedBooksSection.innerHTML = "";
    wholeList.deletedBooks.forEach((book) =>
      deletedBooksSection.appendChild(createDeletedBookElement(book))
    );
    deletedBooksSection.style.display = "flex";
    allBooks.style.display = "none";
  }

  function createDeletedBookElement(bookData) {
    const bookContainer = document.createElement("div");
    bookContainer.className = "book";

    const titleLabel = document.createElement("div");
    titleLabel.className = "label";
    titleLabel.textContent = "Название";
    const title = document.createElement("input");
    title.className = "booktext";
    title.type = "text";
    title.value = bookData.title;
    title.readOnly = true;

    const authorLabel = document.createElement("div");
    authorLabel.className = "label";
    authorLabel.textContent = "Автор";
    const author = document.createElement("input");
    author.className = "booktext";
    author.type = "text";
    author.value = bookData.author;
    author.readOnly = true;

    const genreLabel = document.createElement("div");
    genreLabel.className = "label";
    genreLabel.textContent = "Жанр";
    const genre = document.createElement("input");
    genre.className = "booktext";
    genre.type = "text";
    genre.value = bookData.genre;
    genre.readOnly = true;

    const yearLabel = document.createElement("div");
    yearLabel.className = "label";
    yearLabel.textContent = "Год издания";
    const year = document.createElement("input");
    year.className = "booktext";
    year.type = "number";
    year.value = bookData.year;
    year.readOnly = true;

    const statusLabel = document.createElement("div");
    statusLabel.className = "label";
    statusLabel.textContent = "Статус";
    const status = document.createElement("input");
    status.className = "booktext";
    status.type = "text";
    status.value = bookData.status ? "Прочитано" : "Не прочитано";
    status.readOnly = true;

    const restoreBtn = document.createElement("button");
    restoreBtn.className = "bookbtn";
    restoreBtn.textContent = "Восстановить";
    restoreBtn.addEventListener("click", () => handleRestoreBook(bookData));

    const deleteForeverBtn = document.createElement("button");
    deleteForeverBtn.className = "bookbtn";
    deleteForeverBtn.textContent = "Удалить навсегда";
    deleteForeverBtn.addEventListener("click", () =>
      handlePermanentDelete(bookContainer, bookData)
    );

    bookContainer.append(
      titleLabel,
      title,
      authorLabel,
      author,
      genreLabel,
      genre,
      yearLabel,
      year,
      statusLabel,
      status,
      restoreBtn,
      deleteForeverBtn
    );
    return bookContainer;
  }

  function handleRestoreBook(bookData) {
    wholeList.deletedBooks = wholeList.deletedBooks.filter(
      (book) => book.title !== bookData.title
    );
    wholeList.newBooks.push(bookData);
    refreshBooks();
    saveBooksToLocalStorage();
    updateBookCount();
  }

  function handlePermanentDelete(container, bookData) {
    wholeList.deletedBooks = wholeList.deletedBooks.filter(
      (book) => book.title !== bookData.title
    );
    container.remove();
    saveBooksToLocalStorage();
    updateBookCount();
  }

  function updateBookCount() {
    const bookCountElement = document.getElementById("bookCount");
    bookCountElement.textContent = `Количество книг: ${wholeList.newBooks.length}`;
  }
  function closeInputFields() {
    addBookNestedInputs.style.display = "none";
    searchBookNestedInputs.style.display = "none";
  }

  function scrollToLastBook() {
    const lastBook = allBooks.lastElementChild;
    if (lastBook) {
      lastBook.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  function clearPage() {
    allBooks.innerHTML = "";
    readBooksSection.innerHTML = "";
    deletedBooksSection.innerHTML = "";
  }
});
