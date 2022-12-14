(async () => {
    const r = [200, 400],
        {
            Logger: o,
            Time: i,
            BG: n,
            Net: l
        } = await import(chrome.runtime.getURL("utils.js"));

    function u() {
        var e, t;
        if (!s()) return e = "true" === document.querySelector(".recaptcha-checkbox") ? .getAttribute("aria-checked"), t = document.querySelector("#recaptcha-verify-button") ? .disabled, e || t
    }

    function s() {
        return "Try again later" === document.querySelector(".rc-doscaptcha-header") ? .innerText
    }
    async function e(e) {
        u() || (await i.sleep(e.open_delay), document.querySelector("#recaptcha-anchor") ? .click())
    }
    async function t(t) {
        var c = await n.exec("get_cache", {
            name: "recaptcha_visible",
            tab_specific: true
        });
        if (true === c && !u()) {
            if (s()) return o.log("got solve error"), void await n.exec("reset_recaptcha");
            c = document.querySelector(".rc-audiochallenge-tdownload-link") ? .href, c = (fetch(c), await i.random_sleep(...r), document.querySelector("#audio-source") ? .src ? .replace("recaptcha.net", "google.com"));
            let e = document.querySelector("html") ? .getAttribute("lang") ? .trim();
            e && 0 !== e.length || (e = "en");
            var a = i.time(),
                c = await l.fetch("https://engageub.pythonanywhere.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "input=" + encodeURIComponent(c) + "&lang=" + e
                }),
                c = (document.querySelector("#audio-response").value = c, t.solve_delay - (i.time() - a));
            0 < c && await i.sleep(c), await i.random_sleep(...r), document.querySelector("#recaptcha-verify-button") ? .click()
        }
    }
    for (;;) {
        await i.sleep(1e3);
        var c = await n.exec("get_settings");
        c && "voice" === c.solve_method && (o.debug = c.debug, async function () {
            var t = document.querySelectorAll('iframe[src*="/recaptcha/api2/bframe"]');
            if (0 < t.length) {
                let e = false;
                for (const c of t)
                    if (e = "visible" === window.getComputedStyle(c).visibility) break;
                e ? await n.exec("set_cache", {
                    name: "recaptcha_visible",
                    value: true,
                    tab_specific: true
                }) : await n.exec("set_cache", {
                    name: "recaptcha_visible",
                    value: false,
                    tab_specific: true
                })
            }
        }(), c.auto_open && null !== document.querySelector(".recaptcha-checkbox") ? await e(c) : c.auto_solve && null !== document.querySelector(".rc-imageselect-instructions") ? (a = c, await (true === await n.exec("get_cache", {
            name: "recaptcha_visible",
            tab_specific: true
        }) && !u() && (await i.sleep(a.open_delay), !document.querySelector("#recaptcha-audio-button") ? .click()))) : !c.auto_solve || null === document.querySelector("#audio-instructions") && null === document.querySelector(".rc-doscaptcha-header") || await t(c))
    }
    var a
})();