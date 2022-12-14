const $log = document.querySelector("#log"),
    logs = [];

function log(e) {
    $log && (logs.push(e), $log.innerHTML = logs.join("\n"), $log.scrollTop = $log.scrollHeight)
}
class BG {
    static exec(t, s) {
        return new Promise(e => {
            try {
                chrome.runtime.sendMessage({
                    method: t,
                    data: s
                }, e)
            } catch {
                e()
            }
        })
    }
}
async function set_switch(e, t) {
    const s = document.querySelector(`input#${e}[type="checkbox"]`);
    if (s) {
        var n = s.dataset ? .disables ? .split(",");
        if (n)
            for (const c of n) {
                const o = document.querySelector("#" + c);
                o.disabled = !t
            }
        log(`set_switch ${e} ` + t), s.checked = t, await BG.exec("set_settings", {
            id: e,
            value: t
        })
    }
}
async function set_field(e, t) {
    const s = document.querySelector(`input#${e}[type="text"]`);
    if (s) {
        try {
            t = parseInt(t)
        } catch {
            t = 0
        }
        log(`set_field ${e} ` + (t = 999999 < (t = (t = isNaN(t) ? 0 : t) < 0 ? 0 : t) ? 999999 : t)), s.value = t, await BG.exec("set_settings", {
            id: e,
            value: t
        })
    }
}
async function set_select(e, t) {
    const s = document.querySelector("select#" + e);
    s && (log(`set_select ${e} ` + t), s.value = t, await BG.exec("set_settings", {
        id: e,
        value: t
    }))
}
async function main() {
    document.querySelector("#footer").addEventListener("click", async () => {
        await BG.exec("open_tab", {
            url: "https://discord.gg/gpudrops"
        })
    });
    var e = await BG.exec("get_settings");
    log(JSON.stringify(e));
    for (const s in e) await set_switch(s, e[s]), await set_field(s, e[s]), await set_select(s, e[s]);
    for (const n of document.querySelectorAll('.settings_group input[type="checkbox"]')) n.addEventListener("change", () => set_switch(n.id, n.checked));
    for (const c of document.querySelectorAll('.settings_group input[type="text"]')) c.addEventListener("input", () => set_field(c.id, c.value));
    for (const o of document.querySelectorAll(".settings_group select")) o.addEventListener("change", () => set_select(o.id, o.value));
    async function queryServerStatus() {
        var e = await BG.exec("get_server_status");
        if (["Online", "Offline", "Slow", "Update Required"].includes(e)) {
            const t = document.querySelector("#server_status");
            t.innerHTML = e, t.classList.remove("green"), t.classList.remove("yellow"), t.classList.remove("red"), "Online" === e ? t.classList.add("green") : "Offline" === e ? t.classList.add("red") : "Slow" !== e && "Update Required" !== e || t.classList.add("yellow")
        }
    }
    await queryServerStatus(), setInterval(queryServerStatus, 1e3)
}
document.addEventListener("DOMContentLoaded", main);