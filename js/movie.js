/* function declaration */
//Pararel fetch - Promise.all()
const getMovieSubComponent = async (movieId) => {
  const [getCredit, getReview, getRecommendation, getSimmilarMovie] = await Promise.all([
    //#1: fetch cast data
    fetch(`${baseURL}/3/movie/${movieId}/credits?api_key=${APIKey}&language=en-US`)
      .then((creditResponse) => {
        if (!creditResponse.ok) {
          throw error(creditResponse.statusText);
        } else {
          return creditResponse.json();
        };
      }),
    //#2: fetch review data
    fetch(`${baseURL}/3/movie/${movieId}/reviews?api_key=${APIKey}&language=en-US`)
      .then((reviewResponse) => {
        if (!reviewResponse.ok) {
          throw error(reviewResponse.statusText);
        } else {
          return reviewResponse.json();
        };
      }),
    //#3: fetch recommendation data
    fetch(`${baseURL}/3/movie/${movieId}/recommendations?api_key=${APIKey}&language=en-US`)
      .then((recommendationResponse) => {
        if (!recommendationResponse.ok) {
          throw error(recommendationResponse.statusText);
        } else {
          return recommendationResponse.json();
        };
      }),
    //#4: fetch similar data
    fetch(`${baseURL}/3/movie/${movieId}/similar?api_key=${APIKey}&language=en-US`)
      .then((similarResponse) => {
        if (!similarResponse.ok) {
          throw error(similarResponse.statusText);
        } else {
          return similarResponse.json();
        };
      })
  ]);

  //fetch data in pararel
  const credit = await getCredit;
  const review = await getReview;
  const recommendation = await getRecommendation;
  const similar = await getSimmilarMovie;

  return [credit, review, recommendation, similar];
};

//==============================================================
//fetch cast data
// const getCredit = (movieId) => {
//   fetch(`${baseURL}/3/movie/${movieId}/credits?api_key=${APIKey}&language=en-US`)
//     .then((response) => {
//       if (!response.ok) {
//         throw error(response.statusText);
//       } else {
//         return response.json();
//       };
//     })
//     .then((data) => {
//       console.log(data.cast);
//       console.log(data.crew);

//       //get director name 
//       const result = data.crew.find(elem => elem.job === "Director"); //returns object
//       console.log(result);
//       const director = result["name"];
//       const directorProfilePath = `${imgBaseURL}w185${result["profile_path"]}`;
//       console.log(director, directorProfilePath);

//       //get cast array
//       const castArray = data.cast;
//       console.log(castArray);

//       displayMovieInfo(component, director); //after 5 seconds interval,display the top part (overview)
//       displayMovieDetail(castArray); //after 5 seconds interval
//     })
//     .catch((error) => {
//       console.error(`Error = ${error}. Unable to fetch credit data by movieId`);
//       return error;
//     });
// };

