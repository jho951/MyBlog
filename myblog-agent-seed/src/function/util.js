const qs = (sel, root) => (root || document).querySelector(sel);
const qsa = (sel, root) => (root || document).querySelectorAll(sel);

function closest(el, selector, stopEl) {
    while (el && el !== stopEl && el.nodeType === 1) {
        if (el.matches && el.matches(selector)) return el;
        el = el.parentElement;
    }
    return null;
}

function onReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
}

window.qs = qs;
window.qsa = qsa;
window.closest = closest;
window.onReady = onReady;
