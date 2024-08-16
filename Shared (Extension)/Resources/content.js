const isMobile = () => window.location.host === "m.youtube.com";

const _getVideoHost = () => document.querySelector(isMobile() ? "#player-container-id" : '#ytd-player');
const _getVideo = () => _getVideoHost()?.querySelector('video');
const _videoSkipHost = () => _getVideoHost()?.querySelector('.ytp-skip-ad');

const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

function isAdInterrupting() {
    const _isAdInterrupting = !!_getVideoHost()?.querySelector('.ad-interrupting');
    return _isAdInterrupting;
}

function trySkipAd() {
    if (!isAdInterrupting()) return;
    const vid = _getVideo();
    const skipHost = _videoSkipHost();
    console.log('[Skippy] Skipping ad');
    if (!!skipHost) {
        const skipBtn = skipHost.querySelector('button');
        if (skipBtn) return skipBtn.click();
    }
    
    if (!isVideoPlaying(vid)) return vid.fastSeek(vid.duration-0.05)
    vid.play();
    setTimeout(() => {
        vid.fastSeek(vid.duration - 0.05);
    }, 0.3);
}

function attachListeners() {
    const vid = _getVideo();
    if (!vid) return;
    vid.addEventListener('loadedmetadata', () => {
        console.log('[Skippy] Video metadata loaded, ad might be playing');
        trySkipAd();
    });
}

function _run() {
    console.log('[Skippy] Running');
    attachListeners();
    trySkipAd();
}

function tryRun() {
    let timeOut;
    function waitForVideo() {
        console.log('[Skippy] Waiting for video');
        const vid = _getVideo();
        if (!vid) return;
        clearInterval(timeOut);
        console.log('[Skippy] Video found, running script');
        _run();
    }
    timeOut = setInterval(waitForVideo, 50);
}

(() => {
    tryRun();
    window.addEventListener('yt-navigate-finish', tryRun, true);
})();
