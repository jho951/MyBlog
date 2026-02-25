(function () {
    "use strict";

    if (window.__ttBootInitBound) return;
    window.__ttBootInitBound = true;

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    }

    onReady(function () {
        if (typeof window.initLatestMarquee === "function") {
            window.initLatestMarquee({
                viewportId: "ttLatestViewport",
                trackId: "ttLatestTrack",
                maxItems: 10,
                pxPerFrame: 0.5,
                pauseOnHover: true,
                drag: true
            });
        }

        if (typeof window.initPagesNavSlider === "function") {
            window.initPagesNavSlider({
                viewportId: "ttPagesViewport",
                trackId: "ttPagesTrack",
                menuId: "ttHiddenMenuPages",
                maxItems: 20,
                pxPerFrame: 0,
                pauseOnHover: true,
                drag: true
            });
        }

        if (typeof window.initGuestbookStickAnim === "function") {
            window.initGuestbookStickAnim({ rootSelector: ".tt-guestbook .area_common", duration: 560 });
            window.initGuestbookStickAnim({
                rootSelector: "#ttArticleCommentDock",
                panelSelector: "#ttArticleCommentBottom",
                editorSelector: ".tt-cmt[contenteditable='true'], textarea",
                mode: "pass",
                preventPseudoNav: true,
                duration: 560
            });
            window.initGuestbookStickAnim({
                rootSelector: "#ttArticleCommentBottom",
                panelSelector: "#ttArticleCommentBottom",
                editorSelector: ".tt-cmt[contenteditable='true'], textarea",
                mode: "pass",
                preventPseudoNav: true,
                duration: 560
            });
        }
    });
})();
