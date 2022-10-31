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
               averageRating: 0,
               price: 0,
               publishedDate: 0,
               googlePreview: ""
          };

          // Check for title 
          if(data.items[i].volumeInfo.hasOwnProperty("title")) {
               book.title = data.items[i].volumeInfo.title;
               document.getElementById(`bookCard${i}`).innerHTML += `<h2>${book.title}</h2>`;
          } else {
               book.title = "<p>Title: n/a</p>";
               document.getElementById(`bookCard${i}`).innerHTML += `${book.title}`;
          }

          // Check for page count
          if(data.items[i].volumeInfo.hasOwnProperty("averageRating")) {
               book.averageRating = data.items[i].volumeInfo.averageRating;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: ${book.averageRating}⭐️</p>`;
          } else {
               book.averageRating = undefined;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: n/a</p>`;
          }

          // Check for price USD
          if(data.items[i].saleInfo.hasOwnProperty("listPrice")) {
               book.price = data.items[i].saleInfo.listPrice.amount;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: $${book.price}</p>`;
          } else {
               book.price = undefined;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: n/a</p>`;
          }

          // Check for published date
          if(data.items[i].volumeInfo.hasOwnProperty("publishedDate")) {
               book.publishedDate = data.items[i].volumeInfo.publishedDate.slice(0, 4);
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Published: ${book.publishedDate}</p>`;
          } else {
               book.publishedDate = "<p>Published: n/a</p>";
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

// Search for any book info and retrieve it from Google API
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

//Add filter options to the booksArr
document.getElementById("filter").addEventListener("change", (e) => {
     let filterChoice = e.target.value;
     console.log(filterChoice);
     if(filterChoice === "ratedHigh") {
          booksArr.sort((a, b) => {
               return b.averageRating - a.averageRating;
          });
          
          for (let i = 0; i < booksArr.length; i++) {
               console.log(booksArr[i].averageRating);
               document.getElementById(`bookCard${i}`).innerHTML = `<h2>${booksArr[i].title}</h2>`;
               //Double check if the item has a rating
               if (booksArr[i].averageRating !== undefined) {
                    document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: ${booksArr[i].averageRating}⭐️</p>`;
               } else {
                    document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: n/a</p>`;
               }
               //Double check for price info
               if (booksArr[i].price !== undefined) {
                    document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: $${booksArr[i].price}</p>`;
               } else {
                    document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: n/a</p>`;
               }
               
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Published: ${booksArr[i].publishedDate}</p>`;
               document.getElementById(`bookCard${i}`).innerHTML += `<img src=${booksArr[i].thumbnail} />`;
          }
     }
     
})

const getSearch = (form) => {
     let formData = new FormData(form);
     for (let item of formData.entries()){
          searchInfo = item[1];
     }
}     