//display Title panel
const displayMovieInfo = (component, director) => {
  //for category component
  let htmlCategory = component[0].category[0].map((elem) => {
    return `<p class="col">${elem}</p>`;
  }).join("");

  //for backdropPath
  let srcPath;
  if (component[0].backdropPath === null) {
    srcPath = "";
  } else {
    srcPath = backdropBaseURL + component[0].backdropPath;
  }


  let html = `
    <!-- backdrop -->
    <div class="col backdrop">
      <img src="${srcPath}" alt="backgroundImg">
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
          <p class="col"><span><i class="far fa-clock"></i> ${component[0].runtime} mins</span><span><i class="fas fa-bullhorn"></i> ${director}</span></p>
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

//display movie detail
const displayMovieDetail = (castArray, reviewArray, recomArray) => {
  console.log(castArray, reviewArray, recomArray)
  /* display cast photos*/
  let html;
  if (castArray.length === 0) {
    html = `
    <div class="castImg">
     <p>No cast information available :(</p>
    </div>
  `;
  } else {
    //#1 filter out the profile with no image
    const filteredCastArray = castArray.filter(elem => elem.profile_path !== null);

    html = filteredCastArray.map((elem) => {
      return `
      <div class="castImg">
       <img src="${imgBaseURL}/original${elem.profile_path}" class="card-img-top" alt="sample4">
       <div>
        <p class="castName">${elem.name}</p>
        <p class="character">${elem.character}</p>
      </div>
      </div>
    `;
    }).join("");
  }
  castImgRow.innerHTML = html;

  /* Below is for the cast carousel */
  let counter = 0;
  let numLeft = 0;
  let numRight = 0;
  let maxLeft = (castArray.length) * -150;
  console.log("inside movieDetail function ", castArray);
  //cast carousel - left button
  leftBtn.addEventListener("click", () => {

    console.log("left button clicked");
    const castImg = document.querySelectorAll(".castImg");
    numLeft += - 150;
    counter++;
    console.log(counter)
    for (let i of castImg) {
      if (counter === 0) {
        i.style.transform = `translateX(0%)`;
      }
      if (counter > castArray.length) {
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
    console.log("right button clicked");
    const castImg = document.querySelectorAll(".castImg");
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

  /* display reviews*/
  //create html
  let reviewHTML;
  let htmlArray = [];
  if (reviewArray.length === 0) {
    console.log("no review")
    //no review
    reviewPanel.innerHTML = "<p>No review available :(</p>";
  } else {
    //show review panel
    for (let i = 0; i < reviewArray.length; i++) {
      if ((i % 2) !== 0) {
        //odd num, for style change
        reviewHTML = `
          <div class="reviewCard even">
            <p>${reviewArray[i].content.substr(0, 100)}.......</p>
            <p class="author"><span>- ${reviewArray[i].author} </span><a href="${reviewArray[i].url}" target="_blank"> <i class="fas fa-star-and-crescent"></i> full review</a></p>                
          </div>
          `;
        htmlArray.push(reviewHTML);
      } else {
        //even num, for style change
        reviewHTML = `
          <div class="reviewCard odd">
            <p>${reviewArray[i].content.substr(0, 100)}.......</p>
            <p class="author"><span>- ${reviewArray[i].author} </span><a href="${reviewArray[i].url}" target="_blank"> <i class="fas fa-star-and-crescent"></i> full review</a></p>                
          </div>
          `;
        htmlArray.push(reviewHTML);
      };
    };
    //Append html
    reviewPanel.innerHTML = ""; //clear previous results
    htmlArray.map((elem) => {
      return reviewPanel.insertAdjacentHTML("beforeend", elem);
    }).join("");
  };

  /* display recommendations - first 6 moview*/
  let recomHTML = "";
  let count = 0;
  do {
    recomHTML += `
      <div class="col">
        <div class="card recomCard">
          <img src="${imgBaseURL + "original" + recomArray[count].poster_path}" class="card-img-top recomImg" alt="movieID">
          <div class="card-body">
            <h5 class="card-text">${recomArray[count].title}</h5>
          </div>
        </div>
      </div>
    ` ;
    count++;
  } while ((count >= 0) && (count < 6));

  console.log(recomHTML);
  recomPanel.innerHTML = recomHTML;
}

//display trailer
const displayTrailer = (movieId) => {
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

/* ============ Function calls ============ */
/* Movie component preparation = global variables */
//get movie component from localstorage
const movieComponent = JSON.parse(localStorage.getItem("movieComponent"));
console.log("movie component is ", movieComponent);

//get URL parameter (movieId) and component
const movieIdfromURL = location.search.slice(9); //get parameter from url and delete "?movieId=" (string)
const component = movieComponent.filter((elem) => {
  return elem.movieId == movieIdfromURL;
});

// when the page is loaded
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

  /*#3 fetch sub movie components */
  getMovieSubComponent(movieIdfromURL).then(([credit, review, recommendation, similar]) => {
    credit; //fetch credit data. return object
    review; //fetch review data. return object
    recommendation; //fetch recommendation data. return object. 
    similar; //fetch similar data. return object

    console.log("I am here!!!!!");
    console.log("credit", credit);
    console.log("review", review.results);
    console.log("recommendation", recommendation.results);
    console.log("similar", similar.results);

    //get director name 
    let director;
    if (credit.crew.length === 0) {
      director = "no info";
    } else {
      const result = credit.crew.find(elem => elem.job === "Director"); //returns object
      director = result["name"];
    }

    //get cast array
    const castArray = credit.cast;
    console.log(castArray);

    //get review
    const reviewArray = review.results;

    //get recommendations
    const recomArray = recommendation.results;

    displayMovieInfo(component, director); //after 5 seconds interval,display the top part (overview)
    displayMovieDetail(castArray, reviewArray, recomArray); //after 5 seconds interval

  }).catch((error) => {
    console.error(`Error = ${error}. Unable to fetch sub component data by movieId`);
    return error;
  });

  return movieComponent, movieIdfromURL;
});

// when "Watch Trailer" button is clicked
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