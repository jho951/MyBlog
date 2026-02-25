/* =========================================================
   pages-nav.js
   - Home에서 /pages/* 카드 슬라이더 생성
   - initLatestMarquee와 같이 사용
   - "드래그는 드래그, 클릭은 이동" 강제(핵심)
========================================================= */
(function () {
    "use strict";

    // util.js 있으면 재사용
    var qs = window.qs || function (sel, root) { return (root || document).querySelector(sel); };
    var qsa = window.qsa || function (sel, root) { return (root || document).querySelectorAll(sel); };
    var closest = window.closest || function (el, selector, stopEl) {
        while (el && el !== stopEl && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) return el;
            el = el.parentElement;
        }
        return null;
    };

    function normPath(href) {
        var path = "";
        try { path = new URL(href, location.origin).pathname; }
        catch (_) { path = String(href || ""); }

        path = path.replace(/\/+$/, "");
        if (!path) path = "/";
        try { path = decodeURIComponent(path); } catch (e) {}
        return path;
    }
    function trim(s) { return (s || "").trim(); }
    function getScriptDir(name) {
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].src || scripts[i].getAttribute("src") || "";
            if (!src) continue;
            if (src.indexOf(name) === -1) continue;
            return src.replace(/[^\/?#]+(?:[?#].*)?$/, "");
        }
        return "";
    }
    var PAGES_NAV_ASSET_BASE = getScriptDir("pages-nav.js");
    function resolveCoverSrc(src) {
        src = trim(src);
        if (!src) return "";
        if (/^(?:https?:)?\/\//i.test(src)) return src;
        if (src.charAt(0) === "/" || src.indexOf("data:") === 0 || src.indexOf("blob:") === 0) return src;

        // Tistory skin HTML의 "./images/*"와 달리, JS 문자열은 자동 치환되지 않으므로 script src 기준으로 보정
        if (/^(?:\.\/)?images\//i.test(src) && PAGES_NAV_ASSET_BASE) {
            // script가 images/ 안에 있을 때는 images 중복을 제거하고,
            // root에 있을 때는 원래 상대경로(./images/*)를 그대로 유지한다.
            if (/\/images\/?$/i.test(PAGES_NAV_ASSET_BASE)) {
                return PAGES_NAV_ASSET_BASE + src.replace(/^(?:\.\/)?images\//i, "");
            }
            try { return new URL(src, PAGES_NAV_ASSET_BASE).href; } catch (_) {}
        }
        try { return new URL(src, PAGES_NAV_ASSET_BASE || location.href).href; } catch (_) {}
        return src;
    }
    function pathKey(path) { return normPath(path).toLowerCase(); }
    function mapGetByPath(map, path) {
        if (!map) return undefined;
        if (Object.prototype.hasOwnProperty.call(map, path)) return map[path];

        var want = pathKey(path);
        var keys = Object.keys(map);
        for (var i = 0; i < keys.length; i++) {
            if (pathKey(keys[i]) === want) return map[keys[i]];
        }
        return undefined;
    }
    function mapHasPath(map, path) {
        return !!mapGetByPath(map, path);
    }

    var DEFAULT_ALLOW = {
        "/pages/Performance": true,
        "/pages/Retrospective": true,
        "/pages/Test": true,
        "/pages/DesignPattern": true,
        "/pages/Tool": true,
        "/pages/DataBase": true,
        "/pages/Infra": true,
        "/pages/Framework": true,
        "/pages/Language": true,
        "/pages/OS-operating-System": true,
        "/pages/Network": true,
        "/pages/Algorithm": true,
        "/pages/DataStructure": true
    };

    var DEFAULT_COVER = {
        "/pages/Performance": "./images/pages-cover-performance.svg",
        "/pages/Retrospective": "./images/pages-cover-retrospective.svg",
        "/pages/Test": "./images/pages-cover-test.svg",
        "/pages/DesignPattern": "./images/pages-cover-designpattern.svg",
        "/pages/Tool": "./images/pages-cover-tool.svg",
        "/pages/DataBase": "./images/pages-cover-database.svg",
        "/pages/Infra": "./images/pages-cover-infra.svg",
        "/pages/Framework": "./images/pages-cover-framework.svg",
        "/pages/Language": "./images/pages-cover-language.svg",
        "/pages/OS-operating-System": "./images/pages-cover-os.svg",
        "/pages/Network": "./images/pages-cover-network.svg",
        "/pages/Algorithm": "./images/pages-cover-algorithm.svg",
        "/pages/DataStructure": "./images/pages-cover-datastructure.svg"
    };

    var LABEL = {
        "/pages/Performance": "PERFORMANCE",
        "/pages/Retrospective": "RETROSPECTIVE",
        "/pages/Test": "TEST",
        "/pages/DesignPattern": "DESIGN PATTERN",
        "/pages/Tool": "TOOL",
        "/pages/DataBase": "DATABASE",
        "/pages/Infra": "INFRA",
        "/pages/Framework": "FRAMEWORK",
        "/pages/Language": "LANGUAGE",
        "/pages/OS-operating-System": "OS",
        "/pages/Network": "NETWORK",
        "/pages/Algorithm": "ALGORITHM",
        "/pages/DataStructure": "DATA STRUCTURE"
    };

    function bindClickFix(viewport) {
        if (!viewport) return;
        if (viewport.__pagesClickFixBound) return;
        viewport.__pagesClickFixBound = true;

        var imgs = qsa("img", viewport);
        for (var i = 0; i < imgs.length; i++) imgs[i].setAttribute("draggable", "false");

        var downX = 0, downY = 0, moved = false, downLink = null;
        var TH = 8;

        viewport.addEventListener("pointerdown", function (e) {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            downX = e.clientX;
            downY = e.clientY;
            moved = false;
            downLink = closest(e.target, "a.card-link", viewport);
        }, true);

        viewport.addEventListener("pointermove", function (e) {
            if (Math.abs(e.clientX - downX) > TH || Math.abs(e.clientY - downY) > TH) moved = true;
        }, true);

        viewport.addEventListener("pointerup", function (e) {
            if (moved) return;

            var link = downLink || closest(e.target, "a.card-link", viewport);
            downLink = null;
            if (!link) return;
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

            var href = link.getAttribute("href");
            if (href && href !== "#") window.location.href = href;
        }, true);
    }

    function buildPagesFromMenu(menuEl, allow) {
        var anchors = Array.prototype.slice.call(menuEl.querySelectorAll("a[href]"));
        var out = [];
        var seen = {};

        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            var href = a.getAttribute("href") || "";
            var path = normPath(href);
            if (!mapHasPath(allow, path)) continue;
            if (seen[path]) continue;
            seen[path] = 1;

            out.push({
                href: href,
                path: path,
                title: trim(a.textContent) || path.replace("/pages/", "")
            });
        }
        return out;
    }

    function renderCards(track, pages, coverMap) {
        track.innerHTML = "";
        for (var i = 0; i < pages.length; i++) {
            var p = pages[i];
            var cover = resolveCoverSrc(mapGetByPath(coverMap, p.path) || "");

            var article = document.createElement("article");
            article.className = "card latest-slide";

            var mappedLabel = (typeof LABEL === "object") ? mapGetByPath(LABEL, p.path) : "";
            var label = mappedLabel || p.title;

            article.innerHTML =
                '<a class="card-link" href="' + p.href + '">' +
                '<div class="card-thumb" data-page-path="' + p.path + '">' +
                '<div class="card-thumb-fallback" aria-hidden="true">' + label + '</div>' +
                (cover
                        ? '<img class="page-cover" src="' + cover + '" alt="' + p.title + '" decoding="async" loading="eager" referrerpolicy="no-referrer" />'
                        : ''
                ) +
                '<span class="badge badge-mint">' + label + '</span>' +
                '</div>' +
                '<div class="card-body">' +
                '<div class="card-title">' + p.title + '</div>' +
                '<div class="card-meta">' +
                '</div>' +
                '</div>' +
                '</a>';

            track.appendChild(article);
        }

        var imgs = track.querySelectorAll("img.page-cover");
        for (var j = 0; j < imgs.length; j++) {
            (function (img) {
                function markLoaded() {
                    var thumb = closest(img, ".card-thumb", track);
                    if (thumb) thumb.classList.add("has-page-cover");
                }

                if (img.complete && img.naturalWidth > 0) markLoaded();
                img.addEventListener("load", markLoaded, { once: true });
                img.addEventListener("error", function () {
                    if (img && img.parentNode) img.parentNode.removeChild(img);
                }, { once: true });
            })(imgs[j]);
        }
    }

    window.initPagesNavSlider = function initPagesNavSlider(opt) {
        opt = opt || {};
        if (window.__ttPagesNavInited) return;
        window.__ttPagesNavInited = true;

        // 홈에서만
        if (!qs("#pageHome")) return;

        var navRoot = qs(opt.rootSelector || "#ttPagesNav");
        if (!navRoot) return;

        var viewportId = opt.viewportId || "ttPagesViewport";
        var trackId = opt.trackId || "ttPagesTrack";
        var menuId = opt.menuId || "ttHiddenMenuPages";

        var viewport = document.getElementById(viewportId) || qs("#" + viewportId, navRoot);
        var track = document.getElementById(trackId) || qs("#" + trackId, navRoot);
        var menu = document.getElementById(menuId) || qs("#" + menuId, navRoot);

        if (!viewport || !track || !menu) return;

        var allow = opt.allow || DEFAULT_ALLOW;
        var cover = opt.cover || DEFAULT_COVER;

        // 1) 카드 생성
        var pages = buildPagesFromMenu(menu, allow);
        if (!pages.length) {
            // 메뉴에 없으면 allow 키로 강제 생성
            var keys = Object.keys(allow);
            for (var k = 0; k < keys.length; k++) {
                var pth = keys[k];
                pages.push({ href: pth, path: pth, title: pth.replace("/pages/", "") });
            }
        }
        renderCards(track, pages, cover);

        // 2) 클릭(탭) 이동 보정 (가장 중요)
        bindClickFix(viewport);

        // 3) 마퀴/드래그 엔진 부착
        if (typeof window.initLatestMarquee === "function") {
            window.initLatestMarquee({
                viewportId: viewportId,
                trackId: trackId,
                maxItems: opt.maxItems || 20,
                pxPerFrame: typeof opt.pxPerFrame === "number" ? opt.pxPerFrame : 0, // 0 = 자동이동 없이 드래그만
                pauseOnHover: opt.pauseOnHover !== false,
                drag: opt.drag !== false
            });
        }
    };
})();
