/* =========================================================
   list-search-filter.js
   - Client-side filter on #pageList cards by title/category text
========================================================= */
(function () {
    "use strict";

    function normalizeText(v) {
        return String(v || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function initListSearchFilter() {
        var page = document.getElementById("pageList");
        if (!page) return;

        var input = document.getElementById("ttListSearchInput");
        var clearBtn = document.getElementById("ttListSearchClear");
        var meta = document.getElementById("ttListSearchMeta");
        var toggleBtn = document.getElementById("ttListSearchToggle");
        var panel = document.getElementById("ttListSearchPanel");
        if (!input || !clearBtn || !meta) return;

        var cards = page.querySelectorAll(".list-grid .list-card");
        if (!cards || !cards.length) {
            clearBtn.hidden = true;
            meta.textContent = "";
            return;
        }

        function getCardText(card) {
            var title = card.querySelector(".card-title");
            var badge = card.querySelector(".badge");
            var raw = (title ? title.textContent : "") + " " + (badge ? badge.textContent : "");
            return normalizeText(raw);
        }

        var index = [];
        for (var i = 0; i < cards.length; i++) {
            index.push({ node: cards[i], text: getCardText(cards[i]) });
        }

        function renderCount(shown, total, keyword) {
            if (!keyword) {
                meta.textContent = "전체 " + total + "개";
                return;
            }
            meta.textContent = "\"" + keyword + "\" 검색 결과 " + shown + " / " + total;
        }

        function applyFilter() {
            var keyword = normalizeText(input.value || "");
            var total = index.length;
            var shown = 0;

            for (var i = 0; i < index.length; i++) {
                var row = index[i];
                var match = !keyword || row.text.indexOf(keyword) !== -1;
                row.node.style.display = match ? "" : "none";
                if (match) shown++;
            }

            clearBtn.hidden = !keyword;
            renderCount(shown, total, keyword);
        }

        function setSearchPanel(open) {
            if (!panel || !toggleBtn) return;
            panel.classList.toggle("is-open", !!open);
            panel.setAttribute("aria-hidden", open ? "false" : "true");
            toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
            if (open) input.focus();
        }

        if (panel && toggleBtn) {
            panel.classList.remove("is-open");
            panel.setAttribute("aria-hidden", "true");
            toggleBtn.addEventListener("click", function () {
                var open = !panel.classList.contains("is-open");
                setSearchPanel(open);
            });
            input.addEventListener("keydown", function (e) {
                if (e.key !== "Escape") return;
                if (panel.classList.contains("is-open")) {
                    setSearchPanel(false);
                    toggleBtn.focus();
                }
            });
        }

        clearBtn.hidden = true;
        clearBtn.addEventListener("click", function () {
            input.value = "";
            input.focus();
            applyFilter();
        });

        input.addEventListener("input", applyFilter);
        applyFilter();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initListSearchFilter, { once: true });
    } else {
        initListSearchFilter();
    }
})();
