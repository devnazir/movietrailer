import '../scss/main.scss';
import { getMovies } from './getApi';

let scrollLeft;
let onMouseDown = false;
let startX = 0;

const loading = document.querySelector(".loading .circle");
const popularMovies = document.querySelector(".content-popular");
const genreContainer = document.querySelector("section#genre .movies");
const genreNav = document.querySelectorAll(".genre-nav li");
const linkGenre = document.querySelectorAll(".genre-nav a");
const search = document.querySelector(".input-search");
const next = document.querySelector(".next");

// Menampilkan Movie yang populer bulanan
async function fecthMoviesPopular() {
    try {
        const popularWeek = await getMovies("trending/movie/week");
        loading.classList.add("spin");
        getMoviesPopular(popularWeek)
    }
    catch (e) {
        console.log(e)
    }
}

// Menampilkan Movie yang populer harian
async function fetchMoviesPopularDay() {
    try {
        const popularDay = await getMovies("trending/movie/day");
        getMoviesByGenre(popularDay, "all") 
    }
    catch (e) {
        console.log(e)
    }
}

// Ambil data movie populer
async function getMoviesPopular(data) {
    try {
        const response = await data.json();
        loading.classList.remove("spin");
        showMovies(response);
        loading.parentElement.style.display = 'none';
    }

    catch (e) {
        console.log(e)
    }
}

// Tampilkan data movie
function showMovies(response) {
    const results = response.results;
    let popular = "";

    results.forEach(movie => {
        popular += loadListMoviePopular(movie);
    });

    popularMovies.innerHTML = popular;
    popularMovies.addEventListener("mousedown", mouseDown);
    popularMovies.addEventListener("mousemove", mouseMove);
    popularMovies.addEventListener("mouseup", mouseUp);
    popularMovies.addEventListener("mouseleave", mouseUp);
}

// Fungsi mengecek setiap genre id dan menambah kelas active ketika di click
function browseByGenre() {
    const genreId = this.dataset.genre;
    checkActiveClass();
    this.classList.add("active");
    checkGenreId(genreId);
}
genreNav.forEach(li => li.addEventListener("click", browseByGenre));
linkGenre.forEach(a => a.addEventListener("click", (e) => e.preventDefault()));

// cek apakah link sebelumnya ada kelas active
function checkActiveClass() {
    return genreNav.forEach(li => {
        if (li.classList.contains("active")) {
            li.classList.remove("active");
        }
    });
}

// Fetch API populer harian
async function checkGenreId(genreId) {
    try {
        const data = await getMovies("trending/movie/day");
        getMoviesByGenre(data, genreId);
    }

    catch (e) {
        console.log(e)
    }
}

// Ambil data movie populer harian bagian genre
async function getMoviesByGenre(response, genreId) {
    const data = await response.json();
    const results = data.results;
    showMoviesByGenre(results, genreId);
}

// Tampilkan data movie sesuai genre
function showMoviesByGenre(results, genreId) {
    let genres = "";
    results.forEach(movie => {
        const id = movie.genre_ids;
        if (id.includes(parseInt(genreId))) {
            genres += loadMoviesByGenre(movie)
        }

        if (genreId == "all") {
            genres += loadMoviesByGenre(movie)
        }
    });

    genreContainer.innerHTML = genres;
    genreContainer.addEventListener("mousedown", mouseDown);
    genreContainer.addEventListener("mousemove", mouseMove);
    genreContainer.addEventListener("mouseup", mouseUp);
    genreContainer.addEventListener("mouseleave", mouseUp);
}

// Fungsi untuk mencari film
async function searchMovies(event) {
    const value = search.value;
    if (event.key == "Enter") {
        try {
            const data = await getMovies("search/movie", value)
            console.log(data)
        }
        catch (e) {
            console.log(e)
        }
    }
}
search.addEventListener("keydown", searchMovies);

// Ketika mouse diklik atau ditekan
function mouseDown(e) {
    e.preventDefault();
    onMouseDown = true;
    startX = e.clientX;
    scrollLeft = this.scrollLeft;
}

// ketika cursor mouse digeser
function mouseMove(e) {
    e.preventDefault();
    if (!onMouseDown) return;
    let x = e.clientX;
    let scroll = (x - startX);

    e.path.some(element => {
        if (element.localName == "header") {
            popularMovies.scrollLeft = scrollLeft - (scroll);
            if (popularMovies.scrollLeft == (popularMovies.scrollWidth - popularMovies.clientWidth)) {
                next.style.cssText = 'opacity: 1';
            } else {
                next.style.cssText = 'opacity: 0';
            }
        }
        else if (element.className == "movies") {
            genreContainer.scrollLeft = scrollLeft - (scroll);
        }
    });
}

// ketika klik mouse di lepas
function mouseUp() {
    onMouseDown = false;
}

// Template movie popular
function loadListMoviePopular(movie) {
    return `<div class="card">
                <div class="thumbnail">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/w400${movie.backdrop_path}" alt="Thumbnail" >
                    <button data-btn='${movie.title}'>
                        <img loading="lazy" src="${require('../images/btn-play.png')}" alt="Trailer">
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

// Template movie sesuai genre
function loadMoviesByGenre(movie) {
    return `<div class="card">
                <div class="thumbnail">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="Thumbnail">
                </div>
                <div class="card-title">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                    <span>&#11088;${movie.vote_average}</span>
                </div>
            </div>`
}

fecthMoviesPopular();
fetchMoviesPopularDay();