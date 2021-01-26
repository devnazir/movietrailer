export class publicApi {
    constructor(object) {
        const { path, query, page } = object;
        this.path = path;
        this.query = query;
        this.page = page;

        this.url = "";
        this.api = "";
        this.apiKey = "";
    }

    async movies() {
        this.api = `https://api.themoviedb.org/3/`;
        this.apiKey = process.env.APIKEY_TMDB;

        const query = this.query ?? '';
        const page = this.page ?? '';
        this.url = `${this.api}${this.path}?api_key=${this.apiKey}&page=${page}&query=${query}`;

        if (query === "" && page === "" && this.url.includes("&query=")) {
            return await fetch(this.url.replace("&page=&query=", ""))
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json();
                }).then(response => response.results);
        }

        return await fetch(this.url).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        }).then(response => response.results);
    }
    async trailer(channelId) {
        this.api = `https://youtube.googleapis.com/youtube/v3/`;
        this.apiKey = process.env.APIKEY_YT;

        const id = channelId ?? '';
        this.url = `${this.api}${this.path}?part=snippet&channelId=${id}&maxResults=1&q=${this.query}&type=video&key=${this.apiKey}`
        return await fetch(this.url).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
    }
}