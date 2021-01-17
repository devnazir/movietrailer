export class publicApi {
    constructor(object) {
        const { api, apiKey, path, query } = object;

        this.api = api;
        this.apiKey = apiKey;
        this.path = path;
        this.query = query;
        this.url = "";
    }

    async movies() {
        const query = this.query ?? '';
        this.url = `${this.api}${this.path}?api_key=${this.apiKey}&query=${query}`;
        return await fetch(this.url)
    }

    async trailer(channelId) {
        this.url = `${this.api}${this.path}?part=snippet&channelId=${channelId}&maxResults=1&q=${this.query}&type=video&key=${this.apiKey}`
        return await fetch(this.url)
    }

}

// Example
// new publicApi({
//     api: "https://api.themoviedb.org/3/",
//     apiKey: "6fa39716df5c82d1be46c3d685c8c56c",
//     path: "",
//     query: "",
// }).movies();

// new publicApi({
//     api: "https://youtube.googleapis.com/youtube/v3/",
//     apiKey: "AIzaSyDv8wAkRENMnAXnAqx4QsUs8ufDokXTXt0",
//     path: "search",
//     query: "avengers",
// }).trailer("UCi8e0iOVk1fEOogdfu4YgfA");