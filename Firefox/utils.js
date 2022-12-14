"use strict";
class Type {
    static _string_constructor = "string".constructor;
    static _array_constructor = [].constructor;
    static _object_constructor = {}.constructor;
    static of (t) {
        return null === t ? "null" : void 0 === t ? "undefined" : t.constructor === Type._string_constructor ? "string" : t.constructor === Type._array_constructor ? "array" : t.constructor === Type._object_constructor ? "object" : ""
    }
}
class Logger {
    static debug = !0;
    static log(t = 0) {
        const e = new Array(...arguments).map(t => ["array", "object"].includes(Type.of(t)) ? JSON.stringify(t, null, 4) : "" + t);
        e.join(" ")
    }
}
class Time {
    static time() {
        return Date.now || (Date.now = () => (new Date).getTime()), Date.now()
    }
    static sleep(e = 1e3) {
        return new Promise(t => setTimeout(t, e))
    }
    static async random_sleep(t, e) {
        e = Math.floor(Math.random() * (e - t) + t);
        return Time.sleep(e)
    }
    static pad(t) {
        var e = 2 - String(t).length + 1;
        return 0 < e ? "" + new Array(e).join("0") + t : "" + t
    }
    static date() {
        return new Date
    }
    static string(t = null) {
        return t = t || Time.date(), Time.pad(t.getMonth() + 1) + `/${Time.pad(t.getDate())}/${t.getFullYear()} ${Time.pad(t.getHours()%12)}:${Time.pad(t.getMinutes())}:${Time.pad(t.getSeconds())} ` + (12 <= t.getHours() ? "PM" : "AM")
    }
}
class BG {
    static exec(t, r) {
        return new Promise(e => {
            try {
                chrome.runtime.sendMessage({
                    method: t,
                    data: r
                }, e)
            } catch (t) {
                e()
            }
        })
    }
}
class Net {
    static async fetch(t, e) {
        return BG.exec("fetch", {
            url: t,
            options: e
        })
    }
}
class Image {
    static encode(e) {
        return new Promise(r => {
            if (null === e) return r(null);
            const t = new XMLHttpRequest;
            t.onload = () => {
                const e = new FileReader;
                e.onloadend = () => {
                    let t = e.result;
                    if (t.startsWith("data:text/html;base64,")) return r(null);
                    t = t.replace("data:image/jpeg;base64,", ""), r(t)
                }, e.readAsDataURL(t.response)
            }, t.onerror = () => {
                r(null)
            }, t.onreadystatechange = () => {
                4 == this.readyState && 200 != this.status && r(null)
            }, t.open("GET", e), t.responseType = "blob", t.send()
        })
    }
}

function oep(n, s = 1, t = 100) {
    return new Promise(e => {
        const r = setInterval(() => {
            var t = document.querySelectorAll(n);
            if (t.length === s) return clearInterval(r), e(1 === s ? t[0] : t)
        }, t)
    })
}
export {
    Type,
    Logger,
    Time,
    BG,
    Net,
    Image,
    oep
};