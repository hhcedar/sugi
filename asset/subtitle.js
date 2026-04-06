window.initCustomSubtitles = function (playerId, videoId, subtitleData) {
    let player;
    let rafId = null;

    let subIndex = -1;

    function updateSubtitle() {

        if (!player) return;

        if (player.getPlayerState() === YT.PlayerState.PLAYING) {

            const now = player.getCurrentTime() * 1000; // 秒 → ms
            const container = document.getElementById(playerId).parentElement;
            const overlay = container.querySelector('.subtitle-overlay');

            for (let i = subtitleData.length - 1; i >= 0; i--) {
                if (now >= subtitleData[i].t) {

                    if (subIndex == i) break;

                    subIndex = i;

                    sub = subtitleData[i];

                    // console.log(playerId, sub);
                    // // overlay.style.display = "flex";
                    overlay.innerHTML = `<span class="sub">${sub.text}</span>`;
                    const oldSpan = overlay.querySelector(".sub");

                    requestAnimationFrame(() => {
                        oldSpan.classList.add("show");
                    });
                    break;
                }
            }
            rafId = requestAnimationFrame(updateSubtitle);

        } else {
            rafId = null;
        }
    }

    
    function stopSubtitle() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function createPlayer() {
        player = new YT.Player(playerId, {
            width: '100%',
            height: '100%',
            videoId: videoId,
            playerVars: {
                enablejsapi: 1,
                origin: location.origin
            },
            events: {
                onReady: function () {
                },
                onStateChange: function (event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        if (!rafId) updateSubtitle();
                    } else {
                        stopSubtitle();
                    }
                }
            }
        });
    }

    if (window.YT && YT.Player) {
        createPlayer();
    } else {
        window.onYouTubeIframeAPIReady = createPlayer;
    }
};
