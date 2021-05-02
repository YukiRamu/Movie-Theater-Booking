//variables --> to be moved to variable.js
const tagline = document.querySelector(".tagline");
const taglineSection = document.querySelector(".taglineSection");

//get movie component from localstorage
let movieComponent = JSON.parse(localStorage.getItem("movieComponent"));
console.log("movie component is ", movieComponent);

console.log(movieComponent[0].tagline)
//show tagline --> fadeout
taglineSection.innerHTML = ` <h2 class="tagline">${movieComponent[0].tagline}</h2>`
setTimeout(() => {
  taglineSection.classList.add("hide")
}, 5000);
//show movie component
//backdrop
//category
//title
//description

//another fetch for cast, related movies etc....
