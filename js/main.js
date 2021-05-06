/* Function Declaration */

//show the result on the result section
const displayMovielist = (movieComponent) => {
  console.log("display movie list, moviecomponent is", movieComponent)
  //show only the data that has a poster image
  let appendHTML = movieComponent.map((elem) => {
    if (elem.poster_path) {
      return `
      <div class="col card bg-dark text-white">
        <img src="${imgBaseURL}original${elem.poster_path}" class="card-img clicked posterImg" alt="${elem.id}">
      </div>
      `;
    }
  }).join("");

  movieListRow.innerHTML = appendHTML;
  searchResultSection.style.display = "block"; //open result section  
  smoothScroll("searchResult");//#0 scroll to the result section

  return movieComponent;
};

//Append pagination (ul) buttons : page = string
const showPagination = (totalPageNum, page) => {
  let html = "";
  for (let i = 1; i <= totalPageNum; i++) {
    if (i == page) {
      html += `<li class="page-item active"><a class="page-link pageNum">${i}</a></li>`
    } else {
      html += `<li class="page-item"><a class="page-link pageNum">${i}</a></li>`
    }

  };
  pagination.innerHTML = `
  <li class="page-item"><a class="page-link">Prev</a></li>
  ${html}
  <li class="page-item"><a class="page-link">Next</a></li>`
};

//change pages
document.addEventListener("click", (e) => {
  console.log(e.target)
  if (e.target.classList.contains("pageNum")) {
    console.log(e.target.innerText); //get page number
    pageChange(e.target.innerText);
  }
});
const pageChange = async (pageNum) => {
  movieListRow.innerHTML = ""; //clear previous result
  let movieList = await getMovieByKeyword(search.value, pageNum);
  //display pagination at the bottom
  showPagination(movieList.total_pages, pageNum);

  //display the total number of result on nav bar with fadeIn effect
  numOfResult.innerHTML = `<span>${movieList.total_results}</span> MOVIES Found`;
  numOfResult.classList.add("fadeIn");

  // if there is no data, do nothing.
  if (movieList.total_results === 0) {
    //hide search result section if it is already open
    searchResultSection.style.display = "none";
    return false;
  };

  displayMovielist(movieList.results); //#3 show the result
  return;
}


//################## get backdrop path (for now on theater movies) ##################
const createNowOnTheaterComponent = async (movieId) => {
  console.log("2. create NowOnTheaterComponent with movie id", movieId);
  let categoryArray = [];

  try {
    const movieDetail = await fetch(`${baseURL}/3/movie/${movieId}?api_key=${APIKey}&append_to_response=videos%2Bimages}`);
    const movie = await movieDetail.json();

    //prepare category component
    categoryArray.push(movie["genres"].map((elem) => { return elem.name }));

    //create a movie component
    let dataObj = {
      movieId: movieId,
      movieTitle: movie["title"],
      category: categoryArray,
      runtime: movie["runtime"],
      overview: movie["overview"],
      backdropPath: movie["backdrop_path"], //background photo
      posterPath: movie["poster_path"],
      tagline: movie["tagline"],
      popularity: movie["popularity"]
    };

    //store the component into localStorage
    localStorage.setItem("nowOnTheaterComponent", JSON.stringify(dataObj));

    console.log("3. NowOnTheater Component stored", localStorage);
    return dataObj;

  } catch (error) {
    console.error(`Error = ${error}. Unable to fetch data by ID`);
    return error;
  };
};

/* =========================== Function Call =========================== */
//#1 when the search box is focused
search.addEventListener("focus", () => {
  //numnber of result hide
  numOfResult.classList.remove("fadeIn");
  //movie detail popUp hide
  popOverContent.classList.remove("show");
  //clear input
  //search.value = "";
});

//#2 When the search button is clicked, get a list of movies based on a keyword
searchBtn.addEventListener("click", async (e) => {
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
  //#3 clear the previous search result
  movieListRow.innerHTML = "";
  let movieList = await getMovieByKeyword(search.value, 1);

  console.log(movieList)
  //display pagination at the bottom
  showPagination(movieList[0].total_pages, 1);

  //display the total number of result on nav bar with fadeIn effect
  numOfResult.innerHTML = `<span>${movieList[0].total_results}</span> MOVIES Found`;
  numOfResult.classList.add("fadeIn");

  // if there is no data, do nothing.
  if (movieList[0].total_results === 0) {
    //hide search result section if it is already open
    searchResultSection.style.display = "none";
    return false;
  };

  displayMovielist(movieList[0].results); //#3 show the result
});

