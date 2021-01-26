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
        this.page = 1;

        this.loading.forEach(loading => {
            loading.classList.add("spin")
        });

        this.getPopularMovies();
        this.event();
    }

    async searchMovies(event) {
        if (event.key == "Enter") {
            try {
                const value = this.value;
                const data = await new Api({
                    path: "search/multi",
                    query: value,
                }).movies();

                new Movies().updateUISection(data)
            }

            catch (err) {
                console.log(err)
            }

        }
    }

    updateUISection(data) {
        const section = document.querySelectorAll("section");
        const resultSearch = document.querySelector(".result-search");
        const btnBack = resultSearch.querySelector("button");
        const popularMov = document.querySelector(".popular-movies");
        const header = document.querySelector("header");

        btnBack.addEventListener("click", () => {
            section.forEach(sec => {
                sec.style.display = "block";
            });
            header.style.cssText = "height: auto;"
            popularMov.style.display = "block";
            resultSearch.style.display = "none";
            return;
        });

        header.style.cssText = "height: 50px;"
        popularMov.style.display = "none";
        resultSearch.style.display = "block";
        section.forEach(sec => {
            sec.style.display = "none";
        });

        this.showResultMovies(data, resultSearch);
    }

    showResultMovies(data, resultSearch) {
        let resultMov = "";
        const cards = resultSearch.querySelector(".cards")
        data.forEach(movie => {
            console.log(movie)
            resultMov += this.templateGenres(movie);
        });

        cards.innerHTML = resultMov;
    }

    clickingButtonPlay(event) {
        event.path.some(check => {
            if (check.className === "next-pop" || check.className === "card-title") {
                import(/* webpackChunkName: 'trailer' */ './trailer')
                    .then(response => {
                        new response.Trailer().getTrailer(check);
                    })
            } else if (check.className == "icon-search") {
                const inputsearch = check.previousElementSibling;
                inputsearch.classList.add("show");
                inputsearch.focus();
                check.classList.add("hide");

                inputsearch.addEventListener("focusout", () => {
                    inputsearch.classList.remove("show");
                    check.classList.remove("hide");
                    inputsearch.value = "";
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
        this.loading.forEach(loading => {
            loading.classList.remove("spin");
            loading.parentElement.style.display = 'none';
        });
    }

    updateUIPopularMovies(data) {
        let popular = "";
        data.forEach(movie => {
            popular += this.templatePopular(movie);
        });

        this.containerPopularMovies.innerHTML = popular;
        this.checkWidthUserBrowser();
    }

    checkWidthUserBrowser() {
        if (window.innerWidth <= 576) {
            const images = this.containerPopularMovies.querySelectorAll(".card");
            const dots = document.getElementsByClassName("dot");
            const sectionGenre = document.querySelector("section#genre");
            const h3 = sectionGenre.querySelector("h3");

            sectionGenre.style.marginTop = "1rem";
            h3.textContent = "Recommended Movies";
            this.ul.style.display = "none";

            this.showSlides(images, dots);
        }

        if (window.innerWidth <= 992) {
            const nextPage = document.querySelector(".page-featured .next-page");
            const span = document.querySelector(".page-featured .page-currently");
            const prevPage = document.querySelector(".page-featured .prev-page");

            nextPage.addEventListener("click", () => {
                this.page++;
                this.getFeaturedMovies(this.page);
                span.textContent = `Page ${this.page}`;
                return;
            });

            prevPage.addEventListener("click", () => {
                this.page--;
                if (this.page <= 0) this.page = 1;
                span.textContent = `Page ${this.page}`;
                this.getFeaturedMovies(this.page);
                return;
            });


            this.getFeaturedMovies();
        }
    }

    async getFeaturedMovies(page) {
        const data = await new Api({
            path: "trending/all/week",
            query: "",
            page: page,
        }).movies();

        this.updateUIFeaturedMovies(data);
    }

    updateUIFeaturedMovies(data) {
        let featured = "";
        data.forEach(movie => {
            featured += this.templateGenres(movie)
        });

        this.containerFeaturedMovies.innerHTML = featured;
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

        this.hamburger.addEventListener("click", this.openMenu);
    }

    openMenu() {
        const ul = this.nextElementSibling.nextElementSibling;
        if(ul.classList.contains("open-menu")) {
            this.classList.remove("fixed");
            ul.classList.remove("open-menu");
            return;
        }
        ul.classList.add("open-menu");
        this.classList.add("fixed");
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
                    <button class="next-pop" data-btn='${movie.title}'>
                        <img loading="lazy" src="${require('../images/btn-play.png')}" alt="Trailer" data-btn='${movie.title}'>
                    </button>
                </div>
                <div class="card-title" data-btn="${movie.media_type == "movie" ? movie.title : movie.name}">
                    <h3>${movie.title}</h3>
                    <span>${movie.release_date}</span>
                </div>
                <div class="rating">
                    <div>
                        <img loading="lazy" src="${require('../images/star.png')}" alt="Star"'>
                        <p>${movie.vote_average}</p>
                    </div>
                </div>
            </div>`;
    }

    templateGenres(movie) {
        return `<div class="card">
                <div class="thumbnail" >
                    <img loading="lazy" src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="Thumbnail">
                </div>
                <div class="card-title" data-btn="${movie.media_type == "movie" ? movie.title : movie.name}">
                    <h3>${movie.media_type == "movie" ? movie.title : movie.name ?? movie.original_title}</h3>
                    <span>${movie.release_date}</span>
                    <div>
                        <img loading="lazy" src="${require('../images/star.png')}" alt="Star"'>
                        <p>${movie.vote_average}</p>
                    </div>
                </div>
            </div>`;
    }

    showSlides(images, dots) {
        for (let i = 0; i < 4; i++) {
            images[i].style.display = "none";
        }

        this.slideIndex++;
        if (this.slideIndex >= 4) { this.slideIndex = 1 }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        images[this.slideIndex - 1].style.display = "block";
        dots[this.slideIndex - 1].className += " active";

        setTimeout(() => {
            this.showSlides(images, dots);
        }, 3000)
    }
}

class Genre extends Movies {
    constructor() {
        super();
        this.event();
        this.pageGenre = 1;
        this.clickingPagination();
    }

    clickingPagination() {
        const nextPage = document.querySelector(".page-genres .next-page");
        const span = document.querySelector(".page-genres .page-currently");
        const prevPage = document.querySelector(".page-genres .prev-page");

        nextPage.addEventListener("click", () => {
            this.pageGenre++;
            this.checkGenreId("all", this.pageGenre);
            span.textContent = `Page ${this.pageGenre}`;
            return;
        });

        prevPage.addEventListener("click", () => {
            this.pageGenre--;
            if (this.pageGenre <= 0) this.pageGenre = 1;
            span.textContent = `Page ${this.pageGenre}`;
            this.checkGenreId("all", this.pageGenre);
            return;
        });
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

    async checkGenreId(genreId, page) {
        try {
            const data = await new Api({
                path: "trending/movie/day",
                query: "",
                page: page,
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

if (window.innerWidth <= 576) {
    new Genre().checkGenreId("all");
} else {
    new Genre().checkGenreId(28);
}

new Movies();