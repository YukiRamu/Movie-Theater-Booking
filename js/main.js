/* Variables */
//opening animation
const droptexts = document.querySelectorAll(".drops span");
console.log(droptexts);
const bigger = document.querySelector(".bigger");
console.log(bigger);
//search box
const search = document.querySelector(".search");
const searchBtn = document.querySelector(".searchBtn");

/* ============== Animation function  ============== */
//dropping text animation
let dropTextsArray = [];
Array.from(droptexts).forEach(elem => {
  dropTextsArray.push(elem.innerHTML);
});

// let array = Array.from(droptexts);

let index = 0;
const windowOpen = () => {
  droptexts[index].classList.add("show"); //add class to all span tags one by one
  index++;
  if (index === droptexts.length) {
    complete(timer);
  }
}

let index2= 0;
const scaleUp = () => {
  droptexts[index2].classList.add("scaleUp"); //add class to all span tags one by one
  index2++;
  if (index2 === droptexts.length) {
    complete(timer2);
  }
}

let index3= 0;
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

// //#1 drop
// let index = 0;
// let index2 = 0;
// const windowOpen = () => {
//   console.log(array.length);
//   for (let i = 0; i < array.length; i++) {
//     console.log("show");
//     array[i].classList.add("show");
//     i++
//     console.log("I is  ",i)
//     if (i ===array.length) {
//       alert("stop");
//     }
//   }
// alert("stop")
//   if (i === array.length) {
//     console.log("scaleUp");
//     for (let j = 0; j < array.length; j++) {
//       array[j].classList.add("scaleUp");
//       return j
//     }
//     if (j === array.length) {
//       console.log("grow scaleUp");
//       bigger.classList.add("show"); //add class to .grow
//       clearInterval(timer);
//       timer = null;
//       console.log(timer)
//       return;
//     }

//   }

// }
// let timer = setInterval(windowOpen, 300);

// //#2 scale Up
// let index2 = 0;
// const scaleUp = () => {
//   droptexts[index2].classList.add("scaleUp"); //add class to all span tags one by one
//   alert("before");
//   index2++
//   alert("after");
//   if (index2=== dropTextsArray.length) {
//     alert("inside if")
//     fadeIn(); // -> #3
//     clearInterval(timer2);
//     timer2 = null;
//     console.log(timer2)
//     return;
//   }
// }
// let timer2 = setInterval(scaleUp, 100);

// //#3 FadeIn
// const fadeIn = () => {
//   alert("inside fadeIn")
//   bigger.classList.add("show"); //add class to .grow
// }

