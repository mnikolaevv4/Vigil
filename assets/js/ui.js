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
    }
  };

  window.UI = UI;
})();
