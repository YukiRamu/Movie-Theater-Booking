/* Movie component preparation = global variables */
//get URL parameter (movieId, onTheaterFlg)
const urlParams = new URLSearchParams(window.location.search);
const movieIdfromURL = urlParams.get("movieId");
const onTheaterFlgfromURL = urlParams.get("onTheaterFlg");
console.log(movieIdfromURL);
console.log(onTheaterFlgfromURL);

//object
const seatPrice = {
  regular: 10,
  vip: 20
}

class UI {
  constructor(seatType, isSelected) {
    this._seatType = seatType; //regular or vip
    this._isSelected = isSelected // is "selected" in classLise? true or false
    this._totalTicketNum = 0;
    this._totalPrice;
  }
  //static property
  static regularSeatCount = 0;
  static vipSeatCount = 0;
  static regSubTtl = 0;
  static vipSubTtl = 0;

  //method
  //#1 add "selected" class to the target or remove it 
  toggleSelected(target) {
    target.classList.toggle("selected");
  }

  //#2 Add seats to Your Seats Panel
  addSeat() {
    //count the number of tickets
    if (this._seatType === "regular") {
      UI.regularSeatCount++;
      regularTicketNum.innerHTML = UI.regularSeatCount; //display reg ticket num
      UI.calcTotalPrice(UI.regularSeatCount, this._seatType);
    } else if (this._seatType === "vip") {
      UI.vipSeatCount++;
      vipTicketNum.innerHTML = UI.vipSeatCount; //display vip ticket num
      UI.calcTotalPrice(UI.vipSeatCount, this._seatType);
    }
    //total ticket count
    this._totalTicketNum = UI.regularSeatCount + UI.vipSeatCount;
    totalTicketNum.innerHTML = this._totalTicketNum;
  }

  //#3 Calculate the price and show total
  static calcTotalPrice(seatNum, seatType) {
    //sub total
    if (seatType === "regular") {
      UI.regSubTtl = seatPrice["regular"] * seatNum;
      regularSubtotal.innerHTML = `$ ${UI.regSubTtl}`;
    } else if (seatType === "vip") {
      UI.vipSubTtl = seatPrice["vip"] * seatNum;
      vipSubtotal.innerHTML = `$ ${UI.vipSubTtl}`;
    }
    //total ticket price
    this._totalPrice = UI.regSubTtl + UI.vipSubTtl;
    totalPrice.innerHTML = `$ ${this._totalPrice}`;
  }

  //#4 Remove seats from Your Seats panel
  removeSeat() {
    //recount the number of tickets
    if (this._seatType === "regular") {
      UI.regularSeatCount--;
      regularTicketNum.innerHTML = UI.regularSeatCount; //display reg ticket num
      UI.calcTotalPrice(UI.regularSeatCount, this._seatType);
    } else if (this._seatType === "vip") {
      UI.vipSeatCount--;
      vipTicketNum.innerHTML = UI.vipSeatCount; //display vip ticket num
      UI.calcTotalPrice(UI.vipSeatCount, this._seatType);
    }
    //total ticket count
    this._totalTicketNum = UI.regularSeatCount + UI.vipSeatCount;
    totalTicketNum.innerHTML = this._totalTicketNum;
  }

  static clearCalcPanel() {
    regularTicketNum.innerHTML = 0;
    vipTicketNum.innerHTML = 0;
    totalTicketNum.innerHTML = 0;
    regularSubtotal.innerHTML = "$ 0";
    vipSubtotal.innerHTML = "$ 0";
    totalPrice.innerHTML = "$ 0";
    UI.regularSeatCount = 0;
    UI.vipSeatCount = 0;
    UI.regSubTtl = 0;
    UI.vipSubTtl = 0;
  }

  static showMap() {
    //Show map
    seatLabel.classList.add("show");
    screenLine.classList.add("show");
    seatContainer.classList.add("show");
    note.classList.add("show");
    yourSeat.classList.add("show");
    footer.classList.add("show");
  }

