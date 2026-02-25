// =========================
// Guestbook Stick Animation (global, options supported)
// =========================
(function () {
    "use strict";

    function escapeHTML(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function pickNoteColor(colors, i) {
        var arr = Array.isArray(colors) && colors.length ? colors : ["#fff2a6", "#ffd6a5", "#caffbf", "#bde0fe"];
        return arr[i % arr.length];
    }

    function getTargetRect(root, panelSelector) {
        var list = root.querySelector("ul, ol");
        var first = list ? list.querySelector("li") : null;
        if (first) return first.getBoundingClientRect();
        var panel = document.querySelector(panelSelector) || root;
        return panel.getBoundingClientRect();
    }

    function createFlyNote(text, name, startRect, count, colors) {
        var fly = document.createElement("div");
        fly.className = "gb-fly-note";
        fly.style.setProperty("--note-bg", pickNoteColor(colors, count));

        fly.style.left = startRect.left + "px";
        fly.style.top = startRect.top + "px";
        fly.style.width = startRect.width + "px";
        fly.style.height = startRect.height + "px";

        fly.innerHTML =
            '<div class="gb-fly-head">' +
            '<span class="gb-fly-name">' + escapeHTML(name) + "</span>" +
            '<span class="gb-fly-dot"></span>' +
            "</div>" +
            '<div class="gb-fly-body">' + escapeHTML(text) + "</div>";

        document.body.appendChild(fly);
        return fly;
    }

    window.initGuestbookStickAnim = function initGuestbookStickAnim(options) {
        var opt = options || {};

        var rootSelector = opt.rootSelector || ".tt-guestbook .area_common";
        var composerSelector = opt.composerSelector || ".tt-area-write";
        var buttonSelector = opt.buttonSelector || ".tt-btn_register";
        var editorSelector = opt.editorSelector || ".tt-cmt[contenteditable='true'], textarea";
        var nameSelector = opt.nameSelector || ".tt-box-account input[type='text']";
        var panelSelector = opt.panelSelector || ".tt-guestbook .tt-guestbook__panel";

        var duration = typeof opt.duration === "number" ? opt.duration : 520;
        var easing = opt.easing || "cubic-bezier(0.2,0.8,0.2,1)";
        var noteColors = opt.noteColors || ["#fff2a6", "#ffd6a5", "#caffbf", "#bde0fe"];

        var root = document.querySelector(rootSelector);
        if (!root) return;

        var form = root.querySelector("form");
        if (!form) return;

        var composer = form.querySelector(composerSelector);
        var btn = form.querySelector(buttonSelector);
        var editor = form.querySelector(editorSelector);
        var nameInput = form.querySelector(nameSelector);

        if (!composer || !btn || !editor) return;

        // 중복 바인딩 방지
        if (form.__gbStickBound) return;
        form.__gbStickBound = true;

        var bypass = false;

        function getEditorText() {
            if (!editor) return "";
            var tag = (editor.tagName || "").toUpperCase();
            if (tag === "TEXTAREA" || tag === "INPUT") return (editor.value || "").trim();
            return (editor.textContent || "").trim();
        }

        function getNameText() {
            var v = nameInput ? (nameInput.value || "").trim() : "";
            return v || "익명";
        }

        function playFlyAnimation(thenSubmit) {
            var text = getEditorText();
            if (!text) {
                thenSubmit();
                return;
            }

            var startRect = composer.getBoundingClientRect();
            var targetRect = getTargetRect(root, panelSelector);

            var dx = (targetRect.left - startRect.left) + (Math.random() * 24 - 12);
            var dy = (targetRect.top - startRect.top) - 12 + (Math.random() * 18 - 9);
            var endRot = (Math.random() * 2 - 1).toFixed(2);
            var count = (root.querySelectorAll("ul li, ol li") || []).length;

            var fly = createFlyNote(text, getNameText(), startRect, count, noteColors);

            function finish() {
                if (fly && fly.parentNode) fly.parentNode.removeChild(fly);
                thenSubmit();
            }

            var keyframes = [
                { transform: "translate(0px,0px) rotate(-1.2deg) scale(1)", opacity: 1 },
                { transform: "translate(" + (dx * 0.85) + "px," + (dy * 0.85) + "px) rotate(" + endRot + "deg) scale(0.78)", opacity: 0.95, offset: 0.75 },
                { transform: "translate(" + dx + "px," + dy + "px) rotate(" + endRot + "deg) scale(0.70)", opacity: 0.15 }
            ];

            if (fly.animate) {
                var anim = fly.animate(keyframes, { duration: duration, easing: easing });
                anim.onfinish = finish;
                setTimeout(finish, Math.max(900, duration + 250)); // 안전장치
                return;
            }

            fly.style.transition = "transform " + duration + "ms " + easing + ", opacity " + duration + "ms " + easing;
            requestAnimationFrame(function () {
                fly.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + endRot + "deg) scale(0.70)";
                fly.style.opacity = "0.15";
            });
            setTimeout(finish, duration + 40);
        }

        // 클릭 가로채기
        btn.addEventListener("click", function (e) {
            if (bypass) return;
            if (btn.disabled) return;

            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();

            playFlyAnimation(function () {
                bypass = true;
                btn.click();
                bypass = false;
            });
        }, true);

        // submit(엔터 등) 가로채기
        form.addEventListener("submit", function (e) {
            if (bypass) return;

            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();

            playFlyAnimation(function () {
                bypass = true;
                if (form.requestSubmit) form.requestSubmit(btn);
                else form.submit();
                bypass = false;
            });
        }, true);
    };
})();