//#4 Pop up screen for movie detail
movieListRow.addEventListener("click", async (event) => {

  //when the image is clicked
  if (event.target.classList.contains("posterImg")) {

    //get movie detail
    let id = event.target.getAttribute("alt");
    let selectedMovie = await getMovieDetailById(id); //array of object
    console.log(selectedMovie);

    //create category html
    let htmlCategory = selectedMovie[0].genres.map((elem) => {
      return `<p class="card-text">${elem.name}</p>`;
    }).join("");

    //append html and show pop up
    let appendHTML = `
      <button type="button" class="clsBtn" onclick="closePopup()">x</button>
      <h5>${selectedMovie[0].title}</h5>
      <p">${selectedMovie[0].overview}</p>
      <button type="button" class="btn btn-outline-light trailerBtn">▶ Watch trailer<span class="movieId">${selectedMovie[0].id}</span></button>
      <a class="btn btn-outline-light viewDetailBtn" target="_blank" role="button"><span class="movieId">${selectedMovie[0].id}</span><i
          class="fas fa-film"></i> View Detail</a >
      <a class="btn btn-outline-light bookNowBtn" target="_blank" role="button"><span class="movieId">${selectedMovie[0].id}</span><i class="fas fa-ticket-alt"></i> Book Now</a >
        <div class="info">
          ${htmlCategory}
          <p class="card-text"><i class="far fa-clock"></i> ${selectedMovie[0].runtime} mins</p>
        </div>
      `;

    popOverContent.innerHTML = appendHTML;
    popOverContent.classList.add("show");

  } else {
    popOverContent.classList.remove("show");
  }
});

//#5 Pop over close - onclick attribute in html
const closePopup = () => {
  popOverContent.classList.remove("show");
};

//#6 close modal
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
});

