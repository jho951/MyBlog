/* =========================================================
   1) Backdrop Ads (SAFE MODE)
   - 광고 "이동" ❌
   - 광고 "숨김(display:none)" ❌
   - article: backdrop에 수동 AdSense 유닛 1개만 생성
   - list/home: list 슬롯만 노출
========================================================= */

var ADSENSE_CLIENT = "pub-9149409701352189";
var ADSENSE_SLOT   = "3825649038";
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

function toggleBackdropSlots(kind) {
    var listSlot = safeQs("#ttBackdropAdSlotList");
    var articleSlot = safeQs("#ttBackdropAdSlotArticle");

    if (listSlot) {
        listSlot.hidden = !(kind === "list" || kind === "home" || kind === "etc");
    }

    if (articleSlot) {
        articleSlot.hidden = !(kind === "article");
    }
}

function wrapCenter(node) {
    var wrap = document.createElement("div");
    wrap.className = "tt-backdrop-ad-center";
    wrap.appendChild(node);
    return wrap;
}

/* ---------------------------------------------------------
   SAFE: backdrop 수동 AdSense 1회 렌더링
--------------------------------------------------------- */
function ensureBackdropManualAdsenseOnce() {
    var slot = safeQs("#ttBackdropAdSlotArticle");
    if (!slot) return;

    if (slot.getAttribute("data-filled") === "1") return;

    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.style.width = "100%";
    ins.style.minHeight = "280px";
    ins.style.margin = "0";

    ins.setAttribute("data-ad-client", ADSENSE_CLIENT);
    ins.setAttribute("data-ad-slot", ADSENSE_SLOT);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    slot.innerHTML = "";
    slot.appendChild(wrapCenter(ins));

    try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        slot.setAttribute("data-filled", "1");
    } catch (e) {
        // adsbygoogle 스크립트 미로딩 시 조용히 실패
    }
}

function initBackdropAds() {
    if (window.__ttBackdropAdsInited) return;
    window.__ttBackdropAdsInited = true;

    var kind = getPageKind();
    document.body.setAttribute("data-page-kind", kind);
    toggleBackdropSlots(kind);

    // article 에서만 수동 광고 1개 + "정상/engaged" 트래픽에만 요청
    if (kind !== "article") return;

    if (window.TT_TRAFFIC && typeof window.TT_TRAFFIC.onEngaged === "function") {
        window.TT_TRAFFIC.onEngaged(function () {
            ensureBackdropManualAdsenseOnce();
        }, 12000);
    } else {
        ensureBackdropManualAdsenseOnce();
    }
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
    initBackdropAds();
    initLatestClickFix();
});
