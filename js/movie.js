/* function declaration */
//display Title panel
const displayMovieInfo = (component) => {
  //for category component
  let htmlCategory = component[0].category[0].map((elem) => {
    return `<p class="col">${elem}</p>`;
  }).join("");

  console.log(htmlCategory);

  let html = `
    <!-- backdrop -->
    <div class="col backdrop">
      <img src="${backdropBaseURL + component[0].backdropPath}" alt="backgroundImg">
    </div>
    <!--Title panel-->
    <div class=" col titlePanel">
      <div class="row categoryRow">
        ${htmlCategory}
      </div>
      <div class="row titleRow">
        <h1 class="col">${component[0].movieTitle}</h1>
      </div>

      <div class="row subInfo">
      <!--sub left-->
      <div class="col left">
        <div class="row overviewRow">
          <p class="col">${component[0].overview}</p>
        </div>
        <div class="row directorRow">
          <p class="col"><span><i class="far fa-clock"></i> ${component[0].runtime} mins</span><span><i
                class="far fa-closed-captioning"></i>
                xxxxx</span><span><i class="fas fa-bullhorn"></i> Director Name needs to fetch</span></p>
        </div>
        <div class="row bookRow">
          <button type="button" class="btn btn-outline-light trailerBtn">▶ Watch trailer</button>
          <a class="col-md-8 btn btn-outline-light bookNowBtn" href="./seatSelection.html" target="_blank"
            role="button"><i class="fas fa-ticket-alt"></i> Book Now</a>
          <h4 class="col-md-4 rate">7.5 <span class="badge bg-secondary">IMDB</span></h4>
        </div>
      </div>
      <!--sub right-->
      <div class="col right trailer">
        <p>No trailer available :(</p>
      </div>
    </div>
    `;

  backdropRow.innerHTML = html;
};

//display trailer
const displayTrailer = (movieId) => {
  //fetch video key and store it to the local Storage
  fetch(`${videoBaseURL}${movieId}/videos?api_key=${APIKey}`)
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

      const showTrailer = document.querySelector(".trailer");

      if (videoKeyArray[0].length === 0) {
        //when no trailer found
        showTrailer.innerHTML = "<p>No trailer available :(</p>";
      } else {
        //#3 display trailer 
        showTrailer.innerHTML = `
        <iframe width="400" height="200" class="video" type="text/html" src="https://www.youtube.com/embed/${videoKeyArray[0][0].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
        `
        return;
      };
    })
    .catch((error) => {
      console.error(`Error = ${error}. Unable to fetch video data by movieId`);
      return error;
    });
};

//fetch cast data
//https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=<<api_key>>&language=en-US
const getCredit = (movieId) => {
  fetch(`${videoBaseURL}${movieId}/credits?api_key=${APIKey}&language=en-US`)
    .then((response) => {
      if (!response.ok) {
        throw error(response.statusText);
      } else {
        return response.json();
      };
    })
    .then((data) => {
      console.log(data.cast);
      console.log(data.crew);

      //get director name 
      const result = data.crew.find(elem => elem.job === "Director"); //returns object
      console.log(result);
      let director = result["name"];
      let directorProfilePath = `${imgBaseURL}w185${result["profile_path"]}`;
      console.log(director, directorProfilePath);

      //get cast array
      let castArray = data.cast;
      console.log(castArray);
      displayMovieDetail(castArray); // after 5 seconds interval
    })
};


const displayMovieDetail = (castArray) => {
  let counter = 0;
  let numLeft = 0;
  let numRight = 0;
  let maxLeft = (castArray.length - 2) * -150;
  console.log("inside movieDetail function ", castArray);
  //cast carousel - left button
  leftBtn.addEventListener("click", () => {
    numLeft += - 150;
    counter++;
    for (let i of castImg) {
      if (counter === 0) {
        i.style.transform = `translateX(0%)`;
      }
      if (counter > castArray.length - 2) {
        //do nothing
        leftBtn.style.pointerEvents = "none";
        rightBtn.style.pointerEvents = "auto";
        i.style.transform = `translateX(${maxLeft}%)`;
      } else {
        leftBtn.style.pointerEvents = "auto";
        rightBtn.style.pointerEvents = "auto";
        i.style.transform = `translateX(${numLeft + numRight}%)`;
      }
    }
  });

  //cast carousel - right button
  rightBtn.addEventListener("click", () => {
    numRight += 150;
    counter--;
    for (let i of castImg) {
      if (counter < 0) {
        //back to translateX(0%)
        rightBtn.style.pointerEvents = "none";
        leftBtn.style.pointerEvents = "auto";
        i.style.transform = `translateX(0%)`;
      } else {
        rightBtn.style.pointerEvents = "auto";
        leftBtn.style.pointerEvents = "auto";
        i.style.transform = `translateX(${numLeft + numRight}%)`;
      }
    }
  });
}

/* ============ When the window opens ============ */
/* Movie component preparation = global variables */
//get movie component from localstorage
let movieComponent = JSON.parse(localStorage.getItem("movieComponent"));
console.log("movie component is ", movieComponent);

//get URL parameter (movieId) and component
let movieIdfromURL = location.search.slice(9); //get parameter from url and delete "?movieId=" (string)
let component = movieComponent.filter((elem) => {
  return elem.movieId == movieIdfromURL;
});

window.addEventListener("DOMContentLoaded", () => {
  /* #1 show tagline --> fadeout */
  if (component[0].tagline === "") {
    taglineSection.innerHTML = ` <h2 class="tagline">Loading ...</h2>`; //when no data exists
  } else {
    taglineSection.innerHTML = ` <h2 class="tagline">${component[0].tagline}</h2>`;
  }

  setTimeout(() => {
    taglineSection.classList.add("hide");
    backdropRow.classList.add("show"); //fadeIn
    detailRow.classList.add("show");
    footer.classList.add("show");
  }, 5000);

  /*#2  show movie component */
  console.log(movieIdfromURL);
  console.log(component);

  getCredit(movieIdfromURL); //get director and cast --> 5 seconds interval
  displayMovieInfo(component); //display the top part (overview)

  return movieComponent, movieIdfromURL;
});

//when "Watch Trailer" button is clicked
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("trailerBtn")) {
    //show trailer section
    const trailer = document.querySelector(".trailer");
    const subInfo = document.querySelector(".subInfo");
    trailer.classList.add("show");
    subInfo.classList.add("show");
    displayTrailer(movieIdfromURL);
  };
  return
});