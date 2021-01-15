function getMovies(path, query) {
    let api = `https://api.themoviedb.org/3/`;
    let apiKey = `6fa39716df5c82d1be46c3d685c8c56c`;

    const checkQuery = query ?? '';
    let url = `${api}${path}?api_key=${apiKey}&query=${checkQuery}`;

    if (checkQuery === "" && url.includes("&query=")) {
        return fetch(url.replace("&query=", ""))
    }

    return fetch(url);
}

export { getMovies }

function getTrailer(path, query) {
    // let playVideo = `https://www.youtube.com/watch?v=`;
    let api = `https://youtube.googleapis.com/youtube/v3/`
    let apiKey = `AIzaSyAcw7mlBn6gDe2wW6BsK2zCkIwu69JwDuc`;
    let channelId = `UCi8e0iOVk1fEOogdfu4YgfA`;

    let url = `${api}${path}?part=snippet&channelId=${channelId}&maxResults=1&q=${query}&type=video&key=${apiKey}`;

    return fetch(url);
}

// console.log(getTrailer())