const API_BASE_URL = "https://digital-catalogue-library-backend.onrender.com";

async function loadBooks() {
  const container = document.querySelector(".book-container");
  if (!container) return;

  container.innerHTML = "<p>Loading books...</p>";

  try {
    const res = await fetch(`${API_BASE_URL}/api/books`);
    if (!res.ok) {
      throw new Error("Failed to load books");
    }
    const books = await res.json();

    if (!books.length) {
      container.innerHTML = "<p>No books found in the catalogue.</p>";
      return;
    }

    container.innerHTML = "";
    books.forEach((book) => {
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <img src="${book.image_url || "../assets/book1.jpg"}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <button type="button">Borrow</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Could not load books from the server.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadBooks);


