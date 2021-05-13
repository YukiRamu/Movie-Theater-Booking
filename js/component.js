/* Global Variables */
/* base url */
const movieHTML = "./movie.html";
const searSelectionHTML = "./seatSelection.html";
//let onTheaterFlg = 1;
/* ***************** main.js ***************** */
//opening animation
const droptexts = document.querySelectorAll(".drops span");
const bigger = document.querySelector(".bigger");

//search box
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");
const alertMsg = document.querySelector(".alert");

//now on theater
const nowOnTheater = document.querySelector(".nowOnTheater");

//API
const baseURL = "https://api.themoviedb.org";
const imgBaseURL = "https://image.tmdb.org/t/p/";
const backdropBaseURL = "https://image.tmdb.org/t/p/original";
const APIKey = "a9bfb23ff39a5cefa92aae8e6858a3b2";
const numOfResult = document.querySelector(".numOfResult");
const searchResultSection = document.querySelector(".searchResult");

//animation
const popOverContent = document.querySelector(".popOverContent");
const card = document.querySelectorAll(".card-img-overlay");
const movieListRow = document.querySelector(".movieListRow");
const toTopBtn = document.querySelector(".toTop");

//modal
const htmlBody = document.getElementsByTagName("body")[0];
const trailerModal = document.querySelector(".trailerModal");
const trailerBackground = document.querySelector(".trailerBackground");
const trailerContents = document.querySelector(".trailerContents");

//pagenation
const pagination = document.querySelector(".pagination");

/* ***************** seatselection.js ***************** */
//button
const theaterChoice = document.getElementById("theaterChoice"); //dropdown

//UI
const titleHeader = document.querySelector(".titleHeader");
const description = document.querySelector(".description");
const body = document.querySelector(".body");
const trailer = document.querySelector(".trailer");
const cinemaLocation = document.querySelector(".cinemaLocation");
const completeMsg = document.querySelector(".completeMsg");
const viewSeatsBtn = document.querySelector(".viewSeats");
const checkOutBtn = document.querySelector(".checkOut");

//Seat Panel
const seat = document.querySelectorAll(".seat"); //all seats div 
const regularSeats = document.querySelectorAll(".regSeat"); // all regular seats 
const vipSeats = document.querySelectorAll(".vipSeat"); // all vip seats 

//Seat Panel display control
const seatLabel = document.querySelector(".seatLabel");
const screenLine = document.querySelector(".screenLine");
const seatContainer = document.querySelector(".seat-container");
const note = document.querySelector(".note");
const yourSeat = document.querySelector(".yourSeat");
const footer = document.querySelector(".footer");

//Price Calc
const regularTicketNum = document.querySelector(".regNum");
const vipTicketNum = document.querySelector(".vipNum");
const totalTicketNum = document.querySelector(".totalNum");
const regularSubtotal = document.querySelector(".regSub");
const vipSubtotal = document.querySelector(".vipSub");
const totalPrice = document.querySelector(".sum");
const alertMessage = document.querySelector(".alert");

/* ***************** movie.js ***************** */
//top section
const tagline = document.querySelector(".tagline");
const taglineSection = document.querySelector(".taglineSection");
const backdropRow = document.querySelector(".backdropRow");

//bottom section
const detailRow = document.querySelector(".detailRow");
const castRow = document.querySelector(".castRow");

//cast carousel
const leftBtn = document.querySelector(".leftBtn");
const rightBtn = document.querySelector(".rightBtn");
const castImgRow = document.querySelector(".castImgRow");
const reviewPanel = document.querySelector(".reviewPanel");
const recomPanel = document.querySelector(".recomPanel");


/* Global Fumctions */
// smooth scroll to the section
const smoothScroll = (id) => {
  let scrollTo = document.getElementById(`${id}`);
  scrollTo.scrollIntoView(({
    behavior: "smooth"
  }), true); // to top
};

//move to top button fadeIn
$(window).scroll(() => {
  let height = $(window).scrollTop();
  if (height > 200) {
    $('.toTop').fadeIn();
  } else {
    $('.toTop').fadeOut();
  }
});

//move to top button
toTopBtn.addEventListener("click", () => {
  smoothScroll("container")
});

//Cursor design change
const cursor = document.querySelector(".cursor");

//make the cursor follow the mouse move
document.addEventListener('mousemove', (e) => {
  cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
});

//add class when hover html tags
let tags = document.querySelectorAll('a, li, button');
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('mouseover', () => {
    cursor.classList.add('hovered');
  });
  tags[i].addEventListener('mouseout', () => {
    cursor.classList.remove('hovered');
  });
};
