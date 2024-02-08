let moviesArray = getMovieFromLocalStorage() || [];

if(document.getElementById("search")){
    document.getElementById("search").addEventListener("click",()=>{
        fetch(`https://www.omdbapi.com/?apikey=177fc91e&s=${document.getElementById("input-el").value}`)
        .then(res => res.json())
        .then(data => {
            
            const promises=data.Search.map(movie=>{
                return fetch(`https://www.omdbapi.com/?apikey=177fc91e&i=${movie.imdbID}`)
                    .then(res=>res.json())
                    .then(data=>{                 
                        return `<div class="movie-grid">
                        <img class="movie-img" src="${data.Poster}">
                        <div class="title-container">
                            <h2 class="movie-title">${data.Title}</h2>
                            <i class="fa-solid fa-star star"></i>
                            <p id="rating">${data.imdbRating}</p>
                        </div>
                        <div class="desc-container">
                            <p class="movie-time">${data.Runtime}</p>
                            <p class="movie-genre">${data.Genre}</p>
                            <button class="movie-add" data-add="${movie.imdbID}">+</button>
                        </div>
                        <p class="movie-desc">${data.Plot}</p>
                    </div>`
                    })
                    
            })
            Promise.all(promises)
                .then(htmlArray =>{
                    document.getElementById("movies-list").innerHTML=htmlArray.join("")
                })
        })
    })
}



document.addEventListener("click",e=>{
    if(e.target.dataset.add){
        saveMovieToLocalStorage(e.target.dataset.add)
    }if(e.target.dataset.remove){
        removeFromLocalStorage(e.target.dataset.remove)
    }
    
})

function removeFromLocalStorage(imdbID){
    moviesArray = moviesArray.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem("movies", JSON.stringify(moviesArray)); 
    displayMoviesOnLocalStorage()
}

function saveMovieToLocalStorage(imdbID){
    fetch(`https://www.omdbapi.com/?apikey=177fc91e&i=${imdbID}`)
        .then(res => res.json())
        .then(data =>{
            const movieObj={
                image:data.Poster,
                title:data.Title,
                time:data.Runtime,
                genre:data.Genre,
                rating:data.imdbRating,
                plot:data.Plot,
                imdbID:imdbID
            }
            moviesArray.push(movieObj)
            console.log("Saving movie:", movieObj);
            localStorage.setItem("movies",JSON.stringify(moviesArray))
        })
}


function getMovieFromLocalStorage(){
    if(localStorage.getItem("movies")){
        const savedMovies=JSON.parse(localStorage.getItem("movies"))
        console.log("Retrieved movies:", savedMovies);
        return savedMovies
    }else{
        return null
    } 
}

function displayMoviesOnLocalStorage(){
    const watchlistContainer=document.getElementById("watchlist-container")
    
    const movies=getMovieFromLocalStorage()
    console.log("Retrieved movies for display:", movies);
    if(watchlistContainer){
        if(movies){
            const moviesHtml=movies.map(data=>{
                return `<div class="movie-grid">
                <img class="movie-img" src="${data.image}">
                <div class="title-container">
                    <h2 class="movie-title">${data.title}</h2>
                    <i class="fa-solid fa-star star"></i>
                    <p id="rating">${data.rating}</p>
                </div>
                <div class="desc-container">
                    <p class="movie-time">${data.time}</p>
                    <p class="movie-genre">${data.genre}</p>
                    <button class="delete" data-remove="${data.imdbID}">-</button>
                </div>
                <p class="movie-desc">${data.plot}</p>
            </div>`
            }).join("")
            watchlistContainer.innerHTML=moviesHtml
        }
    
    }
}


displayMoviesOnLocalStorage();


