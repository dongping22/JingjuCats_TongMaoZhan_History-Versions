
    // 切换移动端语言下拉框
    function toggleMobileLanguageDropdown() {
        const dropdown = document.getElementById('mobileLanguageDropdown');
        dropdown.classList.toggle('active');
    }

    // 移动端菜单按钮事件
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenuItems = document.getElementById('mobileMenuItems');

        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuItems.classList.toggle('active');
            // 主菜单开关时确保语言下拉框关闭
            document.getElementById('mobileLanguageDropdown').classList.remove('active');
        });

        // 点击菜单项后关闭菜单（除非是语言按钮或外部链接）
        document.querySelectorAll('.mobileMenuItem').forEach(item => {
            item.addEventListener('click', function(e) {
                // 非外部链接且不是语言切换按钮时关闭菜单
                if (!item.hasAttribute('target') && item.getAttribute('href') !== '#' && item.id !== 'mobileLanguageButton') {
                    mobileMenuItems.classList.remove('active');
                    document.getElementById('mobileLanguageDropdown').classList.remove('active');
                }
            });
        });

        // 处理移动端菜单项的导航滚动
        document.querySelectorAll('.mobileMenuItem').forEach(link => {
            // 排除外部链接和语言切换按钮
            if (link.getAttribute('target') === '_blank' || link.id === 'mobileLanguageButton') {
                return;
            }

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                const topOffset = 70; // 固定顶部导航栏高度
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - topOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // 导航后关闭菜单
                mobileMenuItems.classList.remove('active');
                document.getElementById('mobileLanguageDropdown').classList.remove('active');
            });
        });
    });

    // 点击页面空白处关闭菜单/下拉框
    document.addEventListener('click', function(event) {
        const mobileDropdown = document.getElementById('mobileLanguageDropdown');
        const mobileMenuItems = document.getElementById('mobileMenuItems');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileLanguageButton = document.getElementById('mobileLanguageButton');

        // 如果点击位置不在菜单和菜单按钮内，则关闭主菜单
        if (mobileMenuItems && !mobileMenuBtn.contains(event.target) && !mobileMenuItems.contains(event.target)) {
            mobileMenuItems.classList.remove('active');
            // 主菜单关闭时也关闭语言下拉框
            if (mobileDropdown) mobileDropdown.classList.remove('active');
        }

        // 如果点击位置不在语言切换区域，则关闭语言下拉框
        // 包括在主菜单内但不在语言区域内的点击
        if (mobileDropdown && !mobileLanguageButton.contains(event.target) && !mobileDropdown.contains(event.target)) {
            mobileDropdown.classList.remove('active');
        }
    });

    //加了这么多备注你还看不懂我就杀人了 ---by.沐月 2025.6.12
        // 获取DOM元素
        const player = document.getElementById('music-player');
        const playerToggle = document.getElementById('player-toggle');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const playlistToggle = document.getElementById('playlist-toggle');
        const playlistContainer = document.getElementById('playlist-container');
        const progressBar = document.getElementById('progress-bar');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        const playlistItems = document.querySelectorAll('.playlist li');
        const downloadNotification = document.getElementById('download-notification');
        const downloadButtons = document.querySelectorAll('.download-btn');
        const albumArt = document.getElementById('album-art');
        
        // 播放状态
        let isPlaying = false;
        let playlistVisible = false;
        let currentSongIndex = 0;
        let audio = new Audio();
        let progressInterval;
        
        // 初始化歌曲
        function initSong(index) {
            const song = playlistItems[index];
            const src = song.getAttribute('data-src');
            const title = song.getAttribute('data-title');
            const artist = song.getAttribute('data-artist');
            const duration = song.getAttribute('data-duration');
            const cover = song.getAttribute('data-cover');
            
            // 设置音频源
            audio.src = src;
            
            // 更新UI
            document.querySelector('.song-title').textContent = title;
            document.querySelector('.song-artist').textContent = artist;
            totalTimeEl.textContent = duration;
            
            // 更新专辑封面
            if (cover) {
                albumArt.style.background = `url('${cover}') center/cover no-repeat`;
                albumArt.innerHTML = ''; // 移除图标
            } else {
                albumArt.style.background = 'linear-gradient(45deg, #ff7e7e, #ec3134)';
                albumArt.innerHTML = '<i class="fas fa-cat"></i>'; // 添加默认图标
            }
            
            // 更新播放列表状态
            playlistItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }
        
        // 播放歌曲
        function playSong() {
            audio.play().catch(error => {
                console.error('播放失败:', error);
                alert('播放失败，请检查音频文件路径或浏览器设置。');
            });
            isPlaying = true;
            playPauseBtn.querySelector('i').classList.remove('fa-play');
            playPauseBtn.querySelector('i').classList.add('fa-pause');
            
            // 开始更新进度条
            startProgressUpdate();
        }
        
        // 暂停歌曲
        function pauseSong() {
            audio.pause();
            isPlaying = false;
            playPauseBtn.querySelector('i').classList.remove('fa-pause');
            playPauseBtn.querySelector('i').classList.add('fa-play');
            
            // 停止更新进度条
            clearInterval(progressInterval);
        }
        
        // 开始更新进度条
        function startProgressUpdate() {
            clearInterval(progressInterval);
            
            progressInterval = setInterval(() => {
                if (audio.duration && !isNaN(audio.duration)) {
                    const percent = (audio.currentTime / audio.duration) * 100;
                    progress.style.width = `${percent}%`;
                    
                    // 更新时间显示
                    updateTimeDisplay(audio.currentTime);
                }
            }, 1000);
        }
        
        // 更新时间显示
        function updateTimeDisplay(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            currentTimeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        // 切换整个播放器的收起/展开状态
        function togglePlayer() {
            player.classList.toggle('collapsed');
            
            // 更新图标
            const icon = playerToggle.querySelector('i');
            if (player.classList.contains('collapsed')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-music');
            } else {
                icon.classList.remove('fa-music');
                icon.classList.add('fa-times');
            }
        }
        
        // 下载歌曲
        function downloadSong(index) {
            const song = playlistItems[index];
            const src = song.getAttribute('data-src');
            const title = song.getAttribute('data-title');
            const artist = song.getAttribute('data-artist');
            
            // 显示下载通知
            downloadNotification.querySelector('span').textContent = `正在下载: ${title} - ${artist}`;
            downloadNotification.classList.add('show');
            
            // 模拟下载过程
            setTimeout(() => {
                // 创建一个虚拟的下载链接
                const a = document.createElement('a');
                a.href = src;
                a.download = `${title} - ${artist}.${src.split('.').pop()}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // 更新下载通知
                downloadNotification.querySelector('span').textContent = `下载完成: ${title} - ${artist}`;
                
                // 3秒后隐藏通知
                setTimeout(() => {
                    downloadNotification.classList.remove('show');
                }, 3000);
            }, 1500);
        }
        
        // 播放器收起/展开事件
        playerToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlayer();
        });
        
        // 在收起状态下，点击整个播放器区域也可以展开
        player.addEventListener('click', function(e) {
            if (player.classList.contains('collapsed')) {
                togglePlayer();
            }
        });
        
        // 播放/暂停按钮
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseSong();
            } else {
                if (audio.src) {
                    playSong();
                } else {
                    initSong(currentSongIndex);
                    playSong();
                }
            }
        });
        
        // 上一曲按钮
        prevBtn.addEventListener('click', function() {
            currentSongIndex = (currentSongIndex - 1 + playlistItems.length) % playlistItems.length;
            initSong(currentSongIndex);
            playSong();
        });
        
        // 下一曲按钮
        nextBtn.addEventListener('click', function() {
            currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
            initSong(currentSongIndex);
            playSong();
        });
        
        // 播放列表展开/收起
        playlistToggle.addEventListener('click', function() {
            playlistVisible = !playlistVisible;
            playlistContainer.classList.toggle('show');
            
            // 更新图标
            const icon = this.querySelector('.playlist-toggle i');
            if (playlistVisible) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
        
        // 点击播放列表中的歌曲
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                // 如果点击的是下载按钮，则不切换歌曲
                if (e.target.closest('.download-btn')) {
                    return;
                }
                
                currentSongIndex = index;
                initSong(currentSongIndex);
                playSong();
                
                // 如果播放列表是展开的，点击后自动收起
                playlistVisible = false;
                playlistContainer.classList.remove('show');
                playlistToggle.querySelector('.playlist-toggle i').classList.remove('fa-chevron-up');
                playlistToggle.querySelector('.playlist-toggle i').classList.add('fa-chevron-down');
            });
        });
        
        // 进度条点击事件
        progressBar.addEventListener('click', function(e) {
            if (!audio.src) return;
            
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
            progress.style.width = `${percent * 100}%`;
            updateTimeDisplay(audio.currentTime);
        });
        
        // 歌曲结束时自动播放下一首
        audio.addEventListener('ended', function() {
            currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
            initSong(currentSongIndex);
            playSong();
        });
        
        // 下载按钮事件
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = Array.from(playlistItems).indexOf(this.closest('li'));
                downloadSong(index);
            });
        });
        
        // 初始化第一首歌
        initSong(currentSongIndex);
        
        // 确保页面加载时图标正确
        window.addEventListener('DOMContentLoaded', () => {
            const icon = playerToggle.querySelector('i');
            if (player.classList.contains('collapsed')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-music');
            }
        });
        
        // 滚动按钮功能
        document.getElementById('scroll-to-top').addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.getElementById('scroll-to-bottom').addEventListener('click', function() {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });