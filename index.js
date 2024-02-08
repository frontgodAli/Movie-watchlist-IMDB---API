const inputEl=document.getElementById("input-el")
const container=document.getElementById("movies-list")
const watchlist=document.getElementById("watchlist-container")
let moviesArray=[]


document.getElementById("search").addEventListener("click",()=>{
    fetch(`http://www.omdbapi.com/?apikey=177fc91e&s=${inputEl.value}`)
    .then(res => res.json())
    .then(data => {
        
        const promises=data.Search.map(movie=>{
            return fetch(`http://www.omdbapi.com/?apikey=177fc91e&i=${movie.imdbID}`)
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
                container.innerHTML=htmlArray.join("")
            })
    })
})


document.addEventListener("click",e=>{
    if(e.target.dataset.add){
        saveMovieToLocalStorage(e.target.dataset.add)
    }
    
})
function saveMovieToLocalStorage(imdbID){
    fetch(`http://www.omdbapi.com/?apikey=177fc91e&i=${imdbID}`)
        .then(res => res.json())
        .then(data =>{
            const movieObj={
                image:data.Poster,
                title:data.Title,
                time:data.Runtime,
                genre:data.Genre,
                rating:data.imdbRating,
                plot:data.Plot
            }
            moviesArray.push(movieObj)
            localStorage.setItem("movies",JSON.stringify(moviesArray))
        })
}


function getMovieFromLocalStorage(){
    if(localStorage.getItem("movies")){
        const savedMovies=JSON.parse(localStorage.getItem("movies"))
        return savedMovies
    }else{
        return null
    } 
}

function displayMoviesOnLocalStorage(){
    const movies=getMovieFromLocalStorage()
    if(movies){
        const moviesHtml=movies.map(data=>{
            return `<div class="movie-grid">
            <img class="movie-img" src="${data.Poster}">
            <div class="title-container">
                <h2 class="movie-title">${data.Title}</h2>
                <i class="fa-solid fa-star star"></i>
                <p id="rating">${data.imdbRating}</p>
            </div>a
            <div class="desc-container">
                <p class="movie-time">${data.Runtime}</p>
                <p class="movie-genre">${data.Genre}</p>
                <button class="movie-add">-</button>
            </div>
            <p class="movie-desc">${data.Plot}</p>
        </div>`
        }).join("")
        watchlist.innerHTML=moviesHtml
    }else{
        watchlist.innerHTML=`<div>Watchlist is empty</div>`
    }
}



function displayMovies(){
    
}