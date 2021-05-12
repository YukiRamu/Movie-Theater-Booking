/* testing if the mobile read this script */
alert("Hi I am a test javascript file");



/* Movie component preparation = global variables */
//get URL parameter (movieId)
const urlParams = new URLSearchParams(window.location.search);
const movieIdfromURL = urlParams.get("movieId");

//object
const seatPrice = {
  regular: 10,
  vip: 20
};

class UI {
  constructor(seatType, isSelected) {
    this._seatType = seatType; //regular or vip
    this._isSelected = isSelected // is "selected" in classList? true or false
    this._totalTicketNum = 0;
    this._totalPrice;
  };

  //static property
  static regularSeatCount = 0;
  static vipSeatCount = 0;
  static regSubTtl = 0;
  static vipSubTtl = 0;

  //method
  //#1 add "selected" class to the target or remove it 
  toggleSelected(target) {
    target.classList.toggle("selected");
  };

  //#2 Add seats to Your Seats Panel
  addSeat() {
    //count the number of tickets
    if ((this._seatType === "regular")) {
      UI.regularSeatCount++;
      regularTicketNum.innerHTML = UI.regularSeatCount; //display reg ticket num
      UI.calcTotalPrice(UI.regularSeatCount, this._seatType);
    } else if (this._seatType === "vip") {
      UI.vipSeatCount++;
      vipTicketNum.innerHTML = UI.vipSeatCount; //display vip ticket num
      UI.calcTotalPrice(UI.vipSeatCount, this._seatType);
    };
    //total ticket count
    this._totalTicketNum = UI.regularSeatCount + UI.vipSeatCount;
    totalTicketNum.innerHTML = this._totalTicketNum;
  };

  //#3 Calculate the price and show total
  static calcTotalPrice(seatNum, seatType) {
    //sub total
    if (seatType === "regular") {
      UI.regSubTtl = seatPrice["regular"] * seatNum;
      regularSubtotal.innerHTML = `$ ${UI.regSubTtl}`;
    } else if (seatType === "vip") {
      UI.vipSubTtl = seatPrice["vip"] * seatNum;
      vipSubtotal.innerHTML = `$ ${UI.vipSubTtl}`;
    };
    //total ticket price
    this._totalPrice = UI.regSubTtl + UI.vipSubTtl;
    totalPrice.innerHTML = `$ ${this._totalPrice}`;
  };

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
    };
    //total ticket count
    this._totalTicketNum = UI.regularSeatCount + UI.vipSeatCount;
    totalTicketNum.innerHTML = this._totalTicketNum;
  };

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
  };

  static showMap() {
    //Show map
    seatLabel.classList.add("show");
    screenLine.classList.add("show");
    seatContainer.classList.add("show");
    note.classList.add("show");
    yourSeat.classList.add("show");
    footer.classList.add("show");
  };

  static hideMap() {
    //Hide map
    seatLabel.classList.remove("show");
    screenLine.classList.remove("show");
    seatContainer.classList.remove("show");
    note.classList.remove("show");
    yourSeat.classList.remove("show");
    footer.classList.remove("show");
  };

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
  };
};

/* ========== Call methods ==========*/
/* When the thieater is picked, display the name of the theater */
theaterChoice.onchange = () => {
  cinemaLocation.innerHTML = theaterChoice.value;
  UI.hideMap();
};

