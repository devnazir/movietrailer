function getMovies(path, query) {
    let api = `https://api.themoviedb.org/3/`;
    let apiKey = `6fa39716df5c82d1be46c3d685c8c56c`;

    const checkQuery = query ?? '';
    let url = `${api}${path}?api_key=${apiKey}&query=${checkQuery}`;

    if(checkQuery === "" && url.includes("&query=")) {
        return fetch(url.replace("&query=", ""))
    }

    return fetch(url);
}

export { getMovies }

// function getTrailer() {
//     return fetch("https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCi8e0iOVk1fEOogdfu4YgfA&maxResults=1&q=Maze%20Runner&type=video&key=AIzaSyAcw7mlBn6gDe2wW6BsK2zCkIwu69JwDuc")
// }