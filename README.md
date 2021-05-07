# Movie Theater Booking Website

[Go to website](https://yukiramu.github.io/Movie-Theater-Booking/)

## Features

* Keyword search
* Watch trailer
* View detail of the movie (cast, reviews, and recommendation)
* Seat selection and booking (local storage)
* View movies currently on show

## Teck Stacks

* HTML
* SASS/CSS
* JavaScript
* Bootstrap 5.0
* GitHub action / pages

## File Structure
```bash
/root
├─ index.html
├─ movie.html
├─ seatSelection.html
├─ imageConfig.json
├─ LICENSE
├─ /img
├─ /flaticon
├─ /css
│   │── style.scss  # main style   
│   │── style.css  
│   │── style.css.map 
│   │── movie.scss  # movie detail page style 
│   │── movie.css  
│   │── movie.css.map 
│   │── seatSelection.scss   # booking page style  
│   │── seatSelection.css  
│   │── seatSelection.css.map 
│   │── component.scss     # global variables, styles, @mixin, @keyframe
│   │── bootstrap-reboot.css  
│   └── bootstrap-reboot.css.map 
└─ /js
    │── component.js   # global variables and functions
    │── data.js    # fetch API data
    │── main.js    # for index.html
    │── movie.js   # for movie.html
    └── seatSelection.js    # for seatSelection.html
```


## JavaScript

* How to pass the movieId among three htmls
* How to store the seat map into Local Storage

## License
[MIT](https://github.com/YukiRamu/Movie-Theater-Booking/blob/master/LICENSE)
