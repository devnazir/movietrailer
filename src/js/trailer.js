import { publicApi as Api } from './getApi';

export class Trailer {
    constructor() {
        this.trailerContainer = document.querySelector(".trailer-container");
        this.content = this.trailerContainer.querySelector(".trailer-container .content");
        this.loadBody = document.querySelector(".loading-body");
        this.circleLoadBody = this.loadBody.querySelector(".circle");
        this.loadBody.classList.add("show");
        this.circleLoadBody.classList.add("spin");
    }

    async getTrailer(event) {
        try {
            const querySeacrh = event.dataset.btn;
            const dataTrailer = await new Api({
                path: "search",
                query: querySeacrh,
            }).trailer();

            const dataMovie = await new Api({
                path: "search/multi",
                query: querySeacrh
            }).movies();

            this.showTrailerMovies(dataTrailer, dataMovie[0]);
        }
        catch (err) {
            console.log(err);
        }
    }

    showTrailerMovies(dataTrailer, dataMovie) {
        this.trailerContainer.classList.add("full-height");
        const videoId = dataTrailer.items[0].id.videoId;
        
        const title = dataMovie.original_title ?? dataMovie.original_name;
        const overview = dataMovie.overview;

        this.content.innerHTML = this.templateTrailer(videoId, title, overview);
        this.loadBody.classList.remove("show");
        this.circleLoadBody.classList.remove("spin");

        const btnBack = this.content.querySelector(".btn-back");
        btnBack.addEventListener("click", () => {
            this.trailerContainer.classList.remove("full-height");
        });
    }

    templateTrailer(videoId, title, overview) {
        return `
            <div class="trailer">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="description">
                <h2>${title}</h2>
                
                <p>${overview}</p>
                <div class="btn-back">
                    <a href="#">Back to Homepage</a>
                </div>
            </div>
        `;
    }
}
