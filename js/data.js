/* testing if the mobile read this script */
alert("Hi I am a data javascript file : checkin constructor");

/* Fetch Data -- TMDB */
/* *******************************************
/* Fetch API Note - how to access data
/* 1. Search by keyword : getMovieByKeyword()
/* https://api.themoviedb.org/3/search/movie?api_key=a9bfb23ff39a5cefa92aae8e6858a3b2&query=
//
/* 2. Search detail by id (must have "id") : getMovieDetailById() //for runtime
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
/* ******************************************* */

//#1 fetch a list of movie IDs based on a keyword
const getMovieByKeyword = async (keyword, page) => {
  try {
    const movieByKeyword = await fetch(`${baseURL}/3/search/movie?api_key=${APIKey}&query=${keyword}&page=${page}`);
    if (!movieByKeyword.ok) {
      throw error(movieByKeyword.statusText);
    } else {
      const movieList = await movieByKeyword.json();
      return [movieList];
    }
  } catch (error) {
    console.error(`Error = ${error}. Unable to fetch data by keyword`);
    return error;
  };
};

//#2 fetch movie detail by movie id
const getMovieDetailById = async (movieId) => {
  //fetch detail of the selected movie
  try {
    const selectedMovie = await fetch(`${baseURL}/3/movie/${movieId}?api_key=${APIKey}&append_to_response=videos%2Bimages}`);
    if (!selectedMovie.ok) {
      throw error(selectedMovie.statusText);
    } else {
      const selected = await selectedMovie.json();
      return [selected];
    }
  } catch (error) {
    console.error(`Error = ${error}. Unable to fetch data by ID`);
    return error;
  };
};

//#3 fetch category name
const categoryList = async () => {
  try {
    const category = await fetch(`${baseURL}/3/genre/movie/list?api_key=${APIKey}`);
    if (!category.ok) {
      throw error(category.statusText);
    } else {
      const categoryList = await category.json();
      return [categoryList];
    }
  } catch (error) {
    console.error(`Error = ${error}. Unable to fetch category list`);
    return error;
  }
};

/******************** Below are the functions to fetch trailer data ******************* */
//#4 get video key array by movid id
const getVideoByMovieId = async (movieId) => {
  //fetch video key 
  try {
    const videoList = await fetch(`${baseURL}/3/movie/${movieId}/videos?api_key=${APIKey}`);
    if (!videoList.ok) {
      throw error(videoList.statusText);
    } else {
      const video = await videoList.json();

      //#1 prepare video key array and return
      let videoKeyArray = [];
      videoKeyArray.push(video.results.filter((elem) => { return elem.type === "Trailer" }));

      //#2 show modal
      trailerModal.classList.add("show");
      htmlBody.classList.add("trailerModal-active");

      if (videoKeyArray[0].length === 0) {
        //when no trailer found
        trailerContents.innerHTML = "<h1>No trailer available :(</h1>";
        trailerBackground.style.background = `linear-gradient(45deg, black 10%, transparent), url(./img/bg2.jpg)  center fixed no-repeat`;
        trailerBackground.style.backgroundSize = "cover";
      } else {
        //#3 show trailer in the modal if the video key is found
        showTrailer(videoKeyArray, video.id);
        return videoKeyArray;
      };
    }
  } catch (error) {
    console.error(`Error = ${error}. Unable to fetch video data by movieId`);
    return error;
  };
};

//#6 create iframe for trailer
const showTrailer = (videoKeyArray, movieId) => {
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
  showTrailerBackgroundImg(movieId);
};

//#7 add background image to the trailer
const showTrailerBackgroundImg = async (movieId) => {
  let url;

  //get backdrop photo
  const selectedMovie = await getMovieDetailById(movieId);
  let backdropPath = selectedMovie[0].backdrop_path;

  url = backdropBaseURL + backdropPath;

  if ((backdropPath === null)) {
    // when the data is null -- alternative bg
    trailerBackground.style.background = `linear-gradient(45deg, black 10%, transparent), url(./img/bg2.jpg)  center fixed no-repeat`;
    trailerBackground.style.backgroundSize = "cover";
  } else {
    // trailerModal ---add background
    trailerBackground.style.background = `linear-gradient(45deg, black 10%, transparent), url('${url}') center fixed no-repeat`;
    trailerBackground.style.backgroundSize = "cover";
  };
};

//#8 get now playing data
const getNowPlaying = async () => {
  //get category list
  const [getCategoryList, getNowPlaying] = await Promise.all([
    //fetch category list
    fetch(`${baseURL}/3/genre/movie/list?api_key=${APIKey}`)
      .then((categoryResponse) => {
        if (!categoryResponse.ok) {
          throw error(categoryResponse.statusText);
        } else {
          return categoryResponse.json();
        };
      }),
    //fetch now playing
    fetch(`${baseURL}/3/movie/now_playing?api_key=${APIKey}`)
      .then((nowPlayResponse) => {
        if (!nowPlayResponse.ok) {
          throw error(nowPlayResponse.statusText);
        } else {
          return nowPlayResponse.json();
        };
      })
  ]);

  //fetch data in pararel
  const categoryList = await getCategoryList;
  const nowPlayingList = await getNowPlaying;

  //return when both promises are resolved
  return [categoryList, nowPlayingList];
};