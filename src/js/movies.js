import '../scss/main.scss';
import { publicApi as Api } from './getApi';
import { ElementMovies } from './element';

class Movies extends ElementMovies {
    constructor() {
        super();
        this.scrollLeft;
        this.onMouseDown = false;
        this.startX = 0;
        this.scroll = 0;
        this.slideIndex = 0;

        this.loading.classList.add("spin");
        this.getPopularMovies();
        this.event();
    }

    async searchMovies(event) {
        if (event.key == "Enter") {
            try {
                const value = this.value;
                const data = await new Api({
                    path: "search/movie",
                    query: value,
                }).movies()
                console.log(data)
            }

            catch (err) {
                console.log(err)
            }
        }
    }

    clickingButtonPlay(event) {
        event.path.some(check => {
            if (check.localName === "button") {
                import(/* webpackChunkName: 'trailer' */ './trailer')
                    .then(response => {
                        new response.Trailer().getTrailer(event);
                    });
            }
        });
    }

    async getPopularMovies() {
        try {
            const data = await new Api({
                path: "trending/movie/week",
                query: "",
            }).movies();

            this.updateUIPopularMovies(data);
            this.removeClassSpin();
        }

        catch (err) {
            console.log(err)
        }
    }

    removeClassSpin() {
        this.loading.classList.remove("spin");
        this.loading.parentElement.style.display = 'none';
    }

    updateUIPopularMovies(data) {
        let popular = "";
        data.forEach(movie => {
            popular += this.templatePopular(movie);
        });

        this.containerPopularMovies.innerHTML = popular;

        if(window.innerWidth < 576) {
            let images = this.containerPopularMovies.querySelectorAll(".card");
            this.showSlides(images);
        }
    }

    browseByGenre() {
        const genreId = this.dataset.genre;
        new Genre().checkActiveClass();
        this.classList.add("active");
        new Genre().checkGenreId(genreId);
    }

    event() {
        this.containerPopularMovies.addEventListener("mousedown", this.mouseDown);
        this.containerPopularMovies.addEventListener("mousemove", this.mouseMove);
        this.containerPopularMovies.addEventListener("mouseup", this.mouseUp);
        this.containerPopularMovies.addEventListener("mouseleave", this.mouseUp);

        this.containerGenresMovies.addEventListener("mousedown", this.mouseDown);
        this.containerGenresMovies.addEventListener("mousemove", this.mouseMove);
        this.containerGenresMovies.addEventListener("mouseup", this.mouseUp);
        this.containerGenresMovies.addEventListener("mouseleave", this.mouseUp);

        this.ul.addEventListener("mousedown", this.mouseDown);
        this.ul.addEventListener("mousemove", this.mouseMove);
        this.ul.addEventListener("mouseup", this.mouseUp);
        this.ul.addEventListener("mouseleave", this.mouseUp);

        this.search.addEventListener("keydown", this.searchMovies);
        document.addEventListener("click", this.clickingButtonPlay);
    }

    mouseDown(e) {
        e.preventDefault();
        Movies.onMouseDown = true;
        Movies.startX = e.clientX;
        Movies.scrollLeft = this.scrollLeft;
    }

    mouseMove(e) {
        e.preventDefault();
        if (!Movies.onMouseDown) return;
        let x = e.clientX;
        Movies.scroll = (x - Movies.startX);

        if (this.className == "content-popular") {
            this.scrollLeft = Movies.scrollLeft - (Movies.scroll);

            if (this.scrollLeft == (this.scrollWidth - this.clientWidth)) {
                this.nextElementSibling.style.cssText = 'opacity: 1';
            } else {
                this.nextElementSibling.style.cssText = 'opacity: 0';
            }
        }

        else if (this.className == "movies") {
            this.scrollLeft = Movies.scrollLeft - (Movies.scroll);
        }

        else if (this.className == "links") {
            this.scrollLeft = Movies.scrollLeft - (Movies.scroll);
        }

    }

    mouseUp() {
        Movies.onMouseDown = false;
    }

    templatePopular(movie) {
        return `<div class="card fade">
                <div class="thumbnail">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/w400${movie.backdrop_path}" alt="Thumbnail" >
                    <button data-btn='${movie.title}'>
                        <img loading="lazy" src="${require('../images/btn-play.png')}" alt="Trailer" data-btn='${movie.title}'>
                    </button>
                </div>
                <div class="card-title">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                </div>
                <div class="rating">
                    <span>&#11088;${movie.vote_average}</span>
                </div>
            </div>`;
    }

    templateGenres(movie) {
        return `<div class="card">
                <div class="thumbnail">
                    <img loading="lazy" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="Thumbnail">
                </div>
                <div class="card-title">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                    <span>&#11088;${movie.vote_average}</span>
                </div>
            </div>`;
    }

    showSlides(images) {
        for (let i = 0; i < 4; i++) {
            images[i].style.display = "none";
        }
        this.slideIndex++;
        if (this.slideIndex >= 4) {this.slideIndex = 1} 
        images[this.slideIndex-1].style.display = "block";  

        setTimeout(() => {
           this.showSlides(images);
        }, 2000)   
    }
}

class Genre extends Movies {
    constructor() {
        super();
        this.event();
    }

    event() {
        this.genreNav.forEach(li => li.addEventListener("click", this.browseByGenre));
        this.linkGenre.forEach(a => a.addEventListener("click", (e) => e.preventDefault()));
    }

    checkActiveClass() {
        return this.genreNav.forEach(li => {
            if (li.classList.contains("active")) {
                li.classList.remove("active");
            }
        });
    }

    async checkGenreId(genreId) {
        try {
            const data = await new Api({
                path: "trending/movie/day",
                query: "",
            }).movies();
            this.updateUIGenreMovies(data, genreId);
        }
        catch (err) {
            console.log(err)
        }

    }

    updateUIGenreMovies(data, genreId) {
        let genre = "";
        data.reverse().forEach(movie => {
            const id = movie.genre_ids;
            if (id.includes(parseInt(genreId))) {
                genre += this.templateGenres(movie)
            }

            if (genreId == "all") {
                genre += this.templateGenres(movie)
            }
        });

        this.containerGenresMovies.innerHTML = genre;
    }

}

new Genre().checkGenreId(28);
new Movies();