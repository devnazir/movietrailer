class ElementMovies {
    constructor() {
        this.loading = document.querySelector(".loading .circle");
        this.containerPopularMovies = document.querySelector(".content-popular");
        this.containerGenresMovies = document.querySelector("section#genre .movies");
        this.containerFeaturedMovies = document.querySelector("section#featured .featured-movies");
        this.linkGenre = document.querySelectorAll(".genre-nav a");
        this.search = document.querySelector(".input-search");
        this.genreNav = document.querySelectorAll(".genre-nav li");
        this.ul = document.querySelector(".genre-nav ul");
        this.next = document.querySelector(".next");
        this.iconSearch = document.querySelector(".icon-search");
    }
}

export { ElementMovies };