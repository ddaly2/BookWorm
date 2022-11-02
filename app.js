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
               book.thumbnail = undefined;
               document.getElementById(`bookCard${i}`).innerHTML += `<p>No cover available</p>`;
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
     } else {
          e.preventDefault();
          getSearch(e.target);
          getBooks();
          document.getElementById("books").innerHTML = "";
          document.getElementById("searchMessage").innerHTML = `Showing results for: "${searchInfo}"`;
     }
})

//Add filter options to the booksArr
document.getElementById("filter").addEventListener("change", (e) => {
     let filterChoice = e.target.value;
     let ratedHighArr = [];
     let newToOldArr = [];
     console.log(filterChoice);
     if (filterChoice === "newToOld"){
          newToOldArr = [...booksArr];
          let hasPublishedDate = [];
          let hasNoPublishedDate = [];
          for (let i = 0; i < newToOldArr.length; i++) {
               if (newToOldArr[i].publishedDate === undefined){
                    hasNoPublishedDate.push(newToOldArr[i]);
               } else {
                    hasPublishedDate.push(newToOldArr[i]);
               }
          }
          hasPublishedDate.sort((a, b) => {
               return b.publishedDate - a.publishedDate;
          })
          newToOldArr = [...hasPublishedDate, ...hasNoPublishedDate];
          sortResults(newToOldArr);
     } else if(filterChoice === "ratedHigh") {
          //Create new arr so original books arr is untouched
          ratedHighArr = [...booksArr];
          let hasNoRatingArr = [];
          let hasRatingArr = [];
          for (let i = 0; i < ratedHighArr.length; i++) {
               if (ratedHighArr[i].averageRating === undefined){
                    hasNoRatingArr.push(ratedHighArr[i]);
               } else {
                    hasRatingArr.push(ratedHighArr[i]);
               }
          }
          //Sort ratings in descending order
          hasRatingArr.sort((a, b) => {
               return b.averageRating - a.averageRating;
          });
          //Combine newly sorted rating arr with all books that have no rating appended at the end
          ratedHighArr = [...hasRatingArr, ...hasNoRatingArr];
          sortResults(ratedHighArr);
     } 
     
})

const sortResults = (arr) => {
     console.log("called sortResults")
     for (let i = 0; i < arr.length; i++) {
          document.getElementById(`bookCard${i}`).innerHTML = `<h2>${arr[i].title}</h2>`;
          //Double check if the item has a rating
          if (arr[i].averageRating !== undefined) {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: ${arr[i].averageRating}⭐️</p>`;
          } else {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Rating: n/a</p>`;
          }
          //Double check for price info
          if (arr[i].price !== undefined) {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: $${arr[i].price}</p>`;
          } else {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Price: n/a</p>`;
          }
          //Double check for publishedDate
          if (arr[i].publishedDate !== undefined) {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Published: ${arr[i].publishedDate}</p>`;
          } else {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>Published: n/a</p>`;
          }
          //Double check for thumbnail 
          if (arr[i].thumbnail !== undefined) {
               document.getElementById(`bookCard${i}`).innerHTML += `<img src=${arr[i].thumbnail}>`;
          } else {
               document.getElementById(`bookCard${i}`).innerHTML += `<p>No cover available</p>`;
          }
     }    
}

const getSearch = (form) => {
     let formData = new FormData(form);
     for (let item of formData.entries()){
          searchInfo = item[1];
     }
}     


