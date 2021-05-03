//variables --> to be moved to variable.js
const tagline = document.querySelector(".tagline");
const taglineSection = document.querySelector(".taglineSection");
const backdropRow = document.querySelector(".backdropRow");
const titlePanel = document.querySelector(".titlePanel");

//get movie component from localstorage
let movieComponent = JSON.parse(localStorage.getItem("movieComponent"));
console.log("movie component is ", movieComponent);

//get URL parameter (movieId)
let movieIdfromURL = location.search.slice(9); //get parameter from url and delete "?movieId=" (string)

/* show tagline --> fadeout */
window.addEventListener("DOMContentLoaded", () => {
  let component = movieComponent.filter((elem) => {
    return elem.movieId == movieIdfromURL;
  });

  if (component[0].tagline === "") {
    taglineSection.innerHTML = ` <h2 class="tagline">Loading ...</h2>`;
  } else {
    taglineSection.innerHTML = ` <h2 class="tagline">${component[0].tagline}</h2>`;
  }

  setTimeout(() => {
    taglineSection.classList.add("hide");
    backdropRow.classList.add("show");
    titlePanel.classList.add("show");
  }, 5000);
});


//* show movie component */

// alert(urlPrm.sample1);
//backdrop
//category
//title
//description

//another fetch for cast, related movies etc....
