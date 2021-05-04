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
      };
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
      };

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
      };
    }).then((data) => {
      console.log("movie detail is ", data);
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
        posterPath: data["poster_path"],
        tagline: data["tagline"]
      });
      displayMovielist(resultArray); //#3 show the result

      //export {resultArray};

      return resultArray;
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
      <img src="${imgBaseURL + "w185" + movieComponent[0].posterPath}" class="card-img clicked posterImg" alt="${movieComponent[0].movieId}">
    </div>
    `;

    movieListRow.insertAdjacentHTML("beforeend", appendHTML);
    storeMovieComponentHTML(movieComponent); //-> #4 store html into local storage

    return movieComponent;
  };
};


//#4 store html list with detail movie info into LocalStorage
let detailMovieInfo = [];
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
  <a class="btn btn-outline-light viewDetailBtn" target="_blank" role="button"><span class="movieId">${movieComponent[0].movieId}</span><i
      class="fas fa-film"></i></i> View Detail</a >
    <div class="info">
      ${htmlCategory}
      <p class="card-text"><i class="far fa-clock"></i> ${movieComponent[0].runtime}</p>
    </div>
  `;

  //create an object to store in the local storage
  let dataObj = {
    movieId: movieComponent[0].movieId,
    appendHTML: htmlAll, //discription popUp
    backdropPath: movieComponent[0].backdropPath, //trailer background img
    category: movieComponent[0].category, //below for movie.js
    movieTitle: movieComponent[0].movieTitle,
    overview: movieComponent[0].overview,
    posterPath: movieComponent[0].posterPath,
    runtime: movieComponent[0].runtime,
    tagline: movieComponent[0].tagline
  };

  detailMovieInfo.push(dataObj);

  //when all item is shown, the local storage will be ready (all item stored)
  localStorage.setItem("movieComponent", JSON.stringify(detailMovieInfo));
};

/******************** Below are the functions to fetch trailer data ******************* */
//#4 get video key array by movid id
const getVideoByMovieId = (movieId) => {
  //fetch video key and store it to the local Storage
  fetch(`${baseURL}/3/movie/${movieId}/videos?api_key=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      };
    })
    .then((data) => {
      console.log("video data is ", data)
      //#1 prepare video key array and return
      let videoKeyArray = [];
      videoKeyArray.push(data.results.filter((elem) => { return elem.type === "Trailer" }));

      //#2 show modal
      trailerModal.classList.add("show");
      htmlBody.classList.add("trailerModal-active");

      if (videoKeyArray[0].length === 0) {
        //when no trailer found
        trailerContents.innerHTML = "<h1>No trailer available :(</h1>";
        trailerBackground.style.backgroundImage = `url(./img/bg2.jpg)`;
        trailerBackground.style.backgroundPosition = "center";
        trailerBackground.style.backgroundSize = "cover";
        trailerBackground.style.backgroundRepeat = "no-repeat";
      } else {
        //#3 show trailer in the modal if the video key is found
        showTrailer(videoKeyArray, data.id);

        return videoKeyArray;
      };

    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch video data by movieId`);
      return error;
    });
}

//#6 create iframe for trailer
const showTrailer = (videoKeyArray, movidId) => {
  //#3 create iframe
  //prepare carousel-indicators (= length of array) = buttons
  let indicatorHTMLBase = '<button type="button" data-bs-target="#movieTrailer" data-bs-slide-to="0" class="active" aria-current="true"></button>';

  //******** if there are more than 2 trailers
  let indicatorHTML = "";
  for (let i = 1; i < videoKeyArray[0].length; i++) {
    indicatorHTML += `<button type="button" data-bs-target="#movieTrailer" data-bs-slide-to="${i}"></button>;`
  };

  //prepare carousel-items
  let itemHTMLBase = `
        <div class="carousel-item active">
          <iframe width="650" height="400" class="video" type="text/html" src="https://www.youtube.com/embed/${videoKeyArray[0][0].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        </div>`;

  //******** if there are more than 2 trailers
  let itemHTML = "";
  for (let i = 1; i < videoKeyArray[0].length; i++) {
    itemHTML += `
        <div class="carousel-item">
          <iframe width="650" height="400" class="video" type="text/html" src="https://www.youtube.com/embed/${videoKeyArray[0][i].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
        </div>`
  };

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

  trailerContents.innerHTML = iframeHTML;  //display trailer(s)
  showTrailerBackgroundImg(movidId);
};