/* When "view Seats" button is clicked */
viewSeatsBtn.addEventListener("click", () => {
  displaySeatMap(theaterChoice.value, movieIdfromURL);
});
//get seatMap from local storage
const displaySeatMap = (theater, movieId) => {
  let filteredSeatMap;
  let listOfIndexWithBooked = [];
  let listOfIndexWithAvailable = [];

  alertMessage.classList.remove("show"); //remove alert if it is shown
  // #1: get all from localStorage
  let seatMap = JSON.parse(localStorage.getItem("seatMap"));

  // #2: find the index of NodeList, "seat" where classList "booked" to be added
  // #2-1: prepare the seatMap data only for the theater and movie currently selected
  filteredSeatMap = seatMap.filter(elem => (elem.theater === theater) && (elem.movieId === movieId));

  console.log("filteredSeatMap", filteredSeatMap);

  // #2-2 :when no data stored for the selected theater, show all seats as available
  if (filteredSeatMap.length === 0) {
    Array.from(regularSeats).forEach(elem => {
      elem.classList.remove("selected");
      elem.classList.remove("booked");
    });
    Array.from(vipSeats).forEach(elem => {
      elem.classList.remove("selected");
      elem.classList.remove("booked");
    });
  } else {
    filteredSeatMap.map((elem) => {
      if (elem.seatMap[0].status === "booked") {
        //find the index where class "BOOKED" to be added
        listOfIndexWithBooked.push(filteredSeatMap.indexOf(elem));
        //add classList where already booked
        listOfIndexWithBooked.map(elem => seat[elem].childNodes[0].classList.remove("selected"));
        listOfIndexWithBooked.map(elem => seat[elem].childNodes[0].classList.add("booked"));
      } else {
        //find the index where class "BOOKED" to be removed
        listOfIndexWithAvailable.push(filteredSeatMap.indexOf(elem));
        //remove classList where alreay selected
        listOfIndexWithAvailable.map(elem => seat[elem].childNodes[0].classList.remove("selected"));
        listOfIndexWithAvailable.map(elem => seat[elem].childNodes[0].classList.remove("booked"));
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
    if (event.target.classList.contains("booked")) {
      //do nothing : disabled
    } else if (event.target.classList.contains("selected")) { //cancel selected
      let regular = new UI("regular", true);
      regular.toggleSelected(event.target);
      regular.removeSeat();
    } else { // seats selected
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
    if (event.target.classList.contains("booked")) {
      //do nothing
    } else if (event.target.classList.contains("selected")) {
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

//check out and update the local storage
checkOutBtn.addEventListener("click", () => {
  checkOut(theaterChoice.value, movieIdfromURL);
});
const checkOut = (theater, movieId) => {
  //validation check alert if no seat is selected
  if (totalPrice.innerHTML === "$ 0") {
    alertMessage.classList.add("show");
    return false;
  } else {
    //scroll to top
    window.scrollTo(0, 0);
    //store data into localStorage
    // #1: get all from localStorage
    let seatMapArray = JSON.parse(localStorage.getItem("seatMap")); //get all from localStorage

    // #2: find the index of NodeList, "seat", from where the data should be updated
    // #2-1: prepare the seatMap data only for the movie currently selected
    let filteredSeatMap = seatMapArray.filter(elem => (elem.theater === theater) && (elem.movieId === movieId));

    // #2-2: convert Nodelist to array - current data before update
    seatArrayfromNodeList = Array.from(seat);

    // #2-3 when no data stored, simply push data
    let seatStatus;
    if (filteredSeatMap.length === 0) {
      seatArrayfromNodeList.map(elem => {
        //if selected class is toggled
        if (elem.firstChild.classList.contains("selected")) {
          seatStatus = "booked";
        } else {
          seatStatus = "available";
        }
        return seatMapArray.push(
          {
            movieId: movieIdfromURL,
            theater: theaterChoice.value,
            seatMap: [{
              seatType: elem.firstChild.classList[1], //regSeat or vipSeat
              status: seatStatus, //booked or available
              locationIndex: seatArrayfromNodeList.indexOf(elem)
            }]
          }
        );
      });
    } else {
      //data already stored -> update the element(s)
      seatArrayfromNodeList.map((elem) => {
        if (elem.firstChild.classList.contains("selected")) {
          indexToBeUpdated.push(seatArrayfromNodeList.indexOf(elem)); //store the index to be updated
        };
      })

      //#3: find the index from localStorage (seatMapArray) where data is to be updated
      let startIndex = seatMapArray.indexOf(seatMapArray.find(value => (value.theater === theater && (value.movieId === movieId))));

      //#4: update seatMapArray
      //i.e. )54 = 0, 55 = 1, 56 = 2......108 = 53
      indexToBeUpdated.map((elem) => {
        //replace
        seatMapArray.splice(startIndex + elem, 1, {
          movieId: movieIdfromURL,
          theater: theater,
          seatMap: [{
            seatType: seatMapArray[startIndex + elem].seatMap[0].seatType, //regSeat or vipSeat
            status: "booked", //update!
            locationIndex: elem
          }]
        });
      })
    };

    //store new data and show complete msg
    localStorage.setItem("seatMap", JSON.stringify(seatMapArray));

    completeMsg.style.transform = "translateY(0rem)";
  };
};

/* When the page is loaded 
//At the very first time, localStorage is null
//store emply array
//The JSON.stringify() method converts a JavaScript object into an array.
//array -> convert to object */
window.addEventListener("DOMContentLoaded", async () => {

  //********************* Testing ***************************** */
  alert(`test.js movie ID is ${movieIdfromURL}`);
  alert(localStorage.length);
  alert(localStorage.getItem("seatMap"));


  if ((localStorage.length === 0) || (localStorage.getItem("seatMap") === null)) {
    localStorage.setItem("seatMap", JSON.stringify(Object.entries([])));
  };

  alert(localStorage.getItem("seatMap"));

  /* Show movie title, description and trailer*/
  movieComponent = await getMovieDetailById(movieIdfromURL);

  alert(movieComponent);

  let title;
  let overview;
  let backdropPath;

  title = movieComponent[0].title;
  overview = movieComponent[0].overview;
  backdropPath = movieComponent[0].backdrop_path;

  titleHeader.innerText = `${title}`;
  titleHeader.style.opacity = 1;
  description.innerText = `${overview}`;
  body.style.backgroundImage = `url(${backdropBaseURL}${backdropPath})`;
  body.style.backgroundPosition = "center";
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";

  UI.displayTrailer(movieIdfromURL);
  return;
});
