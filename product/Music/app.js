


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listSongs = $('.songs-list');
const songItem = $('.songs-list__item')
const cdImg = $('.play__cd--img');
const nameSong = $('.play__cd--name');
const author = $('.play__cd--author');
const audio = $('.audio');
const action = $('.action')
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('.cd__time--progress')
const cdTime = $('.cd__time');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isHeart: false,
    songs: [
        {   
            name: 'Thương em đến già',
            singer: 'Lê Bảo Bình',
            path: './assets/music/song1.mp3',
            image: './assets/img/img_song/song1.jpg'
        },
        {
            name: 'Vì mẹ anh bắt chia tay',
            singer: 'Miu Lê Ft KaRik',
            path: './assets/music/song2.mp3',
            image: './assets/img/img_song/song2.jpg'
        },
        {
            name: 'Đào nương',
            singer: 'Hoàng Vương',
            path: './assets/music/song3.mp3',
            image: './assets/img/img_song/song3.jpg'
        },
        {
            name: 'Độ tộc 2',
            singer: 'Độ Mixi x Phúc Du x Pháo',
            path: './assets/music/song4.mp3',
            image: './assets/img/img_song/song4.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: './assets/music/song5.mp3',
            image: './assets/img/img_song/song5.jpg'
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'BuiTruongLinh',
            path: './assets/music/song6.mp3',
            image: './assets/img/img_song/song6.jpg'
        },
        {
            name: 'Chiều hôm ấy',
            singer: 'JayKii',
            path: './assets/music/song7.mp3',
            image: './assets/img/img_song/song7.jpg'
        },
        {
            name: 'Hạ còn vương nắng',
            singer: 'Đatkaa',
            path: './assets/music/song8.mp3',
            image: './assets/img/img_song/song8.jpg'
        },
        {
            name: 'Váy cưới',
            singer: 'Trung Tự',
            path: './assets/music/song9.mp3',
            image: './assets/img/img_song/song9.jpg'
        }
    ],
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="songs-list__item ${index === this.currentIndex ? 'active' : '' }" data-index = "${index}">
                <div class="songs__info">
                    <img/img_song src="${song.image}" alt="">
                    <span class="songs__info--number">${index}</span>
                    <span class="songs__info--author">${song.singer}</span>
                    <span class="songs__info--dash">-</span>
                    <span class="songs__info--name">${song.name}</span>
                </div>
                <i class="user-love fa-solid fa-heart"></i>
            </div>
            `
        })
        listSongs.innerHTML = htmls.join('');
    },
    handleEvents: function() {
        const _this = this;
        const cdThumb = $('.play__cd--img');
        //Xử lý CD quay, dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity //quay vô hạn 
        })
        cdThumbAnimate.pause();

        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //lắng nghe khi bài hát thực sự play
        audio.onplay = function() {
            _this.isPlaying = true;
            cdThumbAnimate.play();
            action.classList.add('playing');

        }
        //Lắng nghe bài hát khi bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            cdThumbAnimate.pause();
            action.classList.remove('playing');
        }
        //Tiến độ bài hat thay đổi
        audio.ontimeupdate = function() {
            const currentTime = audio.currentTime;
            const durationSong = audio.duration;
            let progressWidth = (currentTime * 100 / durationSong);
            progress.style.width = `${progressWidth}%`;
            let musicCurrentTime = $('.current');
            let musicDuration = $('.duration');


            audio.addEventListener('loadeddata', ()=>{
                
                // Duration Update
                let audioDuration = audio.duration;
                let totalMin = Math.floor(audioDuration / 60)
                let totalSec = Math.floor(audioDuration % 60)
                if (totalSec < 10) {
                    totalSec = `0${totalSec}`
                }
                musicDuration.innerText = `${totalMin}:${totalSec}`
            })
            // Current Time Update
            let currentMin = Math.floor(currentTime / 60)
            let currentSec = Math.floor(currentTime % 60)
            if (currentSec < 10) {
                currentSec = `0${currentSec}`
            }
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`
        }

        //Xử lí khi tua bài hát
        cdTime.onclick = function(e) {
            const progressWidthTime = cdTime.clientWidth;
            const progressClickTime = e.offsetX;
            let songDuration = audio.duration;
            audio.currentTime = songDuration * progressClickTime / progressWidthTime;
            audio.play();
        }

        //Xử lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }

        //Xử lý next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong();
            }
            _this.render();
            audio.play();
            _this.scrollToActiveSong();
        }
        //Xử lí khi quay lại bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            _this.render();
            audio.play();
            _this.scrollToActiveSong();
        }
        //Xử lý khi bật random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //Xử lý khi bật hát đi hát lại 1 bài
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Lắng nghe click vào playlist
        listSongs.onclick = function(e) {
            const songNode = e.target.closest('.songs-list__item:not(.active)');
            const heart = e.target.closest('.user-love');
            if(songNode || heart) {
                //Xử lí khi click vào song list
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }
                //Xử lí khi click vào options
                if(heart) {
                    _this.isHeart = !_this.isHeart;
                    heart.classList.toggle('heart', _this.isHeart);
                }
            } 
        }
       
        const menuItem = $$('.list__menu--item');
        const menuItemLength = menuItem.length;
        for(let i = 0 ; i<menuItemLength; i++) {
            menuItem[i].onclick = function() {
                menuItem.forEach((value) => {
                    if(value.classList.contains('active')) {
                        value.classList.remove('active')
                    } 

                })
                menuItem[i].classList.add('active')
                
            }
            
        }
        
       
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
        if(this.currentIndex < 0) {
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
    scrollToActiveSong: function() {
        setTimeout( () => {
            $('.songs-list__item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        cdImg.style.backgroundImage = `url("${this.currentSong.image}")`;
        nameSong.innerText = this.currentSong.name;
        author.innerText = this.currentSong.singer;
        audio.src = this.currentSong.path;
    },
    start: function() {
        //Định nghĩa các thuộc tính cho OBJ
        this.defineProperties();

        //Xử lý các event
        this.handleEvents();
        // Tải danh sách bài hát ra UI
        this.render();
        //Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();
    }
}

app.start();