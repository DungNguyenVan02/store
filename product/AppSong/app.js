
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Thương em đến già',
            singer: 'Lê Bảo Bình',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê Ft KaRik',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Đào nương',
            singer: 'Hoàng Vương',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Độ tộc 2',
            singer: 'Độ Mixi x Phúc Du x Pháo',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'BuiTruongLinh',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Chiều hôm ấy',
            singer: 'JayKii',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Hạ còn vương nắng',
            singer: 'Đatkaa',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Váy cưới',
            singer: 'Trung Tự',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handlEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay, dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity //quay vô hạn 
        })
        cdThumbAnimate.pause();

        //Xử lý khi scroll ứng dụng, CD to nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const cdNewWidth = cdWidth - scrollTop;

            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        }
        //Xử lí khi play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            cdThumbAnimate.play();
            player.classList.add('playing');
        };
        //Khi bài hát pause
        audio.onpause = function() {
            _this.isPlaying = false;
            cdThumbAnimate.pause();
            player.classList.remove('playing');
        };

        //Tiến độ bài hat thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }
        //Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime;

        }
        //Khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            }else {
                _this.nextSong(); 
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Khi quay lại bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Khi phát bài ngẫu nhiên
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Xử lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Xử lí repeat bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Lắng nghe click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                //Xử lí khi click vào song list
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xử lí khi click vào options
                if(e.target.closest('.option')) {

                }
            } 
        }
    },
    scrollToActiveSong: function() {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <  0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        //Lắng nghe, xử lý các sự kiện
        this.handlEvents();
        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();
        // Render playlist
        this.render();
    }
}
app.start();

