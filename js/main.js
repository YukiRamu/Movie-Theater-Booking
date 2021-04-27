/* Variables */
//opening animation
const droptexts = document.querySelectorAll(".drops span");
console.log(droptexts);
const bigger = document.querySelector(".bigger");
console.log(bigger);

//search box
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");

//API
const baseURL = "https://api.themoviedb.org";
//const parameter = "/3/movie/"; //specify movie
const APIKey = "a9bfb23ff39a5cefa92aae8e6858a3b2";

/* Fetch Data -- TMDB */
//to fetch a list of movies based on a keyword
//https://api.themoviedb.org/3/search/movie?api_key=a9bfb23ff39a5cefa92aae8e6858a3b2&query=jurassic

const getMovieList = (keyword) => {
  fetch(`${baseURL}/3/search/movie?api_key=${APIKey}&query=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch data`);
      return error;
    });
}


/* Function Call */
//When the search button is clicked, get a list of movies based on a keyword
searchBtn.addEventListener("click", () => {
  //validation check
  
  getMovieList(search.value);
})

/* ============== Animation function  ============== */
//#1 dropping text animation
let dropTextsArray = [];
Array.from(droptexts).forEach(elem => {
  dropTextsArray.push(elem.innerHTML);
});

let index = 0;
const windowOpen = () => {
  droptexts[index].classList.add("show"); //add class to all span tags one by one
  index++;
  if (index === droptexts.length) {
    complete(timer);
  }
}
//#2 ScaleUp animation
let index2 = 0;
const scaleUp = () => {
  droptexts[index2].classList.add("scaleUp"); //add class to all span tags one by one
  index2++;
  if (index2 === droptexts.length) {
    complete(timer2);
  }
}
//#3 ZoomIn animation
let index3 = 0;
const showText = () => {
  bigger.classList.add("show"); //add class to all span tags one by one
  index3++;
  complete(timer3);
}

const complete = (timerName) => {
  clearInterval(timerName);
  timerName = null;
}
let timer = setInterval(windowOpen, 100);
let timer2 = setInterval(scaleUp, 200);
let timer3 = setInterval(showText, 800);
