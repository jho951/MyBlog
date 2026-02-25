/* =========================================================
   random-post-box.js
   - Random post box click -> fetch RSS/list -> pick random link
   - Requires HTML cards: .rp4-card with data-cat, data-rss, data-list
========================================================= */

(function () {
    "use strict";

    var ROOT_CATEGORIES = [
        { key: "computerscience", label: "ComputerScience", path: "computerscience" },
        { key: "development", label: "Development", path: "development" },
        { key: "engineering", label: "Engineering", path: "enginnering" },
        { key: "troubleshooting", label: "Trouble Shooting", path: "trubleshooting" }
    ];

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function absUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return location.origin + (path.charAt(0) === "/" ? path : ("/" + path));
    }

    function normalizeKey(v) {
        return String(v || "")
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9가-힣]/g, "");
    }

    function encodeCategoryPath(name) {
        return String(name || "")
            .split("/")
            .map(function (seg) { return encodeURIComponent(seg); })
            .join("/");
    }

    function getRootByAny(cat) {
        var k = normalizeKey(cat);
        if (!k) return null;

        for (var i = 0; i < ROOT_CATEGORIES.length; i++) {
            if (ROOT_CATEGORIES[i].key === k) return ROOT_CATEGORIES[i];
        }

        // legacy aliases
        if (k === "cs") return ROOT_CATEGORIES[0];
        if (k === "fe" || k === "dev") return ROOT_CATEGORIES[1];
        if (k === "be" || k === "eng") return ROOT_CATEGORIES[2];
        if (k === "infra" || k === "if" || k === "ts") return ROOT_CATEGORIES[3];
        if (k === "enginnering") return ROOT_CATEGORIES[2];
        if (k === "trubleshooting") return ROOT_CATEGORIES[3];

        return null;
    }

    function parseRss(xmlText) {
        var doc = new DOMParser().parseFromString(xmlText, "text/xml");
        var items = doc.querySelectorAll("item link");
        var out = [];
        for (var i = 0; i < items.length; i++) {
            var link = (items[i].textContent || "").trim();
            if (link) out.push(link);
        }
        return out;
    }

    function fetchLinksFromRss(rssPath) {
        return fetch(absUrl(rssPath), { credentials: "omit" })
            .then(function (res) {
                if (!res.ok) throw new Error("rss http " + res.status);
                return res.text();
            })
            .then(parseRss);
    }

    function parseLinksFromListHtml(htmlText) {
        var doc = new DOMParser().parseFromString(htmlText, "text/html");
        var anchors = doc.querySelectorAll("a[href]");
        var out = [];

        for (var i = 0; i < anchors.length; i++) {
            var href = anchors[i].getAttribute("href") || "";
            if (!href) continue;

            // 글 링크 후보 필터
            // - /826 처럼 숫자 엔트리
            // - /entry/xxx 형태
            if (/\/entry\//.test(href) || /\/\d+$/.test(href)) {
                out.push(absUrl(href));
            }
        }

        // 중복 제거
        var uniq = [];
        var seen = {};
        for (var j = 0; j < out.length; j++) {
            var u = out[j];
            if (!seen[u]) {
                seen[u] = 1;
                uniq.push(u);
            }
        }
        return uniq;
    }

    function fetchLinksFromListPage(listPath) {
        return fetch(absUrl(listPath), { credentials: "omit" })
            .then(function (res) {
                if (!res.ok) throw new Error("list http " + res.status);
                return res.text();
            })
            .then(parseLinksFromListHtml);
    }

    function buildPagedUrl(basePath, page) {
        return basePath + (basePath.indexOf("?") >= 0 ? "&" : "?") + "page=" + page;
    }

    function mergeUnique(a, b) {
        var seen = {};
        var out = [];
        function addAll(arr) {
            for (var i = 0; i < arr.length; i++) {
                var v = arr[i];
                if (!seen[v]) {
                    seen[v] = 1;
                    out.push(v);
                }
            }
        }
        addAll(a || []);
        addAll(b || []);
        return out;
    }

    function cacheKey(cat) {
        return "tt:rndcat:v2:" + cat;
    }
    function getCache(cat) {
        try {
            return JSON.parse(localStorage.getItem(cacheKey(cat)) || "null");
        } catch (e) {
            return null;
        }
    }
    function setCache(cat, links) {
        try {
            localStorage.setItem(cacheKey(cat), JSON.stringify({ t: Date.now(), links: links }));
        } catch (e) {}
    }

    function init() {
        var cards = document.querySelectorAll(".rp4-card");
        if (!cards.length) return;

        // Keep HTML fallback flexible: force cards to target canonical 4 root categories.
        for (var ci = 0; ci < cards.length; ci++) {
            var cfg = ROOT_CATEGORIES[ci];
            if (!cfg) continue;

            var path = "/category/" + encodeCategoryPath(cfg.path);
            var existingList = cards[ci].getAttribute("data-list") || "";
            var existingRss = cards[ci].getAttribute("data-rss") || "";
            cards[ci].setAttribute("data-cat", cfg.label);
            cards[ci].setAttribute("data-list", existingList || path);
            cards[ci].setAttribute("data-rss", existingRss || (path + "/rss"));

            var title = cards[ci].querySelector(".rp4-title");
            if (title) title.textContent = cfg.label;
        }

        var TTL = 1000 * 60 * 60; // 1시간 캐시
        var MAX_PAGES = 5;        // 목록 페이지 최대 5페이지까지

        function goRandom(card) {
            var rawCat = card.getAttribute("data-cat") || "CAT";
            var root = getRootByAny(rawCat);

            var cat = root ? root.label : rawCat;
            var list = card.getAttribute("data-list") || "";
            var rss = card.getAttribute("data-rss") || "";

            if (root) {
                var canonicalPath = "/category/" + encodeCategoryPath(root.path);
                if (!list) list = canonicalPath;
                if (!rss) rss = canonicalPath + "/rss";
            }

            // 1) cache
            var cached = getCache(cat);
            if (cached && cached.t && (Date.now() - cached.t) < TTL && cached.links && cached.links.length) {
                location.href = pick(cached.links);
                return;
            }

            // 2) RSS 먼저
            var p = Promise.resolve([]);
            if (rss) {
                p = fetchLinksFromRss(rss).catch(function () { return []; });
            }

            p.then(function (rssLinks) {
                // 3) 목록 페이지로 보강
                if (!list) return rssLinks;

                var chain = fetchLinksFromListPage(list).catch(function () { return []; });

                for (var page = 2; page <= MAX_PAGES; page++) {
                    (function (pg) {
                        chain = chain.then(function (acc) {
                            return fetchLinksFromListPage(buildPagedUrl(list, pg))
                                .then(function (next) { return mergeUnique(acc, next); })
                                .catch(function () { return acc; });
                        });
                    })(page);
                }

                return chain.then(function (listLinks) {
                    return mergeUnique(rssLinks, listLinks);
                });
            })
                .then(function (allLinks) {
                    if (!allLinks || !allLinks.length) {
                        alert(cat + " 카테고리에서 글을 찾지 못했어요. (RSS/목록 수집 실패)");
                        return;
                    }
                    setCache(cat, allLinks);
                    location.href = pick(allLinks);
                });
        }

        for (var i = 0; i < cards.length; i++) {
            (function (card) {
                card.addEventListener("click", function () { goRandom(card); });
                card.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goRandom(card);
                    }
                });
            })(cards[i]);
        }
    }

    onReady(init);
})();
