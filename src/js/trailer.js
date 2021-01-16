import { getTrailer } from './getApi';
const trailerContainer = document.querySelector(".trailer-container");

export async function trailer(e) {
    const querySeacrh = e.target.dataset.btn;
    await getTrailer("search", querySeacrh)
        .then(res => {
            if (!res.ok) {
                console.log(res.statusText)
            }
            return res.json();
        })
        .then(res => {
            loadTrailer(res);
        });
}

function loadTrailer(res) {
    const content = document.querySelector(".trailer-container .content");
    trailerContainer.classList.add("full-height");
    const videoId = res.items[0].id.videoId;
    content.innerHTML = showTrailerMovies(videoId);

    const btnBack = content.querySelector(".btn-back");
    btnBack.addEventListener("click", () => {
        trailerContainer.classList.remove("full-height");
    });
}

//template trailer 
function showTrailerMovies(videoId) {
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