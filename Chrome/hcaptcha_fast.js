(async () => {
    var {} = await import(chrome.runtime.getURL("utils.js"));
    let a = null,
        t = !1,
        r = !1;

    function n(e, t, r = !1) {
        e && (r || a !== e) && (!0 === t && "false" === e.getAttribute("aria-pressed") || !1 === t && "true" === e.getAttribute("aria-pressed")) && e.click()
    }
    document.addEventListener("mousedown", e => {
        "false" === e ? .target ? .parentNode ? .getAttribute("aria-pressed") ? (t = !0, r = !0) : "true" === e ? .target ? .parentNode ? .getAttribute("aria-pressed") && (t = !0, r = !1), a = e ? .target ? .parentNode
    }), document.addEventListener("mouseup", e => {
        t = !1, a = null
    }), document.addEventListener("mousemove", e => {
        t && (a !== e ? .target ? .parentNode && null !== a && n(a, r, !0), n(e ? .target ? .parentNode, r))
    })
})();