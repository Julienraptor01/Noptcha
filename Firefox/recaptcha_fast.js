(async () => {
    var {} = await import(chrome.runtime.getURL("utils.js"));
    let i = null,
        n = !1,
        s = !1;

    function a(e) {
        let t = e;
        for (; t && !t.classList ? .contains("rc-imageselect-tile");) t = t.parentNode;
        return t
    }

    function t(e, t, n = !1) {
        !e || !n && i === e || (!0 === t && e.classList.contains("rc-imageselect-tileselected") || !1 === t && !e.classList.contains("rc-imageselect-tileselected")) && e.click()
    }
    document.addEventListener("mousedown", e => {
        const t = a(e ? .target);
        t && (s = t.classList.contains("rc-imageselect-tileselected") ? n = !0 : !(n = !0), i = t)
    }), document.addEventListener("mouseup", e => {
        n = !1, i = null
    }), document.addEventListener("mousemove", e => {
        e = a(e ? .target);
        n && (i !== e && null !== i && t(i, s, !0), t(e, s))
    });
    window.addEventListener("load", function (e) {
        const t = document.body.appendChild(document.createElement("style")).sheet;
        t.insertRule(".rc-imageselect-table-33, .rc-imageselect-table-42, .rc-imageselect-table-44 {transition-duration: 0.5s !important}", 0), t.insertRule(".rc-imageselect-tile {transition-duration: 2s !important}", 1), t.insertRule(".rc-imageselect-dynamic-selected {transition-duration: 1s !important}", 2), t.insertRule(".rc-imageselect-progress {transition-duration: 0.5s !important}", 3), t.insertRule(".rc-image-tile-overlay {transition-duration: 0.5s !important}", 4)
    })
})();