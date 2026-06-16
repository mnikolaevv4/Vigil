/* ============================================================
   Vigil — UI слой за демо интерактивност
   Всичко е in-memory (живее докато страницата е отворена).
   Без мрежови заявки, без localStorage (ненадежден при file://).
   ============================================================ */

(function () {
  "use strict";

  function ensureToaster() {
    var t = document.getElementById("toaster");
    if (!t) { t = document.createElement("div"); t.id = "toaster"; document.body.appendChild(t); }
    return t;
  }

  var UI = {
    /* ---- toast ---- */
    toast: function (title, sub, kind) {
      kind = kind || "ok";
      var icons = { ok: "✓", warn: "!", info: "i" };
      var t = ensureToaster();
      var node = document.createElement("div");
      node.className = "toast " + kind;
      node.innerHTML = '<div class="tic">' + (icons[kind] || "✓") + "</div>" +
        '<div class="tx"><b>' + title + "</b>" + (sub ? "<span>" + sub + "</span>" : "") + "</div>";
      t.appendChild(node);
      setTimeout(function () {
        node.style.transition = "opacity .3s, transform .3s";
        node.style.opacity = "0"; node.style.transform = "translateY(8px)";
        setTimeout(function () { node.remove(); }, 300);
      }, 3200);
    },

    /* ---- overlay base ---- */
    _overlay: function (pos, inner) {
      var ov = document.createElement("div");
      ov.className = "ov " + pos;
      ov.innerHTML = inner;
      ov.addEventListener("mousedown", function (e) { if (e.target === ov) UI.close(ov); });
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") { UI.close(ov); document.removeEventListener("keydown", esc); }
      });
      document.body.appendChild(ov);
      var firstInput = ov.querySelector("input,select,textarea,button");
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
      return ov;
    },
    close: function (ov) {
      if (!ov) return;
      ov.style.transition = "opacity .15s"; ov.style.opacity = "0";
      setTimeout(function () { ov.remove(); }, 150);
    },

    /* ---- modal: {title, body, actions:[{label,kind,onClick(close)}]} ---- */
    modal: function (opts) {
      var actions = (opts.actions || []).map(function (a, i) {
        return '<button class="btn ' + (a.kind || "") + '" data-i="' + i + '">' + a.label + "</button>";
      }).join("");
      var ov = UI._overlay("center",
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<div class="modal-h"><h3>' + opts.title + '</h3><button class="x" aria-label="Затвори">✕</button></div>' +
          '<div class="modal-b">' + opts.body + "</div>" +
          (actions ? '<div class="modal-f">' + actions + "</div>" : "") +
        "</div>");
      ov.querySelector(".x").addEventListener("click", function () { UI.close(ov); });
      (opts.actions || []).forEach(function (a, i) {
        var btn = ov.querySelector('[data-i="' + i + '"]');
        if (btn) btn.addEventListener("click", function () {
          if (a.onClick) a.onClick(function () { UI.close(ov); }, ov);
          else UI.close(ov);
        });
      });
      return ov;
    },

    /* ---- drawer (right side panel) ---- */
    drawer: function (opts) {
      var ov = UI._overlay("right",
        '<div class="drawer" role="dialog" aria-modal="true">' +
          '<div class="drawer-h"><h3>' + opts.title + '</h3><button class="x" aria-label="Затвори">✕</button></div>' +
          '<div class="drawer-b">' + opts.body + "</div></div>");
      ov.querySelector(".x").addEventListener("click", function () { UI.close(ov); });
      if (opts.onMount) opts.onMount(ov, function () { UI.close(ov); });
      return ov;
    },

    confirm: function (title, body, onYes, yesLabel) {
      UI.modal({
        title: title, body: '<p style="font-size:.88rem;color:var(--ink-soft)">' + body + "</p>",
        actions: [
          { label: "Отказ" },
          { label: yesLabel || "Потвърди", kind: "primary", onClick: function (close) { close(); onYes && onYes(); } }
        ]
      });
    },

    /* ---- симулирано генериране с прогрес ---- */
    generate: function (opts) {
      var steps = opts.steps || ["Подготовка…", "Сглобяване…", "Готово"];
      var ov = UI.modal({
        title: opts.title || "Генериране",
        body: '<div class="prog"><i id="genbar"></i></div><div class="gen-step" id="genstep">' + steps[0] + "</div>",
        actions: []
      });
      var bar = ov.querySelector("#genbar"), stepEl = ov.querySelector("#genstep");
      var i = 0;
      function next() {
        i++;
        var pct = Math.round((i / steps.length) * 100);
        bar.style.width = pct + "%";
        stepEl.textContent = steps[Math.min(i, steps.length - 1)];
        if (i < steps.length) { setTimeout(next, opts.interval || 520); }
        else {
          setTimeout(function () {
            UI.close(ov);
            if (opts.onDone) opts.onDone();
          }, 480);
        }
      }
      setTimeout(next, 350);
      return ov;
    },

    /* ---- briefly highlight a freshly added/changed row ---- */
    flashRow: function (tr) {
      if (!tr) return;
      tr.classList.add("row-flash");
      tr.scrollIntoView({ block: "center", behavior: "smooth" });
      setTimeout(function () { tr.classList.remove("row-flash"); }, 1100);
    },

    /* ---- inline SVG line chart: {values, width, height, color, suffix, aria} ---- */
    sparkline: function (opts) {
      var W = opts.width || 380, H = opts.height || 170, vals = opts.values || [];
      var left = 34, right = W - 10, top = 20, bottom = H - 30;
      var min = opts.min != null ? opts.min : Math.min.apply(null, vals);
      var max = opts.max != null ? opts.max : Math.max.apply(null, vals);
      if (min === max) { min -= 1; max += 1; }
      var n = vals.length, stepX = (right - left) / (n - 1);
      function x(i) { return left + i * stepX; }
      function y(v) { return bottom - ((v - min) / (max - min)) * (bottom - top); }
      var pts = vals.map(function (v, i) { return x(i).toFixed(1) + "," + y(v).toFixed(1); }).join(" ");
      var color = opts.color || "#234ed8";
      var lastX = x(n - 1), lastY = y(vals[n - 1]);
      return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + (opts.aria || "графика") + '">' +
        '<line x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '" stroke="#cfd6e2"/>' +
        '<line x1="' + left + '" y1="' + top + '" x2="' + left + '" y2="' + bottom + '" stroke="#cfd6e2"/>' +
        '<polyline fill="none" stroke="' + color + '" stroke-width="2.5" points="' + pts + '"/>' +
        '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="4" fill="' + color + '"/>' +
        (opts.labelLeft ? '<text x="' + left + '" y="' + (H - 10) + '" font-size="9" fill="#6b7689" font-family="monospace">' + opts.labelLeft + '</text>' : "") +
        (opts.labelRight ? '<text x="' + right + '" y="' + (H - 10) + '" font-size="9" fill="#6b7689" text-anchor="end" font-family="monospace">' + opts.labelRight + '</text>' : "") +
        '<text x="' + lastX.toFixed(1) + '" y="' + (lastY - 8).toFixed(1) + '" font-size="10" fill="' + color + '" text-anchor="end" font-family="monospace">' + vals[n - 1] + (opts.suffix || "") + '</text>' +
        '</svg>';
    },

    /* ---- inline SVG (stacked) bar chart: {categories, series:[{name,color,values}], width, height} ---- */
    barsChart: function (opts) {
      var W = opts.width || 380, H = opts.height || 170;
      var left = 30, right = W - 10, top = 20, bottom = H - 30;
      var cats = opts.categories || [], n = cats.length, series = opts.series || [];
      var totals = cats.map(function (_, i) { return series.reduce(function (s, se) { return s + (se.values[i] || 0); }, 0); });
      var max = opts.max || Math.max.apply(null, totals) || 1;
      var gap = (right - left) / n, bw = gap * 0.6;
      var bars = "";
      for (var i = 0; i < n; i++) {
        var x0 = left + i * gap + (gap - bw) / 2, yCursor = bottom;
        for (var s = 0; s < series.length; s++) {
          var v = series[s].values[i] || 0;
          var h = (v / max) * (bottom - top);
          yCursor -= h;
          bars += '<rect x="' + x0.toFixed(1) + '" y="' + yCursor.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + series[s].color + '" rx="2"/>';
        }
      }
      var axisLabels = cats.map(function (cat, i) {
        if (n > 8 && i % 2 !== 0) return "";
        var x0 = left + i * gap + gap / 2;
        return '<text x="' + x0.toFixed(1) + '" y="' + (H - 10) + '" font-size="8" fill="#6b7689" text-anchor="middle" font-family="monospace">' + cat + '</text>';
      }).join("");
      return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + (opts.aria || "графика") + '">' +
        '<line x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '" stroke="#cfd6e2"/>' +
        bars + axisLabels +
        '</svg>';
    }
  };

  window.UI = UI;
})();