//#7 Watch Trailer and View Detail clicked on the popover screen
document.addEventListener("click", (event) => {
  //#4 fetch video key by movid Id
  if (event.target.classList.contains("trailerBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    onTheaterFlg = 0;
    getVideoByMovieId(movieId, onTheaterFlg);
  };
  //open movie.html with the URL parameter. movieId and flag
  if (event.target.classList.contains("viewDetailBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    onTheaterFlg = 0;
    addParamtoURL(movieId, onTheaterFlg, movieHTML);
  };
  //open seatSelection.html with the URL parameter. movieId and flag
  if (event.target.classList.contains("bookNowBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    onTheaterFlg = 0;
    addParamtoURL(movieId, onTheaterFlg, searSelectionHTML);
  };
});

//When watch trailer on the now-on-theater section clicked
const promiseFuncTrailer = async (movieId) => {
  await createNowOnTheaterComponent(movieId); //first --> add to local storage
  onTheaterFlg = 1; //movies on theater (default = 1)

  //open movie.html with the URL parameter. movieId
  getVideoByMovieId(movieId, onTheaterFlg); //second
  return;
};

//When view detail on the now-on-theater section clicked
const promiseFuncMovie = async (movieId) => {
  await createNowOnTheaterComponent(movieId); //first --> add to local storage
  onTheaterFlg = 1; //movies on theater (default = 0)

  //open movie.html with the URL parameter. movieId
  addParamtoURL(movieId, onTheaterFlg, movieHTML);
  return;
};

//#8 Watch Trailer and View Detail clicked on the new on theater section
document.addEventListener("click", (event) => {
  //watch trailer
  if (event.target.classList.contains("nowOntrailerBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string

    /******* async/await ******* */
    promiseFuncTrailer(movieId);
  };

  if (event.target.classList.contains("nowOnviewDetailBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string

    /********** async/await ********** */
    promiseFuncMovie(movieId);
  };
});

//add parameter to URL ---> to get movieId on movie.html
const addParamtoURL = (movieId, onTheaterFlg, baseURL) => {
  let fullURL = `${baseURL}?movieId=${movieId}&onTheaterFlg=${onTheaterFlg}`;
  window.open(fullURL); //open window with the combined URL
}

/* =========================== Animation function  =========================== */
// When the page is loaded
window.addEventListener("DOMContentLoaded", () => {
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

  //#4 Show Now Playing
  getNowPlaying().then(([categoryList, nowPlayingList]) => {
    categoryList;
    nowPlayingList;

    //Prepare carousel-item data
    //src pass
    let srcPath;
    if (nowPlayingList.results.backdrop_path === null) {
      srcPath = "./img/smoke.jpg";
    } else {
      srcPath = nowPlayingList.results.backdrop_path;
    }

    //category
    //create a list of category name from category id
    let categoryArray = [];
    categoryArray = nowPlayingList.results.map((elem) => {
      return elem.genre_ids;
    });

    //create an array of category names from category id : find the value of categoryId
    let categoryName = [];
    categoryArray.map((idElem) => {
      return categoryName.push(idElem.map((id) => { return categoryList.genres.find((elem) => elem.id === id) }));
    });

    //create html for category
    //---index 0
    let categoryOneHTML = categoryName[0].map((elem) => {
      return `<p>${elem.name}</p>`
    }).join("");

    //---index 1 ~
    let categoryHTMLArray = [];
    for (let i = 1; i < categoryName.length; i++) {
      categoryHTMLArray.push(categoryName[i].map((elem) => {
        return `<p>${elem.name}</p>`
      }).join(""))
    }

    //first item - with active class
    let carouselOneHTML = `
      <div class="carousel-item active">
        <img src="${backdropBaseURL}${nowPlayingList.results[0].backdrop_path}" class="d-block w-100" alt="sample1">
        <div class="movieInfo">
          <div class="row">
            <h1 class="col movieTitle">${nowPlayingList.results[0].title}</h1>
          </div>
          <div class="row">
            <div class="col category">
              ${categoryOneHTML}
            </div>
          </div>
          <div class="row">
            <p class="col description">${nowPlayingList.results[0].overview}</p>
          </div>
          <div class="row">
            <div class="col btns">
              <button type="button" class="btn btn-outline-light nowOntrailerBtn">▶ Watch trailer<span class="movieId">${nowPlayingList.results[0].id}</span></button>
              <a class="btn btn-outline-light nowOnviewDetailBtn" target="_blank" role="button"><span class="movieId">${nowPlayingList.results[0].id}</span><i class="fas
                fa-film"></i> View Detail</a>
            </div>
          </div>
          </div>
       </div>
      `;

    //second or more items - without active class 
    let carouselHTML = "";
    for (let i = 1; i < nowPlayingList.results.length; i++) {
      carouselHTML += `
        <div class="carousel-item">
          <img src="${backdropBaseURL}${nowPlayingList.results[i].backdrop_path}" class="d-block w-100" alt="sample1">
          <div class="movieInfo">
            <div class="row">
              <h1 class="col movieTitle">${nowPlayingList.results[i].title}</h1>
            </div>
            <div class="row">
              <div class="col category">
                ${categoryHTMLArray[i - 1]}
              </div>
            </div>
            <div class="row">
              <p class="col description">${nowPlayingList.results[i].overview}</p>
            </div>
            <div class="row">
              <div class="col btns">
                <button type="button" class="btn btn-outline-light nowOntrailerBtn">▶ Watch trailer<span class="movieId">${nowPlayingList.results[i].id}</span></button>
                <a class="btn btn-outline-light nowOnviewDetailBtn" target="_blank" role="button"><span class="movieId">${nowPlayingList.results[i].id}</span><i class="fas
                fa-film"></i> View Detail</a>
              </div>
            </div>
            </div>
        </div>
        `;
    };

    nowOnTheater.innerHTML = carouselOneHTML + carouselHTML;

  })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch now playing data`);
      return error;
    });
});

//#4 Nav bar color change on scroll
$(() => {
  $(document).scroll(() => {
    let $nav = $(".fixed-top");
    $nav.toggleClass('headerScrolled', $(this).scrollTop() > $nav.height());
  });
});