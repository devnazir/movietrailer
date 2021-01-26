# Movietrailer
Movietrailer merupakan Website yang berisi trailer movie, menggunakan Public API dari https://www.themoviedb.org/ dan Youtube API https://developers.google.com/youtube/v3/docs.

#### Demo: https://devnazir.github.io/movietrailer/
#### Note: 
Jika saat klik movie yang dipilih hanya menampilkan loading atau videonya tidak muncul, kemungkinan sudah limit. Jadi, silahkan ubah api key yt nya menggunakan milik sendiri. Silahkan cek di folder src, cari file getApi. 

```
async trailer(channelId) {
        this.api = `https://youtube.googleapis.com/youtube/v3/`;
        this.apiKey = `Your Apikey`;

        ...
}
```

## Cara install
<ul>
  <li>buka terminal cmd atau gitbash</li>
  <li>git clone https://github.com/devnazir/movietrailer</li>
  <li>cd movietrailer</li>
  <li>npm install</li>
  <li>npm run build</li>
</ul>

### Screenshoot
#### Laptop : 
![Laptop](/example/laptop.png)
#### Tablet :
![Tablet](/example/tablet.png)
#### Smartphone : 
![Smartphone](/example/smartphone.png)

### Play Video
![play](/example/play-on-smartphone.png)
![play](/example/play-on-laptop.png)

<b> Thanks to Irvan for your Design :D </b>
