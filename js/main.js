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
const imgBaseURL = "https://image.tmdb.org/t/p/w185";
const videoBaseURL = "https://api.themoviedb.org/3/movie/"
const APIKey = "a9bfb23ff39a5cefa92aae8e6858a3b2";
const numOfResult = document.querySelector(".numOfResult");
const searchResultSection = document.querySelector(".searchResult");

//animation
const popOverContent = document.querySelector(".popOverContent");
const card = document.querySelectorAll(".card-img-overlay");
const movieListRow = document.querySelector(".movieListRow");

//modal
const htmlBody = document.getElementsByTagName("body")[0];
const trailerModal = document.querySelector(".trailerModal");
const trailerBackground = document.querySelector(".trailerBackground");
const trailerContents = document.querySelector(".trailerContents");

/* *******************************************
/* Fetch API Note - how to access data
/* 1. Search by keyword : getMovieByKeyword()
/* https://api.themoviedb.org/3/search/movie?api_key=a9bfb23ff39a5cefa92aae8e6858a3b2&query=
//
/* 2. Search detail by id (must have "id") : getMovieDetailById()
/* https://api.themoviedb.org/3/movie/${id}?api_key=a9bfb23ff39a5cefa92aae8e6858a3b2&append_to_response=videos%2Bimages
//
/* 3. get image
/* use poster_path as a parameter
/* https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
// backdrop_path for the backgroud photo
//
// 4. get video getVideoByMovieId ()
/* https://api.themoviedb.org/3/movie/384018/videos?api_key=a9bfb23ff39a5cefa92aae8e6858a3b2&language=en-US
/* 
/* *******************************************

/* Fetch Data -- TMDB */
//#1 fetch a list of movie IDs based on a keyword
const getMovieByKeyword = (keyword) => {
  fetch(`${baseURL}/3/search/movie?api_key=${APIKey}&query=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log("fetch API data is ", data);
      //display the total number of result on nav bar with fadeIn effect
      numOfResult.innerHTML = `<span>${data.total_results}</span> MOVIES Found`;
      numOfResult.classList.add("fadeIn");

      // if there is no data, do nothing.
      if (data.total_results === 0) {
        //hide search result section if it is already open
        searchResultSection.style.display = "none";
        return false;
      } else {
        smoothScroll("searchResult");//#0 scroll to the result section
      }

      //get ids
      let idArray = [];
      idArray.push(data.results.map((elem) => { return elem.id }));

      //get movie detail and display it one by one
      idArray[0].forEach(elem => {
        getMovieDetailById(elem); //#2 get detail by id
        return;
      });
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch data by keyword`);
      return error;
    });
};

//#2 fetch movie detail by movie id
const getMovieDetailById = (movieId) => {
  //fetch detail of movie and store it one by one
  let resultArray = [];
  let categoryArray = [];

  fetch(`${baseURL}/3/movie/${movieId}?api_key=${APIKey}&append_to_response=videos%2Bimages}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    }).then((data) => {
      console.log(data);
      //prepare category component
      categoryArray.push(data["genres"].map((elem) => { return elem.name }));

      //create a movie component
      resultArray.push({
        movieId: movieId,
        movieTitle: data["original_title"],
        category: categoryArray,
        runtime: data["runtime"],
        overview: data["overview"],
        backdropPath: data["backdrop_path"], //background photo
        posterPath: data["poster_path"]
      });
      displayMovielist(resultArray); //#3 show the result
      return;
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch data by ID`);
      return error;
    });
  return;
}

//#3 show the result on the result section
const displayMovielist = (movieComponent) => {
  //show only the data that has a poster image
  if (movieComponent[0].posterPath) {
    let appendHTML =
      `
    <div class="col card bg-dark text-white">
      <img src="${imgBaseURL + movieComponent[0].posterPath}" class="card-img clicked posterImg" alt="${movieComponent[0].movieId}">
    </div>
    `;

    movieListRow.insertAdjacentHTML("beforeend", appendHTML);
    storeMovieComponentHTML(movieComponent); //-> #4 store html into local storage

    return movieComponent;
  }
};

//#4 store html list with detail movie info into LocalStorage
let detailAppendHTMLList = [];
const storeMovieComponentHTML = (movieComponent) => {
  //create html
  //for category component
  let htmlCategory = movieComponent[0].category[0].map((elem) => {
    return `<p class="card-text">${elem}</p>`;
  }).join("");

  //for the entire html
  let htmlAll = `
  <button type="button" class="clsBtn" onclick="closePopup()">x</button>
  <h5>${movieComponent[0].movieTitle}</h5>
  <p">${movieComponent[0].overview}</p>
  <button type="button" class="btn btn-outline-light trailerBtn">▶ Watch trailer<span class="movieId">${movieComponent[0].movieId}</span></button>
  <a class="btn btn-outline-light" href="./movie.html" target="_blank" role="button"><i
      class="fas fa-film"></i></i> View Detail</a >
    <div class="info">
      ${htmlCategory}
      <p class="card-text"><i class="far fa-clock"></i> ${movieComponent[0].runtime}</p>
    </div>
  `;

  //create an object
  let dataObj = {
    movieId: movieComponent[0].movieId,
    appendHTML: htmlAll
  }
  detailAppendHTMLList.push(dataObj);

  //when all item is shown, the local storage will be ready (all item stored)
  localStorage.setItem("descriptionHTML", JSON.stringify(detailAppendHTMLList));
}