  static hideMap() {
    //Hide map
    seatLabel.classList.remove("show");
    screenLine.classList.remove("show");
    seatContainer.classList.remove("show");
    note.classList.remove("show");
    yourSeat.classList.remove("show");
    footer.classList.remove("show");
  }

  static displayTrailer(movieId) {
    //fetch video key
    fetch(`${baseURL}/3/movie/${movieId}/videos?api_key=${APIKey}`)
      .then((response) => {
        if (!response.ok) {
          throw error(response.statusText);
        } else {
          return response.json();
        };
      })
      .then((data) => {
        console.log(data)
        //#1 prepare video key array and return
        let videoKeyArray = [];
        videoKeyArray.push(data.results.filter((elem) => { return elem.type === "Trailer" }));

        if (videoKeyArray[0].length === 0) {
          //when no trailer found
          trailer.innerHTML = "<p>No trailer available :(</p>";
        } else {
          //#3 display trailer 
          trailer.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoKeyArray[0][0].key}?enablejsapi=1&modestbranding=1&iv_load_policy=3?rel=0" title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
          `
          return;
        };
      }).catch((error) => {
        console.error(`Error = ${error}. Unable to fetch video data by movieId`);
        return error;
      });
  }
}

/* ========== Call methods ==========*/
/* When the movie is picked, display the title */
theaterChoice.onchange = () => {
  cinemaLocation.innerHTML = theaterChoice.value;
  UI.hideMap();
};

/* When "view Seats" button is clicked */
//get seatMap from local storage
let listOfIndexWithSelected = [];
let listOfIndexWithoutSelected = [];

const displaySeatMap = (title) => {
  alertMessage.classList.remove("show"); //remove alert if it is shown
  // #1: get all from localStorage
  let seatMap = JSON.parse(localStorage.getItem("seatMap"));

  // #2: find the index of NodeList, "seat" where classList "selected" to be added
  // #2-1: prepare the seatMap data only for the movie currently selected
  let filteredSeatMap = seatMap.filter(elem => elem.theater === title);

  // #2-2 :when no data stored for the selected movie, show all seats as available
  if (filteredSeatMap.length === 0) {
    Array.from(regularSeats).forEach(elem => {
      elem.classList.remove("selected");
    });
    Array.from(vipSeats).forEach(elem => {
      elem.classList.remove("selected");
    });
  } else {
    filteredSeatMap.map((elem) => {
      if (elem.seatMap[0].hasOwnProperty("selected")) {
        //find the index where class "selected" to be added
        listOfIndexWithSelected.push(filteredSeatMap.indexOf(elem));
        //add classList where alreay selected
        listOfIndexWithSelected.map(elem => seat[elem].childNodes[0].classList.add("selected"));
      } else {
        //find the index where class "selected" to be removed
        listOfIndexWithoutSelected.push(filteredSeatMap.indexOf(elem));
        //remove classList where alreay selected
        listOfIndexWithoutSelected.map(elem => seat[elem].childNodes[0].classList.remove("selected"));
      }
    });
  }

  //Show map
  UI.showMap();
};

/* When the seat is selected */
//regular
for (let i = 0; i < regularSeats.length; i++) {
  regularSeats[i].addEventListener("click", (event) => {
    alertMessage.classList.remove("show"); //remove alert if it is shown
    if (event.target.classList.contains("selected")) {
      let regular = new UI("regular", true);
      regular.toggleSelected(event.target);
      regular.removeSeat();
    } else {
      let regular = new UI("regular", false);
      regular.toggleSelected(event.target);
      regular.addSeat();
    }
  });
};
//vip
for (let i = 0; i < vipSeats.length; i++) {
  alertMessage.classList.remove("show"); //remove alert if it is shown
  vipSeats[i].addEventListener("click", (event) => {
    if (event.target.classList.contains("selected")) {
      let vip = new UI("vip", true);
      vip.toggleSelected(event.target);
      vip.removeSeat();
    } else {
      let vip = new UI("vip", false);
      vip.toggleSelected(event.target);
      vip.addSeat();
    }
  });
};

/* When "Add to cart" button is clicked */
//Store SeatMap into localStorage
let seatArrayfromNodeList;
let indexToBeUpdated = [];
let seatType;
let selectedClass;

const checkOut = (title) => {
  //validation check
  if (totalPrice.innerHTML === "$ 0") {
    alertMessage.classList.add("show");
    return false;
  } else {
    //store data into localStorage
    // #1: get all from localStorage
    let seatMapArray = JSON.parse(localStorage.getItem("seatMap")); //get all from localStorage

    // #2: find the index of NodeList, "seat", from where the data is updated
    // #2-1: prepare the seatMap data only for the movie currently selected
    let filteredSeatMap = seatMapArray.filter(elem => elem.theater === title);

    // #2-2: convert Nodelist to array - current data before update
    seatArrayfromNodeList = Array.from(seat);

    // #2-3 when no data stored, simply push data
    if (filteredSeatMap.length === 0) {
      seatArrayfromNodeList.map(elem => {
        return seatMapArray.push(
          {
            theater: theaterChoice.value,
            seatMap: [{
              seatType: elem.firstChild.classList[1], //regSeat or vipSeat
              selected: elem.firstChild.classList[2], //selected or undefined
              locationIndex: seatArrayfromNodeList.indexOf(elem)
            }]
          }
        )
      });
    } else {
      seatArrayfromNodeList.map((elem) => {
        if (elem.firstChild.classList.contains("selected")) {
          indexToBeUpdated.push(seatArrayfromNodeList.indexOf(elem));
        }
      })

      //#3: find the index from localStorage (seatMapArray) where data is to be updated
      let startIndex = seatMapArray.indexOf(seatMapArray.find(value => value.theater === title));

      //#4: update seatMapArray
      //i.e. )54 = 0, 55 = 1, 56 = 2......108 = 53
      indexToBeUpdated.map((elem) => {
        seatMapArray.splice(startIndex + elem, 1, {
          theater: title,
          seatMap: [{
            seatType: seatMapArray[startIndex + 2][seatType], //regSeat or vipSeat
            selected: "selected", //update!
            locationIndex: elem
          }]
        });
      })
    }

    //store new data
    localStorage.setItem("seatMap", JSON.stringify(seatMapArray));
    UI.clearCalcPanel();
    UI.hideMap();
  }
};

/* When the page is loaded 
//For the very first time, localStorage is null
//store emply array
//The JSON.stringify() method converts JavaScript objects into strings.
//array -> convert to object */
window.addEventListener("DOMContentLoaded", async () => {
  if ((localStorage.length === 0) || (localStorage.getItem("seatMap") === null)) {
    localStorage.setItem("seatMap", JSON.stringify(Object.entries([])));
  }

  /* Show movie title, description and trailer*/
  //get movieComponent from localstorage
  if (onTheaterFlgfromURL == "1") {
    movieComponent = JSON.parse(localStorage.getItem("nowOnTheaterComponent"));
  } else {
    movieComponent = await getMovieDetailById(movieIdfromURL);
  }

  console.log(movieComponent);

  let title;
  let overview;
  let backdropPath;
  switch (onTheaterFlgfromURL) {
    case "1":
      title = movieComponent.movieTitle;
      overview = movieComponent.overview;
      backdropPath = movieComponent.backdropPath;
      console.log(title)
      break;
    case "0":
      title = movieComponent[0].title;
      overview = movieComponent[0].overview;
      backdropPath = movieComponent[0].backdrop_path;
      break;
    default:
      break;
  };

  titleHeader.innerText = title;
  titleHeader.style.opacity = 1;
  description.innerText = overview;
  body.style.backgroundImage = `url(${backdropBaseURL}${backdropPath})`;
  body.style.backgroundPosition = "center";
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";

  UI.displayTrailer(movieIdfromURL);

});
