let searchInfo = "";
let searched = false;
let booksArr = [];
async function getBooks() {
     const url = `https://www.googleapis.com/books/v1/volumes?q=${searchInfo}`;
     const response = await fetch(url);
     const data = await response.json();

     // Loop thru each piece of response data and create a new book object then push to booksArr
     for(let i = 0; i < data.items.length; i++) {
          document.getElementById("books").innerHTML += `<div id='bookCard${i}'></div>`;
          let book = {
               title: "",
               thumbnail: "",
               pageCount: 0,
               price: 0,
               publishedDate: 0,
               googlePreview: ""
          };

          // Check for title 
          if(data.items[i].volumeInfo.hasOwnProperty("title")) {
               book.title = data.items[i].volumeInfo.title;
               document.getElementById(`bookCard${i}`).innerHTML += `<h2>${book.title}</h2>`;
          } else {
               book.title = "<p>No title available</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.title}`;
          }

          // Check for page count
          if(data.items[i].volumeInfo.hasOwnProperty("pageCount")) {
               book.pageCount = data.items[i].volumeInfo.pageCount;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Page Count: ${book.pageCount}</p>`;
          } else {
               book.pageCount = "<p>No page count available</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.pageCount}`;
          }

          // Check for price USD
          if(data.items[i].saleInfo.hasOwnProperty("listPrice")) {
               book.price = data.items[i].saleInfo.listPrice.amount;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: $${book.price}</p>`;
          } else {
               book.price = "<p>No price data available</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.price}`;
          }

          // Check for published date
          if(data.items[i].volumeInfo.hasOwnProperty("publishedDate")) {
               book.publishedDate = data.items[i].volumeInfo.publishedDate.slice(0, 4);
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Published: ${book.publishedDate}</p>`;
          } else {
               book.publishedDate = "<p>No page count available</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.publishedDate}`;
          }

          
          // Check for thumbnail image link
          if(data.items[i].volumeInfo.hasOwnProperty("imageLinks")) {
               book.thumbnail = data.items[i].volumeInfo.imageLinks.thumbnail;
               document.getElementById(`bookCard${i}`).innerHTML += `<img src=${book.thumbnail} />`;
          } else {
               book.thumbnail = "<p>No cover available</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.thumbnail}`;
          }

          // Add new book object
          booksArr.push(book);
          
     }  
     
}

document.getElementById("searchForm").addEventListener("submit", (e) => {
     if (searched === false) {
          e.preventDefault();
          getSearch(e.target);
          getBooks();
          document.getElementById("searchMessage").innerHTML = `Showing results for: "${searchInfo}"`;
          searched = true;
          console.log(searchInfo);
     } else {
          e.preventDefault();
          getSearch(e.target);
          getBooks();
          document.getElementById("books").innerHTML = "";
          document.getElementById("searchMessage").innerHTML = `Showing results for: "${searchInfo}"`;
          console.log(searchInfo);
     }
})

const getSearch = (form) => {
     let formData = new FormData(form);
     for (let item of formData.entries()){
          searchInfo = item[1];
     }
}     


