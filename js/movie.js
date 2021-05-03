/* function declaration */
const displayMovieInfo = (component) => {
  //for category component
  let htmlCategory = component[0].category[0].map((elem) => {
    return `<p class="col">${elem}</p>`;
  }).join("");

  console.log(htmlCategory)

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
      <div class="row overviewRow">
        <p class="col">${component[0].overview}</p>
      </div>
      <div class="row directorRow">
        <p class="col"><span><i class="far fa-clock"></i> ${component[0].runtime} mins</span><span><i class="far fa-closed-captioning"></i>
            xxxxx</span><span><i class="fas fa-bullhorn"></i> Director Name needs to fetch</span></p>
      </div>

      <div class="row bookRow">
        <button type="button" class="btn btn-outline-light ">▶ Watch trailer</button>
        <a class="col-md-8 btn btn-outline-light bookNowBtn" href="./seatSelection.html" target="_blank"
          role="button"><i class="fas fa-ticket-alt"></i> Book Now</a>
        <h4 class="col-md-4 rate">Rating needs to fetch <span class="badge bg-secondary">IMDB</span></h4>
      </div>
    </div>
    `;

  //backdropRow.innerHTML = html;
}


/* ============ When the window opens ============ */
window.addEventListener("DOMContentLoaded", () => {
  /* Movie component preparation */
  //get movie component from localstorage
  let movieComponent = JSON.parse(localStorage.getItem("movieComponent"));
  console.log("movie component is ", movieComponent);

  //get URL parameter (movieId) and component
  let movieIdfromURL = location.search.slice(9); //get parameter from url and delete "?movieId=" (string)
  let component = movieComponent.filter((elem) => {
    return elem.movieId == movieIdfromURL;
  });

  /* #1 show tagline --> fadeout */
  if (component[0].tagline === "") {
    taglineSection.innerHTML = ` <h2 class="tagline">Loading ...</h2>`; //when no data exists
  } else {
    taglineSection.innerHTML = ` <h2 class="tagline">${component[0].tagline}</h2>`;
  }

  setTimeout(() => {
    taglineSection.classList.add("hide");
    backdropRow.classList.add("show"); //fadeIn
  }, 5000);

  /*#2  show movie component */
  console.log(movieIdfromURL);
  console.log(component);

  displayMovieInfo(component);

});



// alert(urlPrm.sample1);
//backdrop
//category
//title
//description

//another fetch for cast, related movies etc....
