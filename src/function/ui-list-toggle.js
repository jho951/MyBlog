/* =========================================================
   ui-list-toggle.js
   List/Card View Toggle for Tistory #pageList
   - Requires: HTML has #pageList + .list-view-toggle .view-btn[data-view]
   - Stores preference in localStorage("tt:list:view")
========================================================= */
(function () {
    "use strict";

    var STORAGE_KEY = "tt:list:view";

    function qs(sel, root) {
        return (root || document).querySelector(sel);
    }
    function qsa(sel, root) {
        return (root || document).querySelectorAll(sel);
    }

    function safeGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return ""; }
    }
    function safeSet(key, val) {
        try { localStorage.setItem(key, val); } catch (e) {}
    }

    function initListViewToggle() {
        var page = document.getElementById("pageList");
        if (!page) return;

        var toggle = qs(".list-view-toggle", page);
        if (!toggle) return;

        var btns = qsa(".view-btn[data-view]", toggle);
        if (!btns || !btns.length) return;

        function apply(view) {
            if (view !== "card" && view !== "list") view = "list";

            page.setAttribute("data-view", view);

            for (var i = 0; i < btns.length; i++) {
                var b = btns[i];
                var on = b.getAttribute("data-view") === view;
                if (on) b.classList.add("is-active");
                else b.classList.remove("is-active");
                b.setAttribute("aria-pressed", on ? "true" : "false");
            }

            safeSet(STORAGE_KEY, view);
        }

        // 1) Load saved state (or fallback)
        var saved = safeGet(STORAGE_KEY);
        var initial = (saved === "card" || saved === "list")
            ? saved
            : (page.getAttribute("data-view") || "list");

        apply(initial);

        // 2) Click handler (event delegation)
        toggle.addEventListener("click", function (e) {
            var t = e.target;

            // climb up to .view-btn
            while (t && t !== toggle && !(t.classList && t.classList.contains("view-btn"))) {
                t = t.parentElement;
            }
            if (!t || t === toggle) return;

            var v = t.getAttribute("data-view");
            if (v === "card" || v === "list") apply(v);
        });
    }

    // expose globally (so your loader can call it)
    window.initListViewToggle = initListViewToggle;

    // auto-run (safe): only runs on list pages where #pageList exists
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initListViewToggle, { once: true });
    } else {
        initListViewToggle();
    }
})();