//#4 fetch video key by movid Id
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("trailerBtn")) {
    console.log("trailerBtn is clicked movie id is ")
    console.log(event.target.children[0].innerHTML)
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    getVideoByMovieId(movieId);
  }
});

//#5 get video key array by movid id
const getVideoByMovieId = (movieId) => {
  //fetch video key and store it to the local Storage
  fetch(`${videoBaseURL}${movieId}/videos?api_key=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      //#1 prepare video key array and return
      let videoKeyArray = [];
      videoKeyArray.push(data.results.filter((elem) => { return elem.type === "Trailer" }));
      console.log(videoKeyArray[0]);

      //#2 show modal
      trailerModal.classList.add("show");
      htmlBody.classList.add("trailerModal-active");

      //#3 show trailer in the modal
      showTrailer(videoKeyArray);
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch video data by movieId`);
      return error;
    });
}

//#6 create iframe for trailer
const showTrailer = (videoKeyArray) => {
  //#3 create iframe
  //prepare carousel-indicators (= length of array) = buttons
  let indicatorHTMLBase = '<button type="button" data-bs-target="#movieTrailer" data-bs-slide-to="0" class="active" aria-current="true"></button>';

  //******** if there are more than 2 trailers
  let indicatorHTML = "";
  for (let i = 1; i < videoKeyArray[0].length; i++) {
    indicatorHTML += `<button type="button" data-bs-target="#movieTrailer" data-bs-slide-to="${i}"></button>;`
  };
  console.log(indicatorHTML);

  //prepare carousel-items
  let itemHTMLBase = `
        <div class="carousel-item active">
          <iframe width="560" height="315" class="video" type="text/html" src="https://www.youtube.com/embed/${videoKeyArray[0][0].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        </div>`

  //******** if there are more than 2 trailers
  let itemHTML = "";
  for (let i = 1; i < videoKeyArray[0].length; i++) {
    itemHTML += `
        <div class="carousel-item">
          <iframe width="560" height="315" class="video" type="text/html" src="https://www.youtube.com/embed/${videoKeyArray[0][i].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        </div>`
  }
  console.log(itemHTML);

  let iframeHTML = `
        <div class="carousel-indicators">
          ${indicatorHTMLBase}${indicatorHTML}
        </div>
        <div class="carousel-inner">
          ${itemHTMLBase}${itemHTML}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#movieTrailer" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#movieTrailer" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
        `;
  console.log(iframeHTML);

  trailerContents.innerHTML = iframeHTML;
}

// smooth scroll to the section (param: sectionId)
const smoothScroll = (id) => {
  searchResultSection.style.display = "block";
  let scrollTo = document.getElementById(`${id}`);
  scrollTo.scrollIntoView(({
    behavior: "smooth"
  }), true); // to top
}

/* =========================== Function Call =========================== */
//when the search box is focused
search.addEventListener("focus", () => {
  //numnber of result hide
  numOfResult.classList.remove("fadeIn");
  //movie detail popUp hide
  popOverContent.classList.remove("show");
  //clear input
  search.value = "";
})

//When the search button is clicked, get a list of movies based on a keyword
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //validation check
  if (search.value === "") {
    console.log("alert")
    //Show alert for 1.5s
    e.preventDefault();
    alertMsg.style.transform = "translateY(0rem)";
    setTimeout(() => {
      alertMsg.style.transform = "translateY(-10rem)";
    }, 1500)
    return false
  }
  //clear the previous search result
  movieListRow.innerHTML = "";
  getMovieByKeyword(search.value);
})

/* =========================== Animation function  =========================== */
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

//#5 Pop over screen
movieListRow.addEventListener("click", (event) => {
  console.log(event.target);

  //when the image is clicked
  if (event.target.classList.contains("posterImg")) {
    //show pop up
    popOverContent.classList.add("show");

    //append detail movie information into the pop up
    let component = JSON.parse(localStorage.getItem("descriptionHTML"));
    console.log(component);

    //find the appendHTML by movieId ("==" because of data type difference)
    let result = component.find(obj => { return obj.movieId == event.target.getAttribute("alt") });
    popOverContent.innerHTML = result.appendHTML;
  } else {
    popOverContent.classList.remove("show");
  }
});

//#6 Pop over close - onclick attribute in html
const closePopup = () => {
  popOverContent.classList.remove("show");
}

//#7 close modal
trailerBackground.addEventListener("click", (event) => {
  if (event.target.classList.contains("trailerBackground")) {
    //stop the trailer when the modal is closed
    const video = document.querySelectorAll(".video");
    video.forEach(elem => {
      elem.setAttribute("src", "");
    });
    trailerModal.classList.remove("show");
    htmlBody.classList.remove("trailerModal-active");
  }
})