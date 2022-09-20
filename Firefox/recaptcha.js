(async () => {
    const o = "http://144.126.221.48:31300",
        _ = [200, 250],
        {
            Logger: e,
            Time: g,
            BG: w,
            Net: u,
            Image: y
        } = await import(chrome.runtime.getURL("utils.js"));
    async function v({
        task: e,
        images: t,
        j: a,
        g: c
    }) {
        for (;
            "Online" !== await w.exec("get_server_status");) await g.sleep(1e3);
        var r = {
                y: "r",
                j: a,
                i: t,
                g: c,
                t: e,
                a: null,
                v: chrome.runtime.getManifest().version
            },
            r = await u.fetch(o, {
                method: "POST",
                body: JSON.stringify(r)
            });
        try {
            var i = JSON.parse(r);
            if ("error" in i) return 13 === i.error ? (await g.sleep(1e3), await v({
                task: e,
                images: t,
                j: a,
                g: c
            })) : (10 === i.error ? await f() : 14 === i.error && await w.exec("set_server_status", {
                status: "Slow"
            }), {
                job_id: null,
                clicks: null
            });
            else {
                var l = i.data;
                for (;;) {
                    await g.sleep(1e3);
                    var n = await u.fetch(o + "?id=" + l);
                    try {
                        var s = JSON.parse(n);
                        if ("error" in s) {
                            if (12 != s.error) return await {
                                job_id: l,
                                clicks: null
                            };
                            continue
                        }
                        return await {
                            job_id: l,
                            clicks: s.data
                        }
                    } catch (e) {}
                }
                return await void 0
            }
        } catch (e) {
            await f()
        }
        return {
            job_id: null,
            clicks: null
        }
    }
    async function t(e) {
        var t = await w.exec("get_cache", {
            name: "job_id",
            tab_specific: !0
        });
        return await w.exec("empty_cache", {
            name: "job_id",
            tab_specific: !0
        }), u.fetch(o + "/report", {
            method: "POST",
            body: JSON.stringify({
                j: t,
                g: e
            })
        })
    }
    async function f() {
        await w.exec("set_server_status", {
            status: "Offline"
        })
    }

    function a() {
        var e = "true" === document.querySelector(".recaptcha-checkbox") ? .getAttribute("aria-checked"),
            t = document.querySelector("#recaptcha-verify-button") ? .disabled;
        return e || t
    }

    function b(r = 15e3) {
        return new Promise(async e => {
            for (var t = g.time();;) {
                var a = document.querySelectorAll(".rc-imageselect-tile"),
                    c = document.querySelectorAll(".rc-imageselect-dynamic-selected");
                if (0 < a.length && 0 === c.length) return e(!0);
                if (g.time() - t > r) return e(!1);
                await g.random_sleep(..._)
            }
        })
    }
    let S = null;
    async function c() {
        if (e.debug) {
            let e = await w.exec("get_cache", {
                    name: "recaptcha_pass",
                    tab_specific: !0
                }),
                t = await w.exec("get_cache", {
                    name: "recaptcha_fail",
                    tab_specific: !0
                });
            null === e && (e = 0), null === t && (t = 0);
            0 < e + t && Math.round(100 * e / (e + t))
        }
    }
    async function r(e) {
        if (a()) return l || (await t(!0), await w.exec("inc_cache", {
            name: "recaptcha_pass",
            tab_specific: !0
        }), await c(), l = !0), void(e.debug && await w.exec("reset_recaptcha"));
        l = !1, await g.sleep(e.open_delay), document.querySelector("#recaptcha-anchor") ? .click()
    }
    async function i(r) {
        r.debug && await w.exec("reload_tab", {
            delay: 3e5,
            overwrite: !0
        });
        var i = await w.exec("get_cache", {
            name: "recaptcha_visible",
            tab_specific: !0
        });
        if (!0 === i && !a()) {
            if (x = !(x || ! function () {
                    for (const e of [".rc-imageselect-incorrect-response"])
                        if ("" === document.querySelector(e) ? .style.display) return 1
                }()) && (await t(!(k = [])), await w.exec("inc_cache", {
                    name: "recaptcha_fail",
                    tab_specific: !0
                }), await c(), !0), function () {
                    for (const e of [".rc-imageselect-error-select-more", ".rc-imageselect-error-dynamic-more", ".rc-imageselect-error-select-something"])
                        if ("" === document.querySelector(e) ? .style.display) return 1
                }()) return await t(!(k = [])), void await w.exec("reset_recaptcha");
            if (await b()) {
                l = 100;
                var l, {
                        task: i,
                        is_hard: n,
                        cells: s,
                        background_url: o,
                        urls: u
                    } = await new Promise(f => {
                        let d = !1;
                        const m = setInterval(() => {
                            if (!d) {
                                d = !0;
                                let c = null;
                                const e = document.querySelector(".rc-imageselect-instructions") ? .innerText ? .split("\n");
                                if (c = 1 < e.length ? (c = e.slice(0, 2).join(" ")).replace(/\s+/g, " ") ? .trim() : c) {
                                    var r = 3 === e.length,
                                        i = document.querySelectorAll("table tr td");
                                    if (9 !== i.length && 16 !== i.length) d = !1;
                                    else {
                                        const s = [],
                                            o = Array(i.length).fill(null);
                                        let e = null,
                                            t = !1,
                                            a = 0;
                                        for (const u of i) {
                                            var l = u ? .querySelector("img");
                                            if (!l) return void(d = !1);
                                            var n = l.src ? .trim();
                                            if (!n || "" === n) return void(d = !1);
                                            300 <= l.naturalWidth ? e = n : 100 == l.naturalWidth && (o[a] = n, t = !0), s.push(u), a++
                                        }
                                        t && (e = null);
                                        i = JSON.stringify([e, o]);
                                        if (S !== i) return S = i, clearInterval(m), d = !1, f({
                                            task: c,
                                            is_hard: r,
                                            cells: s,
                                            background_url: e,
                                            urls: o
                                        });
                                        d = !1
                                    }
                                } else d = !1
                            }
                        }, l)
                    }),
                    f = 9 == s.length ? 3 : 4;
                let t = [],
                    e = "c",
                    a = 1,
                    c = [];
                if (null === o)
                    for (let e = 0; e < u.length; e++) {
                        var d = u[e],
                            m = s[e];
                        d && !k.includes(d) && (t.push(await y.encode(d)), c.push(m))
                    } else {
                        o = await y.encode(o);
                        t.push(o), null === o && await w.exec("reset_recaptcha"), e = 4 == f ? "p" : "c", a = f, c = s
                    }
                var o = g.time(),
                    {
                        job_id: i,
                        clicks: h
                    } = await v({
                        task: i,
                        images: t,
                        j: e,
                        g: a
                    });
                if (h) {
                    r = r.solve_delay - (g.time() - o);
                    0 < r && await g.sleep(r), await w.exec("append_cache", {
                        name: "job_id",
                        value: i,
                        tab_specific: !0
                    }), await g.random_sleep(..._);
                    let t = 0;
                    for (let e = 0; e < h.length; e++) !1 !== h[e] && (t++, function (e) {
                        try {
                            return e.classList.contains("rc-imageselect-tileselected")
                        } catch {}
                    }(c[e]) || c[e] ? .click());
                    for (const p of u) k.push(p), 9 < k.length && k.shift();
                    await g.random_sleep(..._), (3 == f && n && 0 === t && await b() || 3 == f && !n || 4 == f) && document.querySelector("#recaptcha-verify-button") ? .click()
                }
            } else await w.exec("reset_recaptcha")
        }
    }
    let l = !1,
        x = !1,
        k = [];
    for (;;) {
        await g.sleep(1e3);
        var n = await w.exec("get_settings");
        n && "image" === n.solve_method && (e.debug = n.debug, async function () {
            var t = document.querySelectorAll('iframe[src*="/bframe"]');
            if (0 < t.length) {
                let e = !1;
                for (const a of t)
                    if (e = "visible" === window.getComputedStyle(a).visibility) break;
                e ? await w.exec("set_cache", {
                    name: "recaptcha_visible",
                    value: !0,
                    tab_specific: !0
                }) : await w.exec("set_cache", {
                    name: "recaptcha_visible",
                    value: !1,
                    tab_specific: !0
                })
            }
        }(), n.auto_open && null !== document.querySelector(".recaptcha-checkbox") ? await r(n) : n.auto_solve && null !== document.querySelector("#rc-imageselect") && await i(n))
    }
})();