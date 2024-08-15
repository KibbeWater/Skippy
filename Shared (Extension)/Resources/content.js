const _getVideoHost = () => document.querySelector('#ytd-player');
const _getVideo = () => _getVideoHost()?.querySelector('video');
const _videoSkipHost = () => _getVideoHost()?.querySelector('.ytp-skip-ad');

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
    vid.play();
    setTimeout(() => {
        vid.fastSeek(vid.duration - 0.1);
    });
}

function attachListeners() {
    const vid = _getVideo();
    if (!vid) return;
    vid.addEventListener('loadedmetadata', () => {
        console.log('[Skippy] Video metadata loaded, ad might be playing');
        trySkipAd();
    })
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
        const vid = document.querySelector('#ytd-player video');
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
