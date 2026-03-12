/* =========================================================
   1) Shared DOM helpers
========================================================= */
var safeQs = (typeof window.qs === "function")
    ? window.qs
    : function (sel, root) { return (root || document).querySelector(sel); };
var safeQsa = (typeof window.qsa === "function")
    ? window.qsa
    : function (sel, root) { return (root || document).querySelectorAll(sel); };
var safeClosest = (typeof window.closest === "function")
    ? window.closest
    : function (el, selector, stopEl) {
        while (el && el !== stopEl && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) return el;
            el = el.parentElement;
        }
        return null;
    };
var safeOnReady = (typeof window.onReady === "function")
    ? window.onReady
    : function (fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    };

function getPageKind() {
    if (safeQs("#pageArticle")) return "article";
    if (safeQs("#pageList")) return "list";
    if (safeQs("#pageHome")) return "home";
    return "etc";
}

function toggleMidAdSlot(kind) {
    var midAd = safeQs("#ttMidAd");
    if (!midAd) return;
    midAd.hidden = (kind === "article");
}

function initPageKind() {
    if (window.__ttPageKindInited) return;
    window.__ttPageKindInited = true;

    var kind = getPageKind();
    document.body.setAttribute("data-page-kind", kind);
    toggleMidAdSlot(kind);
}


/* =========================================================
   2) Latest: 드래그는 드래그, 클릭은 링크 이동
   (기존 코드 그대로 – 광고와 무관)
========================================================= */
function initLatestClickFix() {
    var viewport = safeQs("#ttLatestViewport");
    if (!viewport) return;
    if (viewport.__latestClickFixBound) return;
    viewport.__latestClickFixBound = true;

    var imgs = safeQsa("img", viewport);
    for (var i = 0; i < imgs.length; i++) imgs[i].setAttribute("draggable", "false");

    var downX = 0, downY = 0, moved = false, downLink = null;
    var TH = 8;

    viewport.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        downX = e.clientX;
        downY = e.clientY;
        moved = false;
        downLink = safeClosest(e.target, "a.card-link", viewport);
    }, true);

    viewport.addEventListener("pointermove", function (e) {
        if (Math.abs(e.clientX - downX) > TH || Math.abs(e.clientY - downY) > TH) {
            moved = true;
        }
    }, true);

    viewport.addEventListener("pointerup", function (e) {
        if (moved) return;
        var link = downLink || safeClosest(e.target, "a.card-link", viewport);
        downLink = null;
        if (!link) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

        var href = link.getAttribute("href");
        if (href && href !== "#") window.location.href = href;
    }, true);
}

/* =========================================================
   3) Auto init
========================================================= */
safeOnReady(function () {
    initPageKind();
    initLatestClickFix();
});
