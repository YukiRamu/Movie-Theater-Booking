/* testing if the mobile read this script */
alert("Hi I am a test javascript file");

//get data

const urlParams2 = new URLSearchParams(window.location.search);
const movieIdfromURL2 = urlParams2.get("movieId");
console.log(urlParams2);
console.log(movieIdfromURL2)
alert(`movie ID is ${movieIdfromURL2}`);