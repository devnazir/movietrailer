export class publicApi {
    constructor(object) {
        const { path, query } = object;
        this.path = path;
        this.query = query;

        this.url = "";
        this.api = "";
        this.apiKey = "";
    }

    async movies() {
        this.api = `https://api.themoviedb.org/3/`;
        this.apiKey = `6fa39716df5c82d1be46c3d685c8c56c`;

        const query = this.query ?? '';
        this.url = `${this.api}${this.path}?api_key=${this.apiKey}&query=${query}`;
        return await fetch(this.url).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json();
        }).then(response => response.results);
    }

    async trailer(channelId) {
        this.api = `https://youtube.googleapis.com/youtube/v3/`;
        this.apiKey = `AIzaSyDv8wAkRENMnAXnAqx4QsUs8ufDokXTXt0`;

        this.url = `${this.api}${this.path}?part=snippet&channelId=${channelId}&maxResults=1&q=${this.query}&type=video&key=${this.apiKey}`
        return await fetch(this.url).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
    }
}