<script src="https://www.youtube.com/iframe_api"></script>
<script>
window.initCustomSubtitles = function (playerId, videoId, subtitleData) {
    let player;
    let rafId = null;

function updateSubtitle() {
    if (!player) return;

    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        const now = player.getCurrentTime();
        const sub = subtitleData.find(s => now >= s.start && now <= s.end);

        const container = document.getElementById(playerId).parentElement;
        const overlay = container.querySelector('.subtitle-overlay');

        if (overlay) {
            if (sub) {
                // 同じ字幕なら作り直さない
                if (overlay.dataset.text !== sub.text) {
                    overlay.dataset.text = sub.text;
                    overlay.innerHTML = `<span class="sub">${sub.text}</span>`;

                    const span = overlay.querySelector('.sub');
                    requestAnimationFrame(() => {
                        if (span) span.classList.add('show');
                    });
                }

                overlay.style.display = 'flex';
            } else {
                overlay.innerHTML = '';
                overlay.dataset.text = '';
                overlay.style.display = 'none';
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

        const container = document.getElementById(playerId).parentElement;
        const overlay = container.querySelector('.subtitle-overlay');
        if (overlay) {
            overlay.innerText = "";
            overlay.style.display = "none";
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
                    console.log('player ready');
                },
                onStateChange: function (event) {
                    console.log('state change:', event.data);

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
</script>

<style>
/* 共通デザイン：サイバーパンク風 */
.yt-sub-container { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; margin-bottom: 1em; }
.subtitle-overlay {
    position: absolute; top: 12%; left: 5%; right: 5%;
    text-align: center; color: white; font-weight: normal;
    
    background: rgba(0,0,0,0.6); padding: 8px; border-radius: 4px;
    pointer-events: none; display: none; z-index: 10;
    justify-content: center; align-items: center; min-height: 1.5em;
}

.subtitle-overlay span {
    opacity:0;
    transform:translateY(20px);
    transition:all .35s ease;
}

.subtitle-overlay span.show {
    opacity:1;
    transform:translateY(0);
}
</style>
