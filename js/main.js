/* Variables */
//opening animation
const droptexts = document.querySelectorAll(".drops span");
const bigger = document.querySelector(".bigger");

//search box
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");
const alertMsg = document.querySelector(".alert");

//API
const baseURL = "https://api.themoviedb.org";
//const parameter = "/3/movie/"; //specify movie
const APIKey = "a9bfb23ff39a5cefa92aae8e6858a3b2";
let dataArray = [];

//animation
const popOverContent = document.querySelector(".popOverContent");
const card = document.querySelectorAll(".card-img-overlay");
const movieListRow = document.querySelectorAll(".movieListRow");
const closeBtn = document.querySelector(".clsBtn");

/* Fetch Data -- TMDB */
//#1 fetch a list of movies based on a keyword
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
      console.log(data)
      dataArray = data.results;
      console.log(dataArray);
      smoothScroll("searchResult");
      //showMovieList(); // -> display the list
      return dataArray;
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch data`);
      return error;
    });
}

//#2 display the list in the result section

// smooth scroll to the section (id)
const smoothScroll = (id) => {
  let scrollTo = document.getElementById(`${id}`);
  scrollTo.scrollIntoView(({
    behavior: "smooth"
  }), true); // to top
}

/* Function Call */
//When the search button is clicked, get a list of movies based on a keyword
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //validation check
  if (search.value === "") {
    //Show alert for 1.5s
    e.preventDefault();
    alertMsg.style.transform = "translateY(0rem)";
    setTimeout(() => {

      alertMsg.style.transform = "translateY(-10rem)";
    }, 1500)
    return false
  }
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

//#4 Nav bar color change on scroll
$(() => {
  $(document).scroll(() => {
    let $nav = $(".fixed-top");
    $nav.toggleClass('headerScrolled', $(this).scrollTop() > $nav.height());
  });
});

//#5 Pop over  ---Under construction
console.log(popOverContent);
console.log(card);
console.log(movieListRow);

for (let i = 0; i < movieListRow.length; i++) {
  movieListRow[i].addEventListener("click", (event) => {
    if (event.target.classList.contains("clicked")) {
      console.log("overlay image clicked");
      console.log(i)
      popOverContent.classList.add("show");
    } else if (event.target.classList.contains("shown")) {
      ;
    }
    else {
      console.log("somewhere else clicked");
      popOverContent.classList.remove("show");
    }
  });
};

//#6 Pop over close
closeBtn.addEventListener("click", () => {
  popOverContent.classList.remove("show");
});


// for (let i = 0; i < movieImg.length; i++) {
//   movieImg[i], addEventListener("click", () => {
//     console.log(movieImg[i])
//     popOverContent[i].classList.add("show");
//   });
// }

// $(document).ready(function(){
//   $('#imgOne').popover();
//   $('#popOverContent').popover({ trigger: "hover" });
// })
