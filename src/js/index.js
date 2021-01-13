import '../scss/main.scss';
import { getMovies } from './getApi';

let scrollLeft;
let onMouseDown = false;
let startX = 0;

const popularMovies = document.querySelector(".content-popular");
const search = document.querySelector(".input-search");
search.addEventListener("keydown", searchMovies);

window.addEventListener("load", async () => {
    const loading = document.querySelector(".loading .circle");
    await getMovies("trending/movie/week")
        .finally(() => {
            loading.classList.add("spin")
        })
        .then(resolve => {
            getDataMovies(resolve, loading);
        });
});

async function searchMovies(event) {
    const value = search.value;
    if (event.key == "Enter") {
        await getMovies("search/movie", value)
            .then(resolve => {
                console.log(resolve);
            });
    }
}

function getDataMovies(resolve, loading) {
    const response = resolve.json();
    response
        .then(resolve => {
            showDataMovies(resolve, loading);
        })
        .catch(err => {
            console.log(`${err}`)
        })
}

function showDataMovies(resolve, loading) {
    const results = resolve?.results;
    let popular = "";

    results.forEach(movie => {
        popular += loadListMoviePopular(movie);
    });

    popularMovies.innerHTML = popular;
    loading.parentElement.style.display = 'none';


}

function mouseDown(e) {
    e.preventDefault();
    onMouseDown = true;
    startX = e.clientX;
    scrollLeft = this.scrollLeft;
}

function mouseMove(e) {
    if (!onMouseDown) return;
    let x = e.clientX;
    let scroll = (x - startX);
    popularMovies.scrollLeft = scrollLeft - (scroll);
}

function mouseUp() {
    onMouseDown = false;
}

popularMovies.addEventListener("mousedown", mouseDown);
popularMovies.addEventListener("mousemove", mouseMove);
popularMovies.addEventListener("mouseup", mouseUp);
popularMovies.addEventListener("mouseleave", mouseUp);

function loadListMoviePopular(movie) {
    return `<div class="card">
                <div class="thumbnail">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="Thumbnail" >
                    <button>
                        <img src="${require('../images/btn-play.png')}" alt="Trailer">
                    </button>
                </div>
                <div class="card-title">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                </div>
                <div class="rating">
                    <span>&#11088;${movie.vote_average}</span>
                </div>
            </div>`
}

function loadMoviesByGenre(movie) {
    return `<div class="card">
                <div class="thumbnail">
                    <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="Thumbnail">
                </div>
                <div class="card-title">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                    <span>&#11088;${movie.vote_average}</span>
                </div>
            </div>`
}