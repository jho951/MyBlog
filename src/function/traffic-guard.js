/* =========================================================
   traffic-guard.js
   - Standalone (util.js 없어도 동작)
   - Exposes: window.TT_TRAFFIC
   - Goal: classify traffic + gate ads (no move/hide)
========================================================= */
(function () {
    "use strict";

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else fn();
    }

    function safeGet(pathFn, fallback) {
        try { return pathFn(); } catch (e) { return fallback; }
    }

    function ua() {
        return (navigator.userAgent || "").toLowerCase();
    }

    function isLikelyBotUA(u) {
        return /(bot|crawler|spider|headless|scrapy|curl|wget|python-requests|httpclient|phantom|selenium|playwright|puppeteer)/i.test(u);
    }

    function scoreBotSignals() {
        var score = 0;
        var reasons = [];

        var u = ua();
        if (isLikelyBotUA(u)) { score += 5; reasons.push("ua_bot"); }

        // navigator.webdriver: 자동화 도구 흔적
        if (navigator.webdriver) { score += 4; reasons.push("webdriver"); }

        // headless/automation에서 흔한 약한 시그널들(확률적)
        var langs = safeGet(function () { return navigator.languages; }, []);
        if (!langs || !langs.length) { score += 2; reasons.push("no_languages"); }

        var plugins = safeGet(function () { return navigator.plugins; }, []);
        if (!plugins || plugins.length === 0) { score += 1; reasons.push("no_plugins"); }

        var hw = safeGet(function () { return navigator.hardwareConcurrency; }, 0);
        if (!hw) { score += 1; reasons.push("no_hw"); }

        var mem = safeGet(function () { return navigator.deviceMemory; }, 0);
        if (!mem) { score += 1; reasons.push("no_mem"); }

        // viewport 0 비정상
        var w = window.innerWidth || 0;
        var h = window.innerHeight || 0;
        if (w === 0 || h === 0) { score += 3; reasons.push("zero_viewport"); }

        return { score: score, reasons: reasons };
    }

    // 내부 트래픽 판별:
    // - 티스토리 로그인(작성자/관리자)인 경우
    // - URL에 ?noads=1 붙여서 테스트할 때
    // - localStorage에 noads 플래그를 저장해둔 경우
    function isInternalTraffic() {
        var loggedInName = safeGet(function () {
            return window.T && window.T.config && window.T.config.USER && window.T.config.USER.name;
        }, "");
        if (loggedInName) return true;

        var sp = new URLSearchParams(location.search || "");
        if (sp.get("noads") === "1") return true;

        try {
            if (localStorage.getItem("tt:noads") === "1") return true;
        } catch (e) {}

        return false;
    }

    var state = {
        cls: "unknown",
        botScore: 0,
        botReasons: [],
        engaged: false,
        interactions: 0,
        scrollMax: 0,
        startedAt: Date.now(),
        engagedAt: 0,
        listeners: []
    };

    function classifyNow() {
        if (isInternalTraffic()) {
            state.cls = "internal";
            return;
        }

        var b = scoreBotSignals();
        state.botScore = b.score;
        state.botReasons = b.reasons;

        // bot 임계값(조정 가능): 6 이상이면 bot으로 분류
        if (state.botScore >= 6) {
            state.cls = "bot";
            return;
        }

        // 기본은 human/low로 갈리는데, low는 "engagement"로 후처리
        state.cls = "human";
    }

    function updateEngagement() {
        // engaged 조건(조정 가능)
        var t = Date.now() - state.startedAt;
        var okTime = t >= 2500;             // 2.5초 이상 체류
        var okScroll = state.scrollMax >= 160; // 160px 이상 스크롤
        var okInteract = state.interactions >= 2;

        // 내부/봇이면 engaged 처리 불필요
        if (state.cls === "internal" || state.cls === "bot") return;

        if (!state.engaged && okTime && (okScroll || okInteract)) {
            state.engaged = true;
            state.engagedAt = Date.now();

            // low 트래픽이 아니라는 의미로 남김
            if (state.cls === "human") {
                fireEngaged();
            }
        }
    }

    function fireEngaged() {
        for (var i = 0; i < state.listeners.length; i++) {
            try { state.listeners[i](); } catch (e) {}
        }
        state.listeners.length = 0;
    }

    function bindSignals() {
        // 인터랙션 카운트(광고 클릭 추적 X / iframe 접근 X)
        function bump() {
            state.interactions++;
            updateEngagement();
        }

        window.addEventListener("pointerdown", bump, { passive: true });
        window.addEventListener("keydown", bump, { passive: true });

        window.addEventListener("scroll", function () {
            var y = window.scrollY || document.documentElement.scrollTop || 0;
            if (y > state.scrollMax) state.scrollMax = y;
            updateEngagement();
        }, { passive: true });

        // 시간만 흐르는 케이스도 체크
        var timer = setInterval(function () {
            updateEngagement();
            // 15초 이후엔 타이머 종료
            if (Date.now() - state.startedAt > 15000) clearInterval(timer);
        }, 250);
    }

    function markOnDOM() {
        document.body.setAttribute("data-traffic-class", state.cls);
        document.body.setAttribute("data-bot-score", String(state.botScore));
    }

    // GA4/gtag가 있으면 분류 결과를 이벤트로 남겨서 “분류별 트래픽 추이”를 볼 수 있게
    function emitAnalytics() {
        if (typeof window.gtag !== "function") return;

        window.gtag("event", "traffic_classified", {
            traffic_class: state.cls,
            bot_score: state.botScore,
            engaged: state.engaged ? 1 : 0
        });
    }

    // 외부에서 쓸 API
    window.TT_TRAFFIC = {
        getClass: function () { return state.cls; },
        getBotScore: function () { return state.botScore; },
        getBotReasons: function () { return state.botReasons.slice(); },
        isEngaged: function () { return !!state.engaged; },

        // 광고 노출/요청 허용 조건
        shouldServeAds: function () {
            if (state.cls === "internal") return false;
            if (state.cls === "bot") return false;
            return !!state.engaged; // human이라도 engaged 전에는 광고 요청 X
        },

        // engaged 될 때까지 기다렸다가 콜백 실행
        onEngaged: function (cb, timeoutMs) {
            if (typeof cb !== "function") return;
            if (this.shouldServeAds()) { cb(); return; }
            state.listeners.push(cb);

            var ms = typeof timeoutMs === "number" ? timeoutMs : 12000;
            setTimeout(function () {
                // 타임아웃 시: engaged 안 됐으면 low로 간주 (광고 요청 안 함)
                if (!state.engaged && state.cls === "human") {
                    state.cls = "low";
                    markOnDOM();
                    emitAnalytics();
                }
            }, ms);
        }
    };

    onReady(function () {
        classifyNow();
        bindSignals();
        markOnDOM();
        emitAnalytics();
    });
})();