//#7 add background image to the trailer
const showTrailerBackgroundImg = (movidId) => {
  //get backdropPath from localstorage
  let component = JSON.parse(localStorage.getItem("movieComponent"));

  //find the backdropPath by movieId
  let dataObj = component.find(obj => { return obj.movieId == movidId });
  let url = backdropBaseURL + dataObj.backdropPath;

  if (dataObj.backdropPath === null) {
    // when the data is null
    trailerBackground.style.backgroundImage = `url(./img/bg2.jpg)`; //alternative bg image
    trailerBackground.style.backgroundPosition = "center";
    trailerBackground.style.backgroundSize = "cover";
    trailerBackground.style.backgroundRepeat = "no-repeat";
  } else {
    // trailerModal ---add background
    trailerBackground.style.backgroundImage = `url('${url}')`;
    trailerBackground.style.backgroundPosition = "center";
    trailerBackground.style.backgroundSize = "cover";
    trailerBackground.style.backgroundRepeat = "no-repeat";
    //trailerBackground.style.background = "radial-gradient(#F2B9A1, #EA6264);";
  }
};

// smooth scroll to the section (param: sectionId)
const smoothScroll = (id) => {
  searchResultSection.style.display = "block";
  let scrollTo = document.getElementById(`${id}`);
  scrollTo.scrollIntoView(({
    behavior: "smooth"
  }), true); // to top
};

/* =========================== Function Call =========================== */
//#1 when the search box is focused
search.addEventListener("focus", () => {
  //numnber of result hide
  numOfResult.classList.remove("fadeIn");
  //movie detail popUp hide
  popOverContent.classList.remove("show");
  //clear input
  search.value = "";
});

//#2 When the search button is clicked, get a list of movies based on a keyword
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
  //#3 clear the previous search result
  movieListRow.innerHTML = "";
  getMovieByKeyword(search.value);
});

//#4 Pop up screen for movie detail
movieListRow.addEventListener("click", (event) => {

  //when the image is clicked
  if (event.target.classList.contains("posterImg")) {
    //show pop up
    popOverContent.classList.add("show");

    //append detail movie information into the pop up
    let component = JSON.parse(localStorage.getItem("movieComponent"));

    //find the appendHTML by movieId ("==" because of data type difference)
    let result = component.find(obj => { return obj.movieId == event.target.getAttribute("alt") });
    popOverContent.innerHTML = result.appendHTML;
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

//#7 Watch Trailer and View Detail clicked
document.addEventListener("click", (event) => {
  //#4 fetch video key by movid Id
  if (event.target.classList.contains("trailerBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    getVideoByMovieId(movieId);
  };
  //open movie.html with the URL parameter. movieId
  if (event.target.classList.contains("viewDetailBtn")) {
    //get movieId from the button tag > span
    let movieId = event.target.children[0].innerHTML; //string
    addParamtoURL(movieId, movieHTML);
  };

});

//add parameter to URL ---> to get movieId on movie.html
const addParamtoURL = (movieId, baseURL) => {
  let fullURL = baseURL + `?movieId=${movieId}`;
  console.log(fullURL);
  window.open(fullURL); //open window with the combined URL
}

/* =========================== Animation function  =========================== */

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
});

//#4 Nav bar color change on scroll
$(() => {
  $(document).scroll(() => {
    let $nav = $(".fixed-top");
    $nav.toggleClass('headerScrolled', $(this).scrollTop() > $nav.height());
  });
});