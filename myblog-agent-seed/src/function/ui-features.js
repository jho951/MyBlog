(function () {
    "use strict";

    // -------------------------
    // safe utils
    // -------------------------
    function qs(sel, parent) { return (parent || document).querySelector(sel); }
    function qsa(sel, parent) { return Array.prototype.slice.call((parent || document).querySelectorAll(sel)); }
    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    }

    // -------------------------
    // cmdSearch (기존 그대로)
    // -------------------------
    function cmdSearch() {
        var headerInner = qs(".header-inner");
        var searchInput = qs(".header-search-box input");
        if (!headerInner || !searchInput) return;

        var isOpen = headerInner.classList.contains("search-on");
        if (isOpen) {
            var v = (searchInput.value || "").trim();
            if (v.length > 0) location.href = "/search/" + encodeURIComponent(v);
            else headerInner.classList.remove("search-on");
        } else {
            headerInner.classList.add("search-on");
            setTimeout(function () { try { searchInput.focus(); } catch (e) {} }, 100);
        }
    }
    window.cmdSearch = cmdSearch;

    // -------------------------
    // auth button
    // -------------------------
    function syncAuthButton() {
        var box = qs(".login-logout-button");
        if (!box) return;

        var name = "";
        try { name = (window.T && window.T.config && window.T.config.USER && window.T.config.USER.name) || ""; } catch (e) {}

        var isLoggedIn = !!name;
        if (!isLoggedIn) {
            var st = qs("#ttAuthStatus");
            var t = st ? (st.textContent || "").trim() : "";
            if (/logout|로그아웃/i.test(t)) isLoggedIn = true;
        }

        box.innerHTML = isLoggedIn
            ? '<a href="https://www.tistory.com/auth/logout" class="logout-button">로그아웃</a>'
            : '<a href="https://www.tistory.com/auth/login" class="login-button">로그인</a>';
    }

    function initCategoryAccordion(onHeightChange) {
        var panel = document.getElementById("ttHeaderPanel");
        if (!panel) return;

        // JS 동작 시에만 접힘 적용(안전장치)
        document.documentElement.classList.add("js-cat-accordion");

        var roots = panel.querySelectorAll(".menu-list .tt_category .category_list > li");
        if (!roots || !roots.length) return;

        // helper
        function getRootLink(li) {
            // :scope 미지원 브라우저 대비로 children 기반 사용
            var a = null;
            for (var i = 0; i < li.children.length; i++) {
                if (li.children[i].tagName === "A" && li.children[i].classList.contains("link_item")) a = li.children[i];
            }
            return a;
        }
        function getRootSub(li) {
            var ul = null;
            for (var i = 0; i < li.children.length; i++) {
                if (li.children[i].tagName === "UL" && li.children[i].classList.contains("sub_category_list")) ul = li.children[i];
            }
            return ul;
        }

        function closeItem(li, a, sub) {
            li.classList.remove("is-open");
            a.setAttribute("aria-expanded", "false");
            sub.setAttribute("aria-hidden", "true");
            sub.style.maxHeight = "0px";
            if (typeof onHeightChange === "function") onHeightChange();
        }

        function openItem(li, a, sub) {
            li.classList.add("has-children");
            li.classList.add("is-open");
            a.setAttribute("aria-expanded", "true");
            sub.setAttribute("aria-hidden", "false");

            // 트랜지션 안정적으로: 0 -> scrollHeight
            sub.style.maxHeight = "0px";
            sub.offsetHeight; // reflow
            sub.style.maxHeight = sub.scrollHeight + "px";

            if (typeof onHeightChange === "function") onHeightChange();
        }

        for (var r = 0; r < roots.length; r++) {
            (function (li, idx) {
                var a = getRootLink(li);
                var sub = getRootSub(li);

                // 자식 없는 루트(Start 등)는 그대로 링크 이동
                if (!a || !sub) return;

                li.classList.add("has-children");

                // a11y
                var subId = sub.id || ("ttSubCat_" + idx);
                sub.id = subId;
                a.setAttribute("aria-controls", subId);
                a.setAttribute("aria-expanded", "false");
                sub.setAttribute("aria-hidden", "true");

                // 초기 닫힘
                sub.style.maxHeight = "0px";

                // 클릭하면 아코디언(루트 클릭 = 토글)
                a.addEventListener("click", function (e) {
                    e.preventDefault();

                    var isOpen = (a.getAttribute("aria-expanded") === "true");

                    // “아코디언” 느낌: 하나 열면 나머지 닫기
                    for (var j = 0; j < roots.length; j++) {
                        var other = roots[j];
                        if (other === li) continue;
                        var oa = getRootLink(other);
                        var os = getRootSub(other);
                        if (oa && os && oa.getAttribute("aria-expanded") === "true") {
                            closeItem(other, oa, os);
                        }
                    }

                    if (isOpen) closeItem(li, a, sub);
                    else openItem(li, a, sub);
                });

                // 트랜지션 끝나면 열린 상태의 maxHeight 재세팅(내용 변화 대응)
                sub.addEventListener("transitionend", function () {
                    if (a.getAttribute("aria-expanded") === "true") {
                        sub.style.maxHeight = sub.scrollHeight + "px";
                    }
                    if (typeof onHeightChange === "function") onHeightChange();
                });
            })(roots[r], r);
        }

        // 리사이즈 시 열린 항목 높이 보정
        window.addEventListener("resize", function () {
            for (var i = 0; i < roots.length; i++) {
                var li = roots[i];
                var a = getRootLink(li);
                var sub = getRootSub(li);
                if (!a || !sub) continue;
                if (a.getAttribute("aria-expanded") === "true") {
                    sub.style.maxHeight = sub.scrollHeight + "px";
                }
            }
            if (typeof onHeightChange === "function") onHeightChange();
        });
    }

// 네 코드가 initCategoryAccordion를 찾을 수 있도록(선택)
    window.initCategoryAccordion = initCategoryAccordion;

    function resetCategoryAccordion(panel, onHeightChange) {
        if (!panel) return;

        var roots = panel.querySelectorAll(".menu-list .tt_category .category_list > li");
        if (!roots || !roots.length) return;

        function getRootLink(li) {
            for (var i = 0; i < li.children.length; i++) {
                var el = li.children[i];
                if (el.tagName === "A" && el.classList.contains("link_item")) return el;
            }
            return null;
        }
        function getRootSub(li) {
            for (var i = 0; i < li.children.length; i++) {
                var el = li.children[i];
                if (el.tagName === "UL" && el.classList.contains("sub_category_list")) return el;
            }
            return null;
        }

        for (var r = 0; r < roots.length; r++) {
            var li = roots[r];
            var a = getRootLink(li);
            var sub = getRootSub(li);
            if (!a || !sub) continue;

            li.classList.remove("is-open");
            a.setAttribute("aria-expanded", "false");
            sub.setAttribute("aria-hidden", "true");
            sub.style.maxHeight = "0px";
        }

        if (typeof onHeightChange === "function") onHeightChange();
    }


    function initCapsuleHeaderToggle() {
        var header = qs("#capsuleHeader");
        if (!header) return;

        var toggle = qs("#ttHeaderToggle", header);
        var panel = qs("#ttHeaderPanel", header);
        var headerInner = qs(".header-inner", header);

        if (!toggle || !panel || !headerInner) return;

        var isOpen = false;

        function calcMaxExpandedHeight() {
            var topPx = 0;
            try { topPx = parseFloat(getComputedStyle(header).top) || 0; } catch (e) {}
            return window.innerHeight - (topPx);
        }

        function updateHeaderHeight() {
            if (!isOpen) return;

            var innerH = headerInner.offsetHeight || 0;
            var contentH = measurePanelContentHeight();
            var desired = innerH + contentH;

            var maxH = calcMaxExpandedHeight();

            if (desired <= maxH) {
                header.classList.remove("is-scrollable");
                header.style.setProperty("--header-expanded-h", desired + "px");
                return;
            }

            header.classList.add("is-scrollable");
            header.style.setProperty("--header-expanded-h", maxH + "px");
        }


        function open() {
            isOpen = true;
            header.classList.add("is-expanded");
            document.body.classList.add("tt-scrolllock");

            toggle.setAttribute("aria-expanded", "true");
            panel.setAttribute("aria-hidden", "false");

            // 즉시 max로 한번 펴주고 → 다음 프레임에서 실제 컨텐츠 기반으로 정밀 조정
            header.style.setProperty("--header-expanded-h", calcMaxExpandedHeight() + "px");

            requestAnimationFrame(function () {
                updateHeaderHeight();
                setTimeout(updateHeaderHeight, 80);
            });
        }

        function close() {
            isOpen = false;

            // ✅ 헤더 접기
            header.classList.remove("is-expanded");
            header.classList.remove("is-scrollable");
            document.body.classList.remove("tt-scrolllock");

            toggle.setAttribute("aria-expanded", "false");
            panel.setAttribute("aria-hidden", "true");

            // ✅ 헤더 높이 변수 제거 (원래 캡슐 높이로)
            header.style.removeProperty("--header-expanded-h");

            // ✅ 패널 스크롤 위치도 초기화
            panel.scrollTop = 0;

            // ✅ 아코디언 상태 전부 초기화(다 닫힘)
            resetCategoryAccordion(panel, function () {
                // 혹시 남아있는 레이아웃 계산 한 번 더 정리
                // (열려있던 maxHeight 잔상 방지)
            });
            headerInner.classList.remove("search-on");
        }

        function measurePanelContentHeight() {
            var h = 0;

            // panel padding + gap 반영
            var cs = getComputedStyle(panel);
            var pt = parseFloat(cs.paddingTop) || 0;
            var pb = parseFloat(cs.paddingBottom) || 0;
            var gap = parseFloat(cs.rowGap || cs.gap) || 0;

            h += pt + pb;

            // panel의 실제 자식(menu-list, menu-footer) 높이 합
            var kids = panel.children;
            for (var i = 0; i < kids.length; i++) {
                h += kids[i].offsetHeight || 0;
            }

            if (kids.length > 1) h += gap * (kids.length - 1);
            return h;
        }



        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            if (header.classList.contains("is-expanded")) close();
            else open();
        });

        // 바깥 클릭 닫기
        document.addEventListener("click", function (e) {
            if (!isOpen) return;
            if (header.contains(e.target)) return;
            close();
        });

        // ESC 닫기
        document.addEventListener("keydown", function (e) {
            if (!isOpen) return;
            if (e.key === "Escape") close();
        });

        // 리사이즈 시 높이 재계산
        window.addEventListener("resize", function () {
            updateHeaderHeight();
        });

        // 카테고리 아코디언이 있다면: 토글될 때마다 헤더 높이 갱신
        if (typeof window.initCategoryAccordion === "function") {
            window.initCategoryAccordion(function () {
                requestAnimationFrame(updateHeaderHeight);
                setTimeout(updateHeaderHeight, 80);
            });
        }
    }

    function initCategoryCardsFromGnb() {
        var panel = document.getElementById("ttHeaderPanel");
        if (!panel) return;

        var rootItems = panel.querySelectorAll(".menu-list .tt_category .category_list > li");
        if (!rootItems || !rootItems.length) return;

        function norm(v) {
            return String(v || "")
                .replace(/\s+/g, "")
                .replace(/[^a-zA-Z0-9가-힣]/g, "")
                .toUpperCase();
        }

        function getRootLink(li) {
            for (var i = 0; i < li.children.length; i++) {
                var el = li.children[i];
                if (el.tagName === "A" && el.classList.contains("link_item")) return el;
            }
            return null;
        }

        function findRootItem(key) {
            var target = norm(key);
            if (!target) return null;

            for (var i = 0; i < rootItems.length; i++) {
                var rootLink = getRootLink(rootItems[i]);
                if (!rootLink) continue;
                var label = norm(rootLink.textContent);
                if (label === target || label.indexOf(target) >= 0) return rootItems[i];
            }

            for (var j = 0; j < rootItems.length; j++) {
                var rl = getRootLink(rootItems[j]);
                if (!rl) continue;
                var href = (rl.getAttribute("href") || "").toUpperCase();
                if (href.indexOf("/CATEGORY/" + target) >= 0) return rootItems[j];
            }

            return null;
        }

        function getSubLinks(rootItem) {
            var out = [];
            var sub = rootItem.querySelector("ul.sub_category_list");
            if (!sub) return out;

            function getDirectLink(li) {
                for (var i = 0; i < li.children.length; i++) {
                    var el = li.children[i];
                    if (el.tagName === "A" && el.classList.contains("link_item")) return el;
                }
                return null;
            }

            function getDirectSub(li) {
                for (var i = 0; i < li.children.length; i++) {
                    var el = li.children[i];
                    if (el.tagName === "UL" && el.classList.contains("sub_category_list")) return el;
                }
                return null;
            }

            function collectLeaf(ul) {
                var lis = ul.children || [];
                for (var i = 0; i < lis.length; i++) {
                    var li = lis[i];
                    if (!li || li.tagName !== "LI") continue;

                    var link = getDirectLink(li);
                    var nested = getDirectSub(li);
                    if (nested && nested.children && nested.children.length) {
                        collectLeaf(nested);
                        continue;
                    }

                    if (!link) continue;
                    var href = link.getAttribute("href");
                    var text = (link.textContent || "").trim();
                    if (!href || !text) continue;
                    out.push({ href: href, text: text });
                }
            }

            collectLeaf(sub);

            if (!out.length) {
                var anchors = sub.querySelectorAll("a[href]");
                for (var i = 0; i < anchors.length; i++) {
                    var href = anchors[i].getAttribute("href");
                    var text = (anchors[i].textContent || "").trim();
                    if (!href || !text) continue;
                    out.push({ href: href, text: text });
                }
            }

            return out;
        }

        function createCard() {
            var card = document.createElement("a");
            card.className = "cat-card";
            card.href = "#";

            var icon = document.createElement("div");
            icon.className = "cat-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = "•";

            var title = document.createElement("h3");
            title.className = "cat-name";
            title.textContent = "Category";

            card.appendChild(icon);
            card.appendChild(title);
            return card;
        }

        function clearCardState(card) {
            card.classList.remove("cat-card--ghost");
            card.classList.remove("cat-card--more");
            card.removeAttribute("aria-disabled");
            card.removeAttribute("aria-hidden");
            card.style.display = "";
        }

        var sections = document.querySelectorAll(".category-grid-section[data-root-cat]");
        for (var s = 0; s < sections.length; s++) {
            var section = sections[s];
            var key = section.getAttribute("data-root-cat");
            var rootItem = findRootItem(key);
            if (!rootItem) {
                section.style.display = "none";
                section.setAttribute("aria-hidden", "true");
                continue;
            }

            section.style.display = "";
            section.removeAttribute("aria-hidden");

            var rootLink = getRootLink(rootItem);
            var items = getSubLinks(rootItem);
            var titleNode = section.querySelector(".category-intro .intro-title");
            var descNode = section.querySelector(".category-intro .intro-desc");
            var grid = section.querySelector(".card-grid");
            if (!grid) continue;

            var DISPLAY_SLOTS = 4;
            var hasOverflow = items.length > DISPLAY_SLOTS;
            var requiredCards = hasOverflow ? (items.length + 1) : DISPLAY_SLOTS;
            var cards = grid.querySelectorAll(".cat-card");

            if (cards.length < requiredCards) {
                for (var add = cards.length; add < requiredCards; add++) {
                    grid.appendChild(createCard());
                }
                cards = grid.querySelectorAll(".cat-card");
            }

            if (rootLink) {
                var cta = section.querySelector(".category-intro .btn");
                var rootText = (rootLink.textContent || "").trim();
                var rootHref = rootLink.getAttribute("href");

                if (cta) {
                    if (rootHref) {
                        cta.setAttribute("href", rootHref);
                        cta.setAttribute("data-url", rootHref);
                    }
                }

                if (titleNode && rootText) {
                    titleNode.textContent = rootText;
                }
                if (descNode) {
                    descNode.textContent = items.length + " topics";
                }
            }

            function renderCards() {
                var expanded = !!section.__catExpanded;

                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    clearCardState(card);
                    card.onclick = null;
                    card.onkeydown = null;

                    var titleEl = card.querySelector(".cat-name");
                    var iconEl = card.querySelector(".cat-icon");

                    if (hasOverflow) {
                        var toggleIndex = items.length;
                        var visibleItems = expanded ? items.length : (DISPLAY_SLOTS - 1);

                        if (i < items.length) {
                            if (i >= visibleItems) {
                                card.style.display = "none";
                                card.setAttribute("aria-hidden", "true");
                                continue;
                            }
                            var it = items[i];
                            card.setAttribute("href", it.href || "#");
                            if (titleEl) titleEl.textContent = it.text;
                            if (iconEl) iconEl.textContent = "•";
                            continue;
                        }

                        if (i === toggleIndex) {
                            card.style.display = "";
                            card.classList.add("cat-card--more");
                            card.setAttribute("href", "#");
                            var remain = items.length - (DISPLAY_SLOTS - 1);
                            if (titleEl) titleEl.textContent = expanded ? "접기" : ("+" + remain + " more");
                            if (iconEl) iconEl.textContent = expanded ? "−" : "+";
                            card.onclick = function (e) {
                                e.preventDefault();
                                section.__catExpanded = !section.__catExpanded;
                                renderCards();
                            };
                            card.onkeydown = function (e) {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    section.__catExpanded = !section.__catExpanded;
                                    renderCards();
                                }
                            };
                            continue;
                        }

                        card.style.display = "none";
                        card.setAttribute("aria-hidden", "true");
                        continue;
                    }

                    if (i >= DISPLAY_SLOTS) {
                        card.style.display = "none";
                        card.setAttribute("aria-hidden", "true");
                        continue;
                    }

                    if (i < items.length) {
                        var item = items[i];
                        card.setAttribute("href", item.href || "#");
                        if (titleEl) titleEl.textContent = item.text;
                        if (iconEl) iconEl.textContent = "•";
                        continue;
                    }

                    card.classList.add("cat-card--ghost");
                    card.setAttribute("href", "#");
                    card.setAttribute("aria-disabled", "true");
                    if (titleEl) titleEl.textContent = "Coming soon";
                    if (iconEl) iconEl.textContent = "·";
                }
            }

            if (!hasOverflow) section.__catExpanded = false;
            renderCards();
        }
    }

    
    // -------------------------
    // Latest carousel (no slick)
    // - Uses native horizontal scroll + pointer-drag (mouse)
    // - Optional auto-scroll (pxPerFrame) with seamless loop (by cloning once)
    // -------------------------
    
    // -------------------------
    // Latest carousel (no slick)
    // - Native horizontal scroll + scroll-snap
    // - Mouse drag-to-scroll
    // - Optional autoplay (step-based)
    //   * If opts.autoplayMs is not set but opts.pxPerFrame is provided,
    //     we map it to an interval (0.8 => ~2600ms)
    // -------------------------
    function initLatestMarquee(opts) {
        opts = opts || {};
        var viewport = document.getElementById(opts.viewportId || "ttLatestViewport");
        var track = document.getElementById(opts.trackId || "ttLatestTrack");
        if (!viewport || !track) return;

        if (viewport.__ttLatestInited) return;
        viewport.__ttLatestInited = true;

        // prefers-reduced-motion => marquee off (CSS에서 transform none !important 처리 중)
        var reduced = false;
        try { reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

        // 1) limit items (optional)
        var maxItems = parseInt(opts.maxItems, 10);
        if (maxItems > 0) {
            var slides0 = track.querySelectorAll(".latest-slide");
            for (var i = slides0.length - 1; i >= maxItems; i--) {
                try { slides0[i].parentNode.removeChild(slides0[i]); } catch (e) {}
            }
        }

        // slides re-query after trim
        var baseSlides = Array.prototype.slice.call(track.querySelectorAll(".latest-slide"));
        if (!baseSlides.length) return;

        // 2) 작은 개수로 viewport보다 패턴 폭이 작으면, 패턴을 먼저 늘린 뒤(복제)
        //    마지막에 "패턴 전체"를 한 번 더 복제해서 seamless loop를 만든다.
        function ensurePatternWidth() {
            var vw = viewport.getBoundingClientRect().width || viewport.clientWidth || 0;
            if (!vw) return;

            // 패턴 폭이 너무 작으면 반복 복제
            var safety = 0;
            while (track.scrollWidth < vw * 1.35 && safety < 6) {
                safety++;
                for (var i = 0; i < baseSlides.length; i++) {
                    var c = baseSlides[i].cloneNode(true);
                    c.setAttribute("data-tt-clone", "1");
                    track.appendChild(c);
                }
            }
        }

        // hover pause (optional)
        var paused = false;
        var pauseT = 0;
        function pauseFor(ms) {
            paused = true;
            if (pauseT) clearTimeout(pauseT);
            pauseT = setTimeout(function () { paused = false; }, ms || 600);
        }

        if (opts.pauseOnHover) {
            viewport.addEventListener("mouseenter", function () { paused = true; });
            viewport.addEventListener("mouseleave", function () { paused = false; });
        }

        // 3) build seamless loop (duplicate pattern once)
        ensurePatternWidth();

        // 패턴(현재 children) 스냅샷
        var patternChildren = Array.prototype.slice.call(track.children);
        if (patternChildren.length < 2) return;

        // 패턴 폭 측정(복제 전)
        var patternWidth = track.scrollWidth;

        // 패턴을 1회 더 복제해서 2배 길이로 만든다.
        // (loop는 patternWidth 기준으로 pos를 되감음)
        var frag = document.createDocumentFragment();
        patternChildren.forEach(function (node) {
            var c = node.cloneNode(true);
            c.setAttribute("data-tt-clone", "1");
            // 키보드 탭 포커스는 원본만 가도록 (중복 링크 포커스 방지)
            try {
                c.setAttribute("aria-hidden", "true");
                var links = c.querySelectorAll("a, button, input, textarea, select, [tabindex]");
                for (var i = 0; i < links.length; i++) {
                    links[i].setAttribute("tabindex", "-1");
                }
            } catch (e) {}
            frag.appendChild(c);
        });
        track.appendChild(frag);

        // 4) marquee animation (transform 기반)
        // pxPerFrame: 60fps 기준 한 프레임당 이동 픽셀(기존 옵션 의미 그대로)
        var pxPerFrame = (typeof opts.pxPerFrame === "number" && opts.pxPerFrame > 0) ? opts.pxPerFrame : 0.45;

        // 내부 상태
        var pos = 0;           // 0..patternWidth
        var lastTs = 0;
        var rafId = 0;
        var running = false;
        var dragging = false;
        var startX = 0;
        var startPos = 0;
        var moved = false;
        var MOVE_TH = 6;

        function applyTransform() {
            // patternWidth가 0이면 방어
            if (!patternWidth) return;
            // pos를 0..patternWidth 로 정규화
            pos = pos % patternWidth;
            if (pos < 0) pos += patternWidth;
            track.style.transform = "translate3d(" + (-pos) + "px,0,0)";
        }

        function measure() {
            // 레이아웃 변경(반응형) 시 재측정
            // patternWidth는 "원본 패턴" 길이여야 하므로,
            // 현재 총 scrollWidth의 절반을 쓰는 방식이 가장 안정적(패턴을 2번 복제했으므로).
            var total = track.scrollWidth;
            if (total > 0) patternWidth = Math.max(1, Math.round(total / 2));
        }

        function tick(ts) {
            if (!running) return;
            if (!lastTs) lastTs = ts;
            var dt = Math.min(48, ts - lastTs); // 폭주 방지
            lastTs = ts;

            if (!reduced && !paused && !dragging) {
                // 60fps 기준 pxPerFrame을 dt에 맞게 환산
                var speed = pxPerFrame * (dt / 16.6667);
                pos += speed;
                if (pos >= patternWidth) pos -= patternWidth;
                applyTransform();
            }

            rafId = requestAnimationFrame(tick);
        }

        function start() {
            if (running) return;
            running = true;
            lastTs = 0;
            measure();
            applyTransform();
            rafId = requestAnimationFrame(tick);
        }

        function stop() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
        }

        // 5) drag support (pointer)
        if (opts.drag) {
            function onDown(e) {
                // mouse left only
                if (e.pointerType === "mouse" && e.button !== 0) return;

                dragging = true;
                moved = false;
                startX = e.clientX;
                startPos = pos;

                viewport.classList.add("is-dragging");
                pauseFor(900);

                try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
            }

            function onMove(e) {
                if (!dragging) return;
                var dx = e.clientX - startX;
                if (Math.abs(dx) > MOVE_TH) moved = true;

                // 드래그는 반대 방향으로 pos 변화(손가락 따라 움직이는 느낌)
                pos = startPos - dx;
                applyTransform();

                // 드래그 중 텍스트 선택/스크롤 방지
                try { e.preventDefault(); } catch (err) {}
            }

            function onUp(e) {
                if (!dragging) return;
                dragging = false;
                viewport.classList.remove("is-dragging");
                try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
                pauseFor(300);
            }

            viewport.addEventListener("pointerdown", onDown, { passive: true });
            viewport.addEventListener("pointermove", onMove, { passive: false });
            viewport.addEventListener("pointerup", onUp, { passive: true });
            viewport.addEventListener("pointercancel", onUp, { passive: true });

            // drag로 흔들린 뒤 클릭으로 글이 열리는 문제 방지
            viewport.addEventListener("click", function (e) {
                if (moved) {
                    try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
                    moved = false;
                }
            }, true);
        }

        // 6) user interaction pause
        viewport.addEventListener("wheel", function () { pauseFor(900); }, { passive: true });
        viewport.addEventListener("touchstart", function () { pauseFor(900); }, { passive: true });
        viewport.addEventListener("touchmove", function () { pauseFor(900); }, { passive: true });

        // 7) in-view 최적화 (지원 브라우저만)
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (ent) {
                    if (ent.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.15 });
            io.observe(viewport);
        } else {
            start();
        }

        // 8) resize 대응
        if ("ResizeObserver" in window) {
            var ro = new ResizeObserver(function () {
                pauseFor(250);
                measure();
                applyTransform();
            });
            ro.observe(viewport);
        } else {
            window.addEventListener("resize", function () {
                pauseFor(250);
                measure();
                applyTransform();
            });
        }

        window.addEventListener("pagehide", stop);
    }

    window.initLatestMarquee = initLatestMarquee;

    // -------------------------
    // mobile category tabs sync
    // - button[data-tab] <-> radio#catTab-*
    // -------------------------
    function initMobileCategoryTabs() {
        var hubs = document.querySelectorAll(".catHub--mobile");
        if (!hubs || !hubs.length) return;

        function setSelected(hub, key) {
            if (!hub || !key) return;

            var radio = hub.querySelector("#catTab-" + key);
            if (radio) radio.checked = true;

            var tabs = hub.querySelectorAll(".catTab[data-tab]");
            for (var i = 0; i < tabs.length; i++) {
                var isOn = tabs[i].getAttribute("data-tab") === key;
                tabs[i].setAttribute("aria-selected", isOn ? "true" : "false");
                if (isOn) tabs[i].classList.add("is-active");
                else tabs[i].classList.remove("is-active");
            }
        }

        for (var h = 0; h < hubs.length; h++) {
            (function (hub) {
                var tabs = hub.querySelectorAll(".catTab[data-tab]");
                var tabShell = hub.querySelector(".catTabsShell");
                var tabCapsule = hub.querySelector(".catTabsCapsule");
                if (!tabs || !tabs.length) return;

                var initial = "";
                var checked = hub.querySelector(".catHubRadio:checked");
                if (checked && checked.id.indexOf("catTab-") === 0) {
                    initial = checked.id.replace("catTab-", "");
                } else {
                    initial = tabs[0].getAttribute("data-tab") || "cs";
                }
                setSelected(hub, initial);

                for (var i = 0; i < tabs.length; i++) {
                    (function (tab) {
                        tab.addEventListener("click", function () {
                            var key = tab.getAttribute("data-tab");
                            setSelected(hub, key);
                        });
                    })(tabs[i]);
                }

                if (tabShell && tabCapsule) {
                    function syncTabScrollHints() {
                        var maxLeft = Math.max(0, tabCapsule.scrollWidth - tabCapsule.clientWidth);
                        var left = tabCapsule.scrollLeft || 0;
                        var atStart = left <= 2;
                        var atEnd = left >= (maxLeft - 2);
                        tabShell.classList.toggle("is-at-start", atStart);
                        tabShell.classList.toggle("is-at-end", atEnd);
                        tabShell.classList.toggle("is-scrollable", maxLeft > 8);
                    }

                    tabCapsule.addEventListener("scroll", syncTabScrollHints, { passive: true });
                    window.addEventListener("resize", syncTabScrollHints);
                    requestAnimationFrame(syncTabScrollHints);
                }
            })(hubs[h]);
        }
    }

    // -------------------------
    // article TOC + comment dock
    // - left: TOC from h2/h3 in #ttPostContent
    // - right: comment form as memo note (desktop)
    // - bottom: comment list remains in page
    // -------------------------
    function initArticleEnhancements() {
        var page = document.getElementById("pageArticle");
        if (!page) return;

        var post = document.getElementById("ttPostContent");
        var tocWrap = document.getElementById("ttArticleToc");
        var tocNav = document.getElementById("ttArticleTocNav");
        var dock = document.getElementById("ttArticleCommentDock");
        var formSlot = document.getElementById("ttArticleCommentFormSlot");
        var bottomSlot = document.getElementById("ttArticleCommentBottom");
        if (!post) return;

        function slugify(text) {
            return String(text || "")
                .toLowerCase()
                .replace(/[^a-z0-9가-힣\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .slice(0, 48);
        }

        function buildToc() {
            if (!tocWrap || !tocNav) return;
            var heads = post.querySelectorAll("h2, h3");
            if (!heads || !heads.length) {
                tocWrap.hidden = true;
                return;
            }

            var list = [];
            for (var i = 0; i < heads.length; i++) {
                var h = heads[i];
                var txt = (h.textContent || "").trim();
                if (!txt) continue;

                if (!h.id) {
                    var id = slugify(txt);
                    if (!id) id = "section-" + (i + 1);
                    h.id = "tt-toc-" + id + "-" + (i + 1);
                }
                list.push(h);
            }

            if (list.length < 2) {
                tocWrap.hidden = true;
                return;
            }

            tocNav.innerHTML = "";
            var links = [];
            for (var j = 0; j < list.length; j++) {
                var node = list[j];
                var a = document.createElement("a");
                a.className = "article-toc-link " + (node.tagName === "H3" ? "lvl-3" : "lvl-2");
                a.href = "#" + node.id;
                a.textContent = (node.textContent || "").trim();
                tocNav.appendChild(a);
                links.push(a);
            }

            tocWrap.hidden = false;

            if ("IntersectionObserver" in window) {
                var activeId = "";
                var io = new IntersectionObserver(function (entries) {
                    for (var k = 0; k < entries.length; k++) {
                        if (entries[k].isIntersecting) {
                            activeId = entries[k].target.id;
                            break;
                        }
                    }
                    if (!activeId) return;
                    for (var m = 0; m < links.length; m++) {
                        var on = links[m].getAttribute("href") === ("#" + activeId);
                        if (on) links[m].classList.add("is-active");
                        else links[m].classList.remove("is-active");
                    }
                }, { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 });

                for (var n = 0; n < list.length; n++) io.observe(list[n]);
            }
        }

        function findCommentBoardAndForm() {
            var board = document.querySelector(".tt-comment-cont");
            if (!board) return null;

            var form = null;
            var areaReply = null;
            var kids = board.children || [];
            for (var i = 0; i < kids.length; i++) {
                if (!form && kids[i].tagName === "FORM") form = kids[i];
                if (!areaReply && kids[i].classList && kids[i].classList.contains("tt-area-reply")) areaReply = kids[i];
            }
            if (!form) form = board.querySelector("form");
            if (!areaReply) areaReply = board.querySelector(".tt-area-reply");
            return { board: board, form: form, areaReply: areaReply || null };
        }

        function ensureBottomBoardPosition(found) {
            if (!bottomSlot || !found || !found.board) return;
            // Only move if the board is NOT already inside the bottom slot.
            // (If it is nested inside wrappers under #ttArticleCommentBottom, keep structure intact.)
            try {
                if (!bottomSlot.contains(found.board)) bottomSlot.appendChild(found.board);
            } catch (e) {}
        }

        
function bindDockedFormState(form) {
    // legacy no-op (kept for backward compatibility)
    return;
}

function buildCommentProxy(found) {
    if (!dock || !formSlot || !found || !found.form || !found.board) return false;

    var board = found.board;
    var form = found.form;

    // If previously docked by older script, revert safely
    try { board.classList.remove("is-form-docked"); } catch (e) {}

    var isDesktop = false;
    try { isDesktop = window.matchMedia("(min-width: 1025px)").matches; } catch (e) {}

    // Mobile/Tablet: remove proxy and keep original form in board
    if (!isDesktop) {
        if (formSlot) formSlot.innerHTML = "";
        try { board.classList.remove("is-comment-proxy"); } catch (e) {}
        return true;
    }

    // Desktop: create proxy UI in right dock and keep original form in place (hidden by CSS)
    if (formSlot.__ttProxyBoundForm === form && formSlot.querySelector(".tt-comment-proxy")) {
        try { board.classList.add("is-comment-proxy"); } catch (e) {}
        return true;
    }

    formSlot.innerHTML = "";
    formSlot.__ttProxyBoundForm = form;

    var proxy = document.createElement("div");
    proxy.className = "tt-comment-proxy";

    var area = document.createElement("div");
    area.className = "tt-area-write";

    var head = document.createElement("div");
    head.className = "tt-proxy-head";
    head.innerHTML = "<strong>댓글</strong><p>메모처럼 남겨주세요</p>";

    // Guest fields (if exist in original form)
    var realName = form.querySelector("input[name='name'], input[name='comment_name'], input.tt-name");
    var realPw = form.querySelector("input[type='password'][name], input[name='password'], input[name='comment_password']");
    var guest = null;
    var proxyName = null;
    var proxyPw = null;

    if (realName || realPw) {
        guest = document.createElement("div");
        guest.className = "tt-proxy-guest";

        if (realName) {
            proxyName = document.createElement("input");
            proxyName.type = "text";
            proxyName.className = "tt-proxy-input";
            proxyName.placeholder = "이름";
            proxyName.autocomplete = "name";
            guest.appendChild(proxyName);
        }

        if (realPw) {
            proxyPw = document.createElement("input");
            proxyPw.type = "password";
            proxyPw.className = "tt-proxy-input";
            proxyPw.placeholder = "비밀번호";
            proxyPw.autocomplete = "current-password";
            guest.appendChild(proxyPw);
        }
    }

    var ta = document.createElement("textarea");
    ta.className = "tt-cmt-proxy";
    ta.placeholder = "댓글을 입력하세요";

    var btnBox = document.createElement("div");
    btnBox.className = "tt-box-write";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tt-proxy-submit";
    btn.textContent = "보내기";

    function setDisabled(disabled) {
        btn.disabled = !!disabled;
        if (disabled) btn.setAttribute("aria-disabled", "true");
        else btn.removeAttribute("aria-disabled");
    }

    function syncState() {
        var hasText = (ta.value || "").replace(/\s+/g, "").length > 0;
        setDisabled(!hasText);
    }

    ta.addEventListener("input", syncState);
    ta.addEventListener("change", syncState);
    syncState();

    btn.addEventListener("click", function () {
        var text = (ta.value || "");
        if (!text.replace(/\s+/g, "").length) return;

            // Fill guest fields if needed
    if (realName && proxyName) {
        realName.value = proxyName.value || "";
        try { realName.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
    }
    if (realPw && proxyPw) {
        realPw.value = proxyPw.value || "";
        try { realPw.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
    }

    // Fill real editor (textarea OR contenteditable)
    var realTextarea = form.querySelector("textarea");
    var realEditable =
        form.querySelector(".tt-cmt[contenteditable='true'], .tt-cmt[contenteditable=''], .tt-cmt[contenteditable]") ||
        form.querySelector("[contenteditable='true'].tt-cmt, [contenteditable].tt-cmt");

    if (realTextarea) {
        realTextarea.value = text;
        try { realTextarea.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
        try { realTextarea.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {}
    } else if (realEditable) {
        // Preserve line breaks
        var safe = String(text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        realEditable.innerHTML = safe.replace(/\n/g, "<br>");
        try { realEditable.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
        try { realEditable.dispatchEvent(new Event("keyup", { bubbles: true })); } catch (e) {}
    }

    // Try trigger real submit (button/input/a)
    var realSubmit =
        form.querySelector("button[type='submit'], input[type='submit']") ||
        form.querySelector(".tt-btn_register, .tt-btn-confirm, .btn_register, a.tt-btn_register, a.btn_register");

    if (realSubmit) {
        // Prevent hash navigation for <a href="#..."> style submit buttons, but keep handlers running.
        try {
            if (realSubmit.tagName === "A") {
                realSubmit.addEventListener("click", function (e) {
                    var href = (realSubmit.getAttribute("href") || "").trim();
                    if (href && href.charAt(0) === "#") e.preventDefault();
                }, { capture: true, once: true });
            }
        } catch (e) {}
        try { realSubmit.click(); } catch (e) {}
    } else {
        // Fallback: submit the form programmatically
        try {
            if (typeof form.requestSubmit === "function") form.requestSubmit();
            else form.submit();
        } catch (e) {}
    }
});

    btnBox.appendChild(btn);

    area.appendChild(head);
    if (guest) area.appendChild(guest);
    area.appendChild(ta);
    area.appendChild(btnBox);

    proxy.appendChild(area);
    formSlot.appendChild(proxy);

    try { board.classList.add("is-comment-proxy"); } catch (e) {}
    return true;
}

function syncCommentFormDock() {
    var found = findCommentBoardAndForm();
    if (!found || !found.board) return false;

    // Always keep board at bottom slot (comment list stays under article)
    ensureBottomBoardPosition(found);

    // Proxy UI for desktop
    buildCommentProxy(found);
    return true;
}

        buildToc();
        syncCommentFormDock();
        window.addEventListener("resize", syncCommentFormDock);

        var tries = 0;
        var timer = setInterval(function () {
            tries++;
            if (syncCommentFormDock() || tries > 20) {
                if (tries > 20 && dock) {
                    dock.style.display = "none";
                }
                clearInterval(timer);
            }
        }, 300);
    }


// -------------------------
// hide/remove Tistory Namecard react block
// -------------------------
function removeNamecardBlock() {
    var el = document.querySelector('[data-tistory-react-app="Namecard"]');
    if (!el) return;
    try { el.remove(); } catch (e) { el.style.display = "none"; }
}

// -------------------------
    // init (DOM ready 보장)
    // -------------------------
    onReady(function () {
        try { removeNamecardBlock(); } catch (e) {}
        try { syncAuthButton(); } catch (e) {}
        try { initCapsuleHeaderToggle(); } catch (e) {}
        try { initCategoryCardsFromGnb(); } catch (e) {}
        try { initMobileCategoryTabs(); } catch (e) {}
        try { initArticleEnhancements(); } catch (e) {}
    });

})();
