(function (w, d) {
  "use strict";
  var script = d.currentScript,
    A = (script && script.dataset) || {};
  var defaults = {
    selector: "",
    cursors: 22,
    maxCursors: 28,
    speed: 1.3,
    intro: 1000,
    max: 180,
    labels: false,
    badge: true,
    follow: false,
    guides: 6,
    gap: 130,
    hit: 30,
    size: 30,
    colors: [
      "#2b44ff",
      "#e5484d",
      "#12a370",
      "#e08a00",
      "#8e4ec6",
      "#0ea5e9",
      "#d6409f",
      "#6b8e23",
    ],
    names: [
      "aarav",
      "maya",
      "dev",
      "zoya",
      "kabir",
      "isha",
      "rohan",
      "meera",
      "arjun",
      "tara",
      "veer",
      "anya",
      "neel",
      "sia",
    ],
  };
  var root = d.documentElement;
  var reduced =
    w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var started = false;

  var once = A.once !== "false";
  var store = A.store === "session" ? "sessionStorage" : "localStorage";
  function pageKey() {
    var p =
      location.pathname.replace(/index\.html?$/i, "").replace(/\/+$/, "") ||
      "/";
    return "swb-seen:" + p;
  }
  function seen() {
    if (!once) return false;
    try {
      return !!w[store].getItem(pageKey());
    } catch (e) {
      return false;
    }
  }
  function mark() {
    if (!once) return;
    try {
      w[store].setItem(pageKey(), "1");
    } catch (e) {}
  }

  function fromAttrs() {
    var o = {};
    if (A.selector) o.selector = A.selector;
    if (A.maxCursors) o.maxCursors = +A.maxCursors;
    ["cursors", "speed", "intro", "max", "gap", "hit", "size"].forEach(
      function (k) {
        if (A[k]) o[k] = +A[k];
      },
    );
    if (A.colors)
      o.colors = A.colors.split(",").map(function (s) {
        return s.trim();
      });
    if (A.labels) o.labels = A.labels === "true";
    if (A.badge) o.badge = A.badge !== "false";
    if (A.follow) o.follow = A.follow !== "false";
    return o;
  }
  function merge(o) {
    var r = {},
      k;
    for (k in defaults) r[k] = defaults[k];
    for (k in o || {}) r[k] = o[k];
    return r;
  }

  var CSS =
    "html.swb:not(.swb-ready) body{visibility:hidden}" +
    "html.swb,html.swb body{overflow-x:clip}" +
    "html.swb .swb-t:not(.swb-in){opacity:0!important}" +
    ".swb-in{animation:swb-fade .45s ease backwards}.swb-quick{animation:none!important}" +
    "@keyframes swb-fade{from{opacity:0}to{opacity:1}}@keyframes swb-blink{50%{opacity:0}}" +
    "#swb-cover{position:fixed;inset:0;z-index:2147482999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:opacity .6s;pointer-events:none}" +
    "#swb-cover img,#swb-cover .lg{width:64px;height:64px;border-radius:18px;object-fit:cover;box-shadow:0 8px 28px rgba(0,0,0,.18)}" +
    "#swb-cover .lg{display:flex;align-items:center;justify-content:center;font:700 30px system-ui,sans-serif;color:#fff;background:#2b44ff}" +
    "#swb-cover small{font:500 13px system-ui,sans-serif;opacity:.55}" +
    "#swb-rx,#swb-ry{position:fixed;z-index:2147482998;background:#f4f5f7;pointer-events:none;transition:transform .45s cubic-bezier(.2,.7,.2,1)}" +
    "#swb-rx{left:0;right:0;top:0;height:22px;transform:translateY(-100%);border-bottom:1px solid #c9ccd4;background-image:repeating-linear-gradient(90deg,#8a8f9c 0 1px,transparent 1px 10px);background-size:100% 7px;background-repeat:no-repeat;background-position:bottom}" +
    "#swb-ry{left:0;top:0;bottom:0;width:22px;transform:translateX(-100%);border-right:1px solid #c9ccd4;background-image:repeating-linear-gradient(180deg,#8a8f9c 0 1px,transparent 1px 10px);background-size:7px 100%;background-repeat:no-repeat;background-position:right}" +
    "#swb-rx.on,#swb-ry.on{transform:none}" +
    "#swb-layer{position:absolute;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none}" +
    "#swb-layer .bp{position:absolute;border:1px solid;background:rgba(128,128,128,.16);transition:width .5s cubic-bezier(.2,.7,.2,1),height .5s cubic-bezier(.2,.7,.2,1),opacity .35s}" +
    "#swb-layer .bp b{position:absolute;right:0;top:100%;margin-top:6px;font:500 12px/1 ui-monospace,Menlo,monospace;color:#fff;padding:4px 7px;border-radius:5px;white-space:nowrap}" +
    "#swb-layer .sel{background:transparent;transition:opacity .35s}" +
    "#swb-layer .sel s{position:absolute;width:7px;height:7px;background:#fff;border:1.5px solid var(--c)}" +
    "#swb-layer .gd{position:absolute;width:1px;background:#ff3b30;transition:left .5s cubic-bezier(.2,.7,.2,1),opacity .4s}" +
    "#swb-layer .pl{position:absolute;transition:width .5s cubic-bezier(.2,.7,.2,1),height .5s cubic-bezier(.2,.7,.2,1),opacity .35s}" +
    "#swb-layer .anc{position:absolute;width:8px;height:8px;margin:-4px 0 0 -4px;background:#fff;border:1.5px solid;transition:opacity .35s}" +
    "#swb-layer .sp{position:absolute;background:#ff3b30;transition:opacity .35s}" +
    "#swb-layer .sp b{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:600 11px/1 ui-monospace,Menlo,monospace;color:#fff;background:#ff3b30;padding:3px 5px;border-radius:4px}" +
    "#swb-layer .gh{position:absolute;margin:0;pointer-events:none;opacity:.9;box-shadow:0 14px 34px rgba(0,0,0,.25)}" +
    "#swb-layer .cur{position:absolute;left:0;top:0;opacity:0;transition:transform .5s cubic-bezier(.3,.7,.2,1),opacity .4s;will-change:transform}" +
    "#swb-layer .cur.free{transition:opacity .4s}" +
    "#swb-layer .cur svg{display:block;width:calc(36px*var(--s,1));height:calc(36px*var(--s,1));margin:calc(-4px*var(--s,1)) 0 0 calc(-6px*var(--s,1));transform-origin:calc(6px*var(--s,1)) calc(4.5px*var(--s,1));transform:rotate(var(--r,-135deg)) scale(var(--sx,1),var(--sy,1)) rotate(135deg);filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}" +
    "#swb-layer .cur i{display:none;width:2px;height:calc(30px*var(--s,1));background:var(--c);animation:swb-blink .9s steps(1) infinite}" +
    "#swb-layer .cur.ib svg{display:none}#swb-layer .cur.ib i{display:block}" +
    "#swb-layer .cur span{position:absolute;left:calc(22px*var(--s,1));top:calc(28px*var(--s,1));color:#fff;background:var(--c);font:500 12px/1 ui-monospace,Menlo,monospace;padding:4px 7px;border-radius:5px;white-space:nowrap}" +
    "@media (max-width:768px){html.swb,html.swb body{overflow-x:hidden;overflow-x:clip}}";

  function hideEarly() {
    if (reduced || d.getElementById("swb-style")) return;
    var s = d.createElement("style");
    s.id = "swb-style";
    s.textContent = CSS;
    (d.head || root).appendChild(s);
    root.classList.add("swb");
    w.__swbFail = setTimeout(function () {
      root.classList.remove("swb");
    }, 4500);
  }

  function init(opts) {
    if (started || reduced) return;
    if (seen()) {
      started = true;
      return;
    }
    mark();
    started = true;
    var o = merge(opts),
      S = Math.max(0.3, o.speed);
    var T = function (ms) {
      return ms / S;
    };
    var sleep = function (ms) {
      return new Promise(function (r) {
        setTimeout(r, ms);
      });
    };
    hideEarly();
    try {
      run();
    } catch (e) {
      clearTimeout(w.__swbFail);
      root.classList.remove("swb");
      if (w.console) console.error("swarm-build:", e);
    }

    function run() {
      var body = d.body,
        colors = o.colors,
        base = Math.max(1, o.cursors),
        maxC = Math.max(base, o.maxCursors);
      var active = base;
      function col(k) {
        return colors[k % colors.length];
      }

      var cs0 = getComputedStyle(body),
        bg = cs0.backgroundColor;
      if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent")
        bg = getComputedStyle(root).backgroundColor;
      if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent")
        bg = "#ffffff";
      var cover = d.createElement("div");
      cover.id = "swb-cover";
      cover.style.background = bg;
      cover.style.color = cs0.color;
      var ic = d.querySelector('link[rel~="icon"]'),
        title = (d.title || "").trim();
      var letter =
        '<div class="lg">' +
        (title.charAt(0) || "\u2022").toUpperCase() +
        "</div>";
      cover.innerHTML =
        ic && ic.href ? '<img alt="" src="' + ic.href + '">' : letter;
      var img = cover.querySelector("img");
      if (img)
        img.onerror = function () {
          img.outerHTML = letter;
        };
      body.appendChild(cover);
      var layer = d.createElement("div");
      layer.id = "swb-layer";
      body.appendChild(layer);
      layer.style.setProperty("--s", Math.max(8, o.size) / 36);
      var rx = d.createElement("div"),
        ry = d.createElement("div");
      rx.id = "swb-rx";
      ry.id = "swb-ry";
      body.appendChild(rx);
      body.appendChild(ry);
      root.classList.add("swb-ready");
      clearTimeout(w.__swbFail);

      var cur = [];
      for (var i = 0; i < maxC; i++) {
        var cd = d.createElement("div");
        cd.className = "cur free";
        cd.style.setProperty("--c", col(i));
        cd.innerHTML =
          '<svg viewBox="0 0 24 24"><path d="M4 3l15 8-6.5 2L10 19.5z" fill="' +
          col(i) +
          '" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg><i></i>' +
          (o.labels ? "<span>" + o.names[i % o.names.length] + "</span>" : "");
        cd._x = cd._y = 0;
        cd._vx = cd._vy = 0;
        cd._a = -135;
        cd._i = i;
        cd._idle = i >= base;
        layer.appendChild(cd);
        cur.push(cd);
      }

      var mqMob = w.matchMedia ? w.matchMedia("(max-width: 768px)") : null;
      var mobile = !!(mqMob && mqMob.matches);
      function fadeAway(c) {
        if (c._off) return;
        c._off = 1;
        c.style.transition = "opacity 1.2s ease";
        c.style.opacity = 0;
      }
      function fadeBack(c) {
        c._off = 0;
        c.style.transition = "";
        c.style.transitionDuration = "";
        c.style.opacity = 1;
      }
      function onMq(e) {
        mobile = e.matches;
        cur.forEach(function (c) {
          if (!mobile) {
            c._off = 0;
            c.style.transition = "";
            c.style.transitionDuration = "";
          } else if (c._idle) fadeAway(c);
        });
      }
      if (mqMob) {
        if (mqMob.addEventListener) mqMob.addEventListener("change", onMq);
        else if (mqMob.addListener) mqMob.addListener(onMq);
      }

      function put(c, x, y) {
        if (mobile) {
          var S0 = Math.max(8, o.size),
            x0 = w.scrollX,
            y0 = w.scrollY,
            x1 = x0 + root.clientWidth - S0,
            y1 = y0 + root.clientHeight - S0;
          x = Math.min(Math.max(x, x0), x1);
          y = Math.min(Math.max(y, y0), y1);
        }
        c._x = x;
        c._y = y;
        c.style.transform = "translate(" + x + "px," + y + "px)";
      }
      function go(c, x, y, ms) {
        c._idle = false;
        c.classList.remove("free");
        c._vx = c._vy = 0;
        c._kx = c._ky = 0;
        c._in = false;
        c._a = -135;
        c.style.setProperty("--r", "-135deg");
        c.style.setProperty("--sx", 1);
        c.style.setProperty("--sy", 1);
        c.style.transitionDuration = ms + "ms";
        put(c, x, y);
        return sleep(ms);
      }
      function fly(c, x, y, ms) {
        var x0 = c._x,
          y0 = c._y,
          dx = x - x0,
          dy = y - y0,
          L = Math.sqrt(dx * dx + dy * dy);
        if (L < 60) return go(c, x, y, ms);
        ms += T(Math.min(350, L * 0.25));
        c._idle = false;
        c._vx = c._vy = 0;
        c._kx = c._ky = 0;
        c._in = false;
        c._a = -135;
        c.style.setProperty("--r", "-135deg");
        c.style.setProperty("--sx", 1);
        c.style.setProperty("--sy", 1);
        c.classList.add("free");
        var bend = Math.min(180, L * 0.28),
          qx = (x0 + x) / 2 - (dy / L) * bend,
          qy = (y0 + y) / 2 + (dx / L) * bend,
          s0 = performance.now();
        return new Promise(function (res) {
          (function step() {
            var q = Math.min(1, (performance.now() - s0) / ms),
              e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2,
              u = 1 - e;
            put(
              c,
              u * u * x0 + 2 * u * e * qx + e * e * x,
              u * u * y0 + 2 * u * e * qy + e * e * y,
            );
            if (q < 1) requestAnimationFrame(step);
            else {
              c.classList.remove("free");
              res();
            }
          })();
        });
      }
      function mk(cls, css, html) {
        var e = d.createElement("div");
        e.className = cls;
        e.style.cssText = css;
        if (html) e.innerHTML = html;
        layer.appendChild(e);
        return e;
      }
      function fade() {
        [].slice.call(arguments).forEach(function (r) {
          r.style.opacity = 0;
          setTimeout(function () {
            r.remove();
          }, 450);
        });
      }
      function pos(e) {
        var r = e.getBoundingClientRect();
        return {
          x: r.left + w.scrollX,
          y: r.top + w.scrollY,
          w: r.width,
          h: r.height,
        };
      }

      var intro = true,
        t0 = performance.now();
      (function f() {
        if (!intro) return;
        var a = (performance.now() - t0) / 700;
        for (var i = 0; i < base; i++) {
          var c = cur[i],
            th = a + (i * 6.283) / base,
            rad = 120 + 20 * Math.sin(a * 2.2 + i * 1.3);
          c.style.opacity = 1;
          c.style.setProperty(
            "--r",
            th * 57.3 + 90 + Math.sin(a * 4 + i) * 14 + "deg",
          );
          put(
            c,
            w.innerWidth / 2 + w.scrollX + Math.cos(th) * rad,
            w.innerHeight / 2 +
              w.scrollY +
              Math.sin(th) * rad * 0.8 +
              Math.sin(a * 3 + i) * 8,
          );
        }
        requestAnimationFrame(f);
      })();

      var tasks = [],
        map = new Map(),
        queue = [];
      var BORDER = ["Top", "Right", "Bottom", "Left"];
      function classify() {
        var forced = o.selector
          ? [].slice.call(d.querySelectorAll(o.selector))
          : [];
        [].slice.call(d.querySelectorAll("[data-swarm]")).forEach(function (e) {
          forced.push(e);
        });
        var list = body.querySelectorAll("*"),
          SK = /^(SCRIPT|STYLE|NOSCRIPT|LINK|META|TEMPLATE|BR|HEAD)$/;
        for (var i = 0; i < list.length && tasks.length < o.max; i++) {
          var el = list[i],
            tag = el.tagName;
          if (
            SK.test(tag) ||
            layer.contains(el) ||
            cover.contains(el) ||
            el === layer ||
            el === cover ||
            el === rx ||
            el === ry
          )
            continue;
          if (el.closest("[data-swarm-ignore]")) continue;
          if (
            el.namespaceURI &&
            el.namespaceURI.indexOf("svg") > -1 &&
            tag.toLowerCase() !== "svg"
          )
            continue;
          var cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          var r = el.getBoundingClientRect();
          if (r.width < 2 && r.height < 2) continue;
          var kind = null,
            side = null;
          var direct = [].some.call(el.childNodes, function (nd) {
            return nd.nodeType === 3 && nd.nodeValue.trim();
          });
          if (
            direct &&
            !el.children.length &&
            cs.display !== "inline" &&
            el.textContent.trim().length <= 240
          )
            kind = "text";
          else if (direct) kind = "box";
          else if (
            /^(IMG|svg|VIDEO|CANVAS|PICTURE|IFRAME|INPUT|TEXTAREA|SELECT)$/.test(
              tag,
            )
          )
            kind = "box";
          else if (forced.indexOf(el) > -1) kind = "box";
          else {
            var bc = cs.backgroundColor,
              hasBg = bc && bc !== "rgba(0, 0, 0, 0)" && bc !== "transparent";
            var sides = BORDER.filter(function (s) {
              return (
                parseFloat(cs["border" + s + "Width"]) > 0 &&
                cs["border" + s + "Style"] !== "none" &&
                !/rgba\(0, 0, 0, 0\)|transparent/.test(
                  cs["border" + s + "Color"],
                )
              );
            });
            if (
              hasBg ||
              cs.backgroundImage !== "none" ||
              cs.boxShadow !== "none"
            )
              kind = "box";
            else if (sides.length === 1) {
              kind = "line";
              side = sides[0];
            } else if (sides.length > 1) kind = "box";
          }
          if (!kind) continue;
          var p = el.parentElement,
            parent = null;
          while (p && p !== body) {
            if (map.has(p)) {
              parent = map.get(p);
              break;
            }
            p = p.parentElement;
          }
          var tk = {
            el: el,
            kind: kind,
            side: side,
            parent: parent,
            master: null,
            state: "wait",
          };
          tasks.push(tk);
          map.set(el, tk);
          el.classList.add("swb-t");
        }
        var groups = {},
          gid = 0;
        tasks.forEach(function (tk) {
          var el = tk.el,
            par = el.parentElement;
          if (
            !par ||
            tk.kind === "line" ||
            !(el.children.length || /^(LI|A|BUTTON)$/.test(el.tagName))
          )
            return;
          var key =
            (par._swg || (par._swg = ++gid)) +
            "|" +
            el.tagName +
            "|" +
            el.className;
          (groups[key] = groups[key] || []).push(tk);
        });
        Object.keys(groups).forEach(function (k) {
          var g = groups[k];
          if (g.length < 2 || g[0].el.getBoundingClientRect().width < 24)
            return;
          g.slice(1).forEach(function (tk) {
            tk.master = g[0];
          });
        });
      }

      async function drag(c, p, k, fill) {
        await fly(c, p.x, p.y, T(380));
        var dur = T(500);
        var r = mk(
          "bp",
          "left:" +
            p.x +
            "px;top:" +
            p.y +
            "px;width:0;height:0;border-color:" +
            col(k) +
            ";transition-duration:" +
            dur +
            "ms" +
            (fill ? "" : ";background:transparent"),
        );
        var b = null;
        if (o.badge) {
          b = d.createElement("b");
          b.style.background = col(k);
          b.textContent = "0 \u00d7 0";
          r.appendChild(b);
        }
        void r.offsetWidth;
        r.style.width = p.w + "px";
        r.style.height = p.h + "px";
        var s0 = performance.now(),
          iv =
            b &&
            setInterval(function () {
              var q = Math.min(1, (performance.now() - s0) / dur),
                e = 1 - Math.pow(1 - q, 3);
              b.textContent =
                Math.round(p.w * e) + " \u00d7 " + Math.round(p.h * e);
            }, 30);
        await go(c, p.x + p.w, p.y + p.h, dur);
        if (b) {
          clearInterval(iv);
          b.textContent = Math.round(p.w) + " \u00d7 " + Math.round(p.h);
        }
        return r;
      }
      async function box(c, el, k) {
        var r = await drag(c, pos(el), k, true);
        await sleep(T(150));
        el.classList.add("swb-in");
        await sleep(T(200));
        fade(r);
      }

      async function pen(c, tk, k) {
        var el = tk.el,
          p = pos(el),
          s = tk.side,
          color = col(k);
        var x1 = p.x,
          y1 = p.y,
          x2 = p.x + p.w,
          y2 = p.y + p.h;
        if (s === "Top") y2 = y1;
        else if (s === "Bottom") y1 = y2;
        else if (s === "Left") x2 = x1;
        else x1 = x2;
        var horiz = s === "Top" || s === "Bottom",
          dur = T(500);
        await fly(c, x1, y1, T(380));
        var a1 = mk(
          "anc",
          "left:" + x1 + "px;top:" + y1 + "px;border-color:" + color,
        );
        var ln = mk(
          "pl",
          "left:" +
            x1 +
            "px;top:" +
            y1 +
            "px;transition-duration:" +
            dur +
            "ms;" +
            (horiz
              ? "width:0;border-top:2px solid " + color
              : "height:0;border-left:2px solid " + color),
        );
        void ln.offsetWidth;
        if (horiz) ln.style.width = x2 - x1 + "px";
        else ln.style.height = y2 - y1 + "px";
        await go(c, x2, y2, dur);
        var a2 = mk(
          "anc",
          "left:" + x2 + "px;top:" + y2 + "px;border-color:" + color,
        );
        await sleep(T(160));
        el.classList.add("swb-in");
        await sleep(T(200));
        fade(a1, a2, ln);
      }

      var edges = {},
        nEdges = 0,
        rulerT;
      function rulers() {
        rx.classList.add("on");
        ry.classList.add("on");
        clearTimeout(rulerT);
        rulerT = setTimeout(function () {
          rx.classList.remove("on");
          ry.classList.remove("on");
        }, 2600);
      }
      async function guide(c, p) {
        rulers();
        await fly(c, w.scrollX + 11, p.y + Math.min(p.h / 2, 24), T(380));
        var g = mk(
          "gd",
          "left:" +
            (w.scrollX + 11) +
            "px;top:" +
            w.scrollY +
            "px;height:" +
            w.innerHeight +
            "px;transition-duration:" +
            T(500) +
            "ms",
        );
        void g.offsetWidth;
        g.style.left = p.x + "px";
        await go(c, p.x, p.y, T(500));
        setTimeout(function () {
          fade(g);
        }, T(1700));
      }
      async function type(c, el, p, k, snap) {
        var t = el.textContent.trim(),
          fs = parseFloat(getComputedStyle(el).fontSize);
        var big = /^H[12]$/.test(el.tagName) && fs > 30;
        el.style.minHeight = p.h + "px";
        el.style.minWidth = p.w + "px";
        el.textContent = "";
        if (snap) {
          el.style.transform = "translateX(-22px)";
          el.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)";
        }
        el.classList.add("swb-in", "swb-quick");
        if (snap) {
          void el.offsetWidth;
          el.style.transform = "";
        }
        c.classList.add("ib");
        var m = d.createElement("span");
        m.style.cssText =
          "display:inline-block;width:0;height:1em;vertical-align:text-bottom;border-left:2px solid " +
          col(k) +
          ";animation:swb-blink .8s steps(1) infinite";
        var step = Math.max(1, Math.ceil(t.length / 50));
        for (var i = 0; i < t.length; i += step) {
          if (big)
            el.style.fontSize =
              18 + (fs - 18) * Math.min(1, i / (t.length * 0.8)) + "px";
          el.textContent = t.slice(0, i + step);
          el.appendChild(m);
          var q = m.getBoundingClientRect();
          c.style.transitionDuration = "70ms";
          put(c, q.right + w.scrollX, q.top + w.scrollY);
          await sleep(T(26));
        }
        el.textContent = t;
        el.style.minHeight = "";
        el.style.minWidth = "";
        el.style.fontSize = "";
        setTimeout(function () {
          el.style.transition = "";
        }, 400);
        c.classList.remove("ib");
      }
      async function text(c, el, k) {
        var p = pos(el),
          snap = false,
          ex = Math.round(p.x / 4);
        if (!edges[ex] && nEdges < o.guides) {
          edges[ex] = 1;
          nEdges++;
          snap = true;
          await guide(c, p);
        }
        var r = await drag(c, p, k, false);
        await type(c, el, p, k, snap);
        fade(r);
      }

      async function dup(c, tk, k) {
        var m = tk.master.el,
          el = tk.el,
          mp = pos(m),
          p = pos(el);
        var vis =
          mp.y + mp.h > w.scrollY &&
          mp.y < w.scrollY + w.innerHeight &&
          mp.w > 0;
        if (!vis) return tk.kind === "text" ? text(c, el, k) : box(c, el, k);
        await fly(c, mp.x + mp.w / 2, mp.y + mp.h / 2, T(380));
        var h = [
          "left:-4px;top:-4px",
          "right:-4px;top:-4px",
          "left:-4px;bottom:-4px",
          "right:-4px;bottom:-4px",
        ]
          .map(function (s) {
            return '<s style="' + s + '"></s>';
          })
          .join("");
        var sel = mk(
          "bp sel",
          "left:" +
            mp.x +
            "px;top:" +
            mp.y +
            "px;width:" +
            mp.w +
            "px;height:" +
            mp.h +
            "px;border-color:" +
            col(k) +
            ";--c:" +
            col(k),
          h,
        );
        await sleep(T(220));
        var g = m.cloneNode(true);
        g.removeAttribute("id");
        [].forEach.call(g.querySelectorAll("[id]"), function (e) {
          e.removeAttribute("id");
        });
        g.classList.remove("swb-t");
        [].forEach.call(g.querySelectorAll(".swb-t"), function (e) {
          e.classList.remove("swb-t");
        });
        g.classList.add("gh");
        g.style.cssText +=
          ";left:" +
          mp.x +
          "px;top:" +
          mp.y +
          "px;width:" +
          mp.w +
          "px;height:" +
          mp.h +
          "px;transition:transform " +
          T(650) +
          "ms cubic-bezier(.3,.7,.2,1)";
        layer.appendChild(g);
        void g.offsetWidth;
        g.style.transform =
          "translate(" + (p.x - mp.x) + "px," + (p.y - mp.y) + "px)";
        await go(c, p.x + p.w / 2, p.y + p.h / 2, T(650));
        var sameRow = Math.abs(p.y - mp.y) < mp.h * 0.5,
          gap,
          sp;
        if (sameRow) {
          gap = Math.round(p.x - (mp.x + mp.w));
          sp =
            gap > 0 &&
            mk(
              "sp",
              "left:" +
                (mp.x + mp.w) +
                "px;top:" +
                (mp.y + mp.h / 2) +
                "px;width:" +
                gap +
                "px;height:1px",
              "<b>" + gap + "</b>",
            );
        } else {
          gap = Math.round(p.y - (mp.y + mp.h));
          sp =
            gap > 0 &&
            mk(
              "sp",
              "left:" +
                (mp.x + mp.w / 2) +
                "px;top:" +
                (mp.y + mp.h) +
                "px;width:1px;height:" +
                gap +
                "px",
              "<b>" + gap + "</b>",
            );
        }
        await sleep(T(380));
        g.remove();
        fade(sel);
        if (sp) fade(sp);
        if (tk.kind === "text") await type(c, el, p, k, false);
        else {
          el.classList.add("swb-in");
          await sleep(T(200));
        }
      }
      function ready(tk) {
        var p = tk.parent,
          m = tk.master;
        return (
          (!p || p.state === "done" || p.state === "wait") &&
          (!m || m.state === "done" || m.state === "wait")
        );
      }
      function pick() {
        for (var i = 0; i < queue.length; i++)
          if (ready(queue[i])) return queue.splice(i, 1)[0];
        return null;
      }
      async function worker(i) {
        var c = cur[i];
        for (;;) {
          var tk = i < active ? pick() : null;
          if (!tk) {
            c._idle = true;
            c.classList.add("free");
            fadeAway(c); // smooth fade on every device
            await sleep(180);
            continue;
          }
          tk.state = "run";
          fadeBack(c); // fade back in when it gets a new task
          c.style.opacity = 1;
          try {
            await (tk.master
              ? dup(c, tk, i)
              : tk.kind === "text"
                ? text(c, tk.el, i)
                : tk.kind === "line"
                  ? pen(c, tk, i)
                  : box(c, tk.el, i));
          } catch (e) {
            tk.el.classList.add("swb-in", "swb-quick");
            c.classList.remove("ib");
          }
          tk.state = "done";
        }
      }
      function enqueue(tk) {
        if (tk.state === "wait") {
          tk.state = "queued";
          queue.push(tk);
        }
      }
      function quick(tk) {
        tk.state = "done";
        tk.el.classList.add("swb-in", "swb-quick");
      }

      var mx = w.innerWidth / 2,
        my = w.innerHeight / 2,
        pmx = mx,
        pmy = my;
      var mvx = 0,
        mvy = 0;
      w.addEventListener(
        "pointermove",
        function (e) {
          if (e.pointerType !== "touch") {
            mx = e.clientX;
            my = e.clientY;
            if (!inside) enter();
          }
        },
        { passive: true },
      );
      var fine =
        w.matchMedia &&
        w.matchMedia("(hover:hover) and (pointer:fine)").matches;
      var lastF = performance.now();
      var HIT = Math.max(12, o.hit),
        GAP = Math.max(HIT * 3, o.gap);

      cur.forEach(function (c) {
        c._kx = c._ky = 0;
        c._k = 0.7 + Math.random() * 0.5;
        c._in = false;
        c._arr = false;
        c._g = c._i % 3;
        c._off = 18 + Math.random() * 100;
        c._oa = Math.random() * 6.283;
        c._ow = (Math.random() - 0.5) * 0.03;
      });

      var SLOW = 0.4;
      var ringPhase = 0;
      var inside = true,
        NG = 3,
        groups = [],
        reT = 0;
      for (var gi = 0; gi < NG; gi++) groups.push({ x: 0, y: 0, vx: 0, vy: 0 });
      function rnd(a, b) {
        return a + Math.random() * (b - a);
      }
      function leg(g, t) {
        var X0 = w.scrollX - 90,
          X1 = w.scrollX + root.clientWidth + 90,
          Y0 = w.scrollY - 90,
          Y1 = w.scrollY + root.clientHeight + 90;
        if (Math.random() < 0.55) {
          g.mode = "travel";
          g.wx = rnd(X0, X1);
          g.wy = rnd(Y0, Y1);
          g.sp = rnd(3.5, 6.5);
          g.until = t + rnd(4, 9);
        } else {
          var rad = rnd(80, 200),
            a = Math.random() * 6.283,
            cx = g.x - Math.cos(a) * rad,
            cy = g.y - Math.sin(a) * rad;
          if (
            cx - rad < X0 - 40 ||
            cx + rad > X1 + 40 ||
            cy - rad < Y0 - 40 ||
            cy + rad > Y1 + 40
          )
            return leg(g, t);
          g.mode = "circle";
          g.rad = rad;
          g.a = a;
          g.cx = cx;
          g.cy = cy;
          g.dir = 1;
          g.w = rnd(0.012, 0.026);
          g.until = t + rnd(5, 10);
        }
      }
      function initFlock() {
        var t = performance.now() / 1000;
        groups.forEach(function (g, n) {
          var sx = 0,
            sy = 0,
            m = 0;
          cur.forEach(function (c) {
            if (c._g === n) {
              sx += c._x;
              sy += c._y;
              m++;
            }
          });
          g.x = m ? sx / m : w.scrollX + w.innerWidth / 2;
          g.y = m ? sy / m : w.scrollY + w.innerHeight / 2;
          g.vx = g.vy = 0;
          leg(g, t);
        });
        reT = t + rnd(8, 14);
      }
      function enter() {
        inside = true;
        cur.forEach(function (c) {
          c._in = false;
        });
      }
      function updateGroups(t, dt) {
        if (t > reT) {
          reT = t + rnd(8, 14);
          cur.forEach(function (c) {
            if (Math.random() < 0.3) c._g = (Math.random() * NG) | 0;
          });
          if (Math.random() < 0.3) {
            var a = (Math.random() * NG) | 0,
              b = (a + 1 + ((Math.random() * (NG - 1)) | 0)) % NG;
            cur.forEach(function (c) {
              if (c._g === a) c._g = b;
            });
          }
        }
        groups.forEach(function (g) {
          if (t > g.until) leg(g, t);
          var px = g.x,
            py = g.y;
          if (g.mode === "travel") {
            var dx = g.wx - g.x,
              dy = g.wy - g.y,
              dd = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dd < 50) g.until = t;
            g.vx += ((dx / dd) * g.sp - g.vx) * 0.03 * dt;
            g.vy += ((dy / dd) * g.sp - g.vy) * 0.03 * dt;
            g.x += g.vx * dt;
            g.y += g.vy * dt;
          } else {
            g.a += g.dir * g.w * dt;
            g.x = g.cx + Math.cos(g.a) * g.rad;
            g.y = g.cy + Math.sin(g.a) * g.rad;
            g.vx = (g.x - px) / dt;
            g.vy = (g.y - py) / dt;
          }
        });
      }
      d.documentElement.addEventListener("mouseleave", function () {
        if (!inside) return;
        inside = false;
        initFlock();
      });
      d.documentElement.addEventListener("mouseenter", enter);
      initFlock();

      (function loop() {
        var now = performance.now(),
          dt = Math.max(0.2, Math.min(2.5, (now - lastF) / 16.7)),
          t = now / 1000;
        lastF = now;
        ringPhase += 0.024 * dt;

        mvx += ((mx - pmx) / dt - mvx) * 0.25;
        mvy += ((my - pmy) / dt - mvy) * 0.25;
        pmx = mx;
        pmy = my;
        var mspd = Math.min(60, Math.sqrt(mvx * mvx + mvy * mvy));

        var tx = mx + w.scrollX,
          ty = my + w.scrollY,
          fl = [],
          i;
        for (i = 0; i < maxC; i++) {
          var c0 = cur[i];
          if (!c0._idle) continue;
          if (i >= active || !o.follow || !fine || mobile) {
            c0.style.opacity = 0;
            continue;
          }
          fl.push(c0);
        }
        if (!inside) updateGroups(t, dt);

        fl.forEach(function (c) {
          if (!c._in) {
            c._in = true;
            c._arr = false;
          }

          var dvx, dvy, ms, bl;
          if (inside) {
            var N = fl.length || 1,
              slot = 0;
            for (var si = 0; si < N; si++)
              if (fl[si] === c) {
                slot = si;
                break;
              }
            var ringR = GAP * (0.9 + 0.15 * Math.sin(t * 3.1 + slot * 1.3));
            var ang = ringPhase + (slot * 6.283) / N;
            var gx = tx + Math.cos(ang) * ringR,
              gy = ty + Math.sin(ang) * ringR * 0.85;
            var ex0 = gx - c._x,
              ey0 = gy - c._y,
              G = Math.sqrt(ex0 * ex0 + ey0 * ey0);
            if (!c._arr && G < 45)
              c._arr = true; // arrived: now it rides the ring
            else if (c._arr && G > 360) c._arr = false; // mouse got far away: hurry to catch up

            dvx = ex0 * (c._arr ? 0.07 : 0.03) + mvx * c._k * SLOW;
            dvy = ey0 * (c._arr ? 0.07 : 0.03) + mvy * c._k * SLOW;
            ms = (c._arr ? 8 : 12) + mspd * SLOW * c._k;
            bl = Math.min(1, (c._arr ? 0.07 : 0.04) * dt);
          } else {
            var gr = groups[c._g];
            c._oa += c._ow * dt;
            var fx = gr.x + Math.cos(c._oa) * c._off - c._x,
              fy = gr.y + Math.sin(c._oa) * c._off - c._y;
            dvx =
              fx * 0.035 + gr.vx * 0.9 + Math.cos(t * 1.1 + c._i * 2.3) * 0.8;
            dvy =
              fy * 0.035 + gr.vy * 0.9 + Math.sin(t * 0.9 + c._i * 1.7) * 0.8;
            ms = 7 + 5 * c._k;
            bl = Math.min(1, 0.08 * dt);
          }
          var dl = Math.sqrt(dvx * dvx + dvy * dvy);
          if (dl > ms) {
            dvx *= ms / dl;
            dvy *= ms / dl;
          }
          var vx = c._vx + (dvx - c._vx) * bl,
            vy = c._vy + (dvy - c._vy) * bl;

          fl.forEach(function (q) {
            if (q === c) return;
            var ex = c._x - q._x,
              ey = c._y - q._y,
              e = Math.sqrt(ex * ex + ey * ey) || 1;
            if (e < 26) {
              var f = ((26 - e) / 26) * 0.08 * dt;
              vx += (ex / e) * f;
              vy += (ey / e) * f;
            }
            if (e < 22 && q._kx * q._kx + q._ky * q._ky > 16) {
              c._kx += q._kx * 0.5;
              c._ky += q._ky * 0.5;
              q._kx *= 0.6;
              q._ky *= 0.6;
            }
          });
          c._vx = vx;
          c._vy = vy;

          c._kx *= Math.pow(0.94, dt);
          c._ky *= Math.pow(0.94, dt);
          var nx = c._x + (vx + c._kx) * dt,
            ny = c._y + (vy + c._ky) * dt;

          var hx = nx - tx,
            hy = ny - ty,
            hd = Math.sqrt(hx * hx + hy * hy);
          if (inside && hd < HIT) {
            var ux, uy;
            if (hd < 0.01) {
              var ra = Math.random() * 6.283;
              ux = Math.cos(ra);
              uy = Math.sin(ra);
            } else {
              ux = hx / hd;
              uy = hy / hd;
            }
            var kx, ky, mag;
            if (mspd > 0.6) {
              var dx = (0.7 * mvx) / mspd + 0.3 * ux,
                dy = (0.7 * mvy) / mspd + 0.3 * uy,
                dl2 = Math.sqrt(dx * dx + dy * dy) || 1;
              mag = Math.min(48, 5 + mspd * 1.2);
              kx = (dx / dl2) * mag;
              ky = (dy / dl2) * mag;
            } else {
              kx = ux * 3;
              ky = uy * 3;
            }
            c._kx = kx;
            c._ky = ky;
            c._vx = vx * 0.3;
            c._vy = vy * 0.3;
            nx = tx + ux * (HIT + 1);
            ny = ty + uy * (HIT + 1);
          }

          var S = o.size,
            vx0 = w.scrollX,
            vy0 = w.scrollY,
            vx1 = vx0 + root.clientWidth - S,
            vy1 = vy0 + root.clientHeight - S;
          var qx = Math.min(Math.max(nx, vx0), vx1),
            qy = Math.min(Math.max(ny, vy0), vy1);
          c._x = nx;
          c._y = ny;
          c.style.transform = "translate(" + qx + "px," + qy + "px)";
          c.style.opacity =
            Math.abs(nx - qx) > S * 0.5 || Math.abs(ny - qy) > S * 0.5 ? 0 : 1;

          var tvx = c._vx + c._kx,
            tvy = c._vy + c._ky;
          if (tvx * tvx + tvy * tvy > 0.16) {
            var diff = ((Math.atan2(tvy, tvx) * 57.3 - c._a + 540) % 360) - 180;
            c._a += diff * Math.min(1, 0.14 * dt);
            c.style.setProperty("--r", c._a + "deg");
          }
        });
        requestAnimationFrame(loop);
      })();

      var loaded =
        d.readyState === "complete"
          ? Promise.resolve()
          : new Promise(function (r) {
              w.addEventListener("load", r, { once: true });
            });
      Promise.all([sleep(o.intro), Promise.race([loaded, sleep(2500)])]).then(
        function () {
          classify();
          intro = false;
          for (var i = 0; i < base; i++) cur[i]._idle = false;
          cover.style.opacity = 0;
          setTimeout(function () {
            cover.remove();
          }, 700);
          var io = new IntersectionObserver(
            function (es) {
              es.forEach(function (e) {
                if (e.isIntersecting) {
                  io.unobserve(e.target);
                  enqueue(map.get(e.target));
                }
              });
            },
            { threshold: 0.1 },
          );
          tasks.forEach(function (tk) {
            var r = tk.el.getBoundingClientRect();
            if (r.bottom < 0) quick(tk);
            else if (r.top < w.innerHeight * 0.95) enqueue(tk);
            else io.observe(tk.el);
          });

          var lastY = w.scrollY,
            lastT = performance.now(),
            lastS = 0;
          w.addEventListener(
            "scroll",
            function () {
              var now = performance.now(),
                v =
                  (Math.abs(w.scrollY - lastY) / Math.max(16, now - lastT)) *
                  1000;
              lastY = w.scrollY;
              lastT = now;
              lastS = now;
              active = Math.min(
                maxC,
                Math.max(active, base + Math.floor(v / 500)),
              );
              tasks.forEach(function (tk) {
                if (
                  tk.state === "wait" &&
                  tk.el.getBoundingClientRect().bottom < 0
                ) {
                  io.unobserve(tk.el);
                  quick(tk);
                }
              });
            },
            { passive: true },
          );
          setInterval(function () {
            if (performance.now() - lastS > 900 && active > base) active--;
          }, 700);
          cur.forEach(function (c, i) {
            sleep(i * 120).then(function () {
              worker(i);
            });
          });
        },
      );
    }
  }

  w.SwarmBuild = {
    init: init,
    defaults: defaults,
    version: "3.3.0",
    reset: function () {
      try {
        Object.keys(w[store]).forEach(function (k) {
          if (k.indexOf("swb-seen:") === 0) w[store].removeItem(k);
        });
      } catch (e) {}
    },
  };
  if (A.auto !== "false") {
    if (!seen()) hideEarly(); // only hide the page if the effect will play
    var start = function () {
      init(fromAttrs());
    };
    if (d.readyState === "loading")
      d.addEventListener("DOMContentLoaded", start);
    else start();
  }
})(window, document);
