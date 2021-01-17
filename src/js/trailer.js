import { getTrailer, getMovies } from './getApi';
const trailerContainer = document.querySelector(".trailer-container");

export async function trailer(e) {
    const querySeacrh = e.target.dataset.btn;
    try {
        const dataTrailer = await getTrailer("search", querySeacrh)
        searchTrailer(dataTrailer)
    }
    catch(err) {
        console.log(err);
    }
}

async function searchTrailer(res) {
    const data = await res.json();
    loadTrailer(data)
}

function loadTrailer(res) {
    const content = document.querySelector(".trailer-container .content");
    trailerContainer.classList.add("full-height");
    console.log(res)
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