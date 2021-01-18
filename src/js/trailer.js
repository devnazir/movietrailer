import { publicApi as Api } from './getApi';

export class Trailer {
    constructor() {
        this.trailerContainer = document.querySelector(".trailer-container");
        this.content = this.trailerContainer.querySelector(".trailer-container .content");
    }

    async getTrailer(event) {
        try {
            const querySeacrh = event.target.dataset.btn;
            const data = await new Api({
                path: "search",
                query: querySeacrh,
            }).trailer('UCi8e0iOVk1fEOogdfu4YgfA');

            this.showTrailerMovies(data);
        }
        catch (err) {
            console.log(err);
        }
    }

    showTrailerMovies(data) {
        this.trailerContainer.classList.add("full-height");
        const videoId = data.items[0].id.videoId;
        this.content.innerHTML = this.templateTrailer(videoId);

        const btnBack = this.content.querySelector(".btn-back");
        btnBack.addEventListener("click", () => {
            this.trailerContainer.classList.remove("full-height");
        });
    }

    templateTrailer(videoId) {
        return `
            <div class="trailer">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="description">
                <div class="btn-back">
                    <a href="#">Back to Homepage</a>
                </div>
            </div>
        `;
    }
}
