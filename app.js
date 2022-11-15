let searchInfo = "";
let searched = false;
let booksArr;


async function getBooks() {
     const url = `https://www.googleapis.com/books/v1/volumes?q=${searchInfo}`;
     const response = await fetch(url);
     const data = await response.json();

     // Loop thru each piece of response data and create a new book object then push to booksArr
     for(let i = 0; i < data.items.length; i++) {
          
          let book = {
               title: "",
               thumbnail: "",
               averageRating: 0,
               price: 0,
               publishedDate: 0,
               previewLink: "",
               description: ""
          };

          //Check for previewLink 
          if(data.items[i].volumeInfo.hasOwnProperty("previewLink")) {
               book.previewLink = data.items[i].volumeInfo.previewLink;
               document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink' href='${book.previewLink}' target='_blank'></a>`;
          } else {
               document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink' href='#' target='_blank'></a>`;
          }
          
          

          //Create container Div that will hold the front and back content of the card
          document.getElementById(`bookLink${i}`).innerHTML += `<div id='bookCardContainer${i}' class='bookCardContainer'></div>`;

          //Create card front and back DOM elements
          document.getElementById(`bookCardContainer${i}`).innerHTML += `<div id='bookCardFront${i}' class='bookCardFront'></div>`;
          document.getElementById(`bookCardContainer${i}`).innerHTML += `<div id='bookCardBack${i}' class='bookCardBack'></div>`;
          
          //Check for description
          if(data.items[i].volumeInfo.description !== undefined) {
               book.description = data.items[i].volumeInfo.description;
               document.getElementById(`bookCardBack${i}`).innerHTML += `<p class="bookDescription">${book.description.substring(0, 300)}</p>`;
          } else {
               document.getElementById(`bookCardBack${i}`).innerHTML += "<p class='bookDescription'>No description available</p>"
          }

          // Check for title 
          if(data.items[i].volumeInfo.hasOwnProperty("title")) {
               book.title = data.items[i].volumeInfo.title;
               document.getElementById(`bookCardFront${i}`).innerHTML += `<h2 class="book-title">${book.title}</h2>`;
          } else {
               book.title = "<p>Title: n/a</p>";
               document.getElementById(`bookCardFront${i}`).innerHTML += `${book.title}`;
          }

          document.getElementById(`bookCardFront${i}`).innerHTML += `<div id="book-info-grid" class="book-info-grid">
               <div id="book-stats${i}" class="book-stats"></div>
               <div id="book-img${i}" class="book-img"></div>
          </div>`;





          // Check for page count
          if(data.items[i].volumeInfo.hasOwnProperty("averageRating")) {
               book.averageRating = data.items[i].volumeInfo.averageRating;
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Rating: ${book.averageRating}⭐️</p>`;
          } else {
               book.averageRating = undefined;
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Rating: n/a</p>`;
          }

          // Check for price USD
          if(data.items[i].saleInfo.hasOwnProperty("listPrice")) {
               book.price = data.items[i].saleInfo.listPrice.amount;
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Price: $${book.price}</p>`;
          } else {
               book.price = undefined;
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Price: n/a</p>`;
          }

          // Check for published date
          if(data.items[i].volumeInfo.hasOwnProperty("publishedDate")) {
               book.publishedDate = data.items[i].volumeInfo.publishedDate.slice(0, 4);
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Published: ${book.publishedDate}</p>`;
          } else {
               book.publishedDate = "<p>Published: n/a</p>";
               document.getElementById(`book-stats${i}`).innerHTML += `${book.publishedDate}`;
          }

          // Check for thumbnail image link
          if(data.items[i].volumeInfo.hasOwnProperty("imageLinks")) {
               book.thumbnail = data.items[i].volumeInfo.imageLinks.thumbnail;
               document.getElementById(`book-img${i}`).innerHTML += `<img src=${book.thumbnail} />`;
          } else {
               book.thumbnail = undefined;
               document.getElementById(`book-img${i}`).innerHTML += `<p>No cover available</p>`;
          }

          // Add new book object
          booksArr.push(book);
          
     }  
     
}

//Capture what the user entered into the search bar
const getSearch = (form) => {
     let formData = new FormData(form);
     for (let item of formData.entries()){
          searchInfo = item[1];
     }
}     


// Search for any book info and retrieve it from Google API
document.getElementById("searchForm").addEventListener("submit", (e) => {
     //Initialize booksArr as a new empty arr everytime the search button is clicked to reset what books the filters will apply to
     booksArr = [];
     document.getElementById("filter").innerHTML = `
          <option value="none">None</option>
          <option value="newToOld">Newest first</option>
          <option value="ratedHigh">Highest rated</option>
          <option value="ratedLow">Lowest rated</option>
          <option value="expensive">Price high - low</option>
          <option value="cheap">Price low - high</option>`;
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
     let newToOldArr = [];
     let ratedHighArr = [];
     let ratedLowArr = [];
     let expensiveArr = [];
     let cheapArr = [];
     
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
     } else if(filterChoice === "ratedLow") {
          //Create new arr so original books arr is untouched
          ratedLowArr = [...booksArr];
          let hasNoRatingArr = [];
          let hasRatingArr = [];
          for (let i = 0; i < ratedLowArr.length; i++) {
               if (ratedLowArr[i].averageRating === undefined){
                    hasNoRatingArr.push(ratedLowArr[i]);
               } else {
                    hasRatingArr.push(ratedLowArr[i]);
               }
          }
          //Sort ratings in descending order
          hasRatingArr.sort((a, b) => {
               return a.averageRating - b.averageRating;
          });
          //Combine newly sorted rating arr with all books that have no rating appended at the end
          ratedLowArr = [...hasNoRatingArr, ...hasRatingArr];
          sortResults(ratedLowArr);
     } else if(filterChoice === "expensive") {
          //Create new arr so original books arr is untouched
          expensiveArr = [...booksArr];
          let hasNoPriceArr = [];
          let hasPriceArr = [];
          for (let i = 0; i < expensiveArr.length; i++) {
               if (expensiveArr[i].price === undefined){
                    hasNoPriceArr.push(expensiveArr[i]);
               } else {
                    hasPriceArr.push(expensiveArr[i]);
               }
          }
          //Sort ratings in descending order
          hasPriceArr.sort((a, b) => {
               return b.price - a.price;
          });
          //Combine newly sorted rating arr with all books that have no rating appended at the end
          expensiveArr = [...hasPriceArr, ...hasNoPriceArr];
          sortResults(expensiveArr);
     } else if(filterChoice === "cheap") {
          //Create new arr so original books arr is untouched
          cheapArr = [...booksArr];
          let hasNoPriceArr = [];
          let hasPriceArr = [];
          for (let i = 0; i < cheapArr.length; i++) {
               if (cheapArr[i].price === undefined){
                    hasNoPriceArr.push(cheapArr[i]);
               } else {
                    hasPriceArr.push(cheapArr[i]);
               }
          }
          //Sort ratings in descending order
          hasPriceArr.sort((a, b) => {
               return a.price - b.price;
          });
          //Combine newly sorted rating arr with all books that have no rating appended at the end
          cheapArr = [...hasNoPriceArr, ...hasPriceArr];
          sortResults(cheapArr);
     } else if (filterChoice === "none"){
          sortResults(booksArr);
     }
});

document.getElementById("clearFilters").addEventListener("click", (e) => {
     document.getElementById("filter").innerHTML = `
     <option value="none">None</option>
     <option value="newToOld">Newest first</option>
     <option value="ratedHigh">Highest rated</option>
     <option value="ratedLow">Lowest rated</option>
     <option value="expensive">Price high - low</option>
     <option value="cheap">Price low - high</option>`;
     sortResults(booksArr);
})

const sortResults = (arr) => {
     
     for (let i = 0; i < arr.length; i++) {


          //If the filter has been applied, make the books Div empty --> "". This fixed the issue with the wrong links following the wrong cards
          if(i === 0) {
               document.getElementById("books").innerHTML = "";
               if(arr[i].previewLink !== undefined) {
                    document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink test' href='${arr[i].previewLink}' target='_blank'></a>`;
               } else {
                    document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink' href='#' target='_blank'></a>`;
               }
          } else {
               if(arr[i].previewLink !== undefined) {
                    document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink test' href='${arr[i].previewLink}' target='_blank'></a>`;
               } else {
                    document.getElementById("books").innerHTML += `<a id='bookLink${i}' class='bookLink' href='#' target='_blank'></a>`;
               }
          }

          //--------------------------

          //Create container Div that will hold the front and back content of the card
          document.getElementById(`bookLink${i}`).innerHTML += `<div id='bookCardContainer${i}' class='bookCardContainer'></div>`;

          //Create card front and back DOM elements
          document.getElementById(`bookCardContainer${i}`).innerHTML += `<div id='bookCardFront${i}' class='bookCardFront'></div>`;
          document.getElementById(`bookCardContainer${i}`).innerHTML += `<div id='bookCardBack${i}' class='bookCardBack'></div>`;

          //Create container for book information inside of bookCardFront
          if(i === 0) {
               document.getElementById(`bookCardFront${i}`).innerHTML = "";
               //Add Title to bookCardFront
               document.getElementById(`bookCardFront${i}`).innerHTML = `<h2 class="book-title">${arr[i].title}</h2>`;
               //Add book info grid
               document.getElementById(`bookCardFront${i}`).innerHTML += `<div id="book-info-grid${i}" class="book-info-grid">
                    <div id="book-stats${i}" class="book-stats"></div>
                    <div id="book-img${i}" class="book-img"></div>
               </div>`;
          } else {
               //Add Title to bookCardFront
               document.getElementById(`bookCardFront${i}`).innerHTML = `<h2 class="book-title">${arr[i].title}</h2>`;
               //Add book info grid
               document.getElementById(`bookCardFront${i}`).innerHTML += `<div id="book-info-grid${i}" class="book-info-grid">
                    <div id="book-stats${i}" class="book-stats"></div>
                    <div id="book-img${i}" class="book-img"></div>
               </div>`;
          }
          
          //--------------------------
          
          //Check for description and add to bookCardBack
          if(arr[i].description !== undefined) {
               document.getElementById(`bookCardBack${i}`).innerHTML = `<p class="bookDescription">${arr[i].description.substring(0, 300)}</p>`;
          } else {
               document.getElementById(`bookCardBack${i}`).innerHTML = "<p class='bookDescription'>No description available</p>"
          }

          //Double check if the item has a rating
          if (arr[i].averageRating !== undefined) {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Rating: ${arr[i].averageRating}⭐️</p>`;
          } else {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Rating: n/a</p>`;
          }
          //Double check for price info
          if (arr[i].price !== undefined) {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Price: $${arr[i].price}</p>`;
          } else {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Price: n/a</p>`;
          }
          //Double check for publishedDate
          if (arr[i].publishedDate !== undefined) {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Published: ${arr[i].publishedDate}</p>`;
          } else {
               document.getElementById(`book-stats${i}`).innerHTML += `<p>Published: n/a</p>`;
          }
          //Double check for thumbnail 
          if (arr[i].thumbnail !== undefined) {
               document.getElementById(`book-img${i}`).innerHTML += `<img src=${arr[i].thumbnail}>`;
          } else {
               document.getElementById(`book-img${i}`).innerHTML += `<p>No cover available</p>`;
          }
     }    
}



